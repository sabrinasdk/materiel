<template>
    <div
        class="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 flex flex-col items-center text-gray-800 py-16 px-4">

        <!-- Titre principal -->
        <h1
            class="text-4xl md:text-5xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 drop-shadow-sm">
            💻 Plateforme de Facturation des Matériels
        </h1>

        <!-- Sous-titre -->
        <p class="text-lg text-gray-600 text-center mb-12 max-w-2xl">
            Gérez vos matériels, affectations et facturations avec une interface claire et intuitive.
        </p>

        <!-- Grille des sections principales -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
            <router-link v-for="item in sections" :key="item.name" :to="item.link"
                class="group bg-white/80 border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-center text-center backdrop-blur-sm">
                <!-- Icône -->
                <div class="text-6xl mb-4">{{ item.icon }}</div>
                <h2 class="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-blue-700 transition-colors">
                    {{ item.name }}
                </h2>
                <p class="text-gray-500 text-sm mb-6">{{ item.desc }}</p>
                <button
                    class="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all">
                    Accéder
                </button>
            </router-link>
        </div>

        <!-- Footer -->
        <footer class="mt-20 text-sm text-gray-500 border-t border-gray-200 pt-6">
            © 2025 - Application Facturation Matériels | Créée avec 💙 par <span
                class="font-semibold text-blue-600">Sabrina</span>
        </footer>
    </div>
</template>

<script>
export default {
    name: "HomePage",
    data() {
        return {
            sections: [
                {
                    name: "Matériel",
                    icon: "🖥️",
                    desc: "Gérez les acquisitions, listes et recherches de matériels.",
                    link: "/materiels",
                },
                {
                    name: "Mise à disposition",
                    icon: "📦",
                    desc: "Créez des affectations, transferts ou réintégrations.",
                    link: "/affectations",
                },
                {
                    name: "Facturation",
                    icon: "💰",
                    desc: "Consultez ou éditez vos factures par structure ou globalement.",
                    link: "/facturation",
                },
                {
                    name: "Tables",
                    icon: "📋",
                    desc: "Accédez aux familles, structures et fournisseurs.",
                    link: "/tables",
                },
                {
                    name: "Recherche",
                    icon: "🔍",
                    desc: "Recherchez par structure ou utilisateur rapidement.",
                    link: "/recherche",
                },
                {
                    name: "Utilisateurs",
                    icon: "👤",
                    desc: "Gérez les utilisateurs et leurs accès.",
                    link: "/utilisateurs",
                },
            ],
        };
    },
};
</script>

<style scoped>
/* Animation d’apparition douce */
@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(15px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.grid>a {
    animation: fadeIn 0.8s ease forwards;
}

/* Effet survol titre */
.group:hover h2 {
    background: linear-gradient(to right, #3b82f6, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Animation du bouton */
button:hover {
    transform: scale(1.05);
}
</style>
