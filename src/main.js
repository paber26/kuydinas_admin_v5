import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js";
import CKEditor from "@ckeditor/ckeditor5-vue";

createApp(App).use(router).use(CKEditor).mount("#app");
