<template>
    <!--<div class="navbar  bg-amber-400 shadow-sm z-10" tabindex="0">
        <div class="navbar-start bg-indigo-800 text-cyan-50 w-120">-->
    <div class="navbar bg-gradient-to-r from-cyan-200 to-blue-300 shadow-md z-10" tabindex="0">
        <div class="navbar-start bg-white text-blue-900 w-120">
            <a class="btn btn-ghost text-xl ">Facturation Materiels Informatiques </a>
        </div>
        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
                <li class="min-w-[60px]"><a href="/">Accueil</a></li>
                <li>

                    <details>
                        <summary class="min-w-[110px]">Materiel</summary>
                        <ul class="p-2 z-10 rounded-none">
                            <li><a href="/">Aqcuisition</a></li>
                            <li><a href="/">Liste Materiel</a></li>
                            <li><a href="/">Recherche Materiel</a></li>
                        </ul>
                    </details>
                </li>
                <li>
                    <details>
                        <summary>Mise à disposition</summary>
                        <ul class="p-2 z-10 rounded-none">
                            <li><a>Nouvelle affectation</a></li>
                            <li><a>Transfert</a></li>
                            <li><a>Reintegration</a></li>
                        </ul>
                    </details>
                </li>
                <li>
                    <details>
                        <summary>Facturation</summary>
                        <ul class="p-2 z-10 rounded-none">
                            <li><a>Par Structure</a></li>
                            <li><a>Globale</a></li>

                        </ul>
                    </details>
                </li>
                <li>
                    <details>
                        <summary>Table</summary>
                        <ul class="p-2 z-10 rounded-none">
                            <li><a href="familles">Familles</a> </li>
                            <li><a href="structures">Structure</a></li>
                            <li><a href="fournisseurs">Fournisseurs</a></li>
                            <li><a>Utilisateur</a></li>

                        </ul>
                    </details>
                </li>
                <li>
                    <details>
                        <summary>Recherche</summary>
                        <ul class="p-2 z-10 rounded-none">
                            <li><a>Structure</a></li>
                            <li><a>Utilisateur</a></li>

                        </ul>
                    </details>
                </li>
            </ul>
        </div>
        <div class="navbar-end">
            <a class="btn">Conn / Dec</a>
        </div>
    </div>
</template>

<script>
export default {
    name: "Navbar"
};
</script>