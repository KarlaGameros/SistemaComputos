import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useSolicitudesStore = defineStore("useSolicitudesStore", {
  state: () => ({
    list_Solicitudes_Mr: [],
    list_Solicitudes_Rp: [],
  }),
  actions: {
    //--------------------------------------------------------------
    async load_solicitudes_mr(tipo_eleccion_id) {
      try {
        this.list_Solicitudes_Mr = [];
        this.loading = true;
        const resp = await api.get(
          `/SolicitudesRecapturaComputos/MR/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;

          if (success) {
            this.list_Solicitudes_Mr = data.map((element) => {
              return {
                aprobado: element.aprobado,
                casilla: element.casilla,
                casilla_Id: element.casilla_Id,
                demarcacion: element.demarcacion,
                distrito: element.distrito,
                estatus: element.estatus,
                fecha_Accion: element.fecha_Accion,
                fecha_Solicitud: element.fecha_Solicitud,
                id: element.id,
                motivo: element.motivo,
                municipio: element.municipio,
                resultado_Id: element.resultado_Id,
                resultado_RP_Id: element.resultado_RP_Id,
                usuario_Aprueba: element.usuario_Aprueba,
                usuario_Aprueba_Id: element.usuario_Aprueba_Id,
                usuario_Solicita: element.usuario_Solicita,
                usuario_Solicita_Id: element.usuario_Solicita_Id,
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

    //--------------------------------------------------------------

    async load_solicitudes_rp(tipo_eleccion_id) {
      try {
        this.list_Solicitudes_Rp = [];
        this.loading = true;
        const resp = await api.get(
          `/SolicitudesRecapturaComputos/RP/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.list_Solicitudes_Rp = data.map((element) => {
              return {
                aprobado: element.aprobado,
                casilla: element.casilla,
                casilla_Id: element.casilla_Id,
                demarcacion: element.demarcacion,
                distrito: element.distrito,
                estatus: element.estatus,
                fecha_Accion: element.fecha_Accion,
                fecha_Solicitud: element.fecha_Solicitud,
                id: element.id,
                motivo: element.motivo,
                municipio: element.municipio,
                resultado_RP_Id: element.resultado_RP_Id,
                usuario_Aprueba: element.usuario_Aprueba,
                usuario_Aprueba_Id: element.usuario_Aprueba_Id,
                usuario_Solicita: element.usuario_Solicita,
                usuario_Solicita_Id: element.usuario_Solicita_Id,
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

    //--------------------------------------------------------------

    async solicitarCorreccion(id, tipo, motivo) {
      try {
        let resp = null;
        if (tipo == "MR") {
          resp = await api.post(
            `/SolicitudesRecapturaComputos/MR/${id}`,
            motivo
          );
        } else {
          resp = await api.post(
            `/SolicitudesRecapturaComputos/RP/${id}`,
            motivo
          );
        }
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //--------------------------------------------------------------

    async aprobarSolicitud(id) {
      try {
        const resp = await api.get(
          `/SolicitudesRecapturaComputos/Aprobar/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //--------------------------------------------------------------

    async rechazarSolicitud(id) {
      try {
        const resp = await api.get(
          `/SolicitudesRecapturaComputos/Rechazar/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
