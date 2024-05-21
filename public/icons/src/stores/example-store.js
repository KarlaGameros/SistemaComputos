import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useExampleStore = defineStore("useExampleStore", {
  state: () => ({
    tab: true,
    selection: null,
    modal: false,
    modalFoto: false,
    modalConsentimiento: false,
    perfil: null,
    listEntidades: [],
    listCandidatos: [],
  }),
  actions: {
    actualizarSelection(valor) {
      this.selection = valor;
    },

    actualizarTab(valor) {
      this.tab = valor;
    },

    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarModalFoto(valor) {
      this.modalFoto = valor;
    },

    actualizarModalConsentimiento(valor) {
      this.modalConsentimiento = valor;
    },

    actualizarPerfil(valor) {
      this.perfil = valor;
    },
    async loadCards() {
      this.listCandidatos = [
        {
          id: 1,
          nombre: "Nombre",
          tipo: "Diputaciones",
          partido: "Partido",
          municipio_name: "Tepic",
          progreso: 30,
          estatus: "Incompleto",
          puntuacion: 30,
          fecha_Registro: "20/10/2023",
          tipo_Eleccion: "MR",
          coalicion: "",
          cargo: "Propietario",
          distrito: 1,
          fotografia: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
          imgPartido:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PRI.png",
          coalicion: true,
          imgPartido2:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PAN.png",
          imgPartido3:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/MORENA.png",
        },
        {
          id: 2,
          nombre: "Nombre",
          tipo: "Diputaciones",
          partido: "Partido",
          municipio_name: "Tepic",
          progreso: 100,
          estatus: "Completo",
          puntuacion: 100,
          fecha_Registro: "20/10/2023",
          tipo_Eleccion: "MR",
          coalicion: "",
          cargo: "Propietario",
          distrito: 2,
          fotografia: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
          imgPartido:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PAN.png",
          coalicion: true,
          imgPartido2:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PRI.png",
          imgPartido3:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/MORENA.png",
        },
        {
          id: 3,
          nombre: "Nombre",
          tipo: "Presidencias y Sindicaturas",
          partido: "Partido",
          municipio: "Tepic",
          progreso: 80,
          estatus: "Con observaciones",
          puntuacion: 80,
          fecha_Registro: "20/10/2023",
          coalicion: "",
          cargo: "Suplente",
          fotografia: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
          imgPartido:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/MORENA.png",
          coalicion: true,
          imgPartido2:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PRI.png",
          imgPartido3:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PAN.png",
        },
        {
          id: 4,
          nombre: "Nombre",
          tipo: "Presidencias y Sindicaturas",
          partido: "Partido",
          municipio: "Tepic",
          demarcacion: 2,
          progreso: 80,
          estatus: "Incompleto",
          puntuacion: 80,
          fecha_Registro: "20/10/2023",
          tipo_Eleccion: "MR",
          coalicion: "",
          cargo: "Suplente",
          fotografia: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
          imgPartido:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PAN.png",
          coalicion: true,
          imgPartido2:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PRI.png",
          imgPartido3:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/MORENA.png",
        },
        {
          id: 5,
          nombre: "Nombre",
          tipo: "Regidurías",
          partido: "Partido",
          municipio: "Tepic",
          demarcacion: 3,
          progreso: 80,
          estatus: "Incompleto",
          puntuacion: 80,
          fecha_Registro: "20/10/2023",
          tipo_Eleccion: "MR",
          coalicion: "",
          cargo: "Propietario",
          fotografia: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
          imgPartido:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PAN.png",
          coalicion: true,
          imgPartido2:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PRI.png",
          imgPartido3:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/MORENA.png",
        },
        {
          id: 6,
          nombre: "Nombre",
          tipo: "Regidurías",
          partido: "Partido",
          municipio: "Tepic",
          demarcacion: 2,
          progreso: 80,
          estatus: "Incompleto",
          puntuacion: 80,
          fecha_Registro: "20/10/2023",
          tipo_Eleccion: "MR",
          coalicion: "",
          cargo: "Suplente sindico",
          fotografia: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
          imgPartido:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PAN.png",
          coalicion: true,
          imgPartido2:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/PRI.png",
          imgPartido3:
            "https://www.prepnayarit2021.com/storage/actas_digitales/midaec/logos_partidos/MORENA.png",
        },
      ];
    },
  },
});
