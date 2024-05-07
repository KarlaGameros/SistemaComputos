import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCapturaStore = defineStore("useCapturaStore", {
  state: () => ({
    modal: false,
    modalCausales: false,
    loading: false,
    pendientes_cotejo: [],
    pendientes_recuento: [],
    pendientes_cotejo_rp: [],
    pendientes_recuento_rp: [],
    encabezado: {
      seccion: null,
      casilla: null,
      eleccion: null,
    },
    resultados: {
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
    list_causales: [],
    causales: {
      id: null,
      seccion: null,
      casilla: null,
      causal_1: false,
      causal_2: false,
      causal_3: false,
      causal_4: false,
      causal_5: false,
      causal_6: false,
      causal_7: false,
      causal_8: true,
      causal_9: false,
      causal_10: false,
      causal_11: false,
      total_causales: null,
    },
  }),
  actions: {
    initResultados() {
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

    actualizarModalCausales(valor) {
      this.modalCausales = valor;
    },

    //-----------------------------------------------------------
    async load_cotejo(tipo_eleccion_id) {
      try {
        this.pendientes_cotejo = [];
        this.loading = true;
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
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
    async load_recuento(tipo_eleccion_id) {
      try {
        this.pendientes_recuento = [];
        this.loading = true;
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
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
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

    //-----------------------------------------------------------
    async load_recuento_rp(tipo_eleccion_id) {
      try {
        this.pendientes_recuento_rp = [];
        this.loading = true;
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
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
    async incicializar_resultados(
      eleccion_id,
      casilla_id,
      tipo_computo,
      grupo_trabajo,
      puento_recuento,
      votos_reservados
    ) {
      try {
        this.initResultados();
        const resp = await api.get(
          `/ResultadoComputos/InicializarResultados?TipoEleccionId=${eleccion_id}&CasillaId=${casilla_id}&TipoComputo=${tipo_computo}&GrupoTrabajo=${grupo_trabajo}&PuntoRecuento=${puento_recuento}&VotosReservados=${votos_reservados}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
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
      }
    },

    //-----------------------------------------------------------
    async incicializar_resultados_rp(
      eleccion_id,
      casilla_id,
      tipo_computo,
      grupo_trabajo,
      puento_recuento,
      votos_reservados
    ) {
      try {
        this.initResultados();
        const resp = await api.get(
          `/ResultadoComputos/InicializarResultadosRp?TipoEleccionId=${eleccion_id}&CasillaId=${casilla_id}&TipoComputo=${tipo_computo}&GrupoTrabajo=${grupo_trabajo}&PuntoRecuento=${puento_recuento}&VotosReservados=${votos_reservados}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
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

            if (data.partidos.length > 0) {
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
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async load_causales_by_casilla(eleccion_id, casilla_id) {
      try {
        const resp = await api.get(
          `/Causales/ByCasilla/${casilla_id}/${eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.causales.causal_1 = data.causal_1;
            this.causales.causal_2 = data.causal_2;
            this.causales.causal_3 = data.causal_3;
            this.causales.causal_4 = data.causal_4;
            this.causales.causal_5 = data.causal_5;
            this.causales.causal_6 = data.causal_6;
            this.causales.causal_7 = data.causal_7;
            this.causales.causal_8 = data.causal_8;
            this.causales.causal_9 = data.causal_9;
            this.causales.causal_10 = data.causal_10;
            this.causales.causal_11 = data.causal_11;

            this.list_causales = [
              {
                causal: "El Paquete Electoral fue entregado sin el AECC",
                cumple: data.causal_1,
              },
              {
                causal:
                  "Votos Nulos mayor a la diferencia entre el 1er y 2do lugar",
                cumple: data.causal_2,
              },
              {
                causal:
                  "Total de votos del sistema mayor  a boletas entregadas",
                cumple: data.causal_3,
              },
              {
                causal:
                  "Total de votos del sistema diferente al total de votos del AECC",
                cumple: data.causal_4,
              },
              {
                causal:
                  "Votos para un solo Partido Político, Coalición, Candidatura Común o Independiente",
                cumple: data.causal_5,
              },
              {
                causal: "Acta ilegible",
                cumple: data.causal_6,
              },
              {
                causal: "Acta con alteraciones",
                cumple: data.causal_7,
              },
              {
                causal: "Paquete con muestras de alteraciones",
                cumple: data.causal_8,
              },
              {
                causal:
                  "Ciudadanos que votaron diferente al total de votos del sistema",
                cumple: data.causal_9,
              },
              {
                causal:
                  "Boletas sobrantes más ciudadanos que votaron mayor a boletas entregadas",
                cumple: data.causal_10,
              },
              {
                causal:
                  "Boletas sobrantes más total de votos del sistema a mayor boletas entregadas",
                cumple: data.causal_11,
              },
            ];
          }
        }
      } catch (error) {
        console.error(error);
      }
    },

    //-----------------------------------------------------------
    async registrarResultados(resultado) {
      try {
        const resp = await api.put(
          "/ResultadoComputos/RegistrarResultados",
          resultado
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
    async registrarResultadosRp(resultado) {
      try {
        const resp = await api.put(
          "/ResultadoComputos/RegistrarResultadosRp",
          resultado
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
    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
