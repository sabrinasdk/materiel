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
            title: 'Page Affectations',
            materiels: [],
            affectations: [],
            currentPage: 1,
            itemsPerPage: 50,
            isLoading: true,
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
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        fetchMateriels() {
            axios.get('http://localhost:3000/materiel')
                .then(res => (this.materiels = res.data))
                .catch(err => console.error('Erreur lors de la récupération des matériels :', err));
        },
        fetchAffectations() {
            this.isLoading = true;
            axios.get('http://localhost:3000/affectations')
                .then(res => (this.affectations = res.data))
                .catch(err => console.error('Erreur lors de la récupération des affectations :', err))
                .finally(() => (this.isLoading = false));
        },
        normalize(value) {
            if (!value) return '';
            return value
                .toString()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .trim();
        }
    },
    computed: {
        filteredAffectations() {
            return this.affectations.filter(item => {
                const norm = this.normalize;
                return (
                    (!this.filters.code_mat || norm(item.code_mat).includes(norm(this.filters.code_mat))) &&
                    (!this.filters.libelle || norm(item.libelle).includes(norm(this.filters.libelle))) &&
                    (!this.filters.code_str || norm(item.code_str).includes(norm(this.filters.code_str))) &&
                    (!this.filters.matricule_utl || norm(item.matricule_utl).includes(norm(this.filters.matricule_utl))) &&
                    (!this.filters.type_affectation || norm(item.type_affectation).includes(norm(this.filters.type_affectation)))
                );
            });
        },
        paginatedAffectations() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredAffectations.slice(start, start + this.itemsPerPage);
        },
        totalPages() {
            return Math.ceil(this.filteredAffectations.length / this.itemsPerPage) || 1;
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
    <div class="min-h-screen bg-gray-50 p-6">
        <!-- En-tête -->
        <div class="flex flex-col items-center mb-6 space-y-3">
            <h2 class="text-2xl font-bold text-blue-800 mt-5">🔗 Affectations de Matériels</h2>
            <button class="btn bg-blue-600 text-white hover:bg-blue-700 border-none rounded-md shadow-md px-6"
                onclick="my_modal_4.showModal()">
                + Nouvelle Affectation
            </button>
        </div>

        <AffectationAdd @materiel-ajoute="fetchAffectations" />

        <!-- Loader -->
        <div v-if="isLoading" class="flex justify-center items-center min-h-[200px]">
            <span class="loading loading-spinner text-primary loading-lg"></span>
        </div>

        <!-- Tableau -->
        <div v-else class="bg-white p-4 rounded-2xl shadow-md">
            <!-- Sélecteur de lignes -->
            <div class="flex justify-between items-center mb-3">
                <div>
                    <label for="perPage" class="text-gray-600 text-sm font-medium">Lignes par page :</label>
                    <select id="perPage" v-model.number="itemsPerPage"
                        class="ml-2 border border-gray-300 rounded-md p-1">
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                        <option :value="100">100</option>
                        <option :value="150">150</option>
                        <option :value="200">200</option>
                    </select>
                </div>
                <p class="text-sm text-gray-500">
                    {{ filteredAffectations.length }} résultat(s)
                </p>
            </div>

            <div class="overflow-x-auto">
                <table class="table table-zebra w-full border border-gray-200">
                    <thead class="bg-blue-100 text-blue-800">
                        <tr>
                            <th>#</th>
                            <th><input v-model="filters.code_mat" placeholder="Code Mat"
                                    class="input input-xs w-full" /></th>
                            <th><input v-model="filters.libelle" placeholder="Libellé" class="input input-xs w-full" />
                            </th>
                            <th><input v-model="filters.code_str" placeholder="Structure"
                                    class="input input-xs w-full" /></th>
                            <th><input v-model="filters.matricule_utl" placeholder="Utilisateur"
                                    class="input input-xs w-full" /></th>
                            <th><input v-model="filters.type_affectation" placeholder="Type"
                                    class="input input-xs w-full" /></th>

                        </tr>
                        <tr class="font-semibold">
                            <th>#</th>
                            <th>Matricule</th>
                            <th>Libellé</th>
                            <th>Structure</th>
                            <th>Utilisateur</th>
                            <th>Type</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in paginatedAffectations" :key="item.code_mat"
                            class="hover:bg-blue-50">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.code_mat }}</td>
                            <td>{{ item.libelle }}</td>
                            <td>{{ item.code_str }}</td>
                            <td>{{ item.matricule_utl }}</td>
                            <td>{{ item.type_affectation }}</td>

                        </tr>
                        <tr v-if="filteredAffectations.length === 0">
                            <td colspan="7" class="text-center py-4 text-gray-500 italic">Aucune affectation trouvée
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex justify-center items-center mt-4 space-x-2">
                <button class="btn btn-sm" @click="prevPage" :disabled="currentPage === 1">← Précédent</button>
                <span class="text-gray-700 text-sm">
                    Page {{ currentPage }} / {{ totalPages }}
                </span>
                <button class="btn btn-sm" @click="nextPage" :disabled="currentPage === totalPages">Suivant →</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.input {
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 2px 4px;
}
</style>
