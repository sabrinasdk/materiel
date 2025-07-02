<script>
import axios from 'axios';

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
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        getStructures() {
            axios.get('http://localhost:3000/structures')
                .then(response => {
                    this.structures = response.data;
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des structures :', error);
                });
        },

        getMateriels() {
            try {
                this.dateComplete = this.getDernierJourDuMois(this.mois);

                axios.post('http://localhost:3000/materiel_affectationglobale', {
                    date: this.dateComplete,
                    structure: null // Charger toutes les structures
                })
                    .then((response) => {
                        this.affectations = response.data;
                    })
                    .catch((error) => {
                        console.error('Erreur lors de la récupération des affectations :', error);
                    });

            } catch (err) {
                console.error('Erreur inattendue dans getMateriels() :', err);
            }
        },

        getDernierJourDuMois(mois) {
            const [annee, moisStr] = mois.split("-");
            const anneeNum = parseInt(annee, 10);
            const moisNum = parseInt(moisStr, 10);
            const dernierJour = new Date(anneeNum, moisNum, 0);

            const yyyy = dernierJour.getFullYear();
            const mm = String(dernierJour.getMonth() + 1).padStart(2, "0");
            const dd = String(dernierJour.getDate()).padStart(2, "0");

            return `${yyyy}-${mm}-${dd}`;
        }
    },
    computed: {
        filteredAffectations() {
            return this.affectations.filter(item => {
                return Object.keys(this.filters).every(key => {
                    const filterValue = this.filters[key]?.toString().toLowerCase();
                    const itemValue = item[key]?.toString().toLowerCase();
                    return filterValue === '' || itemValue.includes(filterValue);
                });
            });
        },

        totauxParStructure() {
            const result = {};

            this.filteredAffectations.forEach(item => {
                const structure = item.code_str;
                const montant = parseFloat(item.montant.replace(',', '.')) || 0;
                const montantCalcule = ((montant / 5) + (montant * 0.3) + (montant * 0.10)) / 12;

                if (!result[structure]) {
                    result[structure] = 0;
                }

                result[structure] += montantCalcule;
            });

            return Object.entries(result).map(([structure, total]) => ({
                structure,
                total: total.toFixed(2)
            }));
        },

        totalMontantCalcule() {
            return this.filteredAffectations.reduce((total, item) => {
                let montant = parseFloat(item.montant.replace(',', '.')) || 0;
                let result = ((montant / 5) + (montant * 0.3) + (montant * 0.10)) / 12;
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
            if (newVal) {
                this.getMateriels();
            }
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
        <button class="btn btn-dash btn-primary rounded-none m-2" onclick="my_modal_4.showModal()">
            Facturation Equipement Informatique globale
        </button>

        <h5 class="text-l font-semibold text-primary">Veuillez sélectionner la date</h5>
        <h1 class="text-6xl">𝕏</h1>
        <div class="grid grid-cols-2 gap-4 max-w-xl">
            <div class="form-control">
                <label for="mois" class="label"><span class="label-text">Mois</span></label>
                <input type="month" id="mois" class="input input-bordered w-full" v-model="mois" />
            </div>
        </div>

        <div class="overflow-x-auto mt-5">
            <label for="perPage">Lignes par page :</label>
            <select id="perPage" v-model.number="itemsPerPage">
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="70">70</option>
                <option :value="100">100</option>
                <option :value="150">150</option>
                <option :value="200">200</option>
            </select>

            <h3 class="mt-10 text-lg font-semibold">Totaux par structure</h3>
            <table class="table table-sm table-bordered mt-2">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Structure</th>
                        <th>Total (DzD)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedTotauxParStructure" :key="item.structure">
                        <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                        <td>{{ item.structure }}</td>
                        <td>{{ item.total }}</td>
                    </tr>
                </tbody>
            </table>

            <p class="mt-4 font-semibold text-right">
                Total général : {{ totalMontantCalcule }} DzD
            </p>

            <div class="pagination mt-6">
                <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
                <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                    :class="{ active: currentPage === page }">
                    {{ page }}
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
            </div>




        </div>
    </div>

</template>
