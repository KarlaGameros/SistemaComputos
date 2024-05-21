import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useObservacionStore = defineStore("useObservacionStore", {
  state: () => ({
    actualizar: false,
    isVisualizar: false,
    modal: false,
    list_Observaciones: [],
    list_Observaciones_Partido: [],
    list_Correcciones: [],
    list_Solicitudes_ByPartido: [],
    observacion: {
      id: null,
      empleado_Id: null,
      candidato_Id: null,
      puesto: null,
      identidad: null,
      propuesta_1: null,
      propuesta_2: null,
      genero: null,
      trayectoria: null,
      historia_Profesional: null,
      motivo_Cargo_Publico: null,
      formacion: null,
      fecha_Registro: null,
      faltantes: false,
      validadas: false,
      aplicadas: false,
      publicadas: false,
      informacion_Pausada: null,
    },
    aprobar: {
      aprobar_Rechazar: null,
      identidad: false,
      propuesta_1: false,
      propuesta_2: false,
      genero: false,
      trayectoria: false,
      motivo_Cargo_Publico: false,
      historia_Profesional: false,
      formacion: false,
    },
    solicitudCorreccion: {
      candidato_Id: null,
      puesto: null,
      partido_Id: null,
      identidad: false,
      propuesta_1: false,
      propuesta_2: false,
      genero: false,
      trayectoria: false,
      motivo_Cargo_Publico: false,
      historia_Profesional: false,
      formacion: false,
    },
    correcion: {
      id: null,
      estatus: null,
      candidato_Id: null,
      usuario_Id_Solicitante: null,
      usuario_Solicitante: null,
      correo_Usuario: null,
      candidato_Id: null,
      candidato: null,
      puesto: null,
      partido_Id: null,
      partido: null,
      fecha_Solicitud: null,
      identidad: null,
      propuesta_1: null,
      propuesta_2: null,
      genero: null,
      trayectoria: null,
      motivo_Cargo_Publico: null,
      historia_Profesional: null,
      formacion: null,
      empleado_Id_Aprobacion_Rechazo: null,
      empleado_Aprobacion_Rechazo: null,
      fecha_Aprobacion_Rechazo: null,
    },
    correcion: {
      id: null,
      estatus: null,
      candidato_Id: null,
      usuario_Id_Solicitante: null,
      usuario_Solicitante: null,
      correo_Usuario: null,
      candidato_Id: null,
      candidato: null,
      puesto: null,
      partido_Id: null,
      partido: null,
      fecha_Solicitud: null,
      identidad: null,
      propuesta_1: null,
      propuesta_2: null,
      genero: null,
      trayectoria: null,
      motivo_Cargo_Publico: null,
      historia_Profesional: null,
      formacion: null,
      empleado_Id_Aprobacion_Rechazo: null,
      empleado_Aprobacion_Rechazo: null,
      fecha_Aprobacion_Rechazo: null,
    },
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarVisualizar(valor) {
      this.isVisualizar = valor;
    },

    actualizarTabla(valor) {
      this.actualizar = valor;
    },

    initObservacion() {
      this.observacion.id = null;
      this.observacion.empleado_Id = null;
      this.observacion.candidato_Id = null;
      this.observacion.puesto = null;
      this.observacion.identidad = null;
      this.observacion.propuesta_1 = null;
      this.observacion.propuesta_2 = null;
      this.observacion.genero = null;
      this.observacion.trayectoria = null;
      this.observacion.historia_Profesional = null;
      this.observacion.motivo_Cargo_Publico = null;
      this.observacion.formacion = null;
      this.observacion.fecha_Registro = null;
      this.observacion.faltantes = null;
      this.observacion.validadas = null;
      this.observacion.aplicadas = null;
    },

    initAprobar() {
      this.aprobar.aprobar_Rechazar = null;
      this.aprobar.identidad = false;
      this.aprobar.propuesta_1 = false;
      this.aprobar.propuesta_2 = false;
      this.aprobar.genero = false;
      this.aprobar.trayectoria = false;
      this.aprobar.motivo_Cargo_Publico = false;
      this.aprobar.historia_Profesional = false;
      this.aprobar.formacion = false;
    },

    initCorreccion() {
      this.correcion.id = null;
      this.correcion.estatus = null;
      this.correcion.candidato_Id = null;
      this.correcion.usuario_Id_Solicitante = null;
      this.correcion.usuario_Solicitante = null;
      this.correcion.correo_Usuario = null;
      this.correcion.puesto = null;
      this.correcion.partido_Id = null;
      this.correcion.partido = null;
      this.correcion.fecha_Solicitud = null;
      this.correcion.identidad = null;
      this.correcion.propuesta_1 = null;
      this.correcion.propuesta_2 = null;
      this.correcion.genero = null;
      this.correcion.trayectoria = null;
      this.correcion.motivo_Cargo_Publico = null;
      this.correcion.historia_Profesional = null;
      this.correcion.formacion = null;
      this.correcion.empleado_Id_Aprobacion_Rechazo = null;
      this.correcion.empleado_Aprobacion_Rechazo = null;
      this.correcion.fecha_Aprobacion_Rechazo = null;
    },
    //----------------------------------------------------------------------
    //TIPO DE ELECCIONES
    async loadObservaciones() {
      try {
        let resp = await api.get("/ObservacionesCandidatos/General");
        let { data } = resp.data;
        this.list_Observaciones = data.map((item) => {
          return {
            tipo_Eleccion: item.tipo_Eleccion,
            fecha_Observaciones_Aplicadas: item.fecha_Observaciones_Aplicadas,
            tipo_Candidato: item.tipo_Candidato,
            id: item.id,
            estatus_Observaciones:
              item.estatus_Observaciones == null
                ? "Pendientes"
                : item.estatus_Observaciones,
            empleado_Id: item.empleado_Id,
            empleado: item.empleado,
            candidato_Id: item.candidato_Id,
            candidato: item.candidato,
            puesto: item.puesto,
            puesto_Candidato:
              item.puesto == 0
                ? "Propietaria"
                : item.puesto == 1
                ? "Suplente"
                : item.puesto == 2
                ? "Propietaria sindica"
                : "Suplente sindica",
            identidad: item.identidad,
            propuesta_1: item.propuesta_1,
            propuesta_2: item.propuesta_2,
            genero: item.genero,
            trayectoria: item.trayectoria,
            historia_Profesional: item.historia_Profesional,
            formacion: item.formacion,
            fecha_Registro: item.fecha_Registro,
            faltantes: item.faltantes,
            motivo_Cargo_Publico: item.motivo_Cargo_Publico,
            informacion_Pausada: item.informacion_Pausada,
            empleado_Valida_Id: item.empleado_Valida_Id,
            empleado_Valida: item.empleado_Valida,
            fecha_Observaciones_Validadas: item.fecha_Observaciones_Validadas,
            usuario_Modifica_Id: item.usuario_Modifica_Id,
            usuario_Modifica: item.usuario_Modifica,
            fecha_Observaciones_Aplicadas: item.fecha_Observaciones_Aplicadas,
            empleado_Aprueba_Id: item.empleado_Aprueba_Id,
            empleado_Aprueba: item.empleado_Aprueba,
            fecha_Correcciones_Publicadas: item.fecha_Correcciones_Publicadas,
            validadas: item.validadas,
            aplicadas: item.aplicadas,
            publicadas: item.publicadas,
            logo_Partido: item.logo_Partido,
            partido_Id: item.partido_Id,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //OBSERVACIONES PARTIDO
    async loadObservacionesPartido() {
      try {
        let resp = await api.get("/ObservacionesCandidatos/ByPartido");
        let { data } = resp.data;
        this.list_Observaciones_Partido = data.map((item) => {
          return {
            id: item.id,
            estatus: item.estatus_Observaciones,
            candidato_Id: item.candidato_Id,
            candidato: item.candidato,
            puesto: item.puesto,
            fecha_Registro: item.fecha_Registro,
            fecha_Observaciones_Aplicadas: item.fecha_Observaciones_Aplicadas,
            usuario_Modifica_Id: item.usuario_Modifica_Id,
            usuario_Modifica: item.usuario_Modifica,
            fecha_Correcciones_Publicadas: item.fecha_Correcciones_Publicadas,
            aplicadas: item.aplicadas,
            publicadas: item.publicadas,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
    //----------------------------------------------------------------------
    //TIPO DE ELECCIONES
    async loadSolicitudesCorrecciones() {
      try {
        let resp = await api.get("/Solicitudes_Correccion_Candidatos");
        let { data } = resp.data;
        this.list_Correcciones = data.map((item) => {
          return {
            tipo_Eleccion: item.tipo_Eleccion,
            tipo_Candidato: item.tipo_Candidato,
            id: item.id,
            estatus: item.estatus,
            empleado_Id: item.empleado_Id,
            empleado: item.empleado,
            candidato_Id: item.candidato_Id,
            candidato: item.candidato,
            puesto: item.puesto,
            puesto_Candidato:
              item.puesto == 0
                ? "Propietaria"
                : item.puesto == 1
                ? "Suplente"
                : item.puesto == 2
                ? "Propietaria sindica"
                : "Suplente sindica",
            identidad: item.identidad,
            propuesta_1: item.propuesta_1,
            propuesta_2: item.propuesta_2,
            genero: item.genero,
            trayectoria: item.trayectoria,
            historia_Profesional: item.historia_Profesional,
            formacion: item.formacion,
            fecha_Registro: item.fecha_Registro,
            faltantes: item.faltantes,
            motivo_Cargo_Publico: item.motivo_Cargo_Publico,
            informacion_Pausada: item.informacion_Pausada,
            empleado_Valida_Id: item.empleado_Valida_Id,
            empleado_Valida: item.empleado_Valida,
            fecha_Observaciones_Validadas: item.fecha_Observaciones_Validadas,
            usuario_Modifica_Id: item.usuario_Modifica_Id,
            usuario_Modifica: item.usuario_Modifica,
            fecha_Observaciones_Aplicadas: item.fecha_Observaciones_Aplicadas,
            empleado_Aprueba_Id: item.empleado_Aprueba_Id,
            empleado_Aprueba: item.empleado_Aprueba,
            fecha_Registro: item.fecha_Solicitud,
            validadas: item.validadas,
            aplicadas: item.aplicadas,
            publicadas: item.publicadas,
            empleado: item.usuario_Solicitante,
            correo_Usuario: item.correo_Usuario,
            logo_Partido: item.logo_Partido,
            partido_Id: item.partido_Id,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    //LOAD OBSERVACIÓN
    async loadObservacionId(id) {
      try {
        let resp = null;
        resp = await api.get(`/ObservacionesCandidatos/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.observacion.id = data.id;
            this.observacion.empleado_Id = data.empleado_Id;
            this.observacion.candidato_Id = data.candidato_Id;
            this.observacion.puesto = data.puesto;
            this.observacion.identidad = data.identidad;
            this.observacion.propuesta_1 = data.propuesta_1;
            this.observacion.propuesta_2 = data.propuesta_2;
            this.observacion.genero = data.genero;
            this.observacion.trayectoria = data.trayectoria;
            this.observacion.historia_Profesional = data.historia_Profesional;
            this.observacion.motivo_Cargo_Publico = data.motivo_Cargo_Publico;
            this.observacion.formacion = data.formacion;
            this.observacion.fecha_Registro = data.fecha_Registro;
            this.observacion.faltantes = data.faltantes;
            this.observacion.validadas = data.validadas;
            this.observacion.aplicadas = data.aplicadas;
            this.observacion.publicadas = data.publicadas;
            this.observacion.informacion_Pausada = data.informacion_Pausada;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //APROBAR
    async aprobarObservacion(id, aprobar) {
      try {
        const resp = await api.post(
          `/ObservacionesCandidatos/Validar_Observaciones/Aprobar_Rechazar/${id}`,
          aprobar
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

    //----------------------------------------------------------------------
    //APROBAR
    async enviarCorreciones(id, correcion) {
      try {
        const resp = await api.post(
          `/ObservacionesCandidatos/Enviar_Correcciones/${id}`,
          correcion
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

    //----------------------------------------------------------------------
    //APROBAR
    async aprobarPublicacion(id, aprobar) {
      try {
        const resp = await api.post(
          `/ObservacionesCandidatos/Aprobar_Publicacion_Correcciones/${id}`,
          aprobar
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

    //----------------------------------------------------------------------
    //CREAR CORRECCIÓN
    async crearCorreccion(correcion) {
      try {
        const resp = await api.post(
          "/Solicitudes_Correccion_Candidatos",
          correcion
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

    //-----------------------------------------------------------
    //LOAD CORRECCION
    async loadCorreccionId(id) {
      try {
        let resp = null;
        resp = await api.get(`/Solicitudes_Correccion_Candidatos/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.correcion.id = data.id;
            this.correcion.estatus = data.estatus;
            this.correcion.usuario_Id_Solicitante = data.usuario_Id_Solicitante;
            this.correcion.usuario_Solicitante = data.usuario_Solicitante;
            this.correcion.correo_Usuario = data.correo_Usuario;
            this.correcion.candidato_Id = data.candidato_Id;
            this.correcion.candidato = data.candidato;
            this.correcion.puesto = data.puesto;
            this.correcion.partido_Id = data.partido_Id;
            this.correcion.partido = data.partido;
            this.correcion.fecha_Solicitud = data.fecha_Solicitud;
            this.correcion.identidad = data.identidad;
            this.correcion.propuesta_1 = data.propuesta_1;
            this.correcion.propuesta_2 = data.propuesta_2;
            this.correcion.genero = data.genero;
            this.correcion.trayectoria = data.trayectoria;
            this.correcion.motivo_Cargo_Publico = data.motivo_Cargo_Publico;
            this.correcion.historia_Profesional = data.historia_Profesional;
            this.correcion.formacion = data.formacion;
            this.correcion.empleado_Id_Aprobacion_Rechazo =
              data.empleado_Id_Aprobacion_Rechazo;
            this.correcion.empleado_Aprobacion_Rechazo =
              data.empleado_Aprobacion_Rechazo;
            this.correcion.fecha_Aprobacion_Rechazo =
              data.fecha_Aprobacion_Rechazo;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //APROBAR CORRECCION
    async aprobarSolicitudCorreccion(id, aprobar) {
      try {
        const resp = await api.post(
          `/Solicitudes_Correccion_Candidatos/Aprobar/${id}`,
          aprobar
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

    //----------------------------------------------------------------------
    //TIPO DE ELECCIONES
    async loadSolicitudesCorreccionesByPartido() {
      try {
        let resp = await api.get(
          "/Solicitudes_Correccion_Candidatos/ByPartido"
        );
        let { data } = resp.data;
        this.list_Solicitudes_ByPartido = data.map((item) => {
          return {
            id: item.id,
            solicitud: item.solicitud,
            observaciones_Id: item.observaciones_Id,
            observaciones: item.observaciones,
            usuario_Solicitante: item.usuario_Solicitante,
            candidato_Id: item.candidato_Id,
            candidato: item.candidato,
            puesto: item.puesto,
            partido_Id: item.partido_Id,
            partido: item.partido,
            estatus: item.estatus,
            fecha_Solicitud: item.fecha_Solicitud,
            empleado_Id_Aprueba: item.empleado_Id_Aprueba,
            empleado_Aprueba: item.empleado_Aprueba,
            fecha_Aprobacion: item.fecha_Aprobacion,
            logo_Partido: item.logo_Partido,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
