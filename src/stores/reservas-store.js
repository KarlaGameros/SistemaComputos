import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useRerservasStore = defineStore("useRerservasStore", {
  state: () => ({
    modal: false,
    modalVa: false,
    loading: false,
    cargar: false,
    cargarReservasVa: false,
    list_reservas_mr: [],
    list_reservas_rp: [],
    list_reservas_va: [],
    encabezado: {
      distrito: null,
      municipio: null,
      demarcacion: null,
      eleccion: null,
      casilla_Id: null,
    },
    resultadosVa: {
      boletas: null,
      voto_Anticipado_Id: null,
      encabezado: {
        id: null,
        voto_Anticipado_Id: null,
        total_Votos_Nulos: null,
        total_Votos_Candidatos_No_Registrados: null,
        total_Votos: null,
        total_Sistema: null,
        grupo_Trabajo: null,
        punto_Recuento: null,
        votos_Reservados: null,
      },
      partidos: [],
      coaliciones: [],
    },
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarModalVa(valor) {
      this.modalVa = valor;
    },

    actualizarTabla(valor) {
      this.cargar = valor;
    },

    actualizarTablaReservasVA(valor) {
      this.cargarReservasVa = valor;
    },

    initEncabezado() {
      this.encabezado.distrito = null;
      this.encabezado.municipio = null;
      this.encabezado.demarcacion = null;
      this.encabezado.eleccion = null;
      this.encabezado.casilla_Id = null;
    },

    initResultados() {
      this.resultadosVa.boletas = null;
      this.resultadosVa.encabezado.id = null;
      this.resultadosVa.encabezado.grupo_Trabajo = null;
      this.resultadosVa.encabezado.punto_Recuento = null;
      this.resultadosVa.encabezado.total_Sistema = null;
      this.resultadosVa.encabezado.total_Votos = null;
      this.resultadosVa.encabezado.total_Votos_Candidatos_No_Registrados = null;
      this.resultadosVa.encabezado.total_Votos_Nulos = null;
      this.resultadosVa.encabezado.votos_Reservados = null;
      this.resultadosVa.partidos = [];
      this.resultadosVa.coaliciones = [];
      this.resultadosVa.independientes = [];
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
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
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
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
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

    //--------------------------------------------------------------
    async load_reservas_va(tipo_eleccion_id) {
      try {
        this.list_reservas_va = [];
        this.loading = true;
        const resp = await api.get(
          `/ResultadoComputosVa/Reservas/${tipo_eleccion_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.list_reservas_va = data.map((element) => {
              return {
                id: element.id,
                municipio: element.municipio,
                distrito: element.distrito,
                distrito_Id: element.distrito_Id,
                demarcacion_Id: element.demarcacion_Id,
                demarcacion: element.demarcacion,
                listado_Nominal: element.listado_Nominal,
                computado: element.computado,
                tipo_Eleccion: element.tipo_Eleccion,
                tipo_Eleccion_Id: element.tipo_Eleccion_Id,
                usuario: element.usuario,
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
    async reservarVA(id) {
      try {
        const resp = await api.get(`/ResultadoComputosVa/Reservar/${id}`);
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
    async quitarReservaVA(id) {
      try {
        const resp = await api.get(`/ResultadoComputosVA/QuitarReserva/${id}`);
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
    async incicializar_resultados_va(
      voto_anticipado_id,
      tipo_computo,
      grupo_trabajo,
      punto_recuento,
      votos_reservados
    ) {
      try {
        this.initResultados();
        const resp = await api.get(
          `/ResultadoComputosVa/Inicializar?Voto_Anticipado_Id=${voto_anticipado_id}&Tipo_Computo=${tipo_computo}&Grupo_Trabajo=${grupo_trabajo}&Punto_Recuento=${punto_recuento}&Votos_Reservados=${votos_reservados}`
        );
        if (resp.status == 200) {
          const { success, data, boletas } = resp.data;
          if (success) {
            this.resultadosVa.voto_Anticipado_Id = voto_anticipado_id;
            this.resultadosVa.boletas = boletas;
            this.resultadosVa.encabezado.id = data.encabezado.id;
            this.resultadosVa.encabezado.voto_Anticipado_Id =
              data.encabezado.voto_Anticipado_Id;
            this.resultadosVa.encabezado.total_Votos_Nulos =
              data.encabezado.total_Votos_Nulos;
            this.resultadosVa.encabezado.total_Votos_Candidatos_No_Registrados =
              data.encabezado.total_Votos_Candidatos_No_Registrados;
            this.resultadosVa.encabezado.total_Votos =
              data.encabezado.total_Votos;
            this.resultadosVa.encabezado.total_Sistema =
              data.encabezado.total_Sistema;
            this.resultadosVa.encabezado.grupo_Trabajo =
              data.encabezado.grupo_Trabajo;
            this.resultadosVa.encabezado.punto_Recuento =
              data.encabezado.punto_Recuento;
            this.resultadosVa.encabezado.votos_Reservados =
              data.encabezado.votos_Reservados;

            if (data.partidos.length > 0) {
              this.resultadosVa.partidos = data.partidos.map((element) => {
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
              this.resultadosVa.coaliciones = data.coaliciones.map(
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

    //-----------------------------------------------------------
    async registrarResultadosVA(resultado) {
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
