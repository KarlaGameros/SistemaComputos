import { defineStore } from "pinia";

export const useConsultaStore = defineStore("useConsultaStore", {
  state: () => ({
    modal: false,
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
