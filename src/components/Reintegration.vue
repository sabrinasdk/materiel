<script>
import axios from 'axios';

export default {
    name: 'PageReintegrationMateriels',
    data() {
        return {
            title: 'Page Reintegration Materiel',
            materiels: [],
            affectations: [],
            currentPage: 1,
            itemsPerPage: 150,
            mois: '2025-06-01',
            dateComplete: '',
            date: '',
            structure: 'B142',
            structureto: 'DINF',
            structures: [],
            selectedMateriels: [],
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

                axios.post('http://localhost:3000/materiel_affectation', {
                    date: this.dateComplete,
                    structure: this.structure
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

            // Crée une date au 1er du mois suivant, puis recule d'un jour
            const dernierJour = new Date(anneeNum, moisNum, 0); // 0 → dernier jour du mois précédent

            // Formatage YYYY-MM-DD
            const yyyy = dernierJour.getFullYear();
            const mm = String(dernierJour.getMonth() + 1).padStart(2, "0");
            const dd = String(dernierJour.getDate()).padStart(2, "0");

            return `${yyyy}-${mm}-${dd}`;
        },
        postReintegartion() {
            if (!this.structure || this.selectedMateriels.length === 0) {
                alert("Veuillez sélectionner une structure d'origine, une structure de destination, et au moins un matériel.");
                return;
            }

            axios.post('http://localhost:3000/reintegration', {
                date: this.date,
                structure: this.structure,
                structureto: this.structureto,
                codes_mat: this.selectedMateriels
            })
                .then(response => {
                    alert('Reintegration effectué avec succès');
                    this.selectedMateriels = [];
                    this.getMateriels();

                })
                .catch(error => {
                    console.error('Erreur lors du reintegration :', error);
                    alert('Erreur lors du transfert');
                });
        }

    },
    computed: {

        totalMontantCalcule() {
            return this.paginatedAffectations.reduce((total, item) => {
                let montant = parseFloat(item.montant.replace(',', '.')) || 0;
                let result = ((montant / 5) + (montant * 0.3) + (montant * 0.10)) / 12;
                return total + result;
            }, 0).toFixed(2);
        },
        filteredAffectations() {
            return this.affectations.filter(item => {
                return Object.keys(this.filters).every(key => {
                    const filterValue = this.filters[key]?.toString().toLowerCase();
                    const itemValue = item[key]?.toString().toLowerCase();
                    return filterValue === '' || itemValue.includes(filterValue);
                });
            });
        },
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
            if (newVal && this.structure) {
                this.getMateriels();
            }
        },
        structure(newVal) {
            if (newVal && this.mois) {
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
        <div>
            <button class="btn btn-dash  bg-white text-blue-900  rounded-none m-2">
                Reintegration </button>

        </div>

        <div class="grid grid-cols-4 gap-12 max-w-7xl">
            <div class="form-control">
                <label for="mois" class="label mt-5 mr-40">Veuillez sélectionner la date et la structure :</label>
            </div>
            <div class="form-control">
                <label for="mois" class="label"><span class="label-text">Date</span></label>
                <input type="date" id="mois" class="input input-bordered w-full" v-model="date" />
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text">De Structure</span></label>
                <select class="select input-bordered w-full" v-model="structure">
                    <option disabled value="">Sélectionnez la structure</option>
                    <option v-for="item in structures" :key="item.id" :value="item.code_str">
                        {{ item.code_str }}
                    </option>
                </select>
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

            <table class="table table-xs table-zebra">
                <thead>
                    <tr>
                        <th>#</th>
                        <th></th>
                        <th><input v-model="filters.code_mat" placeholder="Code mat" class="input input-xs" /></th>
                        <th><input v-model="filters.libelle" placeholder="Désignation" class="input input-xs" />
                        </th>
                        <th></th>
                    </tr>
                    <tr>
                        <th class="">#</th>
                        <th>A transférer</th>
                        <th>Code matériel</th>
                        <th>Désignation</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedAffectations" :key="item.code_mat">
                        <th>{{ index + 1 }}</th>
                        <td>
                            <label class="label">
                                <input type="checkbox" class="checkbox" :value="item.code_mat"
                                    v-model="selectedMateriels" />
                            </label>
                        </td>
                        <td>{{ item.code_mat }}</td>
                        <td>{{ item.libelle }}</td>

                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: right;"></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <div class="flex justify-end mt-4 rounded">
                <button class="btn bg-amber-500" @click="postReintegartion">Enregistrer</button>
            </div>

            <div class="pagination">
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

<style scoped>
.pagination {
    margin-top: 10px;
}

.pagination button {
    margin: 0 5px;
}

.pagination button.active {
    font-weight: bold;
    background-color: #eee;
}
</style>
