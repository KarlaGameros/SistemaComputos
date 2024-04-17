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
        class="text-justify bg-white"
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
                :rows="list_por_casilla"
                :columns="columns"
                :filter="filter"
                :visible-columns="visible_columns"
                row-key="name"
                v-model:pagination="pagination"
                color="pink"
              >
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
                      props.row.total_Sistema != props.row.total_Capturado
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
                            props.row.total_Sistema != props.row.total_Capturado
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
                :rows="list_por_casilla_rp"
                :columns="columns"
                :filter="filter"
                row-key="name"
                :visible-columns="visible_columns"
                v-model:pagination="pagination"
                color="pink"
              >
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
                      props.row.total_Sistema != props.row.total_Capturado
                        ? 'bg-red'
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
                          color="pink"
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
    <ModalComp :rp="tab == 'RP' ? true : false" :eleccion="eleccion" />
  </template>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
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
const { list_por_casilla, list_por_casilla_rp } = storeToRefs(casillaStore);
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
//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const evalua_columnas = () => {
  switch (eleccion.value) {
    case "DIP":
      visible_columns.value = [
        "usuario",
        "municipio",
        "distrito",
        "seccion",
        "tipo",
        "total_Sistema",
        "total_Capturado",
        "id",
      ];
      break;
    case "PYS":
      visible_columns.value = [
        "usuario",
        "municipio",
        "seccion",
        "tipo",
        "total_Sistema",
        "total_Capturado",
        "id",
      ];
      break;
    case "REG":
      visible_columns.value = [
        "usuario",
        "municipio",
        "demarcacion",
        "seccion",
        "tipo",
        "total_Sistema",
        "total_Capturado",
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
};

const cargarData = async () => {
  leerPermisos();
  evalua_columnas();
  loading.value = true;
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
    spinnerColor: "pink",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento porfavor...",
    messageColor: "black",
  });
  await casillaStore.load_por_casilla_id(
    row.municipio,
    row.seccion,
    row.casilla,
    row.tipo
  );
  casillaStore.initResultados();
  if (tipo == "MR") {
    await casillaStore.load_resultados_mr(row.id);
  } else {
    await casillaStore.load_resultados_rp(row.id);
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
    sortable: true,
  },
  {
    name: "municipio",
    align: "center",
    label: "Municipio",
    field: "municipio",
    sortable: true,
  },
  {
    name: "demarcacion",
    align: "center",
    label: "Demarcación",
    field: "demarcacion",
    sortable: true,
  },
  {
    name: "distrito",
    align: "center",
    label: "Distrito",
    field: "distrito",
    sortable: true,
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
    sortable: true,
  },
  {
    name: "tipo",
    align: "center",
    label: "Tipo",
    field: "tipo",
    sortable: true,
  },
  {
    name: "total_Sistema",
    align: "center",
    label: "Total sistema",
    field: "total_Sistema",
    sortable: true,
  },
  {
    name: "total_Capturado",
    align: "center",
    label: "Total capturado",
    field: "total_Capturado",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: true,
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
