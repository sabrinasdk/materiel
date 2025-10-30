<template>
    <nav
        class="navbar bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 shadow-lg backdrop-blur-md bg-opacity-90 text-white px-6 sticky top-0 z-50">
        <div class="navbar-start">
            <a href="/"
                class="text-2xl font-semibold tracking-wide flex items-center gap-2 hover:text-yellow-200 transition-colors">
                💻 Facturation Matériels
            </a>
        </div>

        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1 font-medium text-white">
                <li><a href="/" class="hover:bg-white/20 transition-all px-4 py-2">🏠 Accueil</a></li>

                <li>
                    <details>
                        <summary class="hover:bg-white/20 px-4 py-2 cursor-pointer select-none">🖥️ Matériel</summary>
                        <ul class="absolute bg-white text-gray-800 w-48 border border-gray-200 shadow-md mt-1">
                            <li><a href="/materiels"
                                    class="block px-4 py-2 hover:bg-blue-100 border-b border-gray-100">Acquisition</a>
                            </li>
                            <li><a href="/materiels"
                                    class="block px-4 py-2 hover:bg-blue-100 border-b border-gray-100">Liste
                                    Matériel</a></li>
                            <li><a href="/materiels" class="block px-4 py-2 hover:bg-blue-100">Recherche Matériel</a>
                            </li>
                        </ul>
                    </details>
                </li>

                <li>
                    <details>
                        <summary class="hover:bg-white/20 px-4 py-2 cursor-pointer select-none">📦 Mise à disposition
                        </summary>
                        <ul class="absolute bg-white text-gray-800 w-56 border border-gray-200 shadow-md mt-1">
                            <li><a href="/affectations"
                                    class="block px-4 py-2 hover:bg-blue-100 border-b border-gray-100">Nouvelle
                                    affectation</a></li>
                            <li><a href="/transfert"
                                    class="block px-4 py-2 hover:bg-blue-100 border-b border-gray-100">Transfert</a>
                            </li>
                            <li><a href="/reintegration" class="block px-4 py-2 hover:bg-blue-100">Réintégration</a>
                            </li>
                        </ul>
                    </details>
                </li>

                <li>
                    <details>
                        <summary class="hover:bg-white/20 px-4 py-2 cursor-pointer select-none">💰 Facturation</summary>
                        <ul class="absolute bg-white text-gray-800 w-48 border border-gray-200 shadow-md mt-1">
                            <li><a href="/facturation"
                                    class="block px-4 py-2 hover:bg-blue-100 border-b border-gray-100">Par Structure</a>
                            </li>
                            <li><a href="/facturationglobale" class="block px-4 py-2 hover:bg-blue-100">Globale</a></li>
                        </ul>
                    </details>
                </li>

                <li>
                    <details>
                        <summary class="hover:bg-white/20 px-4 py-2 cursor-pointer select-none">📋 Tables</summary>
                        <ul class="absolute bg-white text-gray-800 w-48 border border-gray-200 shadow-md mt-1">
                            <li><a href="/familles"
                                    class="block px-4 py-2 hover:bg-blue-100 border-b border-gray-100">Familles</a></li>
                            <li><a href="/structures"
                                    class="block px-4 py-2 hover:bg-blue-100 border-b border-gray-100">Structures</a>
                            </li>
                            <li><a href="/fournisseurs"
                                    class="block px-4 py-2 hover:bg-blue-100 border-b border-gray-100">Fournisseurs</a>
                            </li>
                            <li><a href="#" class="block px-4 py-2 hover:bg-blue-100">Utilisateurs</a></li>
                        </ul>
                    </details>
                </li>

                <li>
                    <details>
                        <summary class="hover:bg-white/20 px-4 py-2 cursor-pointer select-none">🔍 Recherche</summary>
                        <ul class="absolute bg-white text-gray-800 w-48 border border-gray-200 shadow-md mt-1">
                            <li><a href="#"
                                    class="block px-4 py-2 hover:bg-blue-100 border-b border-gray-100">Structure</a>
                            </li>
                            <li><a href="#" class="block px-4 py-2 hover:bg-blue-100">Utilisateur</a></li>
                        </ul>
                    </details>
                </li>
            </ul>
        </div>

        <div class="navbar-end">

            <button @click="logout" class="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-indigo-600 hover:to-blue-500 text-white
            font-medium px-4 py-2 rounded-md shadow-md transition-all duration-300 hover:shadow-lg">
                🚪 Déconnexion
            </button>

        </div>
    </nav>
</template>
<script>
export default {
    name: "Navbar",

    methods: {
        logout() {
            localStorage.removeItem("token");
            this.$router.push("/login");
        }
    }
};
</script>


<style scoped>
/* Supprime les coins arrondis des sous-menus */
ul li ul {
    border-radius: 0 !important;
}

/* Supprime le style DaisyUI arrondi sur les détails */
details ul {
    border-radius: 0 !important;
}

/* Aligne correctement les sous-menus */
details>ul {
    left: 0;
    top: 100%;
}

/* Animation douce d’ouverture */
details[open]>summary::after {
    transform: rotate(180deg);
    transition: transform 0.2s ease;
}

summary::after {
    content: " ▼";
    font-size: 0.7rem;
    transition: transform 0.2s ease;
}
</style>
