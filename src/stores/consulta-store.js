import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useConsultaStore = defineStore("useConsultaStore", {
  state: () => ({
    modal: false,
    modalIntegracion: false,
    consulta: false,
    encabezado: {
      tipo_Candidatura: null,
      eleccion: null,
      distrito: null,
      municipio: null,
      demarcacion: null,
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
    list_Integracion_Consejerias: [],
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarModalIntegracion(valor) {
      this.modalIntegracion = valor;
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
          resp = await api.get(
            `/ResultadoComputos/ConsultaResultados?TipoEleccion=${eleccion_id}&Distrito=${distrito_id.value}`
          );
        } else if (eleccion == "PYS") {
          resp = await api.get(
            `/ResultadoComputos/ConsultaResultados?TipoEleccion=${eleccion_id}&Municipio=${municipio_id.value}`
          );
        } else if (eleccion == "REG") {
          resp = await api.get(
            `/ResultadoComputos/ConsultaResultados?TipoEleccion=${eleccion_id}&Municipio=${municipio_id.value}&Demarcacion=${demarcacion_id.value}`
          );
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
    async cosultaResultadosRP(eleccion_id, municipio_id) {
      try {
        let resp = null;
        if (municipio_id == null) {
          resp = await api.get(
            `/ResultadoComputos/ConsultaResultadosRp?TipoEleccion=${eleccion_id}`
          );
        } else {
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
        let resp = await api.get(
          "/IntegracionesOficinas/RepresentantesPartidosByOficina"
        );
        let { data } = resp.data;
        this.list_Integracion_Partidos = data.map((element) => {
          return {
            id: element.id,
            oficina_Id: element.oficina_Id,
            nombre_Completo: element.nombre_Completo,
            puesto: element.puesto,
            sexo: element.sexo,
            orden: element.orden,
            partido_Id: element.partido_Id,
            partido: element.partido,
            logo_Partido: element.logo_Partido,
            activo: element.activo,
            presente: false,
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
        let resp = await api.get("/IntegracionesOficinas/ConsejeriasByOficina");
        let { data } = resp.data;
        this.list_Integracion_Consejerias = data.map((element) => {
          return {
            id: element.id,
            oficina_Id: element.oficina_Id,
            nombre_Completo: element.nombre_Completo,
            puesto: element.puesto,
            sexo: element.sexo,
            orden: element.orden,
            partido_Id: element.partido_Id,
            partido: element.partido,
            logo_Partido: element.logo_Partido,
            activo: element.activo,
            presente: false,
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
