<script>
import axios from 'axios';
export default {
    name: 'FournisseurAdd', // Nom du composant
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
            }
        };
    },
    mounted() {
        console.log('Page montée');
    },
    methods: {
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
        <div class="modal-box w-11/12 max-w-4xl">
            <!-- Bouton de fermeture -->
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <!-- Titre -->
            <h3 class="text-xl font-bold mb-6">🧾 Nouveau Fournisseur</h3>

            <!-- Contenu principal -->
            <div class="flex flex-col lg:flex-row gap-6">
                <!-- Colonne 1 -->
                <div class="w-full lg:w-1/3 space-y-4">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Code Fournisseur</legend>
                        <input type="text" class="input input-bordered w-full" placeholder="Ex: FRS001"
                            v-model="form.code_frs" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Libellé</legend>
                        <input type="text" class="input input-bordered w-full" placeholder="Nom du fournisseur"
                            v-model="form.code_libelle" />
                    </fieldset>
                </div>

                <!-- Colonne 2 -->
                <div class="w-full lg:w-1/3 space-y-4">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Téléphone</legend>
                        <input type="text" class="input input-bordered w-full" placeholder="Ex: 0555 55 55 55"
                            v-model="form.telephone" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Adresse</legend>
                        <input type="text" class="input input-bordered w-full" placeholder="Adresse du fournisseur"
                            v-model="form.adresse" />
                    </fieldset>
                </div>

                <!-- Colonne 3 -->
                <div class="w-full lg:w-1/3 space-y-4">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Date création</legend>
                        <input type="text" class="input input-bordered w-full" placeholder="JJ/MM/AAAA"
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
