<script>
import axios from 'axios';
export default {
    name: 'StructureAdd', // Nom du composant
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
        <div class="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 class="text-lg font-bold">Nouvelle Structure </h3>

            <div class="flex w-full flex-col lg:flex-row">
                <div class="w-1/3 ">

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Code Structure</legend>
                        <input type="text" class="input" placeholder="Type here" v-model="form.code_fam" />
                        <p class="label"></p>
                    </fieldset>

                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Type</legend>
                        <input type="text" class="input" placeholder="Type here" v-model="form.code_fam" />
                        <p class="label"></p>
                    </fieldset>


                </div>
                <div class="w-1/3 ">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Libellé</legend>
                        <input type="text" class="input" placeholder="Désignation" v-model="form.libelle" />
                        <p class="label"></p>
                    </fieldset>
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Projet</legend>
                        <input type="text" class="input" placeholder="Désignation" v-model="form.libelle" />
                        <p class="label"></p>
                    </fieldset>

                </div>
                <div class="w-1/3 ">
                    <fieldset class="fieldset">
                        <legend class="fieldset-legend">Date création</legend>
                        <input type="text" class="input" placeholder="Désignation" v-model="form.libelle" />
                        <p class="label"></p>
                    </fieldset>
                    <div class="flex mt-2">
                        <div class="modal-action">
                            <form method="dialog">
                                <button @click="submitForm" class="btn bg-amber-500">Envoyer</button>
                            </form>
                        </div>

                    </div>
                </div>



                <!--
            <div class="modal-action">
                <form method="dialog">
                   
                    <button class="btn">Close</button>
                </form>
            </div>-->
            </div>
        </div>
    </dialog>

</template>
