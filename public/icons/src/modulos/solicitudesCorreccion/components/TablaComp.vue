<template>
  <div class="q-pa-md">
    <div class="q-pb-md">
      <q-banner
        inline-actions
        class="text-justify bg-white"
        style="border-radius: 20px"
      >
        <template v-slot:avatar>
          <q-icon name="info" color="grey" />
        </template>
        Módulo que muestra las solicitudes de corrección del partido logueado.
      </q-banner>
    </div>
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="blue-grey"
        indicator-color="blue-grey"
        align="justify"
      >
        <q-tab name="Observaciones IEEN" label="Observaciones IEEN" />
        <q-tab
          name="Correcciones Partido político"
          label="Correcciones Partido político"
        />
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Observaciones IEEN">
          <q-card>
            <q-table
              :rows="list_Observaciones_Partido"
              :columns="columnsObservacion"
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
                    <div v-if="col.name === 'estatus'">
                      <q-chip
                        :color="
                          col.value == 'Observaciones Aprobadas'
                            ? 'orange'
                            : col.value == 'Observaciones Asignadas' ||
                              col.value == 'Observaciones Aplicadas'
                            ? 'orange'
                            : col.value == 'Información Actualizada'
                            ? 'green'
                            : 'red'
                        "
                        text-color="white"
                      >
                        {{ col.value == null ? "Pendiente" : col.value }}
                      </q-chip>
                    </div>
                    <label v-else>{{ col.value }}</label>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="Correcciones Partido político">
          <q-card>
            <q-table
              :rows="list_Solicitudes_ByPartido"
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
                    <div v-if="col.name === 'estatus'">
                      <q-chip
                        :color="
                          col.value == 'Solicitud Aprobada Parcial'
                            ? 'orange'
                            : col.value == 'Solicitud Aprobada'
                            ? 'green'
                            : 'red'
                        "
                        text-color="white"
                      >
                        {{ col.value == null ? "Pendiente" : col.value }}
                      </q-chip>
                    </div>
                    <label v-else>{{ col.value }}</label>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useObservacionStore } from "src/stores/observacion-store";
import { storeToRefs } from "pinia";
import { useCandidatosStore } from "src/stores/candidatos-store";

//-----------------------------------------------------------

const observacionStore = useObservacionStore();
const candidatoStore = useCandidatosStore();
const { list_Solicitudes_ByPartido, list_Observaciones_Partido } =
  storeToRefs(observacionStore);
const tab = ref("Observaciones IEEN");

onBeforeMount(() => {
  cargarData();
});

const cargarData = async () => {
  await observacionStore.loadSolicitudesCorreccionesByPartido();
  await observacionStore.loadObservacionesPartido();
};

const columnsObservacion = [
  {
    name: "candidato",
    align: "center",
    label: "Candidatura",
    field: "candidato",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
    sortable: true,
  },
  {
    name: "fecha_Registro",
    align: "center",
    label: "Fecha de registro",
    field: "fecha_Registro",
    sortable: true,
  },
];

const columns = [
  {
    name: "usuario_Solicitante",
    align: "center",
    label: "Solicitante",
    field: "usuario_Solicitante",
    sortable: true,
  },
  {
    name: "candidato",
    align: "center",
    label: "Candidatura",
    field: "candidato",
    sortable: true,
  },
  {
    name: "partido",
    align: "center",
    label: "Partido político",
    field: "partido",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
    sortable: true,
  },
  {
    name: "fecha_Solicitud",
    align: "center",
    label: "Fecha de solicitud",
    field: "fecha_Solicitud",
    sortable: true,
  },
  {
    name: "fecha_Aprobacion",
    align: "center",
    label: "Fecha de aprobación",
    field: "fecha_Aprobacion",
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

<style></style>
