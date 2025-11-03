<script>
import axios from 'axios';

export default {
    name: 'UtilisateurAdd',
    data() {
        return {
            title: 'Ajouter un utilisateur',
            form: {
                nom: '',
                prenom: '',
                fonction: '',
                structure: '',
                directeur: 'Non',
            },
            structures: []
        };
    },
    mounted() {
        this.getStructures();
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

        async submitForm() {
            try {
                const response = await axios.post('http://localhost:3000/api/utilisateurs', this.form);
                console.log('Success:', response.data);
                alert('Utilisateur ajouté avec succès !');
                this.$emit('utilisateur-ajoute');
            } catch (error) {
                console.error('Erreur lors de l’envoi du formulaire :', error);
                alert('Une erreur est survenue.');
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
            <h3 class="text-xl font-bold mb-4">🧑‍💼 Ajouter un nouvel utilisateur</h3>

            <!-- Contenu -->
            <div class="flex flex-col lg:flex-row gap-4">
                <!-- Colonne 1 -->
                <div class="w-full lg:w-1/3 space-y-3">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Nom</legend>
                        <input type="text" class="input input-bordered w-full" placeholder="Entrez le nom"
                            v-model="form.nom" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Prénom</legend>
                        <input type="text" class="input input-bordered w-full" placeholder="Entrez le prénom"
                            v-model="form.prenom" />
                    </fieldset>
                </div>

                <!-- Colonne 2 -->
                <div class="w-full lg:w-1/3 space-y-3">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Fonction</legend>
                        <input type="text" class="input input-bordered w-full" placeholder="Exemple : Technicien"
                            v-model="form.fonction" />
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Structure</legend>
                        <select class="select select-bordered w-full" v-model="form.structure">
                            <option disabled value="">Sélectionnez une structure</option>
                            <option v-for="item in structures" :key="item._id" :value="item.libelle">
                                {{ item.libelle }}
                            </option>
                        </select>
                    </fieldset>
                </div>

                <!-- Colonne 3 -->
                <div class="w-full lg:w-1/3 space-y-3">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Directeur</legend>
                        <select class="select select-bordered w-full" v-model="form.directeur">
                            <option>Non</option>
                            <option>Oui</option>
                        </select>
                    </fieldset>

                    <div class="flex justify-end mt-4">
                        <button @click.prevent="submitForm" class="btn bg-amber-500 text-white hover:bg-amber-600">
                            ✅ Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </dialog>
</template>
