import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useConfiguracionStore = defineStore("useConfiguracionStore", {
  state: () => ({
    list_Tipo_Elecciones: [],
    list_Partidos_Politicos: [],
    list_Coaliciones: [],
    list_Municipios: [],
    list_Demarcaciones: [],
    list_Distritos: [],
  }),
  actions: {
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
          };
        });
        this.list_Tipo_Elecciones = listTipoElecciones;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //GEL ALL PARTIDOS POLITICOS
    async loadPartidosPoliticos() {
      try {
        let resp = await api.get("/Partidos_Politicos");
        let { data } = resp.data;
        this.list_Partidos_Politicos = data.map((partido) => {
          return {
            value: partido.id,
            label: `${partido.siglas}-${partido.nombre}`,
            id: partido.id,
            nombre: partido.nombre,
            siglas: partido.siglas,
            logo_URL: partido.logo_URL,
            independiente: partido.independiente,
            prioridad: partido.prioridad,
            pantone_Fondo: partido.pantone_Fondo,
            pantone_Letra: partido.pantona_Letra,
            votos: "",
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
    //GET ALL COALICIONES
    async loadCoaliciones() {
      try {
        let resp = await api.get("/Coaliciones");
        let { data } = resp.data;
        let listCoaliciones = data.map((coalicion) => {
          return {
            id: coalicion.id,
            nombre: coalicion.nombre,
            siglas: coalicion.siglas,
            logo_URL: coalicion.logo_URL,
            orden: coalicion.orden,
            activo: coalicion.activo,
            comun: coalicion.comun,
            votos: "",
          };
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
    //MUNICIPIOS
    async loadMunicipios() {
      try {
        let resp = await api.get("/Municipios/MunicipiosNayarit");
        let { data } = resp.data;
        this.list_Municipios = data.map((municipio) => {
          return {
            value: municipio.id,
            label: municipio.nombre,
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
    //DEMARCACIONES
    async loadDemarcaciones(id) {
      try {
        let resp = await api.get(`/Demarcaciones/ByMunicipio/${id}`);
        let { data } = resp.data;
        this.list_Demarcaciones = data.map((demarcacion) => {
          return {
            value: demarcacion.id,
            label: demarcacion.nombre,
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
    //DISTRITOS
    async loadDistritos() {
      try {
        let resp = await api.get("/Distritos");
        let { data } = resp.data;
        this.list_Distritos = data.map((distrito) => {
          return {
            id: distrito.id,
            no_Distrito: distrito.no_Distrito,
            nombre: distrito.nombre,
            integracion: distrito.integracion,
            label: `${distrito.no_Distrito} - ${distrito.nombre}`,
            value: distrito.id,
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
