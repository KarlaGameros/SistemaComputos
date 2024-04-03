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
              flat
              round
              color="pink"
              icon="edit_square"
              @click="recuentoAlert(props.row)"
            >
              <q-tooltip>Ver acuerdo</q-tooltip>
            </q-btn>
          </div>

          <label v-else>{{ col.value }}</label>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import {
  onBeforeMount,
  ref,
  defineProps,
  onMounted,
  watch,
  watchEffect,
} from "vue";
import { useCapturaStore } from "src/stores/captura-store";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";

//-------------------------------------------------------
const loading = ref(false);
const capturaStore = useCapturaStore();
const {
  pendientes_cotejo,
  pendientes_cotejo_rp,
  pendientes_recuento,
  pendientes_recuento_rp,
} = storeToRefs(capturaStore);
const tipo_Computo = ref(null);
const grupo_Trabajo = ref(null);
const punto_Recuento = ref(null);
const visible_columns = ref([
  "municipio",
  "distrito",
  "seccion",
  "casilla",
  "causales",
  "id",
]);
const props = defineProps({
  tipo_siglas: { type: String, required: true },
  tipo_id: { type: Number, required: true },
  tipo: { type: String, required: true },
  rp: { type: Boolean, required: true },
});
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
    name: "causales",
    align: "center",
    label: "No. Causales",
    field: "causales",
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

const rows = ref([]);
const filter = ref("");
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
});

watch(props, (val) => {
  evalua_columnas();
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
        console.log("--", pendientes_recuento.value);
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

const evalua_columnas = () => {
  switch (props.tipo_siglas) {
    case "DIP":
      visible_columns.value = [
        "municipio",
        "distrito",
        "seccion",
        "casilla",
        "causales",
        "id",
      ];
      break;
    case "PYS":
      visible_columns.value = [
        "municipio",
        "seccion",
        "casilla",
        "causales",
        "id",
      ];
      break;
    case "REG":
      visible_columns.value = [
        "municipio",
        "demarcacion",
        "seccion",
        "casilla",
        "causales",
        "id",
      ];
      break;
  }
};

const recuentoAlert = () => {
  Swal.fire({
    title: "¿Se han reservado votos en esta casilla para esta elección?",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si",
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
    inputLabel: "Se sugiere recuento",
    inputOptions: {
      recuento: "Recuento",
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
          tipo_Computo.value = value;
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
    html: `Tipo de cómputo: <b>${tipo_Computo.value}</b>
    <br />
    Grupo de trabajo: <b>${grupo_Trabajo.value}</b>
    <br />
    Punto de recuento: <b>${punto_Recuento.value}</b>`,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Iniciar captura",
  }).then((result) => {
    if (result.isConfirmed) {
      capturaStore.actualizarModal(true);
    } else if (result.isDenied) {
      Swal.fire("Los datos capturados no se guardarán", "", "info");
    }
  });
};
</script>

<style></style>
