import VueSweetalert2 from "vue-sweetalert2";
import { boot } from "quasar/wrappers";

export default boot(({ app }) => {
  app.use(VueSweetalert2);
});
