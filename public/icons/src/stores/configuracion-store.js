import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useConfiguracionStore = defineStore("useConfiguracionStore", {
  state: () => ({
    isEditar: false,
    tipo_Elecciones: [],
    list_Estados: [],
    list_Preguntas: [],
    list_Opciones: [],
    list_Grupos: [],
    list_Distritos: [],
    list_Partidos_Politicos: [],
    list_Respuestas_Candidatos: [],
    list_Rubros_Evaluacion: [],
    list_Variables_By_Rubro: [],
    list_Paises: [],
    list_Sub_Sensorial: [],
    list_Sub_Negocio: [],
    list_Coaliciones: [],
    list_Municipios: [],
    list_Demarcaciones: [],
    respuesta_Candidato: {
      id: null,
      puesto_Candidato: null,
      pregunta_Id: null,
      opcion_Id: null,
      sub_Opcion_Id: null,
      otros: null,
    },
    documentoExcel: null,
    documentoConsentimiento: null,
  }),
  actions: {
    //-----------------------------------------------------------
    //DOWNLOAD EXCEL
    async downloadExcel() {
      try {
        this.documentoExcel = "";
        const resp = await api.get("/Candidatos/Excel_Avance", {
          responseType: "blob",
        });
        if (resp.status == 200) {
          let blob = new window.Blob([resp.data], {
            type: "application/xlsx",
          });
          this.documentoExcel = window.URL.createObjectURL(blob);
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

    async downloadConsentimiento(id, puesto) {
      try {
        this.documentoConsentimiento = "";
        const resp = await api.get(
          `/Candidatos/GeneraConsetimiento/${id}/${puesto}`,
          {
            responseType: "blob",
          }
        );
        if (resp.status == 200) {
          let blob = new window.Blob([resp.data], {
            type: "application/pdf",
          });
          this.documentoConsentimiento = window.URL.createObjectURL(blob);
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

    //----------------------------------------------------------------------
    //TIPO DE ELECCIONES
    async loadTipoElecciones() {
      try {
        let resp = await api.get("/Tipos_Elecciones");
        let { data } = resp.data;
        let listActivo = [];
        listActivo = data.filter((x) => x.activo == true);
        let listTipoElecciones = listActivo.map((tipo) => {
          return {
            id: tipo.id,
            nombre: tipo.nombre,
            siglas: tipo.siglas,
            activo: tipo.activo,
            propietario_1: tipo.propietario_1,
            propietario_2: tipo.propietario_2,
            suplente_1: tipo.suplente_1,
            suplente_2: tipo.suplente_2,
            fecha_Registro: tipo.fecha_Registro,
          };
        });

        this.tipo_Elecciones = listTipoElecciones;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //ESTADOS
    async loadEstados() {
      try {
        let resp = await api.get("/Estados/GetLista");
        let { data } = resp.data;
        let listEstados = data.map((estado) => {
          return {
            label: estado.label,
            value: estado.value,
          };
        });

        this.list_Estados = listEstados;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //MUNICIPIOS
    async loadMunicipios() {
      try {
        let resp = await api.get("/Municipios");
        let { data } = resp.data;
        let listNayarit = [];
        listNayarit = data.filter((x) => x.estado_Id == 18);
        let listMunicipios = listNayarit.map((municipio) => {
          return {
            value: municipio.id,
            label: municipio.nombre,
          };
        });
        listMunicipios.splice(0, 0, {
          value: 0,
          label: "Todos",
        });
        this.list_Municipios = listMunicipios;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //DEMARCACIONES
    async loadDemarcaciones(id) {
      try {
        let resp = await api.get("/Demarcaciones");
        let { data } = resp.data;

        let listByMunicicipio = [];
        listByMunicicipio = data.filter((x) => x.municipio_Id == id);
        let listDemarcaciones = listByMunicicipio.map((demarcacion) => {
          return {
            value: demarcacion.id,
            label: demarcacion.nombre,
          };
        });
        listDemarcaciones.splice(0, 0, {
          value: 0,
          label: "Todos",
        });
        this.list_Demarcaciones = listDemarcaciones;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //GRUPOS
    async loadGrupos() {
      try {
        let resp = await api.get("/GruposIndigenas/GetLista");
        let { data } = resp.data;
        let listGrupos = data.map((estado) => {
          return {
            label: estado.label,
            value: estado.value,
          };
        });
        let posicion = listGrupos.length;
        listGrupos.splice(posicion, 0, {
          value: 0,
          label: "Otro",
        });

        this.list_Grupos = listGrupos;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //COALICIONES
    async loadCoaliciones() {
      try {
        let resp = await api.get("/Coaliciones");
        let { data } = resp.data;
        let listCoaliciones = data.map((coalicion) => {
          return {
            value: coalicion.id,
            label: coalicion.nombre,
          };
        });
        listCoaliciones.splice(0, 0, {
          value: 0,
          label: "Todos",
        });
        this.list_Coaliciones = listCoaliciones;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //DISTRITOS
    async loadDistritos() {
      try {
        let resp = await api.get("/Distritos");
        let { data } = resp.data;
        let listDistritos = data.map((distrito) => {
          return {
            id: distrito.id,
            no_Distrito: distrito.no_Distrito,
            nombre: distrito.nombre,
            integracion: distrito.integracion,
            label: `${distrito.no_Distrito} - ${distrito.nombre}`,
            value: distrito.id,
          };
        });
        listDistritos.splice(0, 0, {
          value: 0,
          label: "Todos",
        });
        this.list_Distritos = listDistritos;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //PARTIDOS POLITICOS
    async loadPartidosPoliticosTodos() {
      try {
        let resp = await api.get("/Partidos_Politicos/PartidosRP");
        let { data } = resp.data;
        let filtro = data.filter((x) => x.is_Comun == false);
        let listPartidos = filtro.map((partido) => {
          return {
            value: partido.id,
            label: partido.siglas,
            nombre: partido.nombre,
            siglas: partido.siglas,
            logo_URL: partido.logo_URL,
            independiente: partido.independiente,
            prioridad: partido.prioridad,
            pantone_Fondo: partido.pantone_Fondo,
            pantone_Letra: partido.pantone_Letra,
            coalicion_Id: partido.coalicion_Id,
            coalicion: partido.coalicion,
            is_Coalicion: partido.is_Coalicion,
          };
        });
        listPartidos.splice(0, 0, {
          value: 0,
          label: "Todos",
        });
        this.list_Partidos_Politicos = listPartidos;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //PREGUNTAS
    async loadPreguntasCandidatos() {
      try {
        let resp = await api.get("/PreguntasCandidatos");
        let { data } = resp.data;
        let listPreguntas = data.map((pregunta) => {
          return {
            id: pregunta.id,
            numero: pregunta.numero,
            pregunta: pregunta.pregunta,
            tipo: pregunta.tipo,
            apartado: pregunta.apartado,
          };
        });

        this.list_Preguntas = listPreguntas;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //RESPUESTAS
    async loadRespuestasByPregunta(id) {
      try {
        let resp = await api.get(`/OpcionesPreguntas/ByPregunta/${id}`);
        let { data } = resp.data;

        let listRespuestas = data.map((opcion) => {
          return {
            id: opcion.id,
            pregunta_Id: opcion.pregunta_Id,
            opcion: opcion.opcion,
            otro: opcion.otro,
            sub_Opcion_Id: "",
          };
        });
        this.list_Opciones = listRespuestas;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //GET SUBOPCIONES
    async loadSubopcionesByOpcion(id, pregunta) {
      try {
        let resp = await api.get(`/SubOpcionesPreguntas/ByOpcion/${id}`);
        let { data } = resp.data;
        let listSubOpciones = data.map((item) => {
          return {
            id: item.id,
            sub_Opcion: item.sub_Opcion,
          };
        });
        if (pregunta == "Sensorial") {
          this.list_Sub_Sensorial = listSubOpciones;
        } else if (pregunta == "Negocio propio") {
          this.list_Sub_Negocio = listSubOpciones;
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //RESPUESTAS BY CANDIDATO
    async loadRespuestasByCandidato(id, puesto) {
      try {
        let resp = await api.get(`/RespuestasCandidatos/${id}/${puesto}`);
        let { data } = resp.data;
        let listRespuestas = data.map((opcion) => {
          return {
            id: opcion.id,
            puesto_Candidato: opcion.puesto_Candidato,
            candidato_Id: opcion.candidato_Id,
            tipo_Candidato: opcion.tipo_Candidato,
            pregunta_Id: opcion.pregunta_Id,
            opcion_Id: opcion.opcion_Id,
            sub_Opcion_Id: opcion.sub_Opcion_Id,
            otros: opcion.otros,
          };
        });
        this.list_Respuestas_Candidatos = listRespuestas;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async deleteRespuesta(id) {
      try {
        const resp = await api.delete(`/RespuestasCandidatos/${id}`);
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

    //----------------------------------------------------------------------
    //CREATE RESPUESTA
    async createRespuesta(id, opcion) {
      try {
        const resp = await api.post(`/RespuestasCandidatos/${id}`, opcion);
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
    //UPDATE RESPUETA
    async updateRespueta(respuesta) {
      try {
        const resp = await api.put(
          `/RespuestasCandidatos/${respuesta.id}`,
          respuesta
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

    //***************************************************************************

    //----------------------------------------------------------------------
    //RUBROS EVALUACION
    async loadRubrosEvaluacion() {
      try {
        let resp = await api.get("/RubrosEvaluacion");
        let { data } = resp.data;
        this.list_Rubros_Evaluacion = data.map((item) => {
          return {
            id: item.id,
            rubro: item.rubro,
            puntuacion_Maxima: item.puntuacion_Maxima,
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
    //VARIABLES
    async loadVariablesByRubro(id) {
      try {
        let resp = await api.get(`/Variables_Evaluacion/ByRubro/${id}`);
        let { data } = resp.data;
        this.list_Variables_By_Rubro = data.map((item) => {
          return {
            cumple: null,
            variable_Id: item.id,
            variable: item.variable,
            tipo: item.tipo,
            descripcion: item.descripcion,
            puntos_Cumple: item.cumple,
            no_Cumple: item.no_Cumple,
            punto: 0,
            rubro_id: id,
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
    //PAISES
    async loadPaises() {
      try {
        let resp = await api.get("/Paises/GetLista");
        let { data } = resp.data;
        let listPaises = data.map((pais) => {
          return {
            id: pais.value,
            label: pais.label,
          };
        });
        this.list_Paises = listPaises;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
