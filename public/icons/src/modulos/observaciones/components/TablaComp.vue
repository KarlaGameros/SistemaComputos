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
        Módulo que muestra las correcciones por parte de IEEN y por parte de los
        partidos políticos.
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
        <q-tab name="Correcciones IEEN" label="Correcciones IEEN" />
        <q-tab
          name="Correcciones Partido político"
          label="Correcciones Partido político"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Correcciones IEEN">
          <q-card>
            <q-tabs
              v-model="tab2"
              dense
              class="text-grey"
              active-color="pink"
              indicator-color="pink"
              align="justify"
              narrow-indicator
            >
              <q-tab
                v-for="estatu in estatus"
                :key="estatu"
                :name="estatu"
                :label="estatu"
              />
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="tab2" animated>
              <q-tab-panel :name="tab2">
                <q-table
                  :rows="
                    list_Observaciones_Filtrado.filter(
                      (x) => x.estatus_Observaciones == tab2
                    )
                  "
                  :columns="columns"
                  :filter="filter"
                  row-key="name"
                  v-model:pagination="pagination"
                  color="pink"
                >
                  <template v-slot:top-left>
                    <q-select
                      filled
                      color="pink"
                      class="q-pr-md"
                      v-model="partido_Id"
                      :options="list_Partidos_Politicos"
                      label="Selecciona partido"
                      hint="Filtrar por partidos"
                      style="width: 220px"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section
                            avatar
                            v-if="scope.opt.logo_URL != null"
                          >
                            <q-img :src="scope.opt.logo_URL" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
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
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        <div v-if="col.name === 'id'">
                          <q-btn
                            v-if="
                              props.row.estatus_Observaciones !=
                                'Solicitud Aprobada' &&
                              props.row.estatus_Observaciones !=
                                'Información Actualizada' &&
                              props.row.estatus_Observaciones !=
                                'Observaciones Aprobadas' &&
                              props.row.estatus_Observaciones !=
                                'Observaciones Asignadas'
                            "
                            flat
                            round
                            color="pink"
                            icon="check_circle"
                            @click="aprobar(props.row, 'observacion')"
                          >
                            <q-tooltip>Aprobar corrección</q-tooltip>
                          </q-btn>

                          <q-btn
                            v-if="
                              props.row.estatus_Observaciones ==
                                'Información Actualizada' ||
                              props.row.estatus_Observaciones ==
                                'Observaciones Asignadas'
                            "
                            flat
                            round
                            color="pink"
                            icon="visibility"
                            @click="verCoreccion(props.row, 'observacion')"
                          >
                            <q-tooltip>Aprobar corrección</q-tooltip>
                          </q-btn>
                        </div>
                        <div v-else-if="col.name === 'logo_Partido'">
                          <q-avatar square>
                            <img :src="col.value" alt="" />
                          </q-avatar>
                        </div>
                        <div v-else-if="col.name === 'estatus_Observaciones'">
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
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="Correcciones Partido político">
          <q-card>
            <q-tabs
              v-model="tabPartido"
              dense
              class="text-grey"
              active-color="pink"
              indicator-color="pink"
              align="justify"
              narrow-indicator
            >
              <q-tab
                v-for="estatu in estatusPartido"
                :key="estatu"
                :name="estatu"
                :label="estatu"
              />
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="tabPartido" animated>
              <q-tab-panel :name="tabPartido">
                <q-table
                  :rows="
                    list_Correcciones_Filtrado.filter(
                      (x) => x.estatus == tabPartido
                    )
                  "
                  :columns="columnsCorreccion"
                  :filter="filter"
                  row-key="name"
                  v-model:pagination="pagination"
                  color="pink"
                >
                  <template v-slot:top-left>
                    <q-select
                      filled
                      color="pink"
                      class="q-pr-md"
                      v-model="partido_Id"
                      :options="list_Partidos_Politicos"
                      label="Selecciona partido"
                      hint="Filtrar por partidos"
                      style="width: 220px"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section
                            avatar
                            v-if="scope.opt.logo_URL != null"
                          >
                            <q-img :src="scope.opt.logo_URL" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
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
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        <div v-if="col.name === 'id'">
                          <q-btn
                            v-if="props.row.estatus != 'Solicitud Aprobada'"
                            flat
                            round
                            color="pink"
                            icon="check_circle"
                            @click="aprobar(props.row, 'correccion')"
                          >
                            <q-tooltip>Aprobar corrección</q-tooltip>
                          </q-btn>
                          <q-btn
                            v-if="props.row.estatus == 'Solicitud Aprobada'"
                            flat
                            round
                            color="pink"
                            icon="visibility"
                            @click="verCoreccion(props.row, 'correccion')"
                          >
                            <q-tooltip>Aprobar corrección</q-tooltip>
                          </q-btn>
                        </div>
                        <div v-else-if="col.name === 'logo_Partido'">
                          <q-avatar square>
                            <img :src="col.value" alt="" />
                            <q-tooltip>{{ props.row.partido }}</q-tooltip>
                          </q-avatar>
                        </div>
                        <div v-else-if="col.name === 'estatus'">
                          <q-chip
                            :color="
                              col.value == 'Solicitud Aprobada'
                                ? 'green'
                                : 'red'
                            "
                            text-color="white"
                          >
                            {{ col.value }}
                          </q-chip>
                        </div>
                        <label v-else>{{ col.value }}</label>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { useObservacionStore } from "src/stores/observacion-store";
import { storeToRefs } from "pinia";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { useConfiguracionStore } from "src/stores/configuracion-store";

//-----------------------------------------------------------

const observacionStore = useObservacionStore();
const candidatoStore = useCandidatosStore();
const configuracionStore = useConfiguracionStore();
const { list_Observaciones, list_Correcciones, actualizar } =
  storeToRefs(observacionStore);
const { list_Partidos_Politicos } = storeToRefs(configuracionStore);
const tab = ref("Correcciones IEEN");
const tab2 = ref("Pendientes");
const partido_Id = ref({ value: 0, label: "Todos" });
const list_Observaciones_Filtrado = ref([]);
const list_Correcciones_Filtrado = ref([]);
const estatusPartido = ref(["Solicitud Pendiente", "Solicitud Aprobada"]);
const estatus = ref([
  "Pendientes",
  "Observaciones Asignadas",
  "Observaciones Aplicadas",
  "Información Actualizada",
]);
const tabPartido = ref("Solicitud Pendiente");

onBeforeMount(() => {
  cargarData();
});

const cargarData = async () => {
  await observacionStore.loadObservaciones();
  await observacionStore.loadSolicitudesCorrecciones();
  await configuracionStore.loadPartidosPoliticosTodos();
};

const aprobar = async (row, tipo) => {
  if (tipo == "observacion") {
    await observacionStore.loadObservacionId(row.id);
  } else {
    await observacionStore.loadCorreccionId(row.id);
    await candidatoStore.observacionesByCandidatoByPuesto(
      row.candidato_Id,
      row.puesto
    );
    //await observacionStore.loadObservacionId(list_Observaciones.value[0].id);
  }

  await candidatoStore.loadDatosGeneralesById(row.candidato_Id, row.puesto);
  await candidatoStore.loadCandidatoById(row.puesto, row.candidato_Id);
  await candidatoStore.loadPropuestas(row.candidato_Id, row.puesto);
  await candidatoStore.loadFormacionAcademica(row.candidato_Id, row.puesto);
  observacionStore.actualizarModal(true);
  observacionStore.actualizarVisualizar(false);
};

const verCoreccion = async (row, tipo) => {
  if (tipo == "observacion") {
    await observacionStore.loadObservacionId(row.id);
  } else {
    await observacionStore.loadCorreccionId(row.id);
  }
  await candidatoStore.loadCandidatoById(row.puesto, row.candidato_Id);
  await candidatoStore.loadDatosGeneralesById(row.candidato_Id, row.puesto);
  await candidatoStore.loadPropuestas(row.candidato_Id, row.puesto);
  await candidatoStore.loadFormacionAcademica(row.candidato_Id, row.puesto);
  observacionStore.actualizarVisualizar(true);
  observacionStore.actualizarModal(true);
};

watch(tab2, (val) => {
  if (val != null) {
    partido_Id.value = { value: 0, label: "Todos" };
  }
});

watch(actualizar, (val) => {
  if (val == true) {
    cargarData();
    observacionStore.actualizarTabla(false);
  }
});

const columns = [
  {
    name: "empleado",
    align: "center",
    label: "Solicitante",
    field: "empleado",
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
    name: "tipo_Eleccion",
    align: "center",
    label: "Elección",
    field: "tipo_Eleccion",
    sortable: true,
  },
  {
    name: "tipo_Candidato",
    align: "center",
    label: "Tipo",
    field: "tipo_Candidato",
    sortable: true,
  },
  {
    name: "logo_Partido",
    align: "center",
    label: "Partido",
    field: "logo_Partido",
    sortable: true,
  },
  {
    name: "fecha_Registro",
    align: "center",
    label: "Fecha registro",
    field: "fecha_Registro",
    sortable: true,
  },
  {
    name: "empleado_Aprueba",
    align: "center",
    label: "Personal aprueba",
    field: "empleado_Aprueba",
    sortable: true,
  },
  {
    name: "fecha_Observaciones_Validadas",
    align: "center",
    label: "Fecha validado",
    field: "fecha_Observaciones_Validadas",
    sortable: true,
  },
  {
    name: "fecha_Observaciones_Aplicadas",
    align: "center",
    label: "Fecha aplicadas",
    field: "fecha_Observaciones_Aplicadas",
    sortable: true,
  },
  {
    name: "estatus_Observaciones",
    align: "center",
    label: "Estatus",
    field: "estatus_Observaciones",
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

const columnsCorreccion = [
  {
    name: "empleado",
    align: "center",
    label: "Solicitante",
    field: "empleado",
    sortable: true,
  },
  {
    name: "correo_Usuario",
    align: "center",
    label: "Correo",
    field: "correo_Usuario",
    sortable: true,
  },
  {
    name: "logo_Partido",
    align: "center",
    label: "Partido político",
    field: "logo_Partido",
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
    name: "tipo_Eleccion",
    align: "center",
    label: "Elección",
    field: "tipo_Eleccion",
    sortable: true,
  },
  {
    name: "tipo_Candidato",
    align: "center",
    label: "Tipo",
    field: "tipo_Candidato",
    sortable: true,
  },
  {
    name: "puesto_Candidato",
    align: "center",
    label: "Candidatura",
    field: "puesto_Candidato",
    sortable: true,
  },
  {
    name: "fecha_Registro",
    align: "center",
    label: "Fecha registro",
    field: "fecha_Registro",
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

const filtrar = (list, list_correcciones, filtro) => {
  list_Observaciones_Filtrado.value = list.filter((item) => {
    let cumple = true;

    if (filtro.partido !== undefined) {
      if (filtro.partido == 0) {
        cumple = cumple && item.partido_Id === item.partido_Id;
      } else {
        cumple = cumple && item.partido_Id === filtro.partido;
      }
    }
    return cumple;
  });
  list_Correcciones_Filtrado.value = list_correcciones.filter((item) => {
    let cumple = true;

    if (filtro.partido !== undefined) {
      if (filtro.partido == 0) {
        cumple = cumple && item.partido_Id === item.partido_Id;
      } else {
        cumple = cumple && item.partido_Id === filtro.partido;
      }
    }
    return cumple;
  });
};

watchEffect(() => {
  const filtro = {};
  if (partido_Id.value != null) filtro.partido = partido_Id.value.value;
  filtrar(list_Observaciones.value, list_Correcciones.value, filtro);
});
</script>

<style></style>
