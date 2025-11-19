import { createRouter, createWebHistory } from "vue-router";
import PageMateriels from "@components/materiels.vue";
import PageFamilles from "@components/Familles.vue";
import PageStructures from "@components/Structures.vue";
import PageFournisseurs from "@components/Fournisseurs.vue";
import PageAffectations from "@components/Affectation.vue";
import PageFacturationMateriels from "@components/FacturationMateriel.vue";
import PageTransfertMateriels from "@components/Transfert.vue";
import PageReintegrationMateriels from "@components/Reintegration.vue";
import LoginForm from "@components/Login.vue";
import PageFacturationGlobaleMateriels from "@components/FacturationGlobale.vue";
import PageUtilisateurs from "@components/Utilisateurs.vue";
import HomePage from "@components/Home.vue"; // ← ajoute ton composant d’accueil
import PagePreformeMateriels from "@components/Preforme.vue";

const routes = [
  { path: "/login", name: "LoginForm", component: LoginForm },
  // ✅ Nouvelle page d’accueil
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/materiels",
    name: "PageMateriels",
    component: PageMateriels,
    meta: { requiresAuth: true },
  },
  {
    path: "/familles",
    name: "PageFamilles",
    component: PageFamilles,
    meta: { requiresAuth: true },
  },
  {
    path: "/structures",
    name: "PageStructures",
    component: PageStructures,
    meta: { requiresAuth: true },
  },
  {
    path: "/fournisseurs",
    name: "PageFournisseurs",
    component: PageFournisseurs,
    meta: { requiresAuth: true },
  },
  {
    path: "/utilisateurs",
    name: "PageUtilisateurs",
    component: PageUtilisateurs,
    meta: { requiresAuth: true },
  },
  {
    path: "/affectations",
    name: "PageAffectations",
    component: PageAffectations,
    meta: { requiresAuth: true },
  },
  {
    path: "/facturation",
    name: "PageFacturationMateriels",
    component: PageFacturationMateriels,
    meta: { requiresAuth: true },
  },
  {
    path: "/transfert",
    name: "PageTransfertMateriels",
    component: PageTransfertMateriels,
    meta: { requiresAuth: true },
  },
  {
    path: "/reintegration",
    name: "PageReintegrationMateriels",
    component: PageReintegrationMateriels,
    meta: { requiresAuth: true },
  },
  {
    path: "/preforme",
    name: "PagePreformeMateriels",
    component: PagePreformeMateriels,
    meta: { requiresAuth: true },
  },
  {
    path: "/facturationglobale",
    name: "PageFacturationGlobaleMateriels",
    component: PageFacturationGlobaleMateriels,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Vérification du token avant chaque changement de page
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login"); // 🔒 redirige vers login si pas connecté
  } else {
    next();
  }
});

export default router;
