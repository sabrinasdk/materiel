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
            // état des filtres
            filters: {
                code_mat: '',
                libelle: '',
                code_str: '',
                matricule_utl: '',
                type_affectation: '',
                date_affectation: '',
                montant: ''
            },
            // <-- état réactif des accordéons (clé = nom structure)
            expanded: {}
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
            axios.get('http://localhost:3000/affectations_derniere')
                .then(res => {
                    // Tri décroissant par date_affectation
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
        },
        fixEncoding(str) {
            try { return decodeURIComponent(escape(str)); } catch { return str; }
        },

        // -------- Accordéon helpers ----------
        toggleGroup(structure) {
            // si la clé n'existe pas encore dans expanded, l'initialiser de façon réactive
            if (!(structure in this.expanded)) {
                // Vue 2 : utiliser this.$set si disponible
                if (typeof this.$set === 'function') {
                    this.$set(this.expanded, structure, true);
                } else {
                    // Vue 3 : l'objet expanded déclaré dans data est déjà réactif,
                    // donc l'affectation directe fonctionne.
                    this.expanded[structure] = true;
                }
                return;
            }

            // sinon inverser l'état
            this.expanded[structure] = !this.expanded[structure];
        },

        isExpanded(structure) {
            return !!this.expanded[structure];
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

        groupedAffectations() {
            const filtered = this.filteredAffectations;
            const groupsMap = {};

            filtered.forEach(item => {
                const str = item.code_str || 'Non définie';
                if (!groupsMap[str]) groupsMap[str] = { structure: str, items: [] };
                groupsMap[str].items.push(item);
            });

            // 👉 Tri à l'intérieur de chaque structure par famille matériel
            Object.values(groupsMap).forEach(group => {
                group.items.sort((a, b) => {
                    const famA = a.code_mat?.split('/')[0] || '';
                    const famB = b.code_mat?.split('/')[0] || '';

                    // 1) tri par famille (L01 < L02 < L40)
                    if (famA < famB) return -1;
                    if (famA > famB) return 1;

                    // 2) si même famille, tri par code complet
                    return (a.code_mat || '').localeCompare(b.code_mat || '');
                });
            });

            return Object.values(groupsMap);
        },


        totalPages() { return Math.ceil(this.filteredAffectations.length / this.itemsPerPage) || 1; }
    },

    watch: {
        itemsPerPage() { this.currentPage = 1; },
        // si tu veux auto-initialiser l'état expanded quand filtered change, tu peux le faire ici :
        // filteredAffectations() { /* optional: reset expanded or keep as is */ }
    },

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



        <div v-if="isLoading" class="flex flex-col justify-center items-center min-h-[200px] gap-4">
            <!-- Loader cercle moderne -->
            <div class="relative w-10 h-10">
                <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin">
                </div>
            </div>

            <!-- Texte animé -->
            <div class="text-primary text-lg font-medium flex">
                Chargement<span class="dots"></span>
            </div>
        </div>


        <!-- Accordéons par structure -->
        <div v-else>
            <div class="mb-4 border rounded-lg shadow-sm p-4">

                <!-- Top bar -->
                <div class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                    <div class="flex items-center space-x-2">
                        <label class="text-gray-600 text-sm font-medium">Lignes :</label>
                        <select v-model.number="itemsPerPage" class="border rounded px-2 py-1">
                            <option v-for="n in [20, 50, 100, 150, 200]" :key="n" :value="n">{{ n }}</option>
                        </select>
                    </div>
                    <p class="text-sm text-gray-500">{{ filteredAffectations.length }} résultat(s)</p>
                </div>

                <!-- Filtres -->
                <div class="grid grid-cols-2 md:grid-cols-7 gap-2 mb-4">
                    <input v-model="filters.code_mat" placeholder="Code Mat" class="input input-xs" />
                    <input v-model="filters.libelle" placeholder="Libellé" class="input input-xs" />
                    <input v-model="filters.code_str" placeholder="Structure" class="input input-xs" />
                    <input v-model="filters.date_affectation" type="date" class="input input-xs" />
                    <input v-model="filters.matricule_utl" placeholder="Utilisateur" class="input input-xs" />
                    <input v-model="filters.type_affectation" placeholder="Type" class="input input-xs" />
                    <input v-model="filters.montant" placeholder="Montant / Interval" class="input input-xs" />
                </div>

                <!-- Accordéons -->
                <div v-for="group in groupedAffectations" :key="group.structure"
                    class="mb-4 border rounded-lg shadow-sm">
                    <!-- bouton dans le template -->
                    <button type="button" @click="toggleGroup(group.structure)" class="w-full text-left bg-blue-100 px-4 py-2 font-semibold flex justify-between items-center
                        rounded-t-lg">
                        {{ group.structure }} ({{ group.items.length }})
                        <span>{{ isExpanded(group.structure) ? '▲' : '▼' }}</span>
                    </button>


                    <div v-show="isExpanded(group.structure)" class="bg-white overflow-x-auto">
                        <table class="table-auto w-full text-sm">
                            <thead class="bg-blue-50 text-blue-800">
                                <tr>
                                    <th>#</th>
                                    <th>Matricule</th>
                                    <th>Libellé</th>
                                    <th>Date</th>
                                    <th>Utilisateur</th>
                                    <th>Type</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="(item, index) in group.items" :key="index" class="hover:bg-blue-50">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.code_mat }}</td>

                                    <td>{{ fixEncoding(item.libelle) }}</td>
                                    <!-- Utiliser date_affectation (cohérent avec le tri) -->
                                    <td>{{ item.date ? new
                                        Date(item.date).toLocaleDateString('fr-FR') : '' }}</td>
                                    <td>{{ item.utilisateur_nom }}</td>
                                    <td>{{ item.type_affectation }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="filteredAffectations.length === 0" class="text-center py-4 text-gray-500 italic">
                    Aucune affectation trouvée.
                </div>

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

.dots::after {
    content: '';
    animation: dots 1.4s steps(4, end) infinite;
}

@keyframes dots {
    0% {
        content: '';
    }

    25% {
        content: '.';
    }

    50% {
        content: '..';
    }

    75% {
        content: '...';
    }

    100% {
        content: '';
    }
}
</style>
