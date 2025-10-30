<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-sky-500 text-white flex flex-col items-center py-16">
    <!-- Titre principal -->
    <h1 class="text-4xl md:text-5xl font-extrabold mb-10 text-center drop-shadow-lg">
      💻 Bienvenue sur la plateforme de Facturation Matériels
    </h1>

    <!-- Sous-titre -->
    <p class="text-lg md:text-xl mb-12 text-center text-blue-100 max-w-2xl">
      Gérez vos matériels, affectations, facturations et tables en toute simplicité depuis un seul espace.
    </p>

    <!-- Grille des sections principales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-6">
      <router-link v-for="item in sections" :key="item.name" :to="item.link"
        class="group bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-2xl p-8 shadow-lg hover:shadow-2xl flex flex-col items-center text-center backdrop-blur-md border border-white/20">
        <div class="text-5xl mb-4">{{ item.icon }}</div>
        <h2 class="text-2xl font-semibold mb-2">{{ item.name }}</h2>
        <p class="text-blue-100 text-sm">{{ item.desc }}</p>
        <button
          class="mt-6 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-white">
          Accéder
        </button>
      </router-link>
    </div>

    <!-- Bas de page -->
    <footer class="mt-16 text-sm text-blue-200">
      © 2025 - Application Facturation Matériels | Designed with 💙 by Sabrina
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
          link: "/materiels"
        },
        {
          name: "Mise à disposition",
          icon: "📦",
          desc: "Créez des affectations, transferts ou réintégrations.",
          link: "/affectations"
        },
        {
          name: "Facturation",
          icon: "💰",
          desc: "Consultez ou éditez vos factures par structure ou globalement.",
          link: "/facturation"
        },
        {
          name: "Tables",
          icon: "📋",
          desc: "Accédez aux familles, structures et fournisseurs.",
          link: "/tables"
        },
        {
          name: "Recherche",
          icon: "🔍",
          desc: "Recherchez par structure ou utilisateur rapidement.",
          link: "/recherche"
        },
        {
          name: "Utilisateurs",
          icon: "👤",
          desc: "Gérez les utilisateurs et leurs accès.",
          link: "/utilisateurs"
        }
      ]
    };
  }
};
</script>

<style scoped>
/* Animation d’apparition douce */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid>a {
  animation: fadeInUp 0.5s ease forwards;
}

/* Effet au survol sur les cartes */
.group:hover h2 {
  color: #fff;
}
</style>
