<template>
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
import { onBeforeMount, ref, defineProps } from "vue";
import { useCapturaStore } from "src/stores/captura-store";
import Swal from "sweetalert2";

//-------------------------------------------------------

const capturaStore = useCapturaStore();
const tipo_Computo = ref(null);
const grupo_Trabajo = ref(null);
const punto_Recuento = ref(null);
const props = defineProps({
  tipo: { type: String, required: true },
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

onBeforeMount(() => {
  if (props.tipo == "recuentoMR") {
    rows.value.push({
      municipio: "recuento municipio",
      demarcacion: "demarcacion",
      seccion: "seccion",
      casilla: "casilla",
      causales: 3,
      id: 1,
    });
  } else if (props.tipo == "cotejoMR") {
    rows.value.push({
      municipio: "cotejo municipio",
      demarcacion: "demarcacion",
      seccion: "seccion",
      casilla: "casilla",
      causales: 3,
      id: 1,
    });
  } else if (props.tipo == "recuentoRP") {
    rows.value.push({
      municipio: "recuento rp municipio",
      demarcacion: "demarcacion",
      seccion: "seccion",
      casilla: "casilla",
      causales: 3,
      id: 1,
    });
  } else if (props.tipo == "cotejoRP") {
    rows.value.push({
      municipio: "cotejo rp municipio",
      demarcacion: "demarcacion",
      seccion: "seccion",
      casilla: "casilla",
      causales: 3,
      id: 1,
    });
  }
});

//-------------------------------------------------------

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
