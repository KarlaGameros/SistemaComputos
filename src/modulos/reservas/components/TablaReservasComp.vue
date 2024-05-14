<template>
  <template v-if="loading">
    <div class="q-pa-md">
      <div class="absolute-center">
        <q-spinner-cube color="blue-grey" size="10.5em" />
      </div>
    </div>
  </template>
  <template v-else>
    <q-table
      :rows="rp == true ? list_reservas_rp : list_reservas_mr"
      :columns="columns"
      :visible-columns="visible_columns"
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
                v-if="modulo == null ? false : modulo.registrar"
                flat
                round
                color="pink"
                icon="edit_square"
                @click="recuentoAlert(props.row)"
              >
                <q-tooltip>Capturar resultados</q-tooltip>
              </q-btn>
              <q-btn
                v-if="modulo == null ? false : modulo.registrar"
                flat
                round
                color="pink"
                icon="undo"
                @click="quitarReserva(col.value)"
              >
                <q-tooltip>Quitar reserva</q-tooltip>
              </q-btn>
            </div>

            <label v-else>{{ col.value }}</label>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </template>
  <ModalComp :rp="rp" :eleccion="tipo_siglas" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerCube } from "quasar";
import { useRerservasStore } from "src/stores/reservas-store";
import { ref, defineProps, watch, watchEffect, onBeforeMount } from "vue";
import { useCapturaStore } from "src/stores/captura-store";
import { useAuthStore } from "src/stores/auth-store";
import ModalComp from "../components/ModalComp.vue";
import Swal from "sweetalert2";

//-------------------------------------------------------

const $q = useQuasar();
const reservasStore = useRerservasStore();
const capturaStore = useCapturaStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { list_reservas_mr, list_reservas_rp, loading, encabezado } =
  storeToRefs(reservasStore);
const casilla_Id = ref(null);
const votos_Reservados = ref(null);
const grupo_Trabajo = ref(null);
const punto_Recuento = ref(null);
const tipo_Computo = ref(null);
const props = defineProps({
  tipo_siglas: { type: String, required: true },
  tipo_id: { type: Number },
  rp: { type: Boolean, required: true },
});
const visible_columns = ref([
  "municipio",
  "distrito",
  "seccion",
  "casilla",
  "total_Causales",
  "id",
]);
const columns = [
  {
    name: "municipio",
    align: "center",
    label: "Municipio",
    field: "municipio",
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
    name: "demarcacion",
    align: "center",
    label: "Demarcación",
    field: "demarcacion",
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
    name: "total_Causales",
    align: "center",
    label: "No. Causales",
    field: "total_Causales",
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
const siglas = "SC-REG-RES";

//--------------------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//--------------------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

//-------------------------------------------------------

watch(props, (val) => {
  if (val != null) {
    evalua_columnas();
  }
});

// watchEffect(() => {
//   switch (props.tipo_siglas) {
//     case "DIP":
//     case "REG":
//       if (props.rp == true) {
//         loading.value = list_reservas_rp.value.length == 0;
//       } else {
//         loading.value = list_reservas_mr.value.length == 0;
//       }
//       break;
//     case "PYS":
//       loading.value = list_reservas_mr.value.length == 0;
//       break;
//   }
// });

const evalua_columnas = () => {
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
};

const recuentoAlert = (row) => {
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
    padding: "30px",
    title: "Votos Reservados",
    input: "number",
    inputLabel:
      "Ingresa la cantidad de votos reservados para esta casilla y tipo de elección.",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i> `,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value != "") {
          votos_Reservados.value = value;
          resolve();
        } else {
          resolve("Campo vacio");
        }
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      tipoComputoAlert();
    }
  });
};

const tipoComputoAlert = () => {
  Swal.fire({
    title: "Tipo de cómputo",
    input: "select",
    inputOptions: {
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
          tipo_Computo.value = value == "recuento_Parcial" ? 2 : 3;
          resolve();
        } else {
          resolve("Se necesita seleccionar una opción:)");
        }
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      grupoTrabajoAlert();
    }
  });
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
      resumen();
    }
  });
};

const resumen = () => {
  Swal.fire({
    title: "Resumen",
    html: `Votos reservados: <b>${votos_Reservados.value}</b>
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
      if (props.rp == true) {
        await capturaStore.incicializar_resultados_rp(
          props.tipo_id,
          casilla_Id.value,
          tipo_Computo.value,
          grupo_Trabajo.value,
          punto_Recuento.value,
          votos_Reservados.value
        );
      } else {
        await capturaStore.incicializar_resultados(
          props.tipo_id,
          casilla_Id.value,
          tipo_Computo.value,
          grupo_Trabajo.value,
          punto_Recuento.value,
          votos_Reservados.value
        );
      }
      reservasStore.actualizarModal(true);
      $q.loading.hide();
    } else if (result.isDenied) {
      Swal.fire("Los datos capturados no se guardarán", "", "info");
    }
  });
};

const quitarReserva = async (id) => {
  Swal.fire({
    title: "Quitar reserva",
    text: "¿Está seguro de quitar la reserva?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, quitar!",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      $q.loading.show();
      let resp = null;
      if (props.rp == true) {
        resp = await reservasStore.quitarReservaRp(id);
      } else {
        resp = await reservasStore.quitarReservaMr(id);
      }
      if (resp.success) {
        $q.loading.hide();
        $q.notify({
          position: "top-right",
          type: "positive",
          message: resp.data,
        });
        await reservasStore.load_reservas_mr(props.tipo_id);
        await reservasStore.load_reservas_rp(props.tipo_id);
      } else {
        $q.loading.hide();
        $q.notify({
          position: "top-right",
          type: "negative",
          message: resp.data,
        });
      }
    }
  });
};
</script>
