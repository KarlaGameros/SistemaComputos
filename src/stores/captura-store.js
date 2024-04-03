import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCapturaStore = defineStore("useCapturaStore", {
  state: () => ({
    modal: false,
    loading_table: false,
    pendientes_cotejo: [],
    pendientes_recuento: [],
    pendientes_cotejo_rp: [],
    pendientes_recuento_rp: [],
  }),
  actions: {
    async load_cotejo(tipo_eleccion_id) {
      try {
        this.pendientes_cotejo = [];
        this.loading_table = true;
        const resp = await api.get(
          `/ResultadoComputos/Cotejo/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.pendientes_cotejo = data.map((element) => {
              return {
                id: element.id,
                municipio: element.municipio,
                distrito: element.distrito,
                demarcacion: element.demarcacion,
                seccion: element.seccion,
                casilla: element.casilla,
                casilla_Id: element.casilla_Id,
                total_Causales: element.total_Causales,
              };
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading_table = false;
      }
    },

    async load_recuento(tipo_eleccion_id) {
      try {
        this.pendientes_recuento = [];
        this.loading_table = true;
        const resp = await api.get(
          `/ResultadoComputos/Recuento/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.pendientes_recuento = data.map((element) => {
              return {
                id: element.id,
                municipio: element.municipio,
                distrito: element.distrito,
                demarcacion: element.demarcacion,
                seccion: element.seccion,
                casilla: element.casilla,
                casilla_Id: element.casilla_Id,
                total_Causales: element.total_Causales,
              };
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading_table = false;
      }
    },

    async load_cotejo_rp(tipo_eleccion_id) {
      try {
        this.pendientes_cotejo_rp = [];
        this.loading_table = true;
        const resp = await api.get(
          `/ResultadoComputos/CotejoRP/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.pendientes_cotejo_rp = data.map((element) => {
              return {
                id: element.id,
                municipio: element.municipio,
                distrito: element.distrito,
                demarcacion: element.demarcacion,
                seccion: element.seccion,
                casilla: element.casilla,
                casilla_Id: element.casilla_Id,
                total_Causales: element.total_Causales,
              };
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading_table = false;
      }
    },

    async load_recuento_rp(tipo_eleccion_id) {
      try {
        this.pendientes_recuento_rp = [];
        this.loading_table = true;
        const resp = await api.get(
          `/ResultadoComputos/RecuentoRP/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.pendientes_recuento_rp = data.map((element) => {
              return {
                id: element.id,
                municipio: element.municipio,
                distrito: element.distrito,
                demarcacion: element.demarcacion,
                seccion: element.seccion,
                casilla: element.casilla,
                casilla_Id: element.casilla_Id,
                total_Causales: element.total_Causales,
              };
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading_table = false;
      }
    },

    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
