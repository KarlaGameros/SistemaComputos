<template>
  <div class="q-pa-lg">
    <q-banner
      inline-actions
      class="text-justify bg-white"
      style="border-radius: 20px"
    >
      <q-btn
        v-for="tipo in list_Tipo_Elecciones"
        :key="tipo"
        @click="eleccion = tipo.siglas"
        :flat="tipo.siglas != eleccion"
        rounded
        color="blue-grey"
        icon="layers"
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
          <q-tab name="MR" label="Mayoria relativa" />
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
              :rows="rows"
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
                <q-tr
                  :props="props"
                  :class="
                    props.row.total_segun_sistema != props.row.total_capturadas
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
                        flat
                        round
                        color="pink"
                        icon="edit_square"
                        @click="recuentoAlert(props.row)"
                      >
                        <q-tooltip>Capturar resultados</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        color="pink"
                        icon="undo"
                        @click="quitarReserva(props.row)"
                      >
                        <q-tooltip>Quitar reserva</q-tooltip>
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
              :rows="rows"
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
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <div v-if="col.name === 'id'">
                      <q-btn
                        flat
                        round
                        color="pink"
                        icon="edit_square"
                        @click="recuentoAlert(props.row)"
                      >
                        <q-tooltip>Capturar resultados</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        color="pink"
                        icon="undo"
                        @click="quitarReserva(props.row)"
                      >
                        <q-tooltip>Quitar reserva</q-tooltip>
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
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { storeToRefs } from "pinia";

//-----------------------------------------------------------

const configuracionStore = useConfiguracionStore();
const { list_Tipo_Elecciones } = storeToRefs(configuracionStore);
const eleccion = ref("DIP");
const tab = ref("MR");

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  await configuracionStore.loadTipoElecciones();
  await configuracionStore.loadPartidosPoliticos();
  await configuracionStore.loadCoaliciones();
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
    name: "total_segun_sistema",
    align: "center",
    label: "Total según sistema",
    field: "total_segun_sistema",
    sortable: true,
  },
  {
    name: "total_capturadas",
    align: "center",
    label: "Total capturadas",
    field: "total_capturadas",
    sortable: true,
  },
];

const rows = ref([
  {
    usuario: "karla",
    municipio: "Santiafo",
    seccion: "seccion",
    casilla: "casilla",
    tipo: "tipo",
    total_segun_sistema: 30,
    total_capturadas: 30,
  },
]);
const filter = ref("");
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
});
</script>
