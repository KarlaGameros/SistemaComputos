import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useAuthStore = defineStore("auth", {
  state: () => ({
    modulos: [],
    sistemas: [],
    apps: [],
    modulo: null,
    usuario_Nombre: null,
  }),
  actions: {
    async loadSistemas() {
      try {
        const resp = await api.get(`/SistemasUsuarios/ByUSuario`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              const sistemasArray = data.map((sistema) => {
                return {
                  sistema_Id: sistema.sistema_Id,
                  sistema: sistema.sistema,
                  url: sistema.url,
                };
              });
              this.sistemas = sistemasArray;

              const appsArray = data.map((app) => {
                return {
                  id: app.sistema_Id,
                  label: app.sistema,
                  avatar:
                    app.logo_Url == null
                      ? "https://api.sistemas-ieenayarit.org/Imagenes/Sistemas/67cfdabe-0538-4324-b711-93bcb6cb9a60.png"
                      : app.logo_Url,
                  url: app.url,
                };
              });
              const logOut = {
                id: 0,
                label: "Cerrar sesión",
                avatar:
                  "https://api.sistemas-ieenayarit.org/Imagenes/Sistemas/dbb9640f-dd18-4fc3-b530-7041d8594240.png",
                url: "",
              };
              const universoIEEN = {
                id: 0,
                label: "Ir a universo",
                avatar:
                  "https://api.sistemas-ieenayarit.org/Imagenes/Sistemas/67cfdabe-0538-4324-b711-93bcb6cb9a60.png",
                url: "",
              };

              appsArray.push(universoIEEN);
              appsArray.push(logOut);
              this.apps = appsArray;
            }
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

    async loadModulos() {
      try {
        const sistema = encryptStorage.decrypt("sistema");
        const resp = await api.get(
          `/PermisosModulosUsuarios/Bysuario/${sistema}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              const modulosArray = data.map((modulo) => {
                return {
                  siglas_Modulo: modulo.siglas_Modulo,
                  registrar: modulo.registrar,
                  actualizar: modulo.actualizar,
                  eliminar: modulo.eliminar,
                  leer: modulo.leer,
                };
              });
              this.modulos = modulosArray;
            }
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

    async loadModulo(siglas) {
      try {
        if ((this.modulos = [])) await this.loadModulos();
        this.modulo = this.modulos.find((x) => x.siglas_Modulo == siglas);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadPerfil() {
      try {
        const resp = await api.get("/SistemasUsuarios/ByUSuario");
        let { data } = resp.data;

        let filtro = data.find(
          (x) => x.sistema_Id == parseInt(encryptStorage.decrypt("sistema"))
        );
        encryptStorage.encrypt("perfil", filtro.perfil);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadUsuario() {
      try {
        const resp = await api.get("/Oficinas/GetUsuario");
        let { data } = resp.data;
        this.usuario_Nombre = data.nombre_Completo;
        encryptStorage.encrypt("municipio", data.municipio);
        encryptStorage.encrypt("oficina_Id", data.oficina_Id);
        encryptStorage.encrypt("oficina_Letra", data.nombre_Oficina);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadOficina() {
      try {
        const resp = await api.get("/Oficinas/GetOficina");
        let { data } = resp.data;
        encryptStorage.encrypt("municipio_Id", data.municipio_Id);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
