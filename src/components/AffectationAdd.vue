<script>
import axios from 'axios';
export default {
    name: 'AffectationAdd', // Nom du composant
    data() {
        return {
            title: 'Bienvenue',
            message: 'Ceci est une page Vue.js',
            form: {
                code_frs: '',
                libelle: '',
                telephone: '',
                adresse: '',
                email: '',
            },
            structures: [],
            materiels: []

        };
    },
    mounted() {
        // Code exécuté après le montage du composant
        this.getStructures();
        this.getMateriels();
        console.log('Page montée');
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
                console.error('Erreur lors de la récupération des materiels :', error);
            }
        },

        async submitForm() {
            try {
                const response = await axios.post('http://localhost:3000/api/fournisseurs', this.form);
                console.log('Success:', response.data);
                alert('Data inserted successfully!');
                this.$emit('fournisseur-ajoute');

            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error inserting data.');
            }
        }
    }
};
</script>


<template>
    <dialog id="my_modal_4" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 class="text-lg font-bold">Nouvelle Affectation </h3>
            <div class="flex w-full flex-col lg:flex-row">
                <div class="w-full flex flex-col lg:flex-row gap-4"> <!-- flex en ligne dès lg (large) -->

                    <fieldset class="fieldset w-full lg:w-1/3">
                        <legend class="fieldset-legend">Structure</legend>
                        <select class="select" v-model="form.code_structure">
                            <option v-for="item in structures" :key="item.id">
                                {{ item.libelle }}
                            </option>
                        </select>
                        <p class="label"></p>
                    </fieldset>

                    <fieldset class="fieldset w-full lg:w-1/3">
                        <legend class="fieldset-legend">Date</legend>
                        <input type="date" class="input" placeholder="" v-model="form.date" />
                        <p class="label"></p>
                    </fieldset>

                    <fieldset class="fieldset w-full lg:w-1/3">
                        <legend class="fieldset-legend">Utilisateur</legend>
                        <input type="text" class="input" placeholder="" v-model="form.utilisateur" />
                        <p class="label"></p>
                    </fieldset>
                    <fieldset class="fieldset w-full lg:w-1/3">
                        <legend class="fieldset-legend">Nombre</legend>
                        <input type="number" class="input" placeholder="" v-model="form.nombre" />
                        <p class="label"></p>
                    </fieldset>

                </div>
            </div>

            <div class="flex w-full flex-col lg:flex-row">
                <div class="w-full flex flex-col lg:flex-row gap-4">
                    <fieldset class="fieldset w-full lg:w-1/3">
                        <legend class="fieldset-legend">Matériel</legend>
                        <select class="select" v-model="form.materiel">
                            <option v-for="item in materiels" :key="item.id" :value="item.id">
                                {{ item.matricule }} {{ item.libelle }}
                            </option>
                        </select>
                        <p class="label"></p>
                    </fieldset>

                    <fieldset class="fieldset w-full lg:w-1/3">
                        <legend class="fieldset-legend">Affectation Définitive</legend>
                        <select class="select" v-model="form.affectation_definitive">
                            <option value="Affectation Définitive">Affectation Définitive</option>
                            <option value="A la place de">A la place de :</option>
                        </select>
                        <p class="label"></p>
                    </fieldset>

                    <!-- Ce champ n'apparaît que si "non" est sélectionné -->
                    <fieldset class="fieldset w-full lg:w-1/3" v-if="form.affectation_definitive === 'A la place de'">
                        <legend class="fieldset-legend">Choix temporaire</legend>
                        <select class="select" v-model="form.affectation_temporaire">
                            <option v-for="item in materiels" :key="item.id" :value="item.id">
                                {{ item.matricule }} {{ item.libelle }}
                            </option>
                        </select>
                        <p class="label"></p>
                    </fieldset>

                </div>

            </div>
            <div class="flex mt-2">
                <div class="modal-action ml-auto">
                    <form method="dialog">
                        <button @click="submitForm" class="btn bg-amber-500">Envoyer</button>
                    </form>
                </div>

            </div>


        </div>
    </dialog>

</template>
