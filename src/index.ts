import App from "./componets/App.vue";
import * as Vue from "vue";
import * as tools from "./tools";
tools.declareGlobalVaribles({
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
});
let app = Vue.createApp(App);
app.mount("#app");