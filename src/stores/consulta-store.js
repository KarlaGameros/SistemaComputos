import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useConsultaStore = defineStore("useConsultaStore", {
  state: () => ({
    modal: false,
    tipo_Eleccion: null,
    tipo_Candidatura: "MR",
    distrito_Id: null,
    municipio_Id: null,
    demarcacion_Id: null,
    documentoActa: null,
    modalPartidos: false,
    modalCambiarRep: false,
    modalIntegracion: false,
    consulta: false,
    encabezado: {
      tipo_Candidatura: null,
      eleccion: null,
      distrito: null,
      municipio: null,
      demarcacion: null,
    },
    representacion: {
      oficina_Id: null,
      nombre_Completo: null,
      puesto: null,
      sexo: null,
      partido_Id: null,
    },
    resultados: {
      rp: false,
      actorPolitico: [],
      partidosCoalicion: [],
      partidos: [],
      coaliciones: [],
      independientes: null,
      partidos_Dist: [],
      independientes_Dist: null,
      partidos_Actor: [],
      coaliciones_Actor: [],
      independientes_Actot: null,
      total_Votos: 0,
      nulos: 0,
      total_No_Registrados: 0,
      votos_Reservados: 0,
      grupos_Trabajo: 0,
      cotejo: 0,
      recuento_Reserva: 0,
      recuento: 0,
      paquetes: 0,
    },
    list_Integracion_Partidos: [],
    list_Integracion_Partidos_Guardar: [],
    list_Integracion_Consejerias: [],
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarModalPartidos(valor) {
      this.modalPartidos = valor;
    },

    actualizarModalIntegracion(valor) {
      this.modalIntegracion = valor;
    },

    actualizarModalCambiar(valor) {
      this.modalCambiarRep = valor;
    },

    initRepresentacion() {
      this.representacion.oficina_Id = null;
      this.representacion.nombre_Completo = null;
      this.representacion.puesto = null;
      this.representacion.sexo = null;
      this.representacion.partido_Id = null;
    },

    initConsultaResultados() {
      this.resultados.actorPolitico = [];
      this.resultados.partidosCoalicion = [];
      this.resultados.partidos = [];
      this.resultados.coaliciones = [];
      this.resultados.independientes = [];
      this.resultados.partidos_Dist = [];
      this.resultados.independientes_Dist = [];
      this.resultados.partidos_Actor = [];
      this.resultados.coaliciones_Actor = [];
      this.resultados.independientes_Actot = [];
      this.resultados.total_Votos = 0;
      this.resultados.nulos = 0;
      this.resultados.total_No_Registrados = 0;
      this.resultados.votos_Reservados = 0;
      this.resultados.grupos_Trabajo = 0;
      this.resultados.grupos_Trabajo = 0;
      this.resultados.grupos_Trabajo = 0;
    },

    async downloadActa(
      eleccion,
      eleccion_Id,
      distrito_Id,
      municipio_Id,
      demarcacion_Id
    ) {
      try {
        this.documentoActa = "";
        let resp = null;
        if (eleccion == "DIP") {
          if (encryptStorage.decrypt("oficina_Letra") == "CME central IEEN") {
            resp = await api.get(
              `/PDF/GeneraActa?TipoEleccion_Id=${eleccion_Id}&Distrito_Id=${distrito_Id.value}`,
              {
                responseType: "blob",
              }
            );
          } else {
            resp = await api.get(
              `/PDF/GeneraActa?TipoEleccion_Id=${eleccion_Id}&Municipio_Id=${municipio_Id}&Distrito_Id=${distrito_Id.value}`,
              {
                responseType: "blob",
              }
            );
          }
        } else if (eleccion == "PYS") {
          if (encryptStorage.decrypt("oficina_Letra") == "CME central IEEN") {
            resp = await api.get(
              `/PDF/GeneraActa?TipoEleccion_Id=${eleccion_Id}&Municipio_Id=${municipio_Id.value}`,
              {
                responseType: "blob",
              }
            );
          } else {
            resp = await api.get(
              `/PDF/GeneraActa?TipoEleccion_Id=${eleccion_Id}&Municipio_Id=${municipio_Id}`,
              {
                responseType: "blob",
              }
            );
          }
        } else {
          if (encryptStorage.decrypt("oficina_Letra") == "CME central IEEN") {
            resp = await api.get(
              `/PDF/GeneraActa?TipoEleccion_Id=${eleccion_Id}&Municipio_Id=${municipio_Id.value}&Demarcacion_Id=${demarcacion_Id.value}`,
              {
                responseType: "blob",
              }
            );
          } else {
            resp = await api.get(
              `/PDF/GeneraActa?TipoEleccion_Id=${eleccion_Id}&Municipio_Id=${municipio_Id}&Demarcacion_Id=${demarcacion_Id.value}`,
              {
                responseType: "blob",
              }
            );
          }
        }

        if (resp.status == 200) {
          let blob = new window.Blob([resp.data], {
            type: "application/pdf",
          });
          this.documentoActa = window.URL.createObjectURL(blob);
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
    async downloadActaRP(eleccion, eleccion_Id, municipio_Id, distrito_Id) {
      try {
        this.documentoActa = "";
        let resp = null;
        if (eleccion == "DIP") {
          if (encryptStorage.decrypt("oficina_Letra") == "CME central IEEN") {
            resp = await api.get(
              `/PDF/GeneraActaRP?TipoEleccion_Id=${eleccion_Id}`,
              {
                responseType: "blob",
              }
            );
          } else {
            resp = await api.get(
              `/PDF/GeneraActaRP?TipoEleccion_Id=${eleccion_Id}&Municipio_Id=${municipio_Id}&Distrito_Id=${distrito_Id.value}`,
              {
                responseType: "blob",
              }
            );
          }
        } else {
          if (encryptStorage.decrypt("oficina_Letra") == "CME central IEEN") {
            resp = await api.get(
              `/PDF/GeneraActaRP?TipoEleccion_Id=${eleccion_Id}&Municipio_Id=${municipio_Id.value}`,
              {
                responseType: "blob",
              }
            );
          } else {
            resp = await api.get(
              `/PDF/GeneraActaRP?TipoEleccion_Id=${eleccion_Id}&Municipio_Id=${municipio_Id.value}`,
              {
                responseType: "blob",
              }
            );
          }
        }

        if (resp.status == 200) {
          let blob = new window.Blob([resp.data], {
            type: "application/pdf",
          });
          this.documentoActa = window.URL.createObjectURL(blob);
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
    async createNuevoRepresentante(representacion) {
      try {
        const resp = await api.post(
          `/IntegracionesOficinas/Cambiar_Representante?OficinaId=${representacion.oficina_Id}`,
          representacion
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
    async cosultaResultadosMr(
      eleccion,
      eleccion_id,
      municipio_id,
      distrito_id,
      demarcacion_id
    ) {
      try {
        let resp = null;
        if (eleccion == "DIP") {
          if (encryptStorage.decrypt("oficina_Letra") == "CME central IEEN") {
            // resp = await api.get(
            //   `/ResultadoComputos/ConsultaResultados?TipoEleccion=${eleccion_id}&Distrito=${distrito_id.value}`
            // );
            resp = await api.get(
              `/ResultadoComputos/ConsultaResultados?TipoEleccion=${eleccion_id}&Municipio=${municipio_id.value}&Distrito=${distrito_id.value}`
            );
          } else {
            resp = await api.get(
              `/ResultadoComputos/ConsultaResultados?TipoEleccion=${eleccion_id}&Municipio=${municipio_id}&Distrito=${distrito_id.value}`
            );
          }
        } else if (eleccion == "PYS") {
          if (encryptStorage.decrypt("oficina_Letra") == "CME central IEEN") {
            resp = await api.get(
              `/ResultadoComputos/ConsultaResultados?TipoEleccion=${eleccion_id}&Municipio=${municipio_id.value}`
            );
          } else {
            resp = await api.get(
              `/ResultadoComputos/ConsultaResultados?TipoEleccion=${eleccion_id}&Municipio=${municipio_id}`
            );
          }
        } else if (eleccion == "REG") {
          if (encryptStorage.decrypt("oficina_Letra") == "CME central IEEN") {
            resp = await api.get(
              `/ResultadoComputos/ConsultaResultados?TipoEleccion=${eleccion_id}&Municipio=${municipio_id.value}&Demarcacion=${demarcacion_id.value}`
            );
          } else {
            resp = await api.get(
              `/ResultadoComputos/ConsultaResultados?TipoEleccion=${eleccion_id}&Municipio=${municipio_id}&Demarcacion=${demarcacion_id.value}`
            );
          }
        }
        if (resp.status == 200) {
          const { success, data } = resp.data;

          if (success) {
            this.resultados.rp = false;
            this.resultados.partidos = data.partidos;
            this.resultados.coaliciones = data.coaliciones;
            this.resultados.independientes = data.independientes;
            this.resultados.partidos_Dist = data.partidos_Dist;
            this.resultados.independientes_Dist = data.independientes_Dist;
            this.resultados.partidos_Actor = data.partidos_Actor;
            this.resultados.coaliciones_Actor = data.coaliciones_Actor;
            this.resultados.independientes_Actot = data.independientes_Actot;
            this.resultados.total_Votos =
              data.total_Votos.toLocaleString("en-US");
            this.resultados.nulos = data.nulos.toLocaleString("en-US");
            this.resultados.total_No_Registrados =
              data.total_No_Registrados.toLocaleString("en-US");
            this.resultados.votos_Reservados = data.votos_Reservados;
            this.resultados.grupos_Trabajo = data.grupos_Trabajo;
            this.resultados.cotejo = data.cotejo;
            this.resultados.recuento_Reserva = data.recuento_Reserva;
            this.resultados.recuento = data.recuento;
            this.resultados.paquetes = data.paquetes;
            this.consulta = true;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async cosultaResultadosRP(eleccion_id, municipio_id, distrito_id) {
      try {
        let resp = null;
        if (eleccion_id == 2) {
          if (encryptStorage.decrypt("oficina_Letra") == "CME central IEEN") {
            resp = await api.get(
              `/ResultadoComputos/ConsultaResultadosRp?TipoEleccion=${eleccion_id}`
            );
          }
        }
        if (distrito_id != null) {
          if (encryptStorage.decrypt("oficina_Letra") == "CME central IEEN") {
            resp = await api.get(
              `/ResultadoComputos/ConsultaResultadosRp?TipoEleccion=${eleccion_id}`
            );
          } else {
            resp = await api.get(
              `/ResultadoComputos/ConsultaResultadosRp?TipoEleccion=${eleccion_id}&Municipio=${municipio_id}&Distrito=${distrito_id.value}`
            );
          }
        } else if (distrito_id == null && eleccion_id != 2) {
          resp = await api.get(
            `/ResultadoComputos/ConsultaResultadosRp?TipoEleccion=${eleccion_id}&Municipio=${municipio_id.value}`
          );
        }
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.resultados.rp = true;
            this.resultados.partidos = data.partidos;
            this.resultados.total_Votos =
              data.total_Votos.toLocaleString("en-US");
            this.resultados.nulos = data.nulos.toLocaleString("en-US");
            this.resultados.total_No_Registrados =
              data.total_No_Registrados.toLocaleString("en-US");
            this.resultados.votos_Reservados = data.votos_Reservados;
            this.resultados.grupos_Trabajo = data.grupos_Trabajo;
            this.resultados.cotejo = data.cotejo;
            this.resultados.recuento_Reserva = data.recuento_Reserva;
            this.resultados.recuento = data.recuento;
            this.resultados.paquetes = data.paquetes;
            this.consulta = true;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    async loadIntegracionPartidosPoliticos() {
      try {
        this.list_Integracion_Partidos = [];
        let resp = await api.get(
          "/IntegracionesOficinas/RepresentantesPartidosByOficina"
        );
        let { data } = resp.data;
        this.list_Integracion_Partidos = data.map((element) => {
          return {
            id: element.id,
            id_Propietario: element.id_Propietario,
            oficina_Id: element.oficina_Id,
            oficina: element.oficina,
            nombre_Completo: element.nombre_Completo,
            puesto: element.puesto,
            sexo: element.sexo,
            orden: element.orden,
            partido_Id: element.partido_Id,
            partido: element.partido,
            logo_Partido: element.logo_Partido,
            activo: element.activo,
            presente_Propietario: element.presente_Propietario,
            presente_Suplente: element.presente_Suplente,
            nombre_Completo_Propietario: element.nombre_Completo_Propietario,
            puesto_Propietario: element.puesto_Propietario,
            sexo_Propietario: element.sexo_Propietario,
            id_Suplente: element.id_Suplente,
            nombre_Completo_Suplente: element.nombre_Completo_Suplente,
            puesto_Suplente: element.puesto_Suplente,
            sexo_Suplente: element.sexo_Suplente,
            orden: element.orden,
            partido_Nombre: element.partido_Nombre,
            partido_Siglas: element.partido_Siglas,
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
    async loadIntegracionConsejerias() {
      try {
        this.list_Integracion_Consejerias = [];
        let resp = await api.get("/IntegracionesOficinas/ConsejeriasByOficina");
        let { data } = resp.data;
        this.list_Integracion_Consejerias = data.map((element) => {
          return {
            id: element.id,
            oficina_Id: element.oficina_Id,
            oficina: element.oficina,
            nombre_Completo: element.nombre_Completo,
            puesto: element.puesto,
            sexo: element.sexo,
            orden: element.orden,
            activo: element.activo,
            presente: element.presente,
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
    async integracionPresente(id, presente) {
      try {
        const resp = await api.get(
          `/IntegracionesOficinas/RepresentastesPresentes/${id}?Presente=${presente}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          return { success: success, data: data };
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
