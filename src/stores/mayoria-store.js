import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useMayoriaStore = defineStore("useMayoriaStore", {
  state: () => ({
    ganadorPDF: null,
    datos_grafica: {
      primero: null,
      segundo: null,
      diferecia: null,
      porcentaje: null,
      ganador_Id: null,
      datos_Grafica: [],
    },
  }),
  actions: {
    initGrafica() {
      this.datos_grafica.primero = null;
      this.datos_grafica.segundo = null;
      this.datos_grafica.diferecia = null;
      this.datos_grafica.ganador_Id = null;
      this.datos_grafica.porcentaje = null;
      this.datos_grafica.datos_Grafica = [];
    },

    //-----------------------------------------------------------
    async generarConstancia(ganador_id) {
      try {
        this.ganadorPDF = "";
        const resp = await api.get(`/PDF/GeneraConstancia/${ganador_id}`, {
          responseType: "blob",
        });
        if (resp.status == 200) {
          let blob = new window.Blob([resp.data], {
            type: "application/pdf",
          });
          this.ganadorPDF = window.URL.createObjectURL(blob);
          return { success: true };
        } else {
          return {
            success: false,
            data: "Error al descargar archivo, intentelo de nuevo",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrio un error, intentelo de nuevo. Si el error persiste contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async cosultaResultadosMr(eleccion_id, distrito_id) {
      try {
        let resp = null;
        resp = await api.get(
          `/ResultadoComputos/ConsultaMayoriaDipMr?TipoEleccion=${eleccion_id}&Distrito=${distrito_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.datos_grafica.primero = data.primero;
            this.datos_grafica.segundo = data.segundo;
            this.datos_grafica.diferecia = data.diferecia;
            this.datos_grafica.porcentaje =
              data.porcentaje == "NaN" ? 0 : data.porcentaje;
            this.datos_grafica.datos_Grafica = data.datos_Grafica;
            this.datos_grafica.ganador_Id = data.ganador_Id;
          }
        }
      } catch (error) {
        this.datos_grafica.primero = 0;
        this.datos_grafica.segundo = 0;
        this.datos_grafica.diferecia = 0;
        this.datos_grafica.porcentaje = 0;
        this.datos_grafica.ganador_Id = null;
        this.datos_grafica.datos_Grafica = [];
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async cosultaResultadosRP(eleccion_id) {
      try {
        let resp = null;
        resp = await api.get(
          `/ResultadoComputos/ConsultaMayoriaDipRP?TipoEleccion=${eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.datos_grafica.primero = data.primero;
            this.datos_grafica.segundo = data.segundo;
            this.datos_grafica.diferecia = data.diferecia;
            this.datos_grafica.porcentaje =
              data.porcentaje == "NaN" ? 0 : data.porcentaje;
            this.datos_grafica.datos_Grafica = data.datos_Grafica;
            this.datos_grafica.ganador_Id = data.ganador_Id;
          }
        }
      } catch (error) {
        this.datos_grafica.primero = 0;
        this.datos_grafica.segundo = 0;
        this.datos_grafica.diferecia = 0;
        this.datos_grafica.porcentaje = 0;
        this.datos_grafica.datos_Grafica = [];
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async cosultaResultadosPYS(eleccion_id, municipio_id) {
      try {
        let resp = null;
        resp = await api.get(
          `/ResultadoComputos/ConsultaMayoriaPyS?TipoEleccion=${eleccion_id}&Municipio=${municipio_id}`
        );

        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.datos_grafica.primero = data.primero;
            this.datos_grafica.segundo = data.segundo;
            this.datos_grafica.diferecia = data.diferecia;
            this.datos_grafica.porcentaje =
              data.porcentaje == "NaN" ? 0 : data.porcentaje;
            this.datos_grafica.datos_Grafica = data.datos_Grafica;
            this.datos_grafica.ganador_Id = data.ganador_Id;
          }
        }
      } catch (error) {
        this.datos_grafica.primero = 0;
        this.datos_grafica.segundo = 0;
        this.datos_grafica.diferecia = 0;
        this.datos_grafica.porcentaje = 0;
        this.datos_grafica.datos_Grafica = [];
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async cosultaResultadosREGMr(eleccion_id, municipio_id, demarcacion_id) {
      try {
        let resp = null;
        resp = await api.get(
          `/ResultadoComputos/ConsultaMayoriaDemMr?TipoEleccion=${eleccion_id}&Municipio=${municipio_id}&Demarcacion=${demarcacion_id}`
        );

        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.datos_grafica.primero = data.primero;
            this.datos_grafica.segundo = data.segundo;
            this.datos_grafica.diferecia = data.diferecia;
            this.datos_grafica.porcentaje =
              data.porcentaje == "NaN" ? 0 : data.porcentaje;
            this.datos_grafica.datos_Grafica = data.datos_Grafica;
            this.datos_grafica.ganador_Id = data.ganador_Id;
          }
        }
      } catch (error) {
        this.datos_grafica.primero = 0;
        this.datos_grafica.segundo = 0;
        this.datos_grafica.diferecia = 0;
        this.datos_grafica.porcentaje = 0;
        this.datos_grafica.datos_Grafica = [];
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async cosultaResultadosREGRP(eleccion_id, municipio_id) {
      try {
        let resp = null;
        resp = await api.get(
          `/ResultadoComputos/ConsultaMayoriaDemRp?TipoEleccion=${eleccion_id}&Municipio=${municipio_id}`
        );

        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.datos_grafica.primero = data.primero;
            this.datos_grafica.segundo = data.segundo;
            this.datos_grafica.diferecia = data.diferecia;
            this.datos_grafica.porcentaje =
              data.porcentaje == "NaN" ? 0 : data.porcentaje;
            this.datos_grafica.datos_Grafica = data.datos_Grafica;
            this.datos_grafica.ganador_Id = data.ganador_Id;
          }
        }
      } catch (error) {
        this.datos_grafica.primero = 0;
        this.datos_grafica.segundo = 0;
        this.datos_grafica.diferecia = 0;
        this.datos_grafica.porcentaje = 0;
        this.datos_grafica.datos_Grafica = [];
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
