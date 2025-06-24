<script>
import axios from 'axios';

export default {
    name: 'PageFacturationMateriels',
    data() {
        return {
            title: 'Page Facturation Materiel',
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
        <button class="btn btn-dash btn-primary rounded-none m-2" onclick="my_modal_4.showModal()">
            Facturation Equipement Informatique par structure
        </button>

        <h5 class="text-l font-semibold text-primary">Veuillez sélectionner la date et la structure</h5>

        <div class="grid grid-cols-2 gap-4 max-w-xl">
            <div class="form-control">
                <label for="mois" class="label"><span class="label-text">Mois</span></label>
                <input type="month" id="mois" class="input input-bordered w-full" v-model="mois" />
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text">Structure</span></label>
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

            <table class="table table-xs">
                <thead>
                    <tr>
                        <th>#</th>
                        <th><input v-model="filters.code_mat" placeholder="Code mat" class="input input-xs" /></th>
                        <th><input v-model="filters.libelle" placeholder="Désignation" class="input input-xs" /></th>
                        <th><input v-model="filters.code_str" placeholder="Structure" class="input input-xs" /></th>
                        <th><input v-model="filters.matricule_utl" placeholder="Matricule" class="input input-xs" />
                        </th>
                        <th></th>
                    </tr>
                    <tr>
                        <th>#</th>
                        <th>Code matériel</th>
                        <th>Désignation</th>
                        <th>Montant</th>
                        <th>Location</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedAffectations" :key="item.code_mat">
                        <th>{{ index + 1 }}</th>
                        <td>{{ item.code_mat }}</td>
                        <td>{{ item.libelle }}</td>
                        <td>{{ item.montant }}</td>
                        <td>
                            {{
                                ((((parseFloat(item.montant.replace(',', '.')) / 5)
                                    + (parseFloat(item.montant.replace(',', '.')) * 0.3)
                                    + (parseFloat(item.montant.replace(',', '.')) * 0.10)) / 12).toFixed(2))
                            }} <span class="text-red-500">DzD</span>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="5" style="text-align: right;"><strong>Total :</strong></td>
                        <td><strong>{{ totalMontantCalcule }} DzD</strong></td>
                    </tr>
                </tbody>
            </table>

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
