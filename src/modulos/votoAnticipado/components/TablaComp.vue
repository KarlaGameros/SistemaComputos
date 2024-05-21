<template>
  <div class="q-pa-lg">
    <q-banner
      inline-actions
      :class="$q.dark.isActive ? 'text-justify' : 'bg-white'"
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
        >
          <q-tab name="pendientes" label="Pendientes" />
          <q-tab name="resultados" label="Capturados" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="pendientes">
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
                        @click="inicializar(props.row)"
                      >
                        <q-tooltip>Capturar</q-tooltip>
                      </q-btn>
                    </div>
                    <label v-else>{{ col.value }}</label>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel name="resultados">
            <q-table
              :loading="loading"
              :visible-columns="visible_columns_pendientes"
              :rows="list_va_resultados_eleccion"
              :columns="columnsPendientes"
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
                  :class="
                    props.row.total_Sistema != props.row.total_Capturado
                      ? 'bg-red text-white'
                      : ''
                  "
                  :props="props"
                >
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <div v-if="col.name === 'id'">
                      <q-btn
                        :color="
                          props.row.total_Sistema != props.row.total_Capturado
                            ? 'white'
                            : 'pink'
                        "
                        flat
                        round
                        icon="search"
                        @click="verResultados(props.row)"
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
</template>

<script setup>
import { useQuasar, QSpinnerCube } from "quasar";
import { onBeforeMount, ref, watch } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { storeToRefs } from "pinia";
import { useVotoAnticipadoStore } from "src/stores/votoAnticipado-store";
import { useRerservasStore } from "src/stores/reservas-store";
import Swal from "sweetalert2";

//----------------------------------------------------------

const $q = useQuasar();
const reservasStore = useRerservasStore();
const configuracionStore = useConfiguracionStore();
const votoAnticipadoStore = useVotoAnticipadoStore();
const { list_Tipo_Elecciones } = storeToRefs(configuracionStore);
const {
  list_va_eleccion,
  list_va_resultados_eleccion,
  loading,
  encabezado,
  reload,
} = storeToRefs(votoAnticipadoStore);
const eleccion = ref(null);
const tipo_eleccion_id = ref(null);
const visible_columns = ref([]);
const visible_columns_pendientes = ref([]);
const tipo_Computo = ref(null);
const grupo_Trabajo = ref(null);
const punto_Recuento = ref(null);
const tab = ref("pendientes");

//----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

watch(reload, (val) => {
  if (val == true) {
    cargarData();
    votoAnticipadoStore.actualizarTabla(false);
  }
});

//----------------------------------------------------------

const limpiar = () => {
  tipo_Computo.value = null;
  grupo_Trabajo.value = null;
  punto_Recuento.value = null;
};

const cargarData = async () => {
  await configuracionStore.loadTipoElecciones();
  tipo_eleccion_id.value = list_Tipo_Elecciones.value[0].id;
  eleccion.value = list_Tipo_Elecciones.value[0].siglas;
  await votoAnticipadoStore.load_va_by_eleccion(tipo_eleccion_id.value);
  await votoAnticipadoStore.load_va_resultados_by_eleccion(
    tipo_eleccion_id.value
  );
  evalua_columnas();
};

const set_tipo_eleccion = async (tipo) => {
  limpiar();
  tab.value = "pendientes";
  eleccion.value = tipo.siglas;
  tipo_eleccion_id.value = tipo.id;
  await votoAnticipadoStore.load_va_by_eleccion(tipo_eleccion_id.value);
  await votoAnticipadoStore.load_va_resultados_by_eleccion(
    tipo_eleccion_id.value
  );
  evalua_columnas();
};

const evalua_columnas = () => {
  switch (eleccion.value) {
    case "DIP":
      visible_columns.value = ["usuario", "distrito", "listado_Nominal", "id"];
      visible_columns_pendientes.value = [
        "usuario",
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
      visible_columns.value = ["usuario", "municipio", "listado_Nominal", "id"];
      visible_columns_pendientes.value = [
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
        "listado_Nominal",
        "id",
      ];
      visible_columns_pendientes.value = [
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
  pagination.value = {
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 5,
  };
};

const verResultados = async (row) => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "pink",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento porfavor...",
    messageColor: "black",
  });
  encabezado.value.distrito = row.distrito;
  encabezado.value.municipio = row.municipio;
  encabezado.value.demarcacion = row.demarcacion;
  encabezado.value.seccion = row.seccion;
  encabezado.value.casilla = row.casilla;
  encabezado.value.eleccion = eleccion;
  await votoAnticipadoStore.cosultaResultados(row.id, row.boletas);
  votoAnticipadoStore.actualizarVisualizar(true);
  votoAnticipadoStore.actualizarModal(true);
  $q.loading.hide();
};

const inicializar = async (row) => {
  limpiar();
  encabezado.value.distrito = row.distrito;
  encabezado.value.municipio = row.municipio;
  encabezado.value.demarcacion = row.demarcacion;
  encabezado.value.eleccion = row.tipo_Eleccion;
  Swal.fire({
    title: "Tipo de cómputo",
    input: "select",
    inputOptions: {
      cotejo: "Cotejo",
      recuento_Parcial: "Recuento parcial",
      recuento_Total: "Recuento total",
    },
    inputPlaceholder: "Selecciona una opción",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i> `,
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
        resumen(row);
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
    spinnerColor: "pink",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento por favor...",
    messageColor: "black",
  });
  let resp = null;
  resp = await reservasStore.reservarMr(id);
  if (resp.success == true) {
    $q.loading.hide();
    Swal.fire({
      icon: "success",
      title: resp.data,
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    $q.loading.hide();
    Swal.fire({
      icon: "error",
      title: resp.data,
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
const grupoTrabajoAlert = (row) => {
  Swal.fire({
    title: "Grupo de trabajo",
    input: "number",
    inputLabel: "Ingresa el número de grupo de trabajo",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i>`,
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
      puntoRecuentoAlert(row);
    }
  });
};

const puntoRecuentoAlert = (row) => {
  Swal.fire({
    title: "Punto de recuento",
    input: "number",
    inputLabel: "Ingresa el número de punto de recuento",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i> `,
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
      resumen(row);
    }
  });
};

const resumen = (row) => {
  Swal.fire({
    title: "Resumen",
    html:
      tipo_Computo.value == 1
        ? `Tipo de cómputo: <b>${
            tipo_Computo.value == 1
              ? "Cotejo"
              : tipo_Computo.value == 2
              ? "Recuento parcial"
              : "Recuento total"
          }</b>  `
        : `Tipo de cómputo: <b>${
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
        spinnerColor: "pink",
        spinnerSize: 140,
        backgroundColor: "purple-2",
        message: "Espere un momento porfavor...",
        messageColor: "black",
      });
      await votoAnticipadoStore.incicializar_resultados(
        row.id,
        tipo_Computo.value,
        tipo_Computo.value == 1 ? 0 : grupo_Trabajo.value,
        tipo_Computo.value == 1 ? 0 : punto_Recuento.value,
        0
      );
      votoAnticipadoStore.actualizarModal(true);
      $q.loading.hide();
    }
  });
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

const columnsPendientes = [
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
    name: "boletas",
    align: "center",
    label: "Boletas",
    field: "boletas",
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
