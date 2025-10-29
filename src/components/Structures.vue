<script>
import StructureAdd from './StructureAdd.vue'
import axios from 'axios'

export default {
    name: 'PageStructures',
    components: {
        StructureAdd,
    },
    data() {
        return {
            title: 'Page Structure',
            structures: [],
            currentPage: 1,
            itemsPerPage: 150,
            filters: {

                code_str: '',
                libelle: '',

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
        fetchStructures() {
            axios.get('http://localhost:3000/structures')
                .then(response => {
                    this.structures = response.data;
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des matériels :', error);
                });
        },
    },
    computed: {
        /*paginatedStructures() {
          const start = (this.currentPage - 1) * this.itemsPerPage;
          return this.structures.slice(start, start + this.itemsPerPage);
        },
        totalPages() {
          return Math.ceil(this.structures.length / this.itemsPerPage);
        }*/
        filteredStructures() {
            return this.structures.filter(item => {
                return Object.keys(this.filters).every(key => {
                    const filterValue = this.filters[key]?.toString().toLowerCase();
                    const itemValue = item[key]?.toString().toLowerCase();
                    return filterValue === '' || itemValue.includes(filterValue);
                });
            });
        },
        paginatedStructures() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredStructures.slice(start, start + this.itemsPerPage);
        },
        totalPages() {
            return Math.ceil(this.filteredStructures.length / this.itemsPerPage);
        }
    },

    watch: {
        itemsPerPage() {
            this.currentPage = 1;
        }
    },

    mounted() {
        this.fetchStructures();

    },
};
</script>

<template>

    <!-- You can open the modal using ID.showModal() method -->

    <div class=" mx-auto px-4 ">

        <button class="btn btn-dash  bg-white text-blue-900  rounded-none m-2" onclick="my_modal_4.showModal()">Ajouter

            structure</button>

        <StructureAdd @structure-ajoute="fetchStructures" />
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
                        <th><input v-model="filters.code_str" placeholder="Filtrer" class="input input-xs" /></th>
                        <th><input v-model="filters.libelle" placeholder="Filtrer" class="input input-xs" /></th>
                        <th></th>
                    </tr>
                    <tr>
                        <th>#</th>
                        <th>Matricule</th>
                        <th>Structure</th>
                        <th>Type</th>
                        <th>Projet</th>
                        <th>Date création</th>
                        <th>Date cloture</th>

                    </tr>
                </thead>
                <tbody>

                    <tr v-for="(item, index) in paginatedStructures" :key="item.code_mat">
                        <th class="w-1/15 ">{{ index + 1 }}</th>
                        <td class="w-1/5 ">{{ item.code_str }}</td>
                        <td class="w-1/5 ">{{ item.libelle }}</td>
                        <td class="w-1/5 ">{{ item.type_str }}</td>
                        <td class="w-1/8 ">{{ item.projet }}</td>
                        <td class="w-1/5 ">{{ item.date_creation }}</td>
                        <td class="w-1/5 ">{{ item.date_cloture }}</td>

                    </tr>
                </tbody>

                <!-- Pagination -->

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
