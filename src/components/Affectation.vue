<script>
import AffectationAdd from './AffectationAdd.vue'
import axios from 'axios'

export default {
    name: 'PageAffectations',
    components: { AffectationAdd },

    data() {
        return {
            title: 'Affectations de Matériels',
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
                date_affectation: '',
                montant: ''
            }
        };
    },

    methods: {
        goToPage(page) { if (page >= 1 && page <= this.totalPages) this.currentPage = page; },
        nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; },
        prevPage() { if (this.currentPage > 1) this.currentPage--; },

        fetchMateriels() {
            axios.get('http://localhost:3000/materiel')
                .then(res => (this.materiels = res.data))
                .catch(err => console.error('Erreur materiels :', err));
        },

        fetchAffectations() {
            this.isLoading = true;
            axios.get('http://localhost:3000/affectations')
                .then(res => {
                    // Tri décroissant par date
                    this.affectations = res.data.sort((a, b) => {
                        const da = a.date_affectation ? new Date(a.date_affectation) : 0;
                        const db = b.date_affectation ? new Date(b.date_affectation) : 0;
                        return db - da;
                    });
                })
                .catch(err => console.error('Erreur affectations :', err))
                .finally(() => (this.isLoading = false));
        },

        normalize(str) {
            if (!str) return '';
            return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        }
    },

    computed: {
        filteredAffectations() {
            const norm = this.normalize;
            return this.affectations.filter(item => {
                const checkField = (field, filterValue) => !filterValue || norm(field).includes(norm(filterValue));

                return checkField(item.code_mat, this.filters.code_mat) &&
                    checkField(item.libelle, this.filters.libelle) &&
                    checkField(item.code_str, this.filters.code_str) &&
                    checkField(item.matricule_utl, this.filters.matricule_utl) &&
                    checkField(item.type_affectation, this.filters.type_affectation) &&
                    (!this.filters.date_affectation ||
                        (item.date_affectation?.slice(0, 10) === this.filters.date_affectation)) &&
                    (!this.filters.montant || (() => {
                        const f = String(this.filters.montant).trim();
                        if (f.includes('-')) {
                            const [minS, maxS] = f.split('-').map(s => s.trim());
                            const min = parseFloat(minS) || -Infinity;
                            const max = parseFloat(maxS) || Infinity;
                            const m = parseFloat(String(item.montant).replace(',', '.')) || 0;
                            return m >= min && m <= max;
                        } else {
                            return String(item.montant ?? '').toLowerCase().includes(f.toLowerCase());
                        }
                    })());
            });
        },

        paginatedAffectations() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredAffectations.slice(start, start + this.itemsPerPage);
        },

        totalPages() { return Math.ceil(this.filteredAffectations.length / this.itemsPerPage) || 1; }
    },

    watch: { itemsPerPage() { this.currentPage = 1; } },

    mounted() { this.fetchAffectations(); this.fetchMateriels(); }
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 space-y-3 md:space-y-0">
            <h2 class="text-3xl font-bold text-blue-800">🔗 {{ title }}</h2>
            <button class="btn bg-blue-600 text-white hover:bg-blue-700 border-none rounded-md shadow-md px-6"
                onclick="my_modal_4.showModal()">
                + Nouvelle Affectation
            </button>
        </div>

        <!-- Modal add component -->
        <AffectationAdd @materiel-ajoute="fetchAffectations" />

        <!-- Loader -->
        <div v-if="isLoading" class="flex justify-center items-center min-h-[200px]">
            <span class="loading loading-spinner text-primary loading-lg"></span>
        </div>

        <!-- Table -->
        <div v-else class="bg-white rounded-2xl shadow-md overflow-x-auto">
            <!-- Table top bar -->
            <div
                class="flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-200 space-y-2 md:space-y-0">
                <div class="flex items-center space-x-2">
                    <label class="text-gray-600 text-sm font-medium">Lignes :</label>
                    <select v-model.number="itemsPerPage" class="border rounded px-2 py-1">
                        <option v-for="n in [20, 50, 100, 150, 200]" :key="n" :value="n">{{ n }}</option>
                    </select>
                </div>
                <p class="text-sm text-gray-500">{{ filteredAffectations.length }} résultat(s)</p>
            </div>

            <!-- Table -->
            <table class="table-auto w-full text-sm">
                <thead class="bg-blue-100 text-blue-800 sticky top-0">
                    <tr>
                        <th>#</th>
                        <th><input v-model="filters.code_mat" placeholder="Code Mat" class="input input-xs w-full" />
                        </th>
                        <th><input v-model="filters.libelle" placeholder="Libellé" class="input input-xs w-full" /></th>
                        <th><input v-model="filters.code_str" placeholder="Structure" class="input input-xs w-full" />
                        </th>
                        <th><input v-model="filters.date_affectation" type="date" class="input input-xs w-full" /></th>
                        <th><input v-model="filters.matricule_utl" placeholder="Utilisateur"
                                class="input input-xs w-full" /></th>
                        <th><input v-model="filters.type_affectation" placeholder="Type"
                                class="input input-xs w-full" /></th>
                    </tr>
                    <tr class="font-semibold bg-blue-200">
                        <th>#</th>
                        <th>Matricule</th>
                        <th>Libellé</th>
                        <th>Structure</th>
                        <th>Date</th>
                        <th>Utilisateur</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedAffectations" :key="index" class="hover:bg-blue-50">
                        <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                        <td>{{ item.code_mat }}</td>
                        <td>{{ item.libelle }}</td>
                        <td>{{ item.code_str }}</td>
                        <td>{{ item.date }}</td>
                        <td>{{ item.matricule_utl }}</td>
                        <td>{{ item.type_affectation }}</td>
                    </tr>
                    <tr v-if="filteredAffectations.length === 0">
                        <td colspan="7" class="text-center py-4 text-gray-500 italic">Aucune affectation trouvée.</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="flex justify-center items-center space-x-3 p-4">
                <button class="btn btn-sm" @click="prevPage" :disabled="currentPage === 1">← Précédent</button>
                <span class="text-gray-700 text-sm">Page {{ currentPage }} / {{ totalPages }}</span>
                <button class="btn btn-sm" @click="nextPage" :disabled="currentPage === totalPages">Suivant →</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.input {
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 4px 6px;
    font-size: 0.875rem;
}

.table-auto th,
.table-auto td {
    padding: 8px 6px;
    text-align: left;
}
</style>
