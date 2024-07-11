import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCasillaStore = defineStore("useCasillaStore", {
  state: () => ({
    loading: false,
    modal: false,
    list_por_casilla: [],
    list_por_casilla_filtro: [],
    list_por_casilla_rp: [],
    list_por_casilla_rp_filtro: [],
    totales: {
      id: null,
      total_Votos: null,
      total_Sistema: null,
    },
    resultado_casilla: {
      id: null,
      distrito: null,
      eleccion: null,
      usuario: null,
      municipio: null,
      seccion: null,
      casilla: null,
      tipo: null,
      total_Sistema: null,
      total_Capturado: null,
      tipoCandidatura: null,
      demarcacion: null,
    },
    resultados: {
      boletas: null,
      encabezado: {
        grupo_Trabajo: null,
        id: null,
        punto_Recuento: null,
        total_Sistema: null,
        total_Votos: null,
        total_Votos_Candidatos_No_Registrados: null,
        total_Votos_Nulos: null,
        votos_Reservados: null,
      },
      partidos: [],
      coaliciones: [],
      independientes: [],
    },
  }),

  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    initResultados() {
      this.resultados.boletas = null;
      this.resultados.encabezado.id = null;
      this.resultados.encabezado.grupo_Trabajo = null;
      this.resultados.encabezado.punto_Recuento = null;
      this.resultados.encabezado.total_Sistema = null;
      this.resultados.encabezado.total_Votos = null;
      this.resultados.encabezado.total_Votos_Candidatos_No_Registrados = null;
      this.resultados.encabezado.total_Votos_Nulos = null;
      this.resultados.encabezado.votos_Reservados = null;
      this.resultados.partidos = [];
      this.resultados.coaliciones = [];
      this.resultados.independientes = [];
    },

    //--------------------------------------------------------------
    //MR
    async load_por_casilla(tipo_eleccion_id) {
      try {
        this.list_por_casilla = [];
        this.list_por_casilla_filtro = [];
        this.loading = true;
        const resp = await api.get(
          `/ResultadoComputos/ResultadosByTipoEleccion/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.list_por_casilla = data.map((element) => {
              return {
                id: element.id,
                usuario: element.usuario,
                municipio: element.municipio,
                seccion: element.seccion,
                distrito: element.distrito,
                demarcacion: element.demarcacion,
                casilla: element.casilla,
                tipo: element.tipo,
                total_Sistema: element.total_Sistema,
                total_Capturado: element.total_Capturado,
                boletas: element.boletas,
              };
            });
            this.list_por_casilla_filtro = this.list_por_casilla;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      } finally {
        this.loading = false;
      }
    },

    async load_por_casilla_id(
      id,
      distrito,
      municipio,
      seccion,
      casilla,
      tipo,
      tipoCandidatura,
      eleccion,
      demarcacion
    ) {
      try {
        this.resultado_casilla.eleccion = eleccion;
        this.resultado_casilla.distrito = distrito;
        this.resultado_casilla.id = id;
        this.resultado_casilla.municipio = municipio;
        this.resultado_casilla.seccion = seccion;
        this.resultado_casilla.casilla = casilla;
        this.resultado_casilla.tipo = tipo;
        this.resultado_casilla.tipoCandidatura = tipoCandidatura;
        this.resultado_casilla.demarcacion = demarcacion;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //--------------------------------------------------------------
    async load_resultados_mr(id, boletas) {
      try {
        this.loading = true;
        const resp = await api.get(`/ResultadoComputos/ByResultado/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.resultados.boletas = boletas;
            this.resultados.encabezado.id = data.encabezado.id;
            this.resultados.encabezado.grupo_Trabajo =
              data.encabezado.grupo_Trabajo;
            this.resultados.encabezado.punto_Recuento =
              data.encabezado.punto_Recuento;
            this.resultados.encabezado.total_Sistema =
              data.encabezado.total_Sistema;
            this.resultados.encabezado.total_Votos =
              data.encabezado.total_Votos;
            this.resultados.encabezado.total_Votos_Candidatos_No_Registrados =
              data.encabezado.total_Votos_Candidatos_No_Registrados;
            this.resultados.encabezado.total_Votos_Nulos =
              data.encabezado.total_Votos_Nulos;
            this.resultados.encabezado.total_Votos_Nulos =
              data.encabezado.total_Votos_Nulos;

            this.resultados.partidos = data.partidos.map((element) => {
              return {
                id: element.id,
                coalicion: element.coalicion,
                coalicion_Id: element.coalicion_Id,
                combinacion: element.combinacion,
                combinacion_Id: element.combinacion_Id,
                partido: element.partido,
                partido_Id: element.partido_Id,
                resultado_Id: element.resultado_Id,
                voto_Valido: element.voto_Valido,
                votos: element.votos,
                logo_Url: element.logo_Url,
              };
            });
            this.resultados.coaliciones = data.coaliciones.map((element) => {
              return {
                id: element.id,
                coalicion: element.coalicion,
                coalicion_Id: element.coalicion_Id,
                combinacion: element.combinacion,
                combinacion_Id: element.combinacion_Id,
                partido: element.partido,
                partido_Id: element.partido_Id,
                resultado_Id: element.resultado_Id,
                voto_Valido: element.voto_Valido,
                votos: element.votos,
                logo_Url: element.logo_Url,
              };
            });
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      } finally {
        this.loading = false;
      }
    },

    //--------------------------------------------------------------
    //RP
    async load_por_casilla_rp(tipo_eleccion_id) {
      try {
        this.list_por_casilla_rp = [];
        this.list_por_casilla_rp_filtro = [];
        this.loading = true;
        const resp = await api.get(
          `/ResultadoComputos/ResultadosByTipoEleccionRp/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.list_por_casilla_rp = data.map((element) => {
              return {
                id: element.id,
                usuario: element.usuario,
                municipio: element.municipio,
                seccion: element.seccion,
                distrito: element.distrito,
                demarcacion: element.demarcacion,
                casilla: element.casilla,
                tipo: element.tipo,
                total_Sistema: element.total_Sistema,
                total_Capturado: element.total_Capturado,
                boletas: element.boletas,
              };
            });
            this.list_por_casilla_rp_filtro = this.list_por_casilla_rp;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      } finally {
        this.loading = false;
      }
    },

    //--------------------------------------------------------------
    async load_resultados_rp(id, boletas) {
      try {
        this.loading = true;
        const resp = await api.get(`/ResultadoComputos/ByResultadoRp/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success && data.length != 0) {
            this.resultados.boletas = boletas;
            this.resultados.encabezado.id = data.encabezado.id;
            this.resultados.encabezado.grupo_Trabajo =
              data.encabezado.grupo_Trabajo;
            this.resultados.encabezado.punto_Recuento =
              data.encabezado.punto_Recuento;
            this.resultados.encabezado.total_Sistema =
              data.encabezado.total_Sistema;
            this.resultados.encabezado.total_Votos =
              data.encabezado.total_Votos;
            this.resultados.encabezado.total_Votos_Candidatos_No_Registrados =
              data.encabezado.total_Votos_Candidatos_No_Registrados;
            this.resultados.encabezado.total_Votos_Nulos =
              data.encabezado.total_Votos_Nulos;
            this.resultados.encabezado.total_Votos_Nulos =
              data.encabezado.total_Votos_Nulos;

            this.resultados.partidos = data.partidos.map((element) => {
              return {
                id: element.id,
                coalicion: element.coalicion,
                coalicion_Id: element.coalicion_Id,
                combinacion: element.combinacion,
                combinacion_Id: element.combinacion_Id,
                partido: element.partido,
                partido_Id: element.partido_Id,
                resultado_Id: element.resultado_Id,
                voto_Valido: element.voto_Valido,
                votos: element.votos,
                logo_Url: element.logo_Url,
              };
            });
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      } finally {
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
    async modificaTotal(total) {
      try {
        const resp = await api.post(
          "/ResultadoComputos/ModificaTotales",
          total
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
    //DELETE RESULTADO
    async deleteResultado(id) {
      try {
        const resp = await api.delete(`/ResultadoComputos/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
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
    //DELETE RESULTADO RP
    async deleteResultadoRP(id) {
      try {
        const resp = await api.delete(`/ResultadoComputos/RP/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
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
