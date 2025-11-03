<script>
import AddMateriel from './AddMateriel.vue'
import axios from 'axios'

export default {
    name: 'PageMateriels',
    components: {
        AddMateriel,
    },
    data() {
        return {
            title: 'Page Matériels',
            materiels: [],
            currentPage: 1,
            itemsPerPage: 150,
            filters: {
                matricule: '',
                code_fam: '',
                libelle: '',
                code_frs: '',
                date_acquisition: '',
                montant: '',
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
        fetchMateriels() {
            axios.get('http://localhost:3000/materiel')
                .then(response => (this.materiels = response.data))
                .catch(error => console.error('Erreur lors de la récupération des matériels :', error));
        },

        // ✅ méthode pour normaliser les chaînes (suppression des accents, mise en minuscule, etc.)
        normalize(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .trim();
        }
    },

    computed: {
        filteredMateriels() {
            return this.materiels.filter(item => {
                // Matricule
                if (this.filters.matricule) {
                    if (!this.normalize(item.matricule).includes(this.normalize(this.filters.matricule))) return false;
                }

                // Code famille
                if (this.filters.code_fam) {
                    if (!this.normalize(item.code_fam).includes(this.normalize(this.filters.code_fam))) return false;
                }

                // Libellé
                if (this.filters.libelle) {
                    if (!this.normalize(item.libelle).includes(this.normalize(this.filters.libelle))) return false;
                }

                // Fournisseur
                if (this.filters.code_frs) {
                    const val = this.normalize(item.code_frs ?? item.frs ?? item.fournisseur);
                    if (!val.includes(this.normalize(this.filters.code_frs))) return false;
                }

                // Date d’acquisition
                if (this.filters.date_acquisition) {
                    const itemDate = item.date_acquisition ? item.date_acquisition.toString().slice(0, 10) : '';
                    if (itemDate !== this.filters.date_acquisition) return false;
                }

                // Montant
                if (this.filters.montant) {
                    const f = String(this.filters.montant).trim();
                    if (f.includes('-')) {
                        const [minS, maxS] = f.split('-').map(s => s.trim());
                        const min = parseFloat(minS) || -Infinity;
                        const max = parseFloat(maxS) || Infinity;
                        const m = parseFloat(String(item.montant).replace(',', '.')) || 0;
                        if (m < min || m > max) return false;
                    } else {
                        if (!String(item.montant).toLowerCase().includes(f.toLowerCase())) return false;
                    }
                }

                return true;
            });
        },

        paginatedMateriels() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredMateriels.slice(start, start + this.itemsPerPage);
        },

        totalPages() {
            return Math.ceil(this.filteredMateriels.length / this.itemsPerPage) || 1;
        }
    },

    watch: {
        itemsPerPage() {
            this.currentPage = 1;
        },
    },

    mounted() {
        this.fetchMateriels();
    },
};
</script>

<template>
    <div class="mx-auto px-6 py-6 max-w-7xl">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-blue-800">🧰 Gestion des Matériels</h2>
            <button class="btn bg-white text-blue-900 border border-blue-400 rounded-none shadow-sm"
                onclick="my_modal_4.showModal()">
                ➕ Nouveau Matériel
            </button>
        </div>

        <!-- Filtres -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-gray-50 p-4 rounded-lg shadow-sm">
            <div>
                <label class="label-text font-medium">Matricule</label>
                <input v-model="filters.matricule" placeholder="Filtrer par matricule"
                    class="input input-bordered w-full" />
            </div>

            <div>
                <label class="label-text font-medium">Famille</label>
                <input v-model="filters.code_fam" placeholder="Filtrer par famille"
                    class="input input-bordered w-full" />
            </div>

            <div>
                <label class="label-text font-medium">Désignation</label>
                <input v-model="filters.libelle" placeholder="Filtrer par libellé"
                    class="input input-bordered w-full" />
            </div>

            <div>
                <label class="label-text font-medium">Fournisseur</label>
                <input v-model="filters.code_frs" placeholder="Filtrer par fournisseur"
                    class="input input-bordered w-full" />
            </div>

            <div>
                <label class="label-text font-medium">Date Acquisition</label>
                <input v-model="filters.date_acquisition" type="date" class="input input-bordered w-full" />
            </div>

            <div>
                <label class="label-text font-medium">Montant (DZD)</label>
                <input v-model="filters.montant" placeholder="Filtrer par montant"
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

        <AddMateriel @materiel-ajoute="fetchMateriels" />

        <!-- Tableau -->
        <div class="overflow-x-auto mt-6 bg-white rounded-lg shadow-md">
            <table class="table table-sm table-zebra w-full">
                <thead class="bg-blue-100 text-blue-800">
                    <tr class="font-semibold">
                        <th>#</th>
                        <th>Matricule</th>
                        <th>Famille</th>
                        <th>Désignation</th>
                        <th>Fournisseur</th>
                        <th>Date Acquisition</th>
                        <th>Montant (DZD)</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item, index) in paginatedMateriels" :key="item.matricule">
                        <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
                        <td>{{ item.matricule }}</td>
                        <td>{{ item.code_fam }}</td>
                        <td>{{ item.libelle }}</td>
                        <td>{{ item.code_frs }}</td>
                        <td>{{ item.date_acquisition }}</td>
                        <td>{{ item.montant }}</td>
                    </tr>

                    <tr v-if="paginatedMateriels.length === 0">
                        <td colspan="7" class="text-center text-gray-500 py-4">
                            Aucun matériel trouvé pour ces critères.
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
