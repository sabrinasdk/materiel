<script>
import AffectationAdd from './AffectationAdd.vue'
import axios from 'axios'

export default {
    name: 'PageAffectations',
    components: {
        AffectationAdd
    },
    data() {
        return {
            title: 'Page Affectation',
            materiels: [],
            affectations: [],
            currentPage: 1,
            itemsPerPage: 150,
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
        fetchMateriels() {
            axios.get('http://localhost:3000/materiel')
                .then(response => {
                    this.materiels = response.data;
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des matériels :', error);
                });
        },
        fetchAffectations() {
            axios.get('http://localhost:3000/affectations')
                .then(response => {
                    this.affectations = response.data;
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des matériels :', error);
                });
        },
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
        }
    },

    mounted() {

        this.fetchAffectations();
        this.fetchMateriels();

    },
};
</script>

<template>

    <div class=" mx-auto px-4 ">

        <button class="btn btn-dash btn-primary rounded-none m-2" onclick="my_modal_4.showModal()">Ajouter une nouvelle
            affectation</button>

        <AffectationAdd @materiel-ajoute="fetchAffectations" />
        <div class="overflow-x-auto">
            <label for="perPage">Lignes par page :</label>
            <select id="perPage" v-model.number="itemsPerPage">
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="70">70</option>
                <option :value="100">100</option>
                <option :value="150">150</option>
                <option :value="100">200</option>
            </select>

            <table class="table table-xs table-zebra">
                <thead>
                    <tr>
                        <th>#</th>
                        <th><input v-model="filters.code_mat" placeholder="Filtrer" class="input input-xs" /></th>
                        <th><input v-model="filters.libelle" placeholder="Filtrer" class="input input-xs" /></th>
                        <th><input v-model="filters.code_str" placeholder="Filtrer" class="input input-xs" /></th>
                        <th><input v-model="filters.matricule_utl" placeholder="Filtrer" class="input input-xs" /></th>
                        <th><input v-model="filters.type_affectation" placeholder="Filtrer" class="input input-xs" />
                        </th>
                        <th></th>
                    </tr>
                    <tr>
                        <th>#</th>
                        <th>Matricule</th>
                        <th>Libellé</th>
                        <th>Structure</th>
                        <th>Utilisateur</th>
                        <th>Type</th>

                        <th>Edition</th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="(item, index) in paginatedAffectations" :key="item.code_mat">
                        <th>{{ index + 1 }}</th>
                        <td>{{ item.code_mat }}</td>
                        <td>{{ item.libelle }}</td>
                        <td>{{ item.code_str }}</td>
                        <td>{{ item.matricule_utl }}</td>
                        <td>{{ item.type_affectation }}</td>
                        <td></td>

                        <td></td>
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
.read-the-docs {
    color: #888;
}

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
