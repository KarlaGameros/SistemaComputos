import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useVotoAnticipadoStore = defineStore("useVotoAnticipadoStore", {
  state: () => ({
    modal: false,
    loading: false,
    visualizar: false,
    reload: false,
    list_va_eleccion: [],
    list_va_resultados_eleccion: [],
    encabezado: {
      distrito: null,
      municipio: null,
      demarcacion: null,
      eleccion: null,
    },
    resultadosVA: {
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
        voto_Anticipado_Id: null,
      },
      partidos: [],
      coaliciones: [],
      voto_Anticipado_Id: null,
    },
  }),
  actions: {
    actualizarTabla(valor) {
      this.reload = valor;
    },
    actualizarModal(valor) {
      this.modal = valor;
    },
    actualizarVisualizar(valor) {
      this.visualizar = valor;
    },

    initEncabezado() {
      this.encabezado.distrito = null;
      this.encabezado.municipio = null;
      this.encabezado.demarcacion = null;
      this.encabezado.eleccion = null;
    },

    initResultado() {
      this.resultadosVA.boletas = null;
      this.resultadosVA.encabezado.id = null;
      this.resultadosVA.voto_Anticipado_Id = null;
      this.resultadosVA.encabezado.grupo_Trabajo = null;
      this.resultadosVA.encabezado.punto_Recuento = null;
      this.resultadosVA.encabezado.total_Sistema = null;
      this.resultadosVA.encabezado.total_Votos = null;
      this.resultadosVA.encabezado.total_Votos_Candidatos_No_Registrados = null;
      this.resultadosVA.encabezado.total_Votos_Nulos = null;
      this.resultadosVA.encabezado.votos_Reservados = null;
      this.resultadosVA.encabezado.voto_Anticipado_Id = null;
      this.resultadosVA.partidos = [];
      this.resultadosVA.coaliciones = [];
    },

    //--------------------------------------------------------------
    async cosultaResultados(id, boletas) {
      try {
        let resp = null;
        resp = await api.get(`/ResultadoComputosVa/ByResultado/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.resultadosVA.boletas = boletas;
            this.resultadosVA.encabezado.id = data.encabezado.id;
            this.resultadosVA.encabezado.voto_Anticipado_Id =
              data.encabezado.voto_Anticipado_Id;
            this.resultadosVA.encabezado.total_Votos_Nulos =
              data.encabezado.total_Votos_Nulos;
            this.resultadosVA.encabezado.total_Votos_Candidatos_No_Registrados =
              data.encabezado.total_Votos_Candidatos_No_Registrados;
            this.resultadosVA.encabezado.total_Votos =
              data.encabezado.total_Votos.toLocaleString("en-US");
            this.resultadosVA.encabezado.total_Sistema =
              data.encabezado.total_Sistema.toLocaleString("en-US");
            this.resultadosVA.encabezado.grupo_Trabajo =
              data.encabezado.grupo_Trabajo;
            this.resultadosVA.encabezado.punto_Recuento =
              data.encabezado.punto_Recuento;
            this.resultadosVA.encabezado.votos_Reservados =
              data.encabezado.votos_Reservados;
            this.resultadosVA.partidos = data.partidos;
            this.resultadosVA.coaliciones = data.coaliciones;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //--------------------------------------------------------------
    async load_va_by_eleccion(tipo_eleccion_id) {
      try {
        this.list_va_eleccion = [];
        this.loading = true;
        const resp = await api.get(
          `/ResultadoComputosVa/ByTipoEleccion/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.list_va_eleccion = data.map((voto) => {
              return {
                id: voto.id,
                usuario_Id: voto.usuario_Id,
                usuario: voto.usuario,
                tipo_Eleccion_Id: voto.tipo_Eleccion_Id,
                tipo_Eleccion: voto.tipo_Eleccion,
                distrito_Id: voto.distrito_Id,
                distrito: voto.distrito,
                municipio_Id: voto.municipio_Id,
                municipio: voto.municipio,
                demarcacion_Id: voto.demarcacion_Id,
                demarcacion: voto.demarcacion,
                listado_Nominal: voto.listado_Nominal,
                computado: voto.computado,
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
    async load_va_resultados_by_eleccion(tipo_eleccion_id) {
      try {
        this.list_va_resultados_eleccion = [];
        this.loading = true;
        const resp = await api.get(
          `/ResultadoComputosVa/ResultadosByTipoEleccion/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.list_va_resultados_eleccion = data.map((voto) => {
              return {
                id: voto.id,
                usuario: voto.usuario,
                municipio: voto.municipio,
                seccion: voto.seccion,
                casilla: voto.casilla,
                tipo: voto.tipo,
                total_Sistema: voto.total_Sistema,
                total_Capturado: voto.total_Capturado,
                distrito: voto.distrito,
                demarcacion: voto.demarcacion,
                boletas: voto.boletas,
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
    async incicializar_resultados(
      Voto_Anticipado_Id,
      Tipo_Computo,
      Grupo_Trabajo,
      Punto_Recuento,
      Votos_Reservados
    ) {
      try {
        const resp = await api.get(
          `/ResultadoComputosVa/Inicializar?Voto_Anticipado_Id=${Voto_Anticipado_Id}&Tipo_Computo=${Tipo_Computo}&Grupo_Trabajo=${Grupo_Trabajo}&Punto_Recuento=${Punto_Recuento}&Votos_Reservados=${Votos_Reservados}`
        );
        if (resp.status == 200) {
          const { success, data, boletas } = resp.data;
          if (success) {
            this.resultadosVA.encabezado.votos_Reservados =
              parseInt(Votos_Reservados);
            this.resultadosVA.boletas = boletas;
            this.resultadosVA.voto_Anticipado_Id = Voto_Anticipado_Id;
            this.resultadosVA.encabezado.id = data.encabezado.id;
            this.resultadosVA.encabezado.grupo_Trabajo =
              data.encabezado.grupo_Trabajo;
            this.resultadosVA.encabezado.punto_Recuento =
              data.encabezado.punto_Recuento;
            this.resultadosVA.encabezado.total_Sistema =
              data.encabezado.total_Sistema;
            this.resultadosVA.encabezado.total_Votos =
              data.encabezado.total_Votos;
            this.resultadosVA.encabezado.total_Votos_Candidatos_No_Registrados =
              data.encabezado.total_Votos_Candidatos_No_Registrados;
            this.resultadosVA.encabezado.total_Votos_Nulos =
              data.encabezado.total_Votos_Nulos;
            this.resultadosVA.encabezado.total_Votos_Nulos =
              data.encabezado.total_Votos_Nulos;
            this.resultadosVA.encabezado.voto_Anticipado_Id =
              Voto_Anticipado_Id;
            if (data.partidos.length > 0) {
              this.resultadosVA.partidos = data.partidos.map((element) => {
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
            if (data.coaliciones.length > 0) {
              this.resultadosVA.coaliciones = data.coaliciones.map(
                (element) => {
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
                }
              );
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

    //--------------------------------------------------------------
    async createResultadosVA(resultado) {
      try {
        const resp = await api.post(
          "/ResultadoComputosVa/RegistrarResultados",
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
  },
});
