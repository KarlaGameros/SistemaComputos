import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useRerservasStore = defineStore("useRerservasStore", {
  state: () => ({
    modal: false,
    loading: false,
    list_reservas_mr: [],
    list_reservas_rp: [],
    encabezado: {
      seccion: null,
      casilla: null,
      eleccion: null,
    },
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    //--------------------------------------------------------------
    async load_reservas_mr(tipo_eleccion_id) {
      try {
        this.list_reservas_mr = [];
        this.loading = true;
        const resp = await api.get(
          `/ResultadoComputos/Reservas/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.list_reservas_mr = data.map((element) => {
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
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
    async reservarMr(id) {
      try {
        const resp = await api.get(`/ResultadoComputos/Reservar/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            return { success: true, data: data };
          }
        }
      } catch (error) {
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
    async quitarReservaMr(id) {
      try {
        const resp = await api.get(`/ResultadoComputos/QuitarReserva/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            return { success: true, data: data };
          }
        }
      } catch (error) {
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    //--------------------------------------------------------------
    async load_reservas_rp(tipo_eleccion_id) {
      try {
        this.list_reservas_rp = [];
        this.loading = true;
        const resp = await api.get(
          `/ResultadoComputos/ReservasRP/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.list_reservas_rp = data.map((element) => {
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
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
    async reservarRp(id) {
      try {
        const resp = await api.get(`/ResultadoComputos/ReservarRp/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            return { success: true, data: data };
          }
        }
      } catch (error) {
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
    async quitarReservaRp(id) {
      try {
        const resp = await api.get(`/ResultadoComputos/QuitarReservaRp/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            return { success: true, data: data };
          }
        }
      } catch (error) {
        return { success: false };
      } finally {
        this.loading = false;
      }
    },
  },
});
