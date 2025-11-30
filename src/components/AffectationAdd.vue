<script>
import axios from 'axios';
export default {
    name: 'AffectationAdd',
    data() {
        return {
            form: {
                structure: '',       // ✅ correspond au backend
                date: '',
                utilisateur: '',
                nombre: 0
            },
            structures: [],
            materiels: [],
            showSuccess: false

        };
    },
    mounted() {
        this.getStructures();
        this.getMateriels();
    },
    methods: {
        async getStructures() {
            try {
                const response = await axios.get('http://localhost:3000/structures');
                this.structures = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des structures :', error);
            }
        },
        async getMateriels() {
            try {
                const response = await axios.get('http://localhost:3000/materiel');
                this.materiels = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des matériels :', error);
            }
        },
        async submitForm() {
            try {
                const response = await axios.post(
                    'http://localhost:3000/affectation_materiel',
                    this.form
                );

                // notification
                this.showSuccess = true;
                setTimeout(() => {
                    this.showSuccess = false;
                }, 2500);

                // réinitialisation du formulaire
                this.resetForm();

                this.$emit('affectation-ajoute');

            } catch (error) {
                console.error('Erreur lors de l’envoi du formulaire :', error);
                alert('Erreur lors de l’enregistrement.');
            }
        },
        resetForm() { this.form = { structure: '', date: '', utilisateur: '', nombre: 0 }; }

    }
};
</script>

<template>
    <dialog id="my_modal_4" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <h3 class="text-lg font-bold mb-3 text-blue-700 text-center">
                🔗 Nouvelle Affectation
            </h3>

            <!-- Ligne principale -->
            <div class="flex flex-col lg:flex-row gap-4 mb-4">
                <fieldset class="fieldset w-full lg:w-1/3">
                    <legend class="fieldset-legend">Structure</legend>
                    <select class="select" v-model="form.structure">
                        <option value="">-- Choisir une structure --</option>
                        <option v-for="item in structures" :key="item.id" :value="item.code_str">
                            {{ item.libelle }}
                        </option>
                    </select>
                </fieldset>

                <fieldset class="fieldset w-full lg:w-1/3">
                    <legend class="fieldset-legend">Date</legend>
                    <input type="date" class="input" v-model="form.date" />
                </fieldset>

                <fieldset class="fieldset w-full lg:w-1/3">
                    <legend class="fieldset-legend">Utilisateur</legend>
                    <input type="text" class="input" v-model="form.utilisateur" placeholder="Nom de l'utilisateur" />
                </fieldset>

                <fieldset class="fieldset w-full lg:w-1/3">
                    <legend class="fieldset-legend">Nombre de matériels</legend>
                    <input type="number" class="input" v-model="form.nombre" min="1" />
                </fieldset>
            </div>

            <!-- Matériels dynamiques -->
            <div v-for="n in form.nombre" :key="n" class="border border-gray-300 p-3 rounded-lg mb-3">
                <div class="flex flex-col lg:flex-row gap-4">
                    <fieldset class="fieldset w-full lg:w-1/3">
                        <legend class="fieldset-legend">Matériel {{ n }}</legend>
                        <select class="select" v-model="form[`materiel_${n}`]">
                            <option value="">-- Choisir --</option>
                            <option v-for="item in materiels" :key="item.id" :value="item.matricule">
                                {{ item.matricule }} - {{ item.libelle }}
                            </option>
                        </select>
                    </fieldset>

                    <fieldset class="fieldset w-full lg:w-1/3">
                        <legend class="fieldset-legend">Type d’affectation</legend>
                        <select class="select" v-model="form[`affectation_definitive_${n}`]">
                            <option value="Affectation Définitive">Affectation Définitive</option>
                            <option value="A la place de">A la place de</option>
                        </select>
                    </fieldset>

                    <fieldset v-if="form[`affectation_definitive_${n}`] === 'A la place de'"
                        class="fieldset w-full lg:w-1/3">
                        <legend class="fieldset-legend">Remplaçant</legend>
                        <select class="select" v-model="form[`affectation_temporaire_${n}`]">
                            <option value="">-- Choisir --</option>
                            <option v-for="item in materiels" :key="item.id" :value="item.matricule">
                                {{ item.matricule }} - {{ item.libelle }}
                            </option>
                        </select>
                    </fieldset>
                </div>
            </div>

            <div class="modal-action">
                <button type="button" @click="submitForm" class="btn bg-amber-500 text-white">
                    ✅ Envoyer
                </button>
            </div>
            <!-- Toast notification -->


        </div>
        <div v-if="showSuccess" class="toast toast-end">
            <div class="alert alert-success">
                <span>✔️ Affectation enregistrée avec succès !</span>
            </div>
        </div>
    </dialog>
</template>
