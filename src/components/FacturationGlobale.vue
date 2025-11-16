<script>
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
    name: 'PageFacturationGlobaleMateriels',
    data() {
        return {
            title: 'Page Facturation Globale Materiel',
            materiels: [],
            affectations: [],
            currentPage: 1,
            itemsPerPage: 150,
            mois: '2025-06',
            dateComplete: '',
            structures: [],
            loading: false,
            filters: {
                code_mat: '',
                libelle: '',
                code_str: '',
                matricule_utl: '',
                type_affectation: '',
            }
        };
    },

    methods: {
        // ✅ Parse montant (robuste)
        parseMontant(raw) {
            if (raw == null) return 0;
            const sanitized = String(raw).replace(/[^\d,.\-]/g, '').trim();
            if (!sanitized) return 0;
            const lastComma = sanitized.lastIndexOf(',');
            const lastDot = sanitized.lastIndexOf('.');
            let normalized = sanitized;
            if (lastComma > lastDot) {
                normalized = sanitized.replace(/\./g, '').replace(',', '.');
            } else {
                normalized = sanitized.replace(/,/g, '');
            }
            const val = parseFloat(normalized);
            return isNaN(val) ? 0 : val;
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) this.currentPage = page;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },

        getStructures() {
            axios.get('http://localhost:3000/structures')
                .then(response => {
                    this.structures = response.data.filter(s => s.cloture !== 'oui');
                    // 🔹 Ajout structure F00 si absente
                    if (!this.structures.some(s => s.code_str === 'F00')) {
                        this.structures.push({
                            code_str: 'F00',
                            libelle: 'Direction Générale (toutes structures DG sauf DINF)',
                            type_str: 'DG'
                        });
                    }
                })
                .catch(error => console.error('Erreur structures :', error));
        },

        async getMateriels() {
            try {
                this.loading = true;
                this.dateComplete = this.getDernierJourDuMois(this.mois);

                const response = await axios.post('http://localhost:3000/materiel_affectationglobale', {
                    date: this.dateComplete,
                    structure: null
                });

                this.affectations = response.data;
            } catch (err) {
                console.error('Erreur getMateriels :', err);
            } finally {
                this.loading = false;
            }
        },

        getDernierJourDuMois(mois) {
            const [annee, moisStr] = mois.split("-");
            const dernierJour = new Date(parseInt(annee), parseInt(moisStr), 0);
            return `${dernierJour.getFullYear()}-${String(dernierJour.getMonth() + 1).padStart(2, "0")}-${String(dernierJour.getDate()).padStart(2, "0")}`;
        },

        telechargerTxt() {
            const lignes = ['Structure  |  Total (DzD)'];
            this.totauxParStructure.forEach(item => {
                lignes.push(`${item.structure}  ${item.total}`);
            });
            const blob = new Blob([lignes.join('\n')], { type: 'text/plain;charset=utf-8' });
            const lien = document.createElement('a');
            lien.href = URL.createObjectURL(blob);
            lien.download = `Facturation_${this.mois}.txt`;
            lien.click();
            URL.revokeObjectURL(lien.href);
        },

        telechargerPdf() {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text('Facturation par Structure', 14, 15);

            const data = this.totauxParStructure.map(item => [item.structure, `${item.total} DzD`]);

            autoTable(doc, {
                head: [['Structure', 'Total (DzD)']],
                body: data,
                startY: 25,
                theme: 'striped',
                styles: { fontSize: 10 },
            });

            doc.save(`totaux_structures_${this.mois}.pdf`);
        }
    },

    computed: {
        filteredAffectations() {
            return this.affectations.filter(item =>
                Object.keys(this.filters).every(key => {
                    const filterValue = this.filters[key]?.toString().toLowerCase();
                    const itemValue = item[key]?.toString().toLowerCase();
                    return filterValue === '' || itemValue.includes(filterValue);
                })
            );
        },

        // ✅ Version corrigée de totauxParStructure (harmonisée)
        totauxParStructure() {

            const result = {};

            const allStructures = Array.isArray(this.structures) ? this.structures : [];

            const getTypeStr = codeStr => {
                const s = allStructures.find(x => x.code_str === codeStr);
                return s ? s.type_str : null;
            };

            this.filteredAffectations.forEach(item => {
                const montant = this.parseMontant(item.montant);
                const montantCalcule = ((montant / 5) + (montant * 0.3) + (montant * 0.10)) / 12;
                const codeStr = item.code_str || item.structure || '';
                const typeStr = getTypeStr(codeStr);

                let structureKey;
                if (typeStr === 'DG' && codeStr !== 'DINF') {
                    structureKey = 'F00';
                } else {
                    structureKey = codeStr || 'UNKNOWN';
                }

                if (!result[structureKey]) result[structureKey] = 0;
                result[structureKey] += montantCalcule;
            });

            const structuresAGarder = allStructures
                .filter(s => s.type_str !== 'DG' || s.code_str === 'DINF')
                .map(s => s.code_str);
            structuresAGarder.push('F00');

            return structuresAGarder.map(code => ({
                structure: code,
                total: parseFloat((result[code] || 0).toFixed(2))
            })).sort((a, b) => a.structure.localeCompare(b.structure));
        },

        totalMontantCalcule() {
            return this.filteredAffectations.reduce((total, item) => {
                const montant = this.parseMontant(item.montant);
                const result = ((montant / 5) + (montant * 0.3) + (montant * 0.10)) / 12;
                return total + result;
            }, 0).toFixed(2);
        },

        paginatedTotauxParStructure() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.totauxParStructure.slice(start, start + this.itemsPerPage);
        },

        totalPages() {
            return Math.ceil(this.totauxParStructure.length / this.itemsPerPage);
        }
    },

    watch: {
        itemsPerPage() {
            this.currentPage = 1;
        },
        mois(newVal) {
            if (newVal) this.getMateriels();
        }
    },

    mounted() {
        this.getStructures();
        this.getMateriels();
    },
};
</script>

<template>
    <div class="mx-auto px-4">
        <button class="btn btn-blue w-full mt-4 rounded-lg shadow-lg hover:bg-blue-200">
            💻 Facturation Équipement Informatique Globale
        </button>

        <h5 class="text-lg font-semibold text-blue-600 mt-6">📅 Veuillez sélectionner le mois</h5>

        <div class="grid grid-cols-2 gap-4 max-w-xl mt-3">
            <div class="form-control">
                <label for="mois" class="label text-gray-700 font-medium">Mois</label>
                <input type="month" id="mois"
                    class="input input-bordered w-full border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 transition-all rounded-xl shadow-sm"
                    v-model="mois" />
            </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center h-40">
            <span class="loading loading-spinner loading-lg text-blue-500"></span>
        </div>

        <div v-else class="overflow-x-auto mt-8">
            <label for="perPage" class="font-semibold">Lignes par page :</label>
            <select id="perPage" v-model.number="itemsPerPage"
                class="select select-bordered border-blue-400 focus:ring-blue-300 focus:ring-2 rounded-lg shadow-sm ml-2">
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
                <option :value="150">150</option>
                <option :value="200">200</option>
            </select>

            <h3 class="mt-10 text-lg font-semibold text-blue-700">📊 Totaux par structure</h3>

            <table class="table table-sm table-zebra mt-4 border border-blue-300 rounded-lg shadow-md">
                <thead class="bg-blue-100 text-blue-800 font-semibold">
                    <tr>
                        <th>#</th>
                        <th>Structure</th>
                        <th>Total (DzD)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedTotauxParStructure" :key="item.structure"
                        class="hover:bg-blue-50 transition-all">
                        <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                        <td>{{ item.structure }}</td>
                        <td class="font-medium">{{ item.total }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="flex justify-between items-center mt-6">
                <button class="btn btn-outline btn-secondary" @click="telechargerTxt">
                    📄 Télécharger (.txt)
                </button>
                <button class="btn btn-accent" @click="telechargerPdf">
                    📘 Télécharger (.pdf)
                </button>
            </div>

            <div class="pagination mt-6 flex justify-center gap-2">
                <button class="btn btn-sm" @click="prevPage" :disabled="currentPage === 1">⬅️ Précédent</button>
                <button v-for="page in totalPages" :key="page" class="btn btn-sm"
                    :class="{ 'btn-primary': currentPage === page }" @click="goToPage(page)">
                    {{ page }}
                </button>
                <button class="btn btn-sm" @click="nextPage" :disabled="currentPage === totalPages">Suivant ➡️</button>
            </div>
        </div>
    </div>
</template>
