<template>
  <q-table
    :loading="loading"
    :visible-columns="visible_columns"
    :rows="
      rp == true
        ? tipo == 'cotejo'
          ? pendientes_cotejo_rp
          : pendientes_recuento_rp
        : tipo == 'cotejo'
        ? pendientes_cotejo
        : pendientes_recuento
    "
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
              v-if="tipo == 'recuento'"
              flat
              round
              color="green"
              icon="help"
              @click="modalCausales(props.row, true)"
            >
              <q-tooltip>Ver causales</q-tooltip>
            </q-btn>
            <q-btn
              v-if="modulo == null ? false : modulo.registrar"
              flat
              round
              color="pink"
              icon="edit_square"
              @click="tipoComputoAlert(props.row)"
            >
              <q-tooltip>Ver acuerdo</q-tooltip>
            </q-btn>
          </div>

          <label v-else>{{ col.value }}</label>
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <ModalComp
    :rp="props.rp"
    :tipo_id="props.tipo_id"
    :tipo_siglas="props.tipo_siglas"
  />
</template>

<script setup>
import { ref, defineProps, watch, watchEffect, onBeforeMount } from "vue";
import { useCapturaStore } from "src/stores/captura-store";
import { useRerservasStore } from "src/stores/reservas-store";
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth-store";
import { useQuasar, QSpinnerCube } from "quasar";
import ModalComp from "../components/ModalComp.vue";
import Swal from "sweetalert2";

//----------------------------------------------------------

const $q = useQuasar();
const capturaStore = useCapturaStore();
const reservasStore = useRerservasStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const {
  pendientes_cotejo,
  pendientes_cotejo_rp,
  pendientes_recuento,
  pendientes_recuento_rp,
  loading,
  encabezado,
} = storeToRefs(capturaStore);
const casilla_Id = ref(null);
const tipo_Computo = ref(null);
const grupo_Trabajo = ref(null);
const punto_Recuento = ref(null);
const visible_columns = ref([]);
const props = defineProps({
  tipo_siglas: { type: String, required: true },
  tipo_id: { type: Number, required: true },
  tipo: { type: String, required: true },
  rp: { type: Boolean, required: true },
});
const siglas = "SC-CAP-RES";

//----------------------------------------------------------

const columns = [
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
    name: "casilla_Id",
    align: "center",
    label: "casilla_Id",
    field: "casilla_Id",
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

//----------------------------------------------------------

onBeforeMount(() => {
  evalua_columnas();
  leerPermisos();
});

//----------------------------------------------------------

watch(props, (val) => {
  if (val != null) {
    evalua_columnas();
  }
});

watchEffect(() => {
  switch (props.tipo_siglas) {
    case "DIP":
    case "REG":
      if (props.rp == true) {
        if (props.tipo == "cotejo") {
          loading.value = pendientes_cotejo_rp.value.length == 0;
        } else {
          loading.value = pendientes_recuento_rp.value.length == 0;
        }
      } else {
        if (props.tipo == "cotejo") {
          loading.value = pendientes_cotejo.value.length == 0;
        } else {
          loading.value = pendientes_recuento.value.length == 0;
        }
      }
      break;
    case "PYS":
      if (props.tipo == "cotejo") {
        loading.value = pendientes_cotejo.value.length == 0;
      } else {
        loading.value = pendientes_recuento.value.length == 0;
      }
      break;
  }
});

//----------------------------------------------------------

const modalCausales = async (row, valor) => {
  await capturaStore.load_causales_by_casilla(props.tipo_id, row.casilla_Id);
  capturaStore.actualizarModalCausales(valor);
};

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

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

//Cotejo 1
//Recueno parcial 2
const tipoComputoAlert = (row) => {
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
    title: "Tipo de cómputo",
    input: "select",
    inputLabel:
      props.tipo == "cotejo" ? "Se sugiere cotejo" : "Se sugiere recuento",
    inputOptions: {
      cotejo: "Cotejo",
      recuento_Parcial: "Recuento parcial",
      recuento_Total: "Recuento total",
    },
    inputValue: props.tipo == "cotejo" ? "cotejo" : "recuento_Parcial",
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
          resolve("Se necesita seleccionar una opción:)");
        }
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (tipo_Computo.value == 1) {
        resumenCotejo();
      } else {
        recuentoAlert();
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
  let resp = null;
  if (props.rp == true) {
    resp = await reservasStore.reservarRp(id);
  } else {
    resp = await reservasStore.reservarMr(id);
  }
  if (resp.success == true) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    if (props.rp == true) {
      await capturaStore.load_cotejo_rp(props.tipo_id);
      await capturaStore.load_recuento_rp(props.tipo_id);
    } else {
      await capturaStore.load_cotejo(props.tipo_id);
      await capturaStore.load_recuento(props.tipo_id);
    }
    loading.value = false;
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
    });
  }
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

      if (props.rp == true) {
        await capturaStore.incicializar_resultados_rp(
          props.tipo_id,
          casilla_Id.value,
          tipo_Computo.value,
          grupo_Trabajo.value,
          punto_Recuento.value,
          0
        );
      } else {
        await capturaStore.incicializar_resultados(
          props.tipo_id,
          casilla_Id.value,
          tipo_Computo.value,
          grupo_Trabajo.value,
          punto_Recuento.value,
          0
        );
      }
      capturaStore.actualizarModal(true);
      $q.loading.hide();
    } else if (result.isDenied) {
      Swal.fire("Los datos capturados no se guardarán", "", "info");
    }
  });
};

const resumenCotejo = () => {
  Swal.fire({
    title: "Resumen",
    html: `Tipo de cómputo: <b>${
      tipo_Computo.value == 1
        ? "Cotejo"
        : tipo_Computo.value == 2
        ? "Recuento parcial"
        : "Recuento total"
    }</b>`,
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
          0,
          0,
          0
        );
      } else {
        await capturaStore.incicializar_resultados(
          props.tipo_id,
          casilla_Id.value,
          tipo_Computo.value,
          0,
          0,
          0
        );
      }
      capturaStore.actualizarModal(true);
      $q.loading.hide();
    } else if (result.isDenied) {
      Swal.fire("Los datos capturados no se guardarán", "", "info");
    }
  });
};
</script>
