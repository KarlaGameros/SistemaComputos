<template>
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
              title="Listado de solicitudes"
              :rows="list_Filtrado"
              :columns="columns"
              :filter="filter"
              :visible-columns="visible_columns"
              row-key="name"
              v-model:pagination="pagination"
              color="pink"
            >
              <template v-slot:top-left>
                <q-select
                  filled
                  color="pink"
                  class="q-pr-md"
                  v-model="estatus_Id"
                  :options="list_Estatus"
                  label="Seleccione estatus"
                  hint="Filtrar por estatus"
                  style="width: 200px"
                />
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
                          modulo == null
                            ? false
                            : modulo.leer &&
                              (props.row.aprobado == false ||
                                props.row.aprobado == null)
                        "
                        flat
                        round
                        color="pink"
                        icon="search"
                        @click="verCaptura(props.row, 'MR')"
                      >
                        <q-tooltip>Ver captura</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="
                          modulo == null
                            ? false
                            : modulo.registrar && props.row.aprobado == null
                        "
                        flat
                        round
                        color="pink"
                        icon="check_circle"
                        @click="aprobarSolicitud(props.row)"
                      >
                        <q-tooltip>Aprobar solicitud</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="
                          modulo == null
                            ? false
                            : modulo.registrar && props.row.aprobado == null
                        "
                        flat
                        round
                        color="pink"
                        icon="cancel"
                        @click="rechazarSolicitud(props.row)"
                      >
                        <q-tooltip>Rechazar solicitud</q-tooltip>
                      </q-btn>
                    </div>
                    <div v-else-if="col.name == 'aprobado'">
                      <q-badge
                        rounded
                        class="q-pa-xs"
                        :label="
                          col.value == true
                            ? 'Solicitud aprobada'
                            : col.value == false
                            ? 'Solicitud rechazada'
                            : 'Solicitud pendiente'
                        "
                        :color="
                          col.value == true
                            ? 'green'
                            : col.value == false
                            ? 'red'
                            : 'orange'
                        "
                        :name="
                          col.value == true
                            ? 'done'
                            : col.value == false
                            ? 'close'
                            : 'orange'
                        "
                      >
                        <q-icon
                          :name="
                            col.value == true
                              ? 'done'
                              : col.value == false
                              ? 'close'
                              : 'warning'
                          "
                          size="14px"
                          class="q-ml-xs"
                        />
                      </q-badge>
                    </div>
                    <label v-else>{{ col.value }}</label>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel name="RP">
            <q-table
              title="Listado de solicitudes"
              :rows="list_Filtrado"
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
                <q-tr :props="props">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <div v-if="col.name === 'id'">
                      <q-btn
                        v-if="
                          modulo == null
                            ? false
                            : modulo.leer &&
                              (props.row.aprobado == false ||
                                props.row.aprobado == null)
                        "
                        flat
                        round
                        color="pink"
                        icon="search"
                        @click="verCaptura(props.row, 'RP')"
                      >
                        <q-tooltip>Ver captura</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="
                          modulo == null
                            ? false
                            : modulo.registrar && props.row.aprobado == null
                        "
                        flat
                        round
                        color="pink"
                        icon="check_circle"
                        @click="aprobarSolicitud(props.row)"
                      >
                        <q-tooltip>Aprobar solicitud</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="
                          modulo == null
                            ? false
                            : modulo.registrar && props.row.aprobado == null
                        "
                        flat
                        round
                        color="pink"
                        icon="cancel"
                        @click="rechazarSolicitud(props.row)"
                      >
                        <q-tooltip>Rechazar solicitud</q-tooltip>
                      </q-btn>
                    </div>
                    <div v-else-if="col.name == 'aprobado'">
                      <q-badge
                        :label="
                          col.value == true
                            ? 'Solicitud aprobada'
                            : col.value == false
                            ? 'Solicitud rechazada'
                            : 'Solicitud pendiente'
                        "
                        :color="
                          col.value == true
                            ? 'green'
                            : col.value == false
                            ? 'red'
                            : 'orange'
                        "
                        :name="
                          col.value == true
                            ? 'done'
                            : col.value == false
                            ? 'close'
                            : 'orange'
                        "
                      />
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
    <ModalComp :rp="tab == 'RP' ? true : false" :eleccion="eleccion" />
  </div>
</template>

<script setup>
import { useQuasar, QSpinnerCube } from "quasar";
import { onBeforeMount, ref, watchEffect } from "vue";
import { useCasillaStore } from "src/stores/casilla-store";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth-store";
import { useSolicitudesStore } from "src/stores/solicitudes-store";
import Swal from "sweetalert2";
import ModalComp from "../../solicitudes/components/ModalComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const casillaStore = useCasillaStore();
const configuracionStore = useConfiguracionStore();
const solicitudesStore = useSolicitudesStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { list_Tipo_Elecciones } = storeToRefs(configuracionStore);
const { list_Solicitudes_Mr, list_Solicitudes_Rp } =
  storeToRefs(solicitudesStore);
const eleccion = ref("DIP");
const eleccion_Id = ref(null);
const tab = ref("MR");
const loading = ref(false);
const list_Estatus = ref([
  "Todos",
  "Solicitud aprobada",
  "Solicitud pendiente",
  "Solicitud rechazada",
]);
const estatus_Id = ref("Todos");
const siglas = "SC-REG-SOL";
const list_Filtrado = ref([]);

//-----------------------------------------------------------

const visible_columns = ref([
  "usuario_Solicita",
  "usuario_Aprueba",
  "motivo",
  "distrito",
  "casilla",
  "seccion",
  "aprobado",
  "fecha_Solicitud",
  "fecha_Accion",
  "id",
]);
const columns = [
  {
    name: "usuario_Solicita",
    align: "center",
    label: "Usuario solicita",
    field: "usuario_Solicita",
    sortable: true,
  },
  {
    name: "usuario_Aprueba",
    align: "center",
    label: "Usuario aprueba",
    field: "usuario_Aprueba",
    sortable: true,
  },
  {
    name: "motivo",
    align: "center",
    label: "Motivo",
    field: "motivo",
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
    name: "aprobado",
    align: "center",
    label: "Estatus",
    field: "aprobado",
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
    name: "fecha_Accion",
    align: "center",
    label: "Fecha acción",
    field: "fecha_Accion",
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
  sortBy: "asc",
  descending: true,
  page: 1,
  rowsPerPage: 5,
});

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
  cargarData();
});

//-----------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const evalua_columnas = () => {
  switch (eleccion.value) {
    case "DIP":
      visible_columns.value = [
        "usuario_Solicita",
        "usuario_Aprueba",
        "motivo",
        "distrito",
        "casilla",
        "seccion",
        "aprobado",
        "fecha_Solicitud",
        "fecha_Accion",
        "id",
      ];
      break;
    case "PYS":
      visible_columns.value = [
        "usuario_Solicita",
        "usuario_Aprueba",
        "motivo",
        "municipio",
        "casilla",
        "seccion",
        "aprobado",
        "fecha_Solicitud",
        "fecha_Accion",
        "id",
      ];
      break;
    case "REG":
      visible_columns.value = [
        "usuario_Solicita",
        "usuario_Aprueba",
        "motivo",
        "municipio",
        "demarcacion",
        "casilla",
        "seccion",
        "aprobado",
        "fecha_Solicitud",
        "fecha_Accion",
        "id",
      ];
      break;
  }
};

const set_tipo_eleccion = (tipo) => {
  eleccion.value = tipo.siglas;
  eleccion_Id.value = tipo.id;
  tab.value = "MR";
  evalua_columnas();
  switch (eleccion.value) {
    case "DIP":
    case "REG":
      solicitudesStore.load_solicitudes_mr(eleccion_Id.value);
      solicitudesStore.load_solicitudes_rp(eleccion_Id.value);
      break;
    case "PYS":
      solicitudesStore.load_solicitudes_mr(eleccion_Id.value);
      break;
  }
};

const cargarData = async () => {
  evalua_columnas();
  await configuracionStore.loadTipoElecciones();
  eleccion_Id.value = list_Tipo_Elecciones.value[0].id;
  await solicitudesStore.load_solicitudes_mr(eleccion_Id.value);
  await solicitudesStore.load_solicitudes_rp(eleccion_Id.value);
};

const verCaptura = async (row, tipo) => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "blue-grey",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento por favor...",
    messageColor: "black",
  });
  casillaStore.initResultados();
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
  if (tipo == "MR") {
    await casillaStore.load_resultados_mr(row.resultado_Id);
  } else {
    await casillaStore.load_resultados_rp(row.resultado_RP_Id);
  }
  solicitudesStore.actualizarModal(true);
  $q.loading.hide();
};

const aprobarSolicitud = (row) => {
  Swal.fire({
    title: "¿Está seguro de aprobar la solicitud de corrección?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, aprobar",
    cancelButtonText: "No, cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let resp = await solicitudesStore.aprobarSolicitud(row.id);
      if (resp.success == true) {
        Swal.fire({
          title: "Solicitud aprobada",
          icon: "success",
          title: "La solicitud de corrección ha sido aprobada.",
          showConfirmButton: false,
          timer: 1500,
        });
        await solicitudesStore.load_solicitudes_mr(eleccion_Id.value);
        await solicitudesStore.load_solicitudes_rp(eleccion_Id.value);
      } else {
        Swal.fire({
          title: resp.data,
          icon: "error",
        });
      }
    }
  });
};

const rechazarSolicitud = (row) => {
  Swal.fire({
    title: "¿Está seguro de rechazar la solicitud de corrección?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, rechazar",
    cancelButtonText: "No, cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let resp = await solicitudesStore.rechazarSolicitud(row.id);
      if (resp.success == true) {
        Swal.fire({
          icon: "success",
          title: "Solicitud rechazada",
          text: "Su solicitud de corrección ha sido rechazada.",
          showConfirmButton: false,
          timer: 1500,
        });
        await solicitudesStore.load_solicitudes_mr(eleccion_Id.value);
        await solicitudesStore.load_solicitudes_rp(eleccion_Id.value);
      } else {
        Swal.fire({
          title: resp.data,
          icon: "error",
        });
      }
    }
  });
};

const filtrar = (list_Solicitudes, filtro) => {
  list_Filtrado.value = list_Solicitudes.filter((item) => {
    let cumple = true;
    if (filtro.estatus !== undefined) {
      if (filtro.estatus == "Todos") {
        cumple = cumple && item.estatus === item.estatus;
      } else {
        if (filtro.estatus == "Solicitud aprobada") {
          cumple = cumple && item.aprobado === true;
        } else if (filtro.estatus == "Solicitud pendiente") {
          cumple = cumple && item.aprobado === null;
        } else {
          cumple = cumple && item.aprobado == false;
        }
      }
    }

    return cumple;
  });
};

watchEffect(() => {
  const filtro = {};
  if (estatus_Id.value != null) filtro.estatus = estatus_Id.value;
  filtrar(
    tab.value == "MR" ? list_Solicitudes_Mr.value : list_Solicitudes_Rp.value,
    filtro
  );
});
</script>
