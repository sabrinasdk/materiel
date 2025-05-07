/*import { createRouter, createWebHistory } from "vue-router";
import PageMateriels from "@components/HelloWorld.vue";
import PageFamilles from "@components/Familles.vue";

const routes = [
  { path: "/", component: PageMateriels },
  { path: "/", component: PageMateriels },
  { path: "/familles", component: PageFamilles },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;*/
import { createRouter, createWebHistory } from "vue-router";
import PageMateriels from "@components/HelloWorld.vue";
import PageFamilles from "@components/Familles.vue";

const routes = [
  { path: "/", name: "PageMateriels", component: PageMateriels },
  { path: "/about", name: "PageFamilles", component: PageFamilles },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
