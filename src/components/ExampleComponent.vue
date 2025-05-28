<template>
    <div class="container mx-auto p-4">
        <!-- Carte Daisy UI -->
        <div class="card w-96 bg-base-100 shadow-xl">

            <div class="card-body">
                <h2 class="card-title">Titre de la carte</h2>
                <p>Ceci est un exemple d'interface utilisant Vue.js et Daisy UI.</p>
                <div class="card-actions justify-end">
                    <button @click="generatePDF" class="btn btn-primary">Générer le PDF</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { jsPDF } from "jspdf";

export default {
    name: "ExampleComponent",
    methods: {
        generatePDF() {
            const doc = new jsPDF();

            // Ajouter le contenu HTML au PDF
            doc.html(document.body, {
                callback: function (doc) {
                    doc.save("exemple-interface.pdf");
                },
                margin: [10, 10, 10, 10],
                x: 10,
                y: 10,
            });
        },
    },
};
</script>

<style scoped>
/* Vous pouvez ajouter des styles supplémentaires ici si nécessaire */
</style>
