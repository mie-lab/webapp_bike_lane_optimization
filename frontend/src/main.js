import { createApp } from "vue";
import { createPinia} from "pinia";
import "./style.css";
import App from "./App.vue";
import "@fortawesome/fontawesome-free/css/all.min.css";

createApp(App).use(createPinia()).mount("#app");
