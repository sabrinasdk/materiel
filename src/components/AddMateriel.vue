<script>
import axios from 'axios';
export default {
    name: 'AddMateriel', // Nom du composant
    data() {
        return {
            title: 'Bienvenue',
            message: 'Ceci est une page Vue.js',
            form: {
                famille: '',
                date_acquisition: '',
                designation: '',
                fournisseur: '',
                date_livraison: '',
                garantie: '',
                date_fin_garantie: '',
                montant: '',
                numero_sequentiel: '',
                nombre: ''
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
                const response = await axios.post('http://localhost:3000/api/materiels', this.form);
                console.log('Success:', response.data);
                // alert('Data inserted successfully!');
                this.$emit('materiel-ajoute');

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
            <h3 class="text-lg font-bold">Nouvelle Acquisition </h3>

            <div class="flex w-full flex-col lg:flex-row">
                <div class="w-1/3 ">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Familles</legend>
                        <select class="select" v-model="form.famille">
                            <option value="L01" selected>Unité Centrales</option>
                            <option value="L02">Imprimantes</option>
                            <option value="L40">Ecrans</option>
                            <option value="L11">Onduleur</option>
                        </select>
                        <span class="label"></span>
                    </fieldset>
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Date aqcuisition</legend>
                        <input type="date" class="input" placeholder="Type here" v-model="form.date_acquisition" />
                        <p class="label"></p>
                    </fieldset>
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Désignation</legend>
                        <input type="text" class="input" placeholder="Désignation" v-model="form.designation" />
                        <p class="label"></p>
                    </fieldset>
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Fournisseurs</legend>
                        <select class="select" v-model="form.fournisseur">
                            <option disabled selected>F1</option>
                            <option>F2</option>
                            <option>F3</option>
                            <option>F4</option>
                        </select>
                        <span class="label"></span>
                    </fieldset>
                </div>

                <div class="w-1/3 ">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Date livraison</legend>
                        <input type="date" class="input" placeholder="Type here" v-model="form.date_livraison" />
                        <p class="label"></p>
                    </fieldset>
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Garantie (mois)</legend>
                        <input type="number" class="input" placeholder="" v-model="form.garantie" />
                        <p class="label"></p>
                    </fieldset>
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Date fin de garantie</legend>
                        <input type="date" class="input" placeholder="Type here" v-model="form.date_fin_garantie" />
                        <p class="label"></p>
                    </fieldset>
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Montant</legend>
                        <input type="text" class="input" placeholder="10000" v-model="form.montant" />
                        <p class="label"></p>
                    </fieldset>
                </div>
                <div>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Numéro séquentiel</legend>
                        <input type="text" class="input" placeholder="10000" v-model="form.numero_sequentiel" />
                        <p class="label"></p>
                    </fieldset>
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Nombre </legend>
                        <input type="number" class="input" placeholder="" v-model="form.nombre" />
                        <p class="label"></p>
                    </fieldset>
                </div>

            </div>
            <div class="flex justify-end">
                <div class="modal-action">
                    <form method="dialog">

                        <button class="btn">Fermer</button>
                        <button @click="submitForm" class="btn bg-amber-500">Envoyer</button>
                    </form>
                </div>

            </div>

            <p class="py-4">Click the button below to close</p>
            <!--
            <div class="modal-action">
                <form method="dialog">
                   
                    <button class="btn">Close</button>
                </form>
            </div>-->
        </div>
    </dialog>

</template>
