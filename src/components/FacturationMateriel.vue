<script>
import axios from 'axios';
import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';

// ✅ attache la méthode autoTable à jsPDF


export default {
    name: 'PageFacturationMateriels',
    data() {
        return {
            title: 'Page Facturation Matériel',
            materiels: [],
            affectations: [],
            currentPage: 1,
            itemsPerPage: 150,
            mois: '2025-06',
            dateComplete: '',
            structure: 'B142',
            structures: [],
            filters: {
                code_mat: '',
                libelle: '',
                code_str: '',
                matricule_utl: '',
                type_affectation: '',
            },
            famillesMap: {
                L40: "Écran",
                L02: "Imprimante",
                L11: "Onduleur",
                L03: "Pc Portable",
                L01: "Unité centrale",
                L08: "Scanner",
                L70: "Équipement réseau",
                L60: "Data Show",
                L00: "Serveur",
                L62: "Imprimante Code Barre",
                L61: "Lecteur code à barre",
                L43: "Armoire de brassage",
                L04: "All In One"
            }
        };
    },

    methods: {
        /** 🧾 Génération du PDF **/
        telechargerFacture() {
            const doc = new jsPDF();
            const titre = `Facture Materiels Informatique - ${this.structure} (${this.mois})`;

            doc.setFontSize(16);
            doc.text(titre, 14, 20);

            doc.setFontSize(12);
            doc.text(`Date de génération : ${new Date().toLocaleDateString()}`, 14, 30);

            // ✅ Tableau totaux par famille
            const dataFamilles = this.totauxParFamille.map(f => [
                f.famille,
                f.count,
                `${f.total} DzD`
            ]);

            autoTable(doc, {
                head: [['Famille', 'Nb matériels', 'Total (DzD)']],
                body: dataFamilles,
                startY: 40,
                styles: { fontSize: 10 },
            });

            // ✅ Tableau détails
            const dataDetails = this.filteredAffectations.map((item, i) => [
                i + 1,
                item.code_mat,
                item.libelle,
                item.montant,
                ((((parseFloat(item.montant.replace(',', '.')) / 5)
                    + (parseFloat(item.montant.replace(',', '.')) * 0.3)
                    + (parseFloat(item.montant.replace(',', '.')) * 0.10)) / 12).toFixed(2))
            ]);

            autoTable(doc, {
                head: [['#', 'Code matériel', 'Désignation', 'Montant', 'Location (DzD)']],
                body: dataDetails,
                startY: doc.lastAutoTable.finalY + 10,
                styles: { fontSize: 9 },
            });

            doc.text(`Total général : ${this.totalMontantCalcule} DzD`, 14, doc.lastAutoTable.finalY + 15);

            // ✅ Sauvegarde du PDF
            doc.save(`Facture_${this.structure}_${this.mois}.pdf`);
        }
        ,

        /** 🔹 Récupération des structures **/
        getStructures() {
            axios.get('http://localhost:3000/structures')
                .then(response => {
                    this.structures = response.data;
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des structures :', error);
                });
        },

        /** 🔹 Récupération des matériels affectés **/
        getMateriels() {
            try {
                this.dateComplete = this.getDernierJourDuMois(this.mois);

                axios.post('http://localhost:3000/materiel_affectation', {
                    date: this.dateComplete,
                    structure: this.structure
                })
                    .then((response) => {
                        this.affectations = response.data.map(item => {
                            const prefix = item.code_mat ? item.code_mat.substring(0, 3) : '';
                            item.famille = this.famillesMap[prefix] || 'Autre';
                            return item;
                        });
                    })
                    .catch((error) => {
                        console.error('Erreur lors de la récupération des affectations :', error);
                    });
            } catch (err) {
                console.error('Erreur inattendue dans getMateriels() :', err);
            }
        },

        /** 🗓️ Obtenir le dernier jour du mois **/
        getDernierJourDuMois(mois) {
            const [annee, moisStr] = mois.split("-");
            const anneeNum = parseInt(annee, 10);
            const moisNum = parseInt(moisStr, 10);
            const dernierJour = new Date(anneeNum, moisNum, 0);
            const yyyy = dernierJour.getFullYear();
            const mm = String(dernierJour.getMonth() + 1).padStart(2, "0");
            const dd = String(dernierJour.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        },

        /** 🔹 Pagination **/
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) this.currentPage = page;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        }
    },

    computed: {
        /** Totaux par famille **/
        totauxParFamille() {
            const result = {};
            this.filteredAffectations.forEach(item => {
                const famille = item.famille || 'Non définie';
                const montant = parseFloat(item.montant.replace(',', '.')) || 0;
                const montantCalcule = ((montant / 5) + (montant * 0.3) + (montant * 0.10)) / 12;

                if (!result[famille]) result[famille] = { total: 0, count: 0 };

                result[famille].total += montantCalcule;
                result[famille].count++;
            });

            return Object.entries(result).map(([famille, data]) => ({
                famille,
                total: data.total.toFixed(2),
                count: data.count
            }));
        },

        /** Groupement par famille **/
        groupByFamille() {
            const groupes = {};
            this.filteredAffectations.forEach(item => {
                const famille = item.famille || 'Non définie';
                if (!groupes[famille]) groupes[famille] = [];
                groupes[famille].push(item);
            });
            return groupes;
        },

        /** Total général **/
        totalMontantCalcule() {
            return this.filteredAffectations.reduce((total, item) => {
                const montant = parseFloat(item.montant.replace(',', '.')) || 0;
                const calcul = ((montant / 5) + (montant * 0.3) + (montant * 0.10)) / 12;
                return total + calcul;
            }, 0).toFixed(2);
        },

        /** Filtrage **/
        filteredAffectations() {
            return this.affectations.filter(item => {
                return Object.keys(this.filters).every(key => {
                    const filterValue = this.filters[key]?.toString().toLowerCase();
                    const itemValue = item[key]?.toString().toLowerCase();
                    return filterValue === '' || itemValue.includes(filterValue);
                });
            });
        },

        /** Pagination **/
        paginatedAffectations() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredAffectations.slice(start, start + this.itemsPerPage);
        },

        totalPages() {
            return Math.ceil(this.filteredAffectations.length / this.itemsPerPage);
        }
    },

    watch: {
        itemsPerPage() {
            this.currentPage = 1;
        },
        mois(newVal) {
            if (newVal && this.structure) this.getMateriels();
        },
        structure(newVal) {
            if (newVal && this.mois) this.getMateriels();
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
        <h3 class="font-bold text-lg mb-4 text-primary">
            Facturation des Équipements Informatiques
        </h3>

        <div class="grid grid-cols-2 gap-4 max-w-xl">
            <div class="form-control">
                <label class="label-text font-medium">Mois</label>
                <input type="month" class="input input-bordered w-full" v-model="mois" />
            </div>
            <div class="form-control">
                <label class="label-text font-medium">Structure</label>
                <select class="select input-bordered w-full" v-model="structure">
                    <option disabled value="">Sélectionnez la structure</option>
                    <option v-for="item in structures" :key="item.id" :value="item.code_str">
                        {{ item.code_str }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Totaux par famille -->
        <h3 class="mt-6 font-bold text-primary">Totaux par famille</h3>
        <table class="table table-sm table-bordered mt-2">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Famille</th>
                    <th>Nb Matériels</th>
                    <th>Total (DzD)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in totauxParFamille" :key="item.famille">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.famille }}</td>
                    <td>{{ item.count }}</td>
                    <td>{{ item.total }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Détails -->
        <h3 class="mt-6 font-bold text-primary">Détails des matériels par famille</h3>
        <table class="table table-xs table-zebra mt-2">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Code matériel</th>
                    <th>Désignation</th>
                    <th>Montant</th>
                    <th>Location (DzD)</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(group, famille) in groupByFamille" :key="famille">
                    <tr class="bg-gray-100 font-bold text-primary">
                        <td colspan="5">{{ famille }}</td>
                    </tr>
                    <tr v-for="(item, index) in group" :key="item.code_mat">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.code_mat }}</td>
                        <td>{{ item.libelle }}</td>
                        <td>{{ item.montant }}</td>
                        <td>
                            {{
                                ((((parseFloat(item.montant.replace(',', '.')) / 5)
                                    + (parseFloat(item.montant.replace(',', '.')) * 0.3)
                                    + (parseFloat(item.montant.replace(',', '.')) * 0.10)) / 12).toFixed(2))
                            }}
                        </td>
                    </tr>
                </template>
                <tr>
                    <td colspan="4" class="text-right font-bold">Total général :</td>
                    <td><strong>{{ totalMontantCalcule }} DzD</strong></td>
                </tr>
            </tbody>
        </table>

        <div class="flex justify-end mt-4">
            <button class="btn btn-primary" @click="telechargerFacture">
                📄 Télécharger la facture
            </button>
        </div>
    </div>
</template>

<style scoped>
.table {
    width: 100%;
}

.bg-gray-100 {
    background-color: #f3f4f6;
}

.text-primary {
    color: #2563eb;
}
</style>
