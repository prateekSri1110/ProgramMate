import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; //for redirection and communication
import "./allCss.css";

// bootstrap class import for styling
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const app = createApp(App);
app.use(router).mount("#app");
