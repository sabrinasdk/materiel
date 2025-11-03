<script>
import FournisseurAdd from './FournisseurAdd.vue'
import axios from 'axios'

export default {
    name: 'PageFournisseurs',
    components: {
        FournisseurAdd,
    },
    data() {
        return {
            title: 'Page Fournisseur',
            fournisseurs: [],
            currentPage: 1,
            itemsPerPage: 150,
            filters: {
                code_frs: '',
                libelle: '',
                telephone: '',
                adresse: '',
                email: '',
            },
        };
    },
    methods: {
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) this.currentPage = page;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        fetchFournisseurs() {
            axios.get('http://localhost:3000/fournisseurs')
                .then(response => {
                    this.fournisseurs = response.data;
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des fournisseurs :', error);
                });
        },
    },
    computed: {
        filteredFournisseurs() {
            return this.fournisseurs.filter(item => {
                return Object.keys(this.filters).every(key => {
                    const filterValue = this.filters[key]?.toString().toLowerCase();
                    const itemValue = item[key]?.toString().toLowerCase();
                    return filterValue === '' || itemValue.includes(filterValue);
                });
            });
        },
        paginatedFournisseurs() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredFournisseurs.slice(start, start + this.itemsPerPage);
        },
        totalPages() {
            return Math.ceil(this.filteredFournisseurs.length / this.itemsPerPage) || 1;
        }
    },
    watch: {
        itemsPerPage() {
            this.currentPage = 1;
        }
    },
    mounted() {
        this.fetchFournisseurs();
    },
};
</script>

<template>
    <div class="mx-auto px-6 py-6 max-w-7xl">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-blue-800">🏢 Fournisseurs</h2>
            <button class="btn bg-white text-blue-900 border border-blue-400 rounded-none shadow-sm"
                onclick="my_modal_4.showModal()">
                ➕ Nouveau Fournisseur
            </button>
        </div>

        <!-- Filtres -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
            <div>
                <label class="label-text font-medium">Code Fournisseur</label>
                <input v-model="filters.code_frs" placeholder="Filtrer par code" class="input input-bordered w-full" />
            </div>

            <div>
                <label class="label-text font-medium">Libellé</label>
                <input v-model="filters.libelle" placeholder="Filtrer par libellé"
                    class="input input-bordered w-full" />
            </div>

            <div>
                <label class="label-text font-medium">Téléphone</label>
                <input v-model="filters.telephone" placeholder="Filtrer par téléphone"
                    class="input input-bordered w-full" />
            </div>

            <div>
                <label class="label-text font-medium">Adresse</label>
                <input v-model="filters.adresse" placeholder="Filtrer par adresse"
                    class="input input-bordered w-full" />
            </div>

            <div>
                <label class="label-text font-medium">Email</label>
                <input v-model="filters.email" placeholder="Filtrer par email" class="input input-bordered w-full" />
            </div>
        </div>

        <FournisseurAdd @fournisseur-ajoute="fetchFournisseurs" />

        <!-- Tableau -->
        <div class="overflow-x-auto bg-white rounded-lg shadow-md">
            <table class="table table-sm table-zebra w-full">
                <thead class="bg-blue-100 text-blue-800">
                    <tr class="font-semibold">
                        <th>#</th>
                        <th>Code Fournisseur</th>
                        <th>Libellé</th>
                        <th>Téléphone</th>
                        <th>Adresse</th>
                        <th>Email</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item, index) in paginatedFournisseurs" :key="item.code_frs">
                        <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
                        <td>{{ item.code_frs }}</td>
                        <td>{{ item.libelle }}</td>
                        <td>{{ item.telephone }}</td>
                        <td>{{ item.adresse }}</td>
                        <td>{{ item.email }}</td>
                    </tr>

                    <tr v-if="paginatedFournisseurs.length === 0">
                        <td colspan="6" class="text-center text-gray-500 py-4">
                            Aucun fournisseur trouvé pour ces critères.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center items-center gap-2 mt-6">
            <button class="btn btn-xs" @click="prevPage" :disabled="currentPage === 1">←</button>

            <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                :class="['btn btn-xs', currentPage === page ? 'btn-active' : '']">
                {{ page }}
            </button>

            <button class="btn btn-xs" @click="nextPage" :disabled="currentPage === totalPages">→</button>
        </div>

        <!-- Sélecteur lignes par page -->
        <div class="flex justify-end items-center gap-2 mt-4">
            <label class="font-medium text-gray-600">Lignes par page :</label>
            <select v-model.number="itemsPerPage" class="select select-bordered select-sm w-32">
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="70">70</option>
                <option :value="100">100</option>
                <option :value="150">150</option>
                <option :value="200">200</option>
            </select>
        </div>
    </div>
</template>

<style scoped>
.btn-active {
    background-color: #2563eb;
    color: white;
}
</style>
