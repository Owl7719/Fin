import { createApp } from "vue";
import Axios from "./plugins/axios";
import App from "@/App.vue";
import { helpers } from "@/mixins/helpers";
import VDelete from "@/components/VDelete.vue";
import VConfirm from "@/components/VConfirm.vue";
import DOMPurify from "dompurify";
import { store } from "@/store/store.js";
import { router } from "@/router/router.js";
import vuetify from "@/plugins/vuetify.js";

const app = createApp(App);

app.config.devtools = !import.meta.env.PROD;
app.config.globalProperties = { ...app.config.globalProperties, ...helpers };

app.component("VDelete", VDelete);
app.component("VConfirm", VConfirm);
app.use(Axios);

app.directive("sanitize", {
  mounted: function (el, binding) {
    el.innerHTML = DOMPurify.sanitize(binding.value, { ADD_ATTR: ["target"] });
  },
  updated: function (el, binding) {
    el.innerHTML = DOMPurify.sanitize(binding.value);
  },
});

app.use(store);
app.use(router);
app.use(vuetify);

app.mount("#app");
