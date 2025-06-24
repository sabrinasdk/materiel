import { createRouter, createWebHistory } from "vue-router";
import PageMateriels from "@components/HelloWorld.vue";
import PageFamilles from "@components/Familles.vue";
import PageStructures from "@components/Structures.vue";
import PageFournisseurs from "@components/Fournisseurs.vue";
import PageAffectations from "@components/Affectation.vue";
import PageFacturationMateriels from "@components/FacturationMateriel.vue";
import PageTransfertMateriels from "@components/Transfert.vue";

const routes = [
  { path: "/", name: "PageMateriels", component: PageMateriels },
  { path: "/familles", name: "PageFamilles", component: PageFamilles },
  { path: "/structures", name: "PageStructures", component: PageStructures },
  {
    path: "/fournisseurs",
    name: "PageFournisseurs",
    component: PageFournisseurs,
  },
  {
    path: "/affectations",
    name: "PageAffectations",
    component: PageAffectations,
  },
  {
    path: "/facturation",
    name: "PageFacturationMateriels",
    component: PageFacturationMateriels,
  },
  {
    path: "/transfert",
    name: "PageTransfertMateriels",
    component: PageTransfertMateriels,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
