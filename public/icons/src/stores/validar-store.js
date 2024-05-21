import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useValidarStore = defineStore("useValidarStore", {
  state: () => ({
    modal: false,
    modal_Requerir: false,
    modal_Faltante: false,
    modal_Foto: false,
    isEditar: false,
    list_Rubros_By_Evaluacion: [],
    list_Variables_Evaluacion_By_Rubro: [],
    validar: {
      candidato_Id: null,
      puesto_Candidato: null,
      total_Puntos: 0,
      rubros: [],
    },
    rubros: [
      {
        rubro_Id: null,
        total_Puntos: 0,
        variables: [],
      },
    ],
    evaluacion: {
      id: null,
      empleado_Id: null,
      empleado: null,
      candidato_Id: null,
      candidato: null,
      puesto_Candidato: null,
      total_Puntos: 0,
    },
    observaciones: {
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
    },
  }),
  actions: {
    initObservacion() {
      this.observaciones.id = null;
      this.observaciones.empleado_Id = null;
      this.observaciones.candidato_Id = null;
      this.observaciones.puesto = null;
      this.observaciones.identidad = null;
      this.observaciones.propuesta_1 = null;
      this.observaciones.propuesta_2 = null;
      this.observaciones.genero = null;
      this.observaciones.trayectoria = null;
      this.observaciones.historia_Profesional = null;
      this.observaciones.motivo_Cargo_Publico = null;
      this.observaciones.formacion = null;
      this.observaciones.fecha_Registro = null;
      this.observaciones.faltantes = null;
      this.observaciones.validadas = null;
      this.observaciones.aplicadas = null;
    },

    actualizarModalRequerir(valor) {
      this.modal_Requerir = valor;
    },

    actualizarModalFaltante(valor) {
      this.modal_Faltante = valor;
    },

    actualizarModalFoto(valor) {
      this.modal_Foto = valor;
    },

    initEvaluacion() {
      this.evaluacion.id = null;
      this.evaluacion.empleado_Id = null;
      this.evaluacion.empleado = null;
      this.evaluacion.candidato_Id = null;
      this.evaluacion.candidato = null;
      this.evaluacion.puesto_Candidato = null;
      this.evaluacion.total_Puntos = null;
      this.list_Rubros_By_Evaluacion = [];
      this.list_Variables_Evaluacion_By_Rubro = [];
    },
    //-----------------------------------------------------------
    async createValidar(validar) {
      try {
        const resp = await api.post("/EvaluacionesCandidatos", validar);
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

    async addVariable(variable_Id, cumple, punto) {
      try {
        this.rubros.push({
          variable_Id: variable_Id,
          cumple: cumple,
          punto: punto,
        });
        return true;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadVariableByCandidato(candidato_Id, puesto) {
      try {
        let resp = await api.get(
          `/EvaluacionesCandidatos/${candidato_Id}/${puesto}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.evaluacion.id = data.id;
            this.evaluacion.empleado_Id = data.empleado_Id;
            this.evaluacion.empleado = data.empleado;
            this.evaluacion.candidato_Id = data.candidato_Id;
            this.evaluacion.candidato = data.candidato;
            this.evaluacion.puesto_Candidato = data.puesto_Candidato;
            this.evaluacion.total_Puntos = data.total_Puntos;
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
    async loadRubrosByEvaluacion(id) {
      try {
        let resp = null;
        resp = await api.get(
          `/EvaluacionesCandidatos/RubrosByEvaluacion/${id}`
        );
        let { data } = resp.data;
        this.list_Rubros_By_Evaluacion = data.map((rubro) => {
          return {
            id: rubro.id,
            evaluacion_Candidato_Id: rubro.evaluacion_Candidato_Id,
            rubro_Id: rubro.rubro_Id,
            rubro: rubro.rubro,
            total_Puntos: rubro.total_Puntos,
            fecha_Registro: rubro.fecha_Registro,
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
    async loadRespuestasdByRubro(id) {
      try {
        let resp = null;
        resp = await api.get(`/EvaluacionesCandidatos/VariablesByRubo/${id}`);
        let { data } = resp.data;
        this.list_Variables_Evaluacion_By_Rubro = data.map((variable) => {
          return {
            id: variable.id,
            empleado_Id: variable.empleado_Id,
            evaluacion_Rubro_Id: variable.evaluacion_Rubro_Id,
            variable_Id: variable.variable_Id,
            cumple: variable.cumple,
            punto: variable.punto,
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
    async updateEvaluacionCandidato(validar) {
      try {
        const resp = await api.put(`/EvaluacionesCandidatos`, validar);
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
    async validarCandidatoByIEEN(candidato_Id, puesto) {
      try {
        const resp = await api.get(
          `/Candidatos/ValidarIEEN/${candidato_Id}/${puesto}`
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
    async validarCandidatoByPartido(candidato_Id, puesto) {
      try {
        const resp = await api.get(
          `/Candidatos/Validar/${candidato_Id}/${puesto}`
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
    async createObservaciones(observaciones) {
      try {
        const resp = await api.post("/ObservacionesCandidatos", observaciones);
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
