import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useVotoAnticipadoStore = defineStore("useVotoAnticipadoStore", {
  state: () => ({
    loading: false,
    list_va_eleccion: [],
  }),
  actions: {
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
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
