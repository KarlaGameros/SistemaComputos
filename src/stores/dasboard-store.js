import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useDasboardStore = defineStore("useDasboardStore", {
  state: () => ({
    avance: {
      capturadas_Dip_MR: 0,
      capturadas_Dip_RP: 0,
      capturadas_Pys: 0,
      capturadas_Reg_MR: 0,
      capturadas_Reg_Rp: 0,
      capturadas_Va: 0,
      casillas: 0,
      casillas_RP: 0,
      voto_Anticipado: 0,
      general_Diputaciones: [],
      general_Diputaciones_RP: [],
      general_PyS: [],
      general_Regidurias: [],
      general_Regidurias_RP: [],
      municipios: [],
    },
    avanceCME: {
      esperadas_Dip_MR: 0,
      capturadas_Dip_MR: 0,
      esperadas_Dip_RP: 0,
      capturadas_Dip_Rp: 0,
      esperadas_PyS: 0,
      capturadas_PyS: 0,
      esperadas_Reg_MR: 0,
      capturadas_Reg_MR: 0,
      esperadas_Reg_RP: 0,
      capturadas_Reg_RP: 0,
    },
    avanceEstatal: {
      esperadas_Dip_MR: 0,
      capturadas_Dip_MR: 0,
      esperadas_Dip_RP: 0,
      capturadas_Dip_Rp: 0,
      esperadas_PyS: 0,
      capturadas_PyS: 0,
      esperadas_Reg_MR: 0,
      capturadas_Reg_MR: 0,
      esperadas_Reg_RP: 0,
      capturadas_Reg_RP: 0,
      esperadas_VA: 0,
      capturadas_VA: 0,
    },
    documentoExcel: null,
  }),
  actions: {
    initAvance() {
      this.avance.capturadas_Dip_MR = 0;
      this.avance.capturadas_Dip_RP = 0;
      this.avance.capturadas_Pys = 0;
      this.avance.capturadas_Reg_MR = 0;
      this.avance.capturadas_Reg_Rp = 0;
      this.avance.capturadas_Va = 0;
      this.avance.casillas = 0;
      this.avance.casillas_RP = 0;
      this.avance.voto_Anticipado = 0;
      this.avance.general_Diputaciones = [];
      this.avance.general_Diputaciones_RP = [];
      this.avance.general_PyS = [];
      this.avance.general_Regidurias = [];
      this.avance.general_Regidurias_RP = [];
      this.avance.municipios = [];
    },

    initAvanceCME() {
      this.avanceCME.esperadas_Dip_MR = 0;
      this.avanceCME.capturadas_Dip_MR = 0;
      this.avanceCME.esperadas_Dip_RP = 0;
      this.avanceCME.capturadas_Dip_Rp = 0;
      this.avanceCME.esperadas_PyS = 0;
      this.avanceCME.capturadas_PyS = 0;
      this.avanceCME.esperadas_Reg_MR = 0;
      this.avanceCME.capturadas_Reg_MR = 0;
      this.avanceCME.esperadas_Reg_RP = 0;
      this.avanceCME.capturadas_Reg_RP = 0;
    },

    initAvanceEstatal() {
      this.avanceEstatal.esperadas_Dip_MR = 0;
      this.avanceEstatal.capturadas_Dip_MR = 0;
      this.avanceEstatal.esperadas_Dip_RP = 0;
      this.avanceEstatal.capturadas_Dip_Rp = 0;
      this.avanceEstatal.esperadas_PyS = 0;
      this.avanceEstatal.capturadas_PyS = 0;
      this.avanceEstatal.esperadas_Reg_MR = 0;
      this.avanceEstatal.capturadas_Reg_MR = 0;
      this.avanceEstatal.esperadas_Reg_RP = 0;
      this.avanceEstatal.capturadas_Reg_RP = 0;
    },

    //----------------------------------------------------------------------
    async loadAvance() {
      try {
        const resp = await api.get("/Dashboard/Avance");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.avance.capturadas_Dip_MR =
              (data.capturadas_Dip_MR * 100) / data.casillas;
            this.avance.capturadas_Dip_RP =
              data.casillas_RP == 0
                ? 0
                : (data.capturadas_Dip_RP * 100) / data.casillas_RP;
            this.avance.capturadas_Pys =
              (data.capturadas_Pys * 100) / data.casillas;
            this.avance.capturadas_Reg_MR =
              (data.capturadas_Reg_MR * 100) / data.casillas;
            this.avance.capturadas_Reg_Rp =
              data.casillas_RP == 0
                ? 0
                : (data.capturadas_Reg_Rp * 100) / data.casillas_RP;
            this.avance.capturadas_Va =
              data.voto_Anticipado == 0
                ? 0
                : (data.capturadas_Va * 100) / data.voto_Anticipado;

            this.avance.general_Diputaciones = data.general_Diputaciones;
            this.avance.general_Diputaciones_RP = data.general_Diputaciones_RP;
            this.avance.general_PyS = data.general_PyS;
            this.avance.general_Regidurias = data.general_Regidurias;
            this.avance.general_Regidurias_RP = data.general_Regidurias_RP;
            if (data.municipios.length > 0) {
              let filtro = [];
              if (
                encryptStorage.decrypt("oficina_Letra") == "CME central IEEN"
              ) {
                filtro = data.municipios;
              } else {
                filtro = data.municipios.filter(
                  (x) => x.id == encryptStorage.decrypt("municipio_Id")
                );
              }

              this.avance.municipios = filtro.map((element) => {
                return {
                  id: element.id,
                  estado_Id: element.estado_Id,
                  clave: element.clave,
                  nombre: element.nombre,
                  cabecera: element.cabecera,
                  fecha_Registro: element.fecha_Registro,
                  eliminado: element.eliminado,
                  estado: element.estado,
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

    //----------------------------------------------------------------------
    async loadAvanceMunicipioCME(id) {
      try {
        const resp = await api.get(`/Dashboard/AvanceMunicipal/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.avanceCME.esperadas_Dip_MR = data.esperadas_Dip_MR;
            this.avanceCME.capturadas_Dip_MR = data.capturadas_Dip_MR;
            this.avanceCME.esperadas_Dip_RP = data.esperadas_Dip_RP;
            this.avanceCME.capturadas_Dip_Rp = data.capturadas_Dip_Rp;
            this.avanceCME.esperadas_PyS = data.esperadas_PyS;
            this.avanceCME.capturadas_PyS = data.capturadas_PyS;
            this.avanceCME.esperadas_Reg_MR = data.esperadas_Reg_MR;
            this.avanceCME.capturadas_Reg_MR = data.capturadas_Reg_MR;
            this.avanceCME.esperadas_Reg_RP = data.esperadas_Reg_RP;
            this.avanceCME.capturadas_Reg_RP = data.capturadas_Reg_RP;
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
    async loadAvanceEstatal() {
      try {
        const resp = await api.get("/Dashboard/AvanceEstatal");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.avanceEstatal.esperadas_Dip_MR = data.esperadas_Dip_MR;
            this.avanceEstatal.capturadas_Dip_MR = data.capturadas_Dip_MR;
            this.avanceEstatal.esperadas_Dip_RP = data.esperadas_Dip_RP;
            this.avanceEstatal.capturadas_Dip_Rp = data.capturadas_Dip_Rp;
            this.avanceEstatal.esperadas_PyS = data.esperadas_PyS;
            this.avanceEstatal.capturadas_PyS = data.capturadas_PyS;
            this.avanceEstatal.esperadas_Reg_MR = data.esperadas_Reg_MR;
            this.avanceEstatal.capturadas_Reg_MR = data.capturadas_Reg_MR;
            this.avanceEstatal.esperadas_Reg_RP = data.esperadas_Reg_RP;
            this.avanceEstatal.capturadas_Reg_RP = data.capturadas_Reg_RP;
            this.avanceEstatal.esperadas_VA = data.esperadas_VA;
            this.avanceEstatal.capturadas_VA = data.capturadas_VA;
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
    //DOWNLOAD EXCEL
    async downloadExcel(eleccion) {
      try {
        this.documentoExcel = "";
        let resp = null;
        if (eleccion == "DIP") {
          resp = await api.get("/Excel/GeneraDiputaciones", {
            responseType: "blob",
          });
        } else if (eleccion == "PYS") {
          resp = await api.get("/Excel/GeneraPyS", {
            responseType: "blob",
          });
        } else {
          resp = await api.get("/Excel/GeneraRegidurias", {
            responseType: "blob",
          });
        }
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
  },
});
