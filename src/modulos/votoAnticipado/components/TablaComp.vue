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
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar, QSpinnerCube } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { storeToRefs } from "pinia";
import { useVotoAnticipadoStore } from "src/stores/votoAnticipado-store";
import { useCapturaStore } from "src/stores/captura-store";
import Swal from "sweetalert2";

//----------------------------------------------------------

const $q = useQuasar();
const configuracionStore = useConfiguracionStore();
const votoAnticipadoStore = useVotoAnticipadoStore();
const capturaStore = useCapturaStore();
const { list_Tipo_Elecciones } = storeToRefs(configuracionStore);
const { list_va_eleccion, loading } = storeToRefs(votoAnticipadoStore);
const eleccion = ref(null);
const tipo_eleccion_id = ref(null);
const visible_columns = ref([]);
const tipo_Computo = ref(null);
const grupo_Trabajo = ref(null);
const punto_Recuento = ref(null);

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

const inicializar = async (row) => {
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
      grupoTrabajoAlert(row);
    }
  });
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
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i> `,
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
    confirmButtonText: "Iniciar captura",
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

      await capturaStore.incicializar_resultados_va(
        row.id,
        tipo_Computo.value,
        grupo_Trabajo.value,
        punto_Recuento.value,
        0
      );
      capturaStore.actualizarModal(true);
      $q.loading.hide();
    } else if (result.isDenied) {
      Swal.fire("Los datos capturados no se guardarán", "", "info");
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
const filter = ref("");
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
});
</script>
