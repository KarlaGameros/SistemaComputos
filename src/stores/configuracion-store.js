import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useConfiguracionStore = defineStore("useConfiguracionStore", {
  state: () => ({
    list_Tipo_Elecciones: [],
    list_Partidos_Politicos: [],
    list_Coaliciones: [],
    list_Municipios: [],
    list_Demarcaciones: [],
    list_Distritos: [],
    list_Distritos_By_Municipio: [],
    list_Candidatos_By_Partido: [],
  }),
  actions: {
    //----------------------------------------------------------------------
    //TIPO DE ELECCIONES
    async loadTipoElecciones() {
      try {
        let resp = await api.get("/Tipos_Elecciones/Jornada");
        let { data } = resp.data;
        let listActivo = [];
        listActivo = data.filter((x) => x.activo == true);
        let listTipoElecciones = listActivo.map((tipo) => {
          return {
            id: tipo.id,
            nombre: tipo.nombre,
            siglas: tipo.siglas,
            activo: tipo.activo,
            value: tipo.id,
            label: tipo.nombre,
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

    //-----------------------------------------------------------
    async loadCandidatosByPartido(partido, eleccion, municipio_id) {
      try {
        let resp = await api.get(
          `/Candidatos/ByPartidoTipoEleccion/${partido}/${eleccion}`
        );
        let { data } = resp.data;
        let filtro = null;
        if (municipio_id == null) {
          filtro = data.filter((x) => x.tipo_Candidato == "RP");
        } else {
          filtro = data.filter(
            (x) => x.tipo_Candidato == "RP" && x.municipio_Id == municipio_id
          );
        }
        let contador = 1;
        let idsVistos = {};
        this.list_Candidatos_By_Partido = filtro.map((candidato) => {
          if (idsVistos[candidato.id]) {
            contador++;
          } else {
            contador = 1;
            idsVistos[candidato.id] = true;
          }
          let label = ` ${contador}-${candidato.nombres} ${candidato.apellido_Paterno}`;
          if (candidato.apellido_Materno != null) {
            label += ` ${candidato.apellido_Materno}`;
          }
          return {
            value: candidato.id,
            label: label,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //GEL ALL PARTIDOS POLITICOS
    async loadPartidosPoliticos() {
      try {
        let resp = await api.get("/Partidos_Politicos/Partidos");
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
        let listMunicipios = data.map((municipio) => {
          return {
            value: municipio.id,
            label: municipio.nombre,
          };
        });
        if (encryptStorage.decrypt("oficina_Letra") != "CME central IEEN") {
          this.list_Municipios = listMunicipios.filter(
            (x) => x.label === encryptStorage.decrypt("municipio")
          );
        } else {
          this.list_Municipios = listMunicipios;
        }
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
        let listDistritos = data.map((distrito) => {
          return {
            id: distrito.id,
            no_Distrito: distrito.no_Distrito,
            nombre: distrito.nombre,
            integracion: distrito.integracion,
            label: distrito.no_Distrito,
            value: distrito.id,
            integracion: distrito.integracion,
          };
        });
        if (encryptStorage.decrypt("oficina_Letra") != "CME central IEEN") {
          this.list_Distritos = listDistritos.filter((x) =>
            x.nombre.includes(encryptStorage.decrypt("municipio"))
          );
          if (this.list_Distritos.length == 0) {
            this.list_Distritos = listDistritos.filter((x) =>
              x.integracion.includes(encryptStorage.decrypt("municipio"))
            );
          }
        } else {
          this.list_Distritos = listDistritos;
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //----------------------------------------------------------------------
    //DISTRITOS BY MUNICIPIO
    async loadDistritosByMunicipio(id) {
      try {
        let resp = await api.get(`/Distritos/GetListaByMunicipio/${id}`);
        let { data } = resp.data;
        this.list_Distritos_By_Municipio = data.map((distrito) => {
          return {
            label: distrito.label,
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

    //----------------------------------------------------------------------
    //SECCIONES
    async loadSecciones(id) {
      try {
        let resp = await api.get(`/Distritos/GetListaByMunicipio/${id}`);
        let { data } = resp.data;
        this.list_Distritos_By_Municipio = data.map((distrito) => {
          return {
            label: distrito.label,
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
