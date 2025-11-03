<script>
import axios from 'axios';
export default {
    name: 'AddMateriel', // Nom du composant
    data() {
        return {
            title: 'Bienvenue',
            message: 'Ceci est une page Vue.js',
            form: {
                code_fam: '',
                libelle: '',

            }
        };
    },
    mounted() {
        // Code exécuté après le montage du composant
        console.log('Page montée');
    },
    methods: {

        async submitForm() {
            try {
                const response = await axios.post('http://localhost:3000/api/familles', this.form);
                console.log('Success:', response.data);
                alert('Data inserted successfully!');
                this.$emit('famille-ajoute');

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
        <div class="modal-box w-11/12 max-w-4xl">
            <!-- Bouton de fermeture -->
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <!-- Titre -->
            <h3 class="text-xl font-bold mb-6">📦 Nouvelle Famille</h3>

            <!-- Contenu principal -->
            <div class="flex flex-col lg:flex-row gap-6">
                <!-- Colonne 1 -->
                <div class="w-full lg:w-1/2 space-y-4">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Code Famille</legend>
                        <input type="text" class="input input-bordered w-full" placeholder="Ex: FAM001"
                            v-model="form.code_fam" />
                    </fieldset>
                </div>

                <!-- Colonne 2 -->
                <div class="w-full lg:w-1/2 space-y-4">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Libellé Famille</legend>
                        <input type="text" class="input input-bordered w-full" placeholder="Désignation de la famille"
                            v-model="form.libelle" />
                    </fieldset>

                    <div class="flex justify-end mt-4">
                        <form method="dialog">
                            <button @click="submitForm" class="btn bg-amber-500 text-white hover:bg-amber-600 w-full">
                                ✅ Envoyer
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </dialog>
</template>
