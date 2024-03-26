import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCapturaStore = defineStore("useCapturaStore", {
  state: () => ({
    modal: false,
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
