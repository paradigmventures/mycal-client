import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";

import "./assets/main.css";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount("#app");
app.use(VueAxios, axios);
