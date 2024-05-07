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
          <q-table
            :loading="loading"
            :visible-columns="visible_columns"
            :rows="list_va_eleccion"
            :columns="columns"
            :filter="filter"
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
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <label>{{ col.value }}</label>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </template>
</template>

<script setup>
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { storeToRefs } from "pinia";
import { useVotoAnticipadoStore } from "src/stores/votoAnticipado-store";
//----------------------------------------------------------

const $q = useQuasar();
const configuracionStore = useConfiguracionStore();
const votoAnticipadoStore = useVotoAnticipadoStore();
const { list_Tipo_Elecciones } = storeToRefs(configuracionStore);
const { list_va_eleccion, loading } = storeToRefs(votoAnticipadoStore);
const eleccion = ref(null);
const tipo_eleccion_id = ref(null);
const visible_columns = ref([]);

//----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//----------------------------------------------------------

const cargarData = async () => {
  await configuracionStore.loadTipoElecciones();
  tipo_eleccion_id.value = list_Tipo_Elecciones.value[0].id;
  eleccion.value = list_Tipo_Elecciones.value[0].siglas;
  await votoAnticipadoStore.load_va_by_eleccion(tipo_eleccion_id.value);
  evalua_columnas();
};

const set_tipo_eleccion = async (tipo) => {
  eleccion.value = tipo.siglas;
  tipo_eleccion_id.value = tipo.id;
  await votoAnticipadoStore.load_va_by_eleccion(tipo_eleccion_id.value);
  evalua_columnas();
};

const evalua_columnas = () => {
  switch (eleccion.value) {
    case "DIP":
      visible_columns.value = ["usuario", "distrito", "listado_Nominal", "id"];
      break;
    case "PYS":
      visible_columns.value = ["usuario", "municipio", "listado_Nominal", "id"];
      break;
    case "REG":
      visible_columns.value = [
        "usuario",
        "municipio",
        "demarcacion",
        "listado_Nominal",
        "id",
      ];
      break;
  }
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
    name: "distrito",
    align: "center",
    label: "Distrito",
    field: "distrito",
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
    name: "listado_Nominal",
    align: "center",
    label: "Listado nominal",
    field: "listado_Nominal",
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
