<script>
import AddFamille from './AddFamille.vue'
import axios from 'axios'

export default {
    name: 'PageFamilles',
    components: {
        AddFamille,
    },
    data() {
        return {
            title: 'Page Famille',
            familles: [],
            currentPage: 1,
            itemsPerPage: 150,
            filters: {
                code_fam: '',
                libelle: '',
            }
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
        fetchFamilles() {
            axios.get('http://localhost:3000/familles')
                .then(response => (this.familles = response.data))
                .catch(error => console.error('Erreur lors de la récupération des familles :', error));
        },
        fixEncoding(str) {
            try {
                return decodeURIComponent(escape(str));
            } catch {
                return str;
            }
        }
    },
    computed: {
        filteredFamilles() {
            return this.familles.filter(item =>
                Object.keys(this.filters).every(key => {
                    const filterValue = this.filters[key]?.toString().toLowerCase();
                    const itemValue = item[key]?.toString().toLowerCase();
                    return filterValue === '' || itemValue.includes(filterValue);
                })
            );
        },
        paginatedFamilles() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredFamilles.slice(start, start + this.itemsPerPage);
        },
        totalPages() {
            return Math.ceil(this.filteredFamilles.length / this.itemsPerPage) || 1;
        }
    },
    watch: {
        itemsPerPage() {
            this.currentPage = 1;
        }
    },
    mounted() {
        this.fetchFamilles();
    },
};
</script>

<template>
    <div class="mx-auto px-6 py-6 max-w-7xl">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-blue-800">📦 Familles Matériels</h2>
            <button class="btn bg-white text-blue-900 border border-blue-400 rounded-none shadow-sm"
                onclick="my_modal_4.showModal()">
                ➕ Nouvelle Famille
            </button>
        </div>

        <!-- Filtres -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg shadow-sm">
            <div>
                <label class="label-text font-medium">Code Famille</label>
                <input v-model="filters.code_fam" placeholder="Filtrer par code" class="input input-bordered w-full" />
            </div>

            <div>
                <label class="label-text font-medium">Libellé</label>
                <input v-model="filters.libelle" placeholder="Filtrer par libellé"
                    class="input input-bordered w-full" />
            </div>

            <div>
                <label class="label-text font-medium">Lignes par page</label>
                <select v-model.number="itemsPerPage" class="select select-bordered w-full">
                    <option :value="20">20</option>
                    <option :value="50">50</option>
                    <option :value="70">70</option>
                    <option :value="100">100</option>
                    <option :value="150">150</option>
                    <option :value="200">200</option>
                </select>
            </div>
        </div>

        <AddFamille @famille-ajoute="fetchFamilles" />

        <!-- Tableau -->
        <div class="overflow-x-auto mt-6 bg-white rounded-lg shadow-md">
            <table class="table table-sm table-zebra w-full">
                <thead class="bg-blue-100 text-blue-800">
                    <tr class="font-semibold">
                        <th>#</th>
                        <th>Code Famille</th>
                        <th>Libellé</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item, index) in paginatedFamilles" :key="item.code_fam">
                        <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
                        <td>{{ item.code_fam }}</td>
                        <td>{{ fixEncoding(item.libelle) }}</td>
                    </tr>

                    <tr v-if="paginatedFamilles.length === 0">
                        <td colspan="3" class="text-center text-gray-500 py-4">
                            Aucune famille trouvée pour ces critères.
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
    </div>
</template>

<style scoped>
.btn-active {
    background-color: #2563eb;
    color: white;
}
</style>
