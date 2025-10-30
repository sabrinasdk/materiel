import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

const app = createApp(App);

// ✅ Configuration Axios globale pour envoyer le token JWT automatiquement
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// ✅ Optionnel : définir l’URL de base de ton backend
axios.defaults.baseURL = "http://localhost:3000";

// ✅ Rendre axios disponible dans tous les composants via this.$axios
app.config.globalProperties.$axios = axios;

// ✅ Utilisation du router et montage de l’app
app.use(router);
app.mount("#app");
