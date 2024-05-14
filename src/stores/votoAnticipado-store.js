import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useVotoAnticipadoStore = defineStore("useVotoAnticipadoStore", {
  state: () => ({
    loading: false,
    list_va_eleccion: [],
    resultados: {
      encabezado: {
        grupo_Trabajo: null,
        id: null,
        punto_Recuento: null,
        total_Sistema: null,
        total_Votos: null,
        total_Votos_Candidatos_No_Registrados: null,
        total_Votos_Nulos: null,
        votos_Reservados: null,
      },
      partidos: [],
      coaliciones: [],
      independientes: [],
      voto_Anticipado_Id: null,
    },
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
          const { success, data } = resp.data;
          if (success) {
            this.resultados.voto_Anticipado_Id = data.voto_Anticipado_Id;
            this.resultados.encabezado.id = data.encabezado.id;
            this.resultados.encabezado.grupo_Trabajo =
              data.encabezado.grupo_Trabajo;
            this.resultados.encabezado.punto_Recuento =
              data.encabezado.punto_Recuento;
            this.resultados.encabezado.total_Sistema =
              data.encabezado.total_Sistema;
            this.resultados.encabezado.total_Votos =
              data.encabezado.total_Votos;
            this.resultados.encabezado.total_Votos_Candidatos_No_Registrados =
              data.encabezado.total_Votos_Candidatos_No_Registrados;
            this.resultados.encabezado.total_Votos_Nulos =
              data.encabezado.total_Votos_Nulos;
            this.resultados.encabezado.total_Votos_Nulos =
              data.encabezado.total_Votos_Nulos;

            if (data.partidos.length > 0) {
              this.resultados.partidos = data.partidos.map((element) => {
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
              this.resultados.coaliciones = data.coaliciones.map((element) => {
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
          }
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
