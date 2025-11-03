<script>
import axios from 'axios';

export default {
    name: 'PageReintegrationMateriels',
    data() {
        return {
            title: 'Page Réintégration Matériel',
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
            if (page >= 1 && page <= this.totalPages) this.currentPage = page;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        getStructures() {
            axios.get('http://localhost:3000/structures')
                .then(response => (this.structures = response.data))
                .catch(error => console.error('Erreur lors de la récupération des structures :', error));
        },
        getMateriels() {
            this.dateComplete = this.getDernierJourDuMois(this.mois);
            axios.post('http://localhost:3000/materiel_affectation', {
                date: this.dateComplete,
                structure: this.structure
            })
                .then(response => (this.affectations = response.data))
                .catch(error => console.error('Erreur lors de la récupération des affectations :', error));
        },
        getDernierJourDuMois(mois) {
            const [annee, moisStr] = mois.split("-");
            const dernierJour = new Date(parseInt(annee, 10), parseInt(moisStr, 10), 0);
            return `${dernierJour.getFullYear()}-${String(dernierJour.getMonth() + 1).padStart(2, "0")}-${String(dernierJour.getDate()).padStart(2, "0")}`;
        },
        postReintegration() {
            if (!this.structure || this.selectedMateriels.length === 0) {
                alert("Veuillez sélectionner une structure et au moins un matériel.");
                return;
            }

            axios.post('http://localhost:3000/reintegration', {
                date: this.date,
                structure: this.structure,
                structureto: this.structureto,
                codes_mat: this.selectedMateriels
            })
                .then(() => {
                    alert('Réintégration effectuée avec succès');
                    this.selectedMateriels = [];
                    this.getMateriels();
                })
                .catch(error => {
                    console.error('Erreur lors de la réintégration :', error);
                    alert('Erreur lors de la réintégration');
                });
        }
    },
    computed: {
        filteredAffectations() {
            return this.affectations.filter(item =>
                Object.keys(this.filters).every(key => {
                    const filterValue = this.filters[key]?.toString().toLowerCase();
                    const itemValue = item[key]?.toString().toLowerCase();
                    return filterValue === '' || itemValue.includes(filterValue);
                })
            );
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
        mois() {
            if (this.mois && this.structure) this.getMateriels();
        },
        structure() {
            if (this.structure && this.mois) this.getMateriels();
        }
    },
    mounted() {
        this.getStructures();
        this.getMateriels();
    }
};
</script>

<template>
    <div class="mx-auto px-6 py-6 max-w-7xl">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-blue-800">♻️ Réintégration de Matériels</h2>
            <button class="btn bg-white text-blue-900 border border-blue-400 rounded-none shadow-sm">
                Réintégration
            </button>
        </div>

        <!-- Filtres principaux -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 p-4 rounded-lg shadow-sm">
            <div>
                <label class="label-text font-medium">Date</label>
                <input type="date" class="input input-bordered w-full" v-model="mois" />
            </div>

            <div>
                <label class="label-text font-medium">Structure</label>
                <select class="select select-bordered w-full" v-model="structure">
                    <option disabled value="">Sélectionnez</option>
                    <option v-for="item in structures" :key="item.id" :value="item.code_str">
                        {{ item.code_str }}
                    </option>
                </select>
            </div>

            <div>
                <label class="label-text font-medium">Structure de destination</label>
                <select class="select select-bordered w-full" v-model="structureto">
                    <option disabled value="">Sélectionnez</option>
                    <option v-for="item in structures" :key="item.id" :value="item.code_str">
                        {{ item.code_str }}
                    </option>
                </select>
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

        <!-- Tableau -->
        <div class="overflow-x-auto mt-6 bg-white rounded-lg shadow-md">
            <table class="table table-sm table-zebra w-full">
                <thead class="bg-blue-100 text-blue-800">
                    <tr>
                        <th>#</th>
                        <th></th>
                        <th><input v-model="filters.code_mat" placeholder="Code mat" class="input input-xs w-full" />
                        </th>
                        <th><input v-model="filters.libelle" placeholder="Désignation" class="input input-xs w-full" />
                        </th>
                        <th></th>
                    </tr>
                    <tr class="font-semibold">
                        <th>#</th>
                        <th>À réintégrer</th>
                        <th>Code matériel</th>
                        <th>Désignation</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedAffectations" :key="item.code_mat">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <input type="checkbox" class="checkbox checkbox-sm" :value="item.code_mat"
                                v-model="selectedMateriels" />
                        </td>
                        <td>{{ item.code_mat }}</td>
                        <td>{{ item.libelle }}</td>
                        <td></td>
                    </tr>
                    <tr v-if="paginatedAffectations.length === 0">
                        <td colspan="5" class="text-center text-gray-500 py-4">
                            Aucun matériel trouvé pour ces critères.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Actions -->
        <div class="flex justify-end mt-5">
            <button class="btn bg-amber-500 hover:bg-amber-600 text-white px-6" @click="postReintegration">
                💾 Enregistrer la réintégration
            </button>
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
