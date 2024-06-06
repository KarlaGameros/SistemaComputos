<template>
  <template v-if="loading">
    <div class="q-pa-md">
      <div class="absolute-center">
        <q-spinner-cube color="blue-grey" size="10.5em" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="q-pa-lg">
      <q-banner
        inline-actions
        :class="$q.dark.isActive ? 'text-justify' : 'text-justify bg-white'"
        style="border-radius: 20px"
      >
        <q-btn
          v-for="tipo in list_Tipo_Elecciones"
          :key="tipo"
          @click="set_tipo_eleccion(tipo)"
          :flat="tipo.siglas != eleccion"
          rounded
          color="blue-grey"
          icon="how_to_vote"
          :label="tipo.nombre"
        />
      </q-banner>
      <div class="q-pt-md">
        <q-card>
          <q-tabs
            v-model="tab"
            class="text-grey"
            active-color="blue-grey"
            indicator-color="blue-grey"
            align="justify"
            :breakpoint="0"
          >
            <q-tab name="MR" label="Mayoría relativa" />
            <q-tab
              v-if="eleccion == 'DIP' || eleccion == 'REG'"
              name="RP"
              label="Representación proporcional"
            />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="MR">
              <q-table
                :loading="loading"
                :rows="list_por_casilla_filtro"
                :columns="columns"
                :filter="filter"
                :visible-columns="visible_columns"
                row-key="name"
                v-model:pagination="pagination"
                color="pink"
                :rows-per-page-options="[5, 10, 15, 20, 25, 30, 50]"
              >
                <template v-slot:header-cell="props">
                  <q-th :props="props">
                    <q-input
                      v-if="
                        props.col.name != 'id' &&
                        props.col.name != 'total_Sistema' &&
                        props.col.name != 'total_Capturado' &&
                        props.col.name != 'boletas' &&
                        props.col.name != 'usuario'
                      "
                      @keydown.enter.prevent="
                        filteredRows(
                          props.col.name,
                          columnFilters[props.col.name]
                        )
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
                  <q-tr
                    :props="props"
                    :class="
                      props.row.total_Sistema != props.row.total_Capturado ||
                      props.row.total_Capturado > props.row.boletas ||
                      (props.row.total_Sistema == 0 &&
                        props.row.total_Capturado == 0)
                        ? 'bg-red text-white'
                        : ''
                    "
                  >
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      <div v-if="col.name === 'id'">
                        <q-btn
                          v-if="modulo == null ? false : modulo.leer"
                          flat
                          round
                          :color="
                            props.row.total_Sistema !=
                              props.row.total_Capturado ||
                            props.row.total_Capturado > props.row.boletas
                              ? 'white'
                              : 'pink'
                          "
                          icon="search"
                          @click="verResultados(props.row, 'MR')"
                        >
                          <q-tooltip>Ver resultados</q-tooltip>
                        </q-btn>
                      </div>

                      <label v-else>{{ col.value }}</label>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-tab-panel>
            <q-tab-panel name="RP">
              <q-table
                :loading="loading"
                :rows="list_por_casilla_rp_filtro"
                :columns="columns"
                :filter="filter"
                row-key="name"
                :visible-columns="visible_columns"
                v-model:pagination="pagination"
                color="pink"
                :rows-per-page-options="[5, 10, 15, 20, 25, 30, 50]"
              >
                <template v-slot:header-cell="props">
                  <q-th :props="props">
                    <q-input
                      v-if="
                        props.col.name != 'id' &&
                        props.col.name != 'total_Sistema' &&
                        props.col.name != 'total_Capturado' &&
                        props.col.name != 'boletas' &&
                        props.col.name != 'usuario'
                      "
                      @keydown.enter.prevent="
                        filteredRows(
                          props.col.name,
                          columnFilters[props.col.name]
                        )
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
                  <q-tr
                    :props="props"
                    :class="
                      props.row.total_Sistema != props.row.total_Capturado ||
                      props.row.total_Capturado > props.row.boletas ||
                      (props.row.total_Sistema == 0 &&
                        props.row.total_Capturado == 0)
                        ? 'bg-red text-white'
                        : ''
                    "
                  >
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      <div v-if="col.name === 'id'">
                        <q-btn
                          v-if="modulo == null ? false : modulo.leer"
                          flat
                          round
                          :color="
                            props.row.total_Sistema !=
                              props.row.total_Capturado ||
                            props.row.total_Capturado > props.row.boletas
                              ? 'white'
                              : 'pink'
                          "
                          icon="search"
                          @click="verResultados(props.row, 'RP')"
                        >
                          <q-tooltip>Ver resultados</q-tooltip>
                        </q-btn>
                      </div>
                      <label v-else>{{ col.value }}</label>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <ModalComp
      :eleccion_Id="eleccion_Id"
      :rp="tab == 'RP' ? true : false"
      :eleccion="eleccion"
    />
  </template>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth-store";
import { useCasillaStore } from "src/stores/casilla-store";
import { useQuasar, QSpinnerCube } from "quasar";
import ModalComp from "../components/ModalComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const casillaStore = useCasillaStore();
const configuracionStore = useConfiguracionStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const {
  list_por_casilla,
  list_por_casilla_filtro,
  list_por_casilla_rp,
  list_por_casilla_rp_filtro,
} = storeToRefs(casillaStore);
const { list_Tipo_Elecciones } = storeToRefs(configuracionStore);
const eleccion = ref("DIP");
const eleccion_Id = ref(null);
const tab = ref("MR");
const loading = ref(false);
const siglas = "SC-REG-CAS";
const visible_columns = ref([
  "usuario",
  "municipio",
  "distrito",
  "seccion",
  "tipo",
  "total_Sistema",
  "total_Capturado",
  "id",
]);
const columnFilters = ref({});

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

watch(tab, (val) => {
  if (val != null) {
    columnFilters.value = {};
    pagination.value = {
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
    };
  }
});

//-----------------------------------------------------------

const filteredRows = () => {
  loading.value = true;
  if (tab.value == "MR") {
    list_por_casilla_filtro.value = list_por_casilla.value.filter((item) => {
      let cumple = true;
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
          cumple = cumple && item.distrito === columnFilters.value["distrito"];
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
      if (columnFilters.value["tipo"] !== undefined) {
        if (columnFilters.value["tipo"] == "") {
          cumple = cumple && item.tipo === item.tipo;
        } else {
          let tipo = item.tipo.toUpperCase();
          cumple =
            cumple && tipo.includes(columnFilters.value["tipo"].toUpperCase());
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
  } else if (tab.value == "RP") {
    list_por_casilla_rp_filtro.value = list_por_casilla_rp.value.filter(
      (item) => {
        let cumple = true;

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
              cumple && item.distrito === columnFilters.value["distrito"];
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
        if (columnFilters.value["tipo"] !== undefined) {
          if (columnFilters.value["tipo"] == " ") {
            cumple = cumple && item.tipo === item.tipo;
          } else {
            let tipo = item.tipo.toUpperCase();
            cumple =
              cumple &&
              tipo.includes(columnFilters.value["tipo"].toUpperCase());
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

const evalua_columnas = () => {
  switch (eleccion.value) {
    case "DIP":
      visible_columns.value = [
        "usuario",
        "municipio",
        "distrito",
        "seccion",
        "casilla",
        "tipo",
        "total_Sistema",
        "total_Capturado",
        "boletas",
        "id",
      ];
      break;
    case "PYS":
      visible_columns.value = [
        "usuario",
        "municipio",
        "seccion",
        "casilla",
        "tipo",
        "total_Sistema",
        "total_Capturado",
        "boletas",
        "id",
      ];
      break;
    case "REG":
      visible_columns.value = [
        "usuario",
        "municipio",
        "demarcacion",
        "seccion",
        "casilla",
        "tipo",
        "total_Sistema",
        "total_Capturado",
        "boletas",
        "id",
      ];
      break;
  }
};

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const set_tipo_eleccion = (tipo) => {
  columnFilters.value = {};
  loading.value = true;
  eleccion.value = tipo.siglas;
  eleccion_Id.value = tipo.id;
  tab.value = "MR";
  evalua_columnas();
  switch (eleccion.value) {
    case "DIP":
    case "REG":
      casillaStore.load_por_casilla(eleccion_Id.value);
      casillaStore.load_por_casilla_rp(eleccion_Id.value);
      break;
    case "PYS":
      casillaStore.load_por_casilla(eleccion_Id.value);
      break;
  }
  pagination.value = {
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 5,
  };
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

const cargarData = async () => {
  loading.value = true;
  leerPermisos();
  evalua_columnas();
  await configuracionStore.loadTipoElecciones();
  eleccion_Id.value = list_Tipo_Elecciones.value[0].id;
  await configuracionStore.loadPartidosPoliticos();
  await configuracionStore.loadCoaliciones();
  await casillaStore.load_por_casilla(eleccion_Id.value);
  await casillaStore.load_por_casilla_rp(eleccion_Id.value);
  loading.value = false;
};

const verResultados = async (row, tipo) => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "blue-grey",
    spinnerSize: 140,
    backgroundColor: "blue-grey",
    message: "Espere un momento por favor...",
    messageColor: "black",
  });
  await casillaStore.load_por_casilla_id(
    row.id,
    row.distrito,
    row.municipio,
    row.seccion,
    row.casilla,
    row.tipo,
    tipo,
    eleccion.value,
    row.demarcacion
  );
  casillaStore.initResultados();
  if (tipo == "MR") {
    await casillaStore.load_resultados_mr(row.id, row.boletas);
  } else {
    await casillaStore.load_resultados_rp(row.id, row.boletas);
  }
  casillaStore.actualizarModal(true);
  $q.loading.hide();
};

const columns = [
  {
    name: "usuario",
    align: "center",
    label: "Usuario",
    field: "usuario",
    sortable: false,
  },
  {
    name: "municipio",
    align: "center",
    label: "Municipio",
    field: "municipio",
    sortable: false,
  },
  {
    name: "demarcacion",
    align: "center",
    label: "Demarcación",
    field: "demarcacion",
    sortable: false,
  },
  {
    name: "distrito",
    align: "center",
    label: "Distrito",
    field: "distrito",
    sortable: false,
  },
  {
    name: "seccion",
    align: "center",
    label: "Sección",
    field: "seccion",
    sortable: true,
  },
  {
    name: "casilla",
    align: "center",
    label: "Casilla",
    field: "casilla",
    sortable: false,
  },
  {
    name: "tipo",
    align: "center",
    label: "Tipo",
    field: "tipo",
    sortable: false,
  },
  {
    name: "total_Sistema",
    align: "center",
    label: "Total sistema",
    field: "total_Sistema",
    sortable: false,
  },
  {
    name: "total_Capturado",
    align: "center",
    label: "Total capturado",
    field: "total_Capturado",
    sortable: false,
  },
  {
    name: "boletas",
    align: "center",
    label: "Total boletas",
    field: "boletas",
    sortable: false,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: false,
  },
];

const filter = ref("");
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
});
</script>
