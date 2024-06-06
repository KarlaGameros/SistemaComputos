<template>
  <q-table
    :rows-per-page-options="[5, 10, 15, 20, 25, 30, 50]"
    :loading="loading"
    :visible-columns="visible_columns"
    :rows="
      rp == true
        ? tipo == 'cotejo'
          ? pendientes_cotejo_rp_filtro
          : pendientes_recuento_rp_filtro
        : tipo == 'cotejo'
        ? pendientes_cotejo_filtro
        : pendientes_recuento_filtro
    "
    :columns="columns"
    :filter="filter"
    row-key="name"
    v-model:pagination="pagination"
    color="pink"
  >
    <template v-slot:header-cell="props">
      <q-th :props="props">
        <q-input
          v-if="props.col.name != 'total_Causales' && props.col.name != 'id'"
          @keyup.enter.prevent="
            filteredRows(props.col.name, columnFilters[props.col.name])
          "
          filled
          dense
          debounce="300"
          v-model="columnFilters[props.col.name]"
          placeholder="Buscar"
        />
        {{ props.col.label }}
      </q-th>
    </template>
    <template v-slot:top-right>
      <q-input
        borderless
        dense
        debounce="300"
        v-model="filter"
        placeholder="Buscar"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.name === 'id'">
            <q-btn
              v-if="modulo == null ? false : modulo.leer && tipo == 'recuento'"
              flat
              round
              color="green"
              icon="help"
              @click="modalCausales(props.row, true)"
            >
              <q-tooltip>Ver causales</q-tooltip>
            </q-btn>
            <q-btn
              v-if="modulo == null ? false : modulo.registrar"
              flat
              round
              color="pink"
              icon="edit_square"
              @click="tipoComputoAlert(props.row)"
            >
              <q-tooltip>Capturar resultados</q-tooltip>
            </q-btn>
          </div>
          <label v-else>{{ col.value }}</label>
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <ModalComp
    :rp="props.rp"
    :tipo_id="props.tipo_id"
    :tipo_siglas="props.tipo_siglas"
  />
</template>

<script setup>
import { ref, defineProps, watch, onBeforeMount } from "vue";
import { useCapturaStore } from "src/stores/captura-store";
import { useRerservasStore } from "src/stores/reservas-store";
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth-store";
import { useQuasar, QSpinnerCube } from "quasar";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import ModalComp from "../components/ModalComp.vue";
import Swal from "sweetalert2";

//----------------------------------------------------------

const $q = useQuasar();
const capturaStore = useCapturaStore();
const reservasStore = useRerservasStore();
const authStore = useAuthStore();
const configuracionStore = useConfiguracionStore();
const { modulo } = storeToRefs(authStore);
const {
  pendientes_cotejo,
  pendientes_cotejo_filtro,
  pendientes_cotejo_rp,
  pendientes_cotejo_rp_filtro,
  pendientes_recuento,
  pendientes_recuento_filtro,
  pendientes_recuento_rp,
  pendientes_recuento_rp_filtro,
  loading,
  encabezado,
  loadFiltros,
} = storeToRefs(capturaStore);
const { list_Municipios, list_Distritos_By_Municipio } =
  storeToRefs(configuracionStore);
const casilla_Id = ref(null);
const tipo_Computo = ref(null);
const grupo_Trabajo = ref(null);
const punto_Recuento = ref(null);
const municipio_Id = ref(null);
const distrito_Id = ref(null);
const visible_columns = ref([]);
const props = defineProps({
  tipo_siglas: { type: String, required: true },
  tipo_id: { type: Number, required: true },
  tipo: { type: String, required: true },
  rp: { type: Boolean, required: true },
});
const siglas = "SC-CAP-RES";
const columnFilters = ref({});

//----------------------------------------------------------

const columns = [
  {
    name: "municipio",
    align: "center",
    label: "Municipio",
    field: "municipio",
  },
  {
    name: "demarcacion",
    align: "center",
    label: "Demarcación",
    field: "demarcacion",
  },
  {
    name: "distrito",
    align: "center",
    label: "Distrito",
    field: "distrito",
  },
  {
    name: "seccion",
    align: "center",
    label: "Sección",
    field: "seccion",
  },
  {
    name: "casilla",
    align: "center",
    label: "Casilla",
    field: "casilla",
  },
  {
    name: "casilla_Id",
    align: "center",
    label: "casilla_Id",
    field: "casilla_Id",
  },
  {
    name: "total_Causales",
    align: "center",
    label: "No. Causales",
    field: "total_Causales",
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
  },
];
const filter = ref("");
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
});

//----------------------------------------------------------

onBeforeMount(() => {
  evalua_columnas();
  leerPermisos();
});

//----------------------------------------------------------

watch(loadFiltros, (val) => {
  if (val == true) {
    filter.value = "";
    columnFilters.value = {};
  }
});

watch(props, (val) => {
  if (val != null) {
    columnFilters.value = {};
    pagination.value = {
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
    };
    evalua_columnas();
  }
});

watch(municipio_Id, async (val) => {
  if (val != null) {
    if (props.tipo_siglas == "DIP") {
      distrito_Id.value = null;
      await configuracionStore.loadDistritosByMunicipio(val.value);
    }
  }
});

//----------------------------------------------------------
const filteredRows = () => {
  loading.value = true;
  if (props.rp == false && props.tipo == "cotejo") {
    pendientes_cotejo_filtro.value = pendientes_cotejo.value.filter((item) => {
      let cumple = true;
      if (columnFilters.value["casilla"] !== undefined) {
        if (columnFilters.value["casilla"] == "") {
          cumple = cumple && item.casilla === item.casilla;
        } else {
          var chars = {
            á: "a",
            é: "e",
            í: "i",
            ó: "o",
            ú: "u",
            à: "a",
            è: "e",
            ì: "i",
            ò: "o",
            ù: "u",
            ñ: "n",
            Á: "A",
            É: "E",
            Í: "I",
            Ó: "O",
            Ú: "U",
            À: "A",
            È: "E",
            Ì: "I",
            Ò: "O",
            Ù: "U",
            Ñ: "N",
          };
          var expr = /[áàéèíìóòúùñ]/gi;
          var res = item.casilla.toUpperCase().replace(expr, function (e) {
            return chars[e];
          });
          cumple =
            cumple &&
            res.includes(columnFilters.value["casilla"].toUpperCase());
        }
      }
      if (columnFilters.value["municipio"] !== undefined) {
        if (columnFilters.value["municipio"] == "") {
          cumple = cumple && item.municipio === item.municipio;
        } else {
          let municipio = item.municipio.toUpperCase();
          cumple =
            cumple &&
            municipio.includes(columnFilters.value["municipio"].toUpperCase());
        }
      }
      if (columnFilters.value["distrito"] !== undefined) {
        if (columnFilters.value["distrito"] == "") {
          cumple = cumple && item.distrito === item.distrito;
        } else {
          cumple =
            cumple &&
            item.distrito === parseInt(columnFilters.value["distrito"]);
        }
      }
      if (columnFilters.value["seccion"] !== undefined) {
        if (columnFilters.value["seccion"] == "") {
          cumple = cumple && item.seccion === item.seccion;
        } else {
          cumple =
            cumple && item.seccion.includes(columnFilters.value["seccion"]);
        }
      }

      if (columnFilters.value["demarcacion"] !== undefined) {
        if (columnFilters.value["demarcacion"] == "") {
          cumple = cumple && item.demarcacion === item.demarcacion;
        } else {
          var chars = {
            á: "a",
            é: "e",
            í: "i",
            ó: "o",
            ú: "u",
            à: "a",
            è: "e",
            ì: "i",
            ò: "o",
            ù: "u",
            ñ: "n",
            Á: "A",
            É: "E",
            Í: "I",
            Ó: "O",
            Ú: "U",
            À: "A",
            È: "E",
            Ì: "I",
            Ò: "O",
            Ù: "U",
            Ñ: "N",
          };
          var expr = /[áàéèíìóòúùñ]/gi;
          var res = item.demarcacion.toUpperCase().replace(expr, function (e) {
            return chars[e];
          });
          cumple =
            cumple &&
            res.includes(columnFilters.value["demarcacion"].toUpperCase());
        }
      }
      return cumple;
    });
  } else if (props.rp == false && props.tipo != "cotejo") {
    pendientes_recuento_filtro.value = pendientes_recuento.value.filter(
      (item) => {
        let cumple = true;
        if (columnFilters.value["casilla"] !== undefined) {
          if (columnFilters.value["casilla"] == "") {
            cumple = cumple && item.casilla === item.casilla;
          } else {
            var chars = {
              á: "a",
              é: "e",
              í: "i",
              ó: "o",
              ú: "u",
              à: "a",
              è: "e",
              ì: "i",
              ò: "o",
              ù: "u",
              ñ: "n",
              Á: "A",
              É: "E",
              Í: "I",
              Ó: "O",
              Ú: "U",
              À: "A",
              È: "E",
              Ì: "I",
              Ò: "O",
              Ù: "U",
              Ñ: "N",
            };
            var expr = /[áàéèíìóòúùñ]/gi;
            var res = item.casilla.toUpperCase().replace(expr, function (e) {
              return chars[e];
            });
            cumple =
              cumple &&
              res.includes(columnFilters.value["casilla"].toUpperCase());
          }
        }
        if (columnFilters.value["municipio"] !== undefined) {
          if (columnFilters.value["municipio"] == "") {
            cumple = cumple && item.municipio === item.municipio;
          } else {
            let municipio = item.municipio.toUpperCase();
            cumple =
              cumple &&
              municipio.includes(
                columnFilters.value["municipio"].toUpperCase()
              );
          }
        }
        if (columnFilters.value["distrito"] !== undefined) {
          if (columnFilters.value["distrito"] == "") {
            cumple = cumple && item.distrito === item.distrito;
          } else {
            cumple =
              cumple &&
              item.distrito === parseInt(columnFilters.value["distrito"]);
          }
        }
        if (columnFilters.value["seccion"] !== undefined) {
          if (columnFilters.value["seccion"] == "") {
            cumple = cumple && item.seccion === item.seccion;
          } else {
            cumple =
              cumple && item.seccion.includes(columnFilters.value["seccion"]);
          }
        }
        if (columnFilters.value["demarcacion"] !== undefined) {
          if (columnFilters.value["demarcacion"] == "") {
            cumple = cumple && item.demarcacion === item.demarcacion;
          } else {
            var chars = {
              á: "a",
              é: "e",
              í: "i",
              ó: "o",
              ú: "u",
              à: "a",
              è: "e",
              ì: "i",
              ò: "o",
              ù: "u",
              ñ: "n",
              Á: "A",
              É: "E",
              Í: "I",
              Ó: "O",
              Ú: "U",
              À: "A",
              È: "E",
              Ì: "I",
              Ò: "O",
              Ù: "U",
              Ñ: "N",
            };
            var expr = /[áàéèíìóòúùñ]/gi;
            var res = item.demarcacion
              .toUpperCase()
              .replace(expr, function (e) {
                return chars[e];
              });
            cumple =
              cumple &&
              res.includes(columnFilters.value["demarcacion"].toUpperCase());
          }
        }
        return cumple;
      }
    );
  } else if (props.rp == true && props.tipo == "cotejo") {
    pendientes_cotejo_rp_filtro.value = pendientes_cotejo_rp.value.filter(
      (item) => {
        let cumple = true;
        if (columnFilters.value["casilla"] !== undefined) {
          if (columnFilters.value["casilla"] == "") {
            cumple = cumple && item.casilla === item.casilla;
          } else {
            var chars = {
              á: "a",
              é: "e",
              í: "i",
              ó: "o",
              ú: "u",
              à: "a",
              è: "e",
              ì: "i",
              ò: "o",
              ù: "u",
              ñ: "n",
              Á: "A",
              É: "E",
              Í: "I",
              Ó: "O",
              Ú: "U",
              À: "A",
              È: "E",
              Ì: "I",
              Ò: "O",
              Ù: "U",
              Ñ: "N",
            };
            var expr = /[áàéèíìóòúùñ]/gi;
            var res = item.casilla.toUpperCase().replace(expr, function (e) {
              return chars[e];
            });
            cumple =
              cumple &&
              res.includes(columnFilters.value["casilla"].toUpperCase());
          }
        }
        if (columnFilters.value["municipio"] !== undefined) {
          if (columnFilters.value["municipio"] == "") {
            cumple = cumple && item.municipio === item.municipio;
          } else {
            let municipio = item.municipio.toUpperCase();
            cumple =
              cumple &&
              municipio.includes(
                columnFilters.value["municipio"].toUpperCase()
              );
          }
        }
        if (columnFilters.value["distrito"] !== undefined) {
          if (columnFilters.value["distrito"] == "") {
            cumple = cumple && item.distrito === item.distrito;
          } else {
            cumple =
              cumple &&
              item.distrito === parseInt(columnFilters.value["distrito"]);
          }
        }
        if (columnFilters.value["seccion"] !== undefined) {
          if (columnFilters.value["seccion"] == "") {
            cumple = cumple && item.seccion === item.seccion;
          } else {
            cumple =
              cumple && item.seccion.includes(columnFilters.value["seccion"]);
          }
        }
        if (columnFilters.value["demarcacion"] !== undefined) {
          if (columnFilters.value["demarcacion"] == "") {
            cumple = cumple && item.demarcacion === item.demarcacion;
          } else {
            var chars = {
              á: "a",
              é: "e",
              í: "i",
              ó: "o",
              ú: "u",
              à: "a",
              è: "e",
              ì: "i",
              ò: "o",
              ù: "u",
              ñ: "n",
              Á: "A",
              É: "E",
              Í: "I",
              Ó: "O",
              Ú: "U",
              À: "A",
              È: "E",
              Ì: "I",
              Ò: "O",
              Ù: "U",
              Ñ: "N",
            };
            var expr = /[áàéèíìóòúùñ]/gi;
            var res = item.demarcacion
              .toUpperCase()
              .replace(expr, function (e) {
                return chars[e];
              });
            cumple =
              cumple &&
              res.includes(columnFilters.value["demarcacion"].toUpperCase());
          }
        }
        return cumple;
      }
    );
  } else if (props.rp == true && props.tipo != "cotejo") {
    pendientes_recuento_rp_filtro.value = pendientes_recuento_rp.value.filter(
      (item) => {
        let cumple = true;
        if (columnFilters.value["casilla"] !== undefined) {
          if (columnFilters.value["casilla"] == "") {
            cumple = cumple && item.casilla === item.casilla;
          } else {
            var chars = {
              á: "a",
              é: "e",
              í: "i",
              ó: "o",
              ú: "u",
              à: "a",
              è: "e",
              ì: "i",
              ò: "o",
              ù: "u",
              ñ: "n",
              Á: "A",
              É: "E",
              Í: "I",
              Ó: "O",
              Ú: "U",
              À: "A",
              È: "E",
              Ì: "I",
              Ò: "O",
              Ù: "U",
              Ñ: "N",
            };
            var expr = /[áàéèíìóòúùñ]/gi;
            var res = item.casilla.toUpperCase().replace(expr, function (e) {
              return chars[e];
            });
            cumple =
              cumple &&
              res.includes(columnFilters.value["casilla"].toUpperCase());
          }
        }
        if (columnFilters.value["municipio"] !== undefined) {
          if (columnFilters.value["municipio"] == "") {
            cumple = cumple && item.municipio === item.municipio;
          } else {
            let municipio = item.municipio.toUpperCase();
            cumple =
              cumple &&
              municipio.includes(
                columnFilters.value["municipio"].toUpperCase()
              );
          }
        }
        if (columnFilters.value["distrito"] !== undefined) {
          if (columnFilters.value["distrito"] == "") {
            cumple = cumple && item.distrito === item.distrito;
          } else {
            cumple =
              cumple &&
              item.distrito === parseInt(columnFilters.value["distrito"]);
          }
        }
        if (columnFilters.value["seccion"] !== undefined) {
          if (columnFilters.value["seccion"] == "") {
            cumple = cumple && item.seccion === item.seccion;
          } else {
            cumple =
              cumple && item.seccion.includes(columnFilters.value["seccion"]);
          }
        }
        if (columnFilters.value["demarcacion"] !== undefined) {
          if (columnFilters.value["demarcacion"] == "") {
            cumple = cumple && item.demarcacion === item.demarcacion;
          } else {
            var chars = {
              á: "a",
              é: "e",
              í: "i",
              ó: "o",
              ú: "u",
              à: "a",
              è: "e",
              ì: "i",
              ò: "o",
              ù: "u",
              ñ: "n",
              Á: "A",
              É: "E",
              Í: "I",
              Ó: "O",
              Ú: "U",
              À: "A",
              È: "E",
              Ì: "I",
              Ò: "O",
              Ù: "U",
              Ñ: "N",
            };
            var expr = /[áàéèíìóòúùñ]/gi;
            var res = item.demarcacion
              .toUpperCase()
              .replace(expr, function (e) {
                return chars[e];
              });
            cumple =
              cumple &&
              res.includes(columnFilters.value["demarcacion"].toUpperCase());
          }
        }
        return cumple;
      }
    );
  }
  loading.value = false;
};

const modalCausales = async (row, valor) => {
  await capturaStore.load_causales_by_casilla(props.tipo_id, row.casilla_Id);
  capturaStore.actualizarModalCausales(valor);
};

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const evalua_columnas = () => {
  loading.value = true;
  filter.value = "";
  switch (props.tipo_siglas) {
    case "DIP":
      visible_columns.value = [
        "municipio",
        "distrito",
        "seccion",
        "casilla",
        "total_Causales",
        "id",
      ];
      break;
    case "PYS":
      visible_columns.value = [
        "municipio",
        "seccion",
        "casilla",
        "total_Causales",
        "id",
      ];
      break;
    case "REG":
      visible_columns.value = [
        "municipio",
        "demarcacion",
        "seccion",
        "casilla",
        "total_Causales",
        "id",
      ];
      break;
  }
  loading.value = false;
};

const limpiar = () => {
  casilla_Id.value = null;
  tipo_Computo.value = null;
  grupo_Trabajo.value = null;
  punto_Recuento.value = null;
  municipio_Id.value = null;
  distrito_Id.value = null;
};

//Cotejo 1
//Recueno parcial 2
const tipoComputoAlert = (row) => {
  limpiar();
  capturaStore.intiEncabezado();
  encabezado.value.rp = props.rp;
  encabezado.value.distrito = row.distrito;
  encabezado.value.municipio = row.municipio;
  encabezado.value.demarcacion = row.demarcacion;
  encabezado.value.seccion = row.seccion;
  encabezado.value.casilla = row.casilla;
  encabezado.value.eleccion =
    props.tipo_siglas == "DIP"
      ? "Diputaciones"
      : props.tipo_siglas == "PYS"
      ? "Presidencias y Sindicaturas"
      : "Regidurías";
  casilla_Id.value = row.casilla_Id;
  Swal.fire({
    title: "Tipo de cómputo",
    input: "select",
    inputLabel:
      props.tipo == "cotejo" ? "Se sugiere cotejo" : "Se sugiere recuento",
    inputOptions: {
      cotejo: "Cotejo",
      recuento_Parcial: "Recuento parcial",
      recuento_Total: "Recuento total",
    },
    inputValue: props.tipo == "cotejo" ? "cotejo" : "recuento_Parcial",
    inputPlaceholder: "Selecciona una opción",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente &nbsp;<i class="fa fa-arrow-right"></i>`,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value != "") {
          tipo_Computo.value =
            value == "cotejo" ? 1 : value == "recuento_Parcial" ? 2 : 3;
          resolve();
        } else {
          resolve("Es necesario seleccionar una opción.");
        }
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (tipo_Computo.value == 1) {
        resumenCotejo();
      } else {
        recuentoAlert(row);
      }
    }
  });
};

const recuentoAlert = async (row) => {
  Swal.fire({
    title: "¿Se han reservado votos en esta casilla para esta elección?",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si",
  }).then((result) => {
    if (!result.isConfirmed) {
      grupoTrabajoAlert();
    } else {
      reservar(row.id);
    }
  });
};

const reservar = async (id) => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "blue-grey",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento por favor...",
    messageColor: "black",
  });
  let resp = null;
  if (props.rp == true) {
    resp = await reservasStore.reservarRp(id);
  } else {
    resp = await reservasStore.reservarMr(id);
  }
  if (resp.success == true) {
    $q.loading.hide();
    Swal.fire({
      icon: "success",
      title: resp.data,
      showConfirmButton: false,
      timer: 1500,
    });
    if (props.rp == true) {
      await capturaStore.load_cotejo_rp(props.tipo_id);
      await capturaStore.load_recuento_rp(props.tipo_id);
    } else {
      await capturaStore.load_cotejo(props.tipo_id);
      await capturaStore.load_recuento(props.tipo_id);
    }
  } else {
    $q.loading.hide();
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
    });
  }
};

const grupoTrabajoAlert = () => {
  Swal.fire({
    title: "Grupo de trabajo",
    input: "number",
    inputLabel: "Ingresa el número de grupo de trabajo",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente &nbsp;<i class="fa fa-arrow-right"></i> `,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value != "") {
          grupo_Trabajo.value = value;
          resolve();
        } else {
          resolve("Campo vacio");
        }
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      puntoRecuentoAlert();
    }
  });
};

const puntoRecuentoAlert = () => {
  Swal.fire({
    title: "Punto de recuento",
    input: "number",
    inputLabel: "Ingresa el número de punto de recuento",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente &nbsp;<i class="fa fa-arrow-right"></i>`,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value != "") {
          punto_Recuento.value = value;
          resolve();
        } else {
          resolve("Campo vacio");
        }
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      resumen();
    }
  });
};

const resumen = () => {
  Swal.fire({
    title: "Resumen",
    html: `Tipo de cómputo: <b>${
      tipo_Computo.value == 1
        ? "Cotejo"
        : tipo_Computo.value == 2
        ? "Recuento parcial"
        : "Recuento total"
    }</b>
        <br />
        Grupo de trabajo: <b>${grupo_Trabajo.value}</b>
        <br />
        Punto de recuento: <b>${punto_Recuento.value}</b>`,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Iniciar captura &nbsp;<i class="fa fa-arrow-right"></i>`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      $q.loading.show({
        spinner: QSpinnerCube,
        spinnerColor: "blue-grey",
        spinnerSize: 140,
        backgroundColor: "purple-2",
        message: "Espere un momento por favor...",
        messageColor: "black",
      });
      if (props.rp == true) {
        await capturaStore.incicializar_resultados_rp(
          props.tipo_id,
          casilla_Id.value,
          tipo_Computo.value,
          grupo_Trabajo.value,
          punto_Recuento.value,
          0
        );
      } else {
        await capturaStore.incicializar_resultados(
          props.tipo_id,
          casilla_Id.value,
          tipo_Computo.value,
          grupo_Trabajo.value,
          punto_Recuento.value,
          0
        );
      }
      capturaStore.actualizarModal(true);
      $q.loading.hide();
    } else if (result.isDenied) {
      Swal.fire("Los datos capturados no se guardarán", "", "info");
    }
  });
};

const resumenCotejo = () => {
  Swal.fire({
    title: "Resumen",
    html: `Tipo de cómputo: <b>${
      tipo_Computo.value == 1
        ? "Cotejo"
        : tipo_Computo.value == 2
        ? "Recuento parcial"
        : "Recuento total"
    }</b>`,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Iniciar captura &nbsp;<i class="fa fa-arrow-right"></i>`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      $q.loading.show({
        spinner: QSpinnerCube,
        spinnerColor: "blue-grey",
        spinnerSize: 140,
        backgroundColor: "purple-2",
        message: "Espere un momento por favor...",
        messageColor: "black",
      });
      if (props.rp == true) {
        await capturaStore.incicializar_resultados_rp(
          props.tipo_id,
          casilla_Id.value,
          tipo_Computo.value,
          0,
          0,
          0
        );
      } else {
        await capturaStore.incicializar_resultados(
          props.tipo_id,
          casilla_Id.value,
          tipo_Computo.value,
          0,
          0,
          0
        );
      }
      capturaStore.actualizarModal(true);
      $q.loading.hide();
    }
  });
};
</script>
