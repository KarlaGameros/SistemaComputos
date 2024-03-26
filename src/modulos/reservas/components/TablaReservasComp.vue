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
</template>

<script setup>
import { onBeforeMount, ref, defineProps } from "vue";
import { useCapturaStore } from "src/stores/captura-store";
import Swal from "sweetalert2";

//-------------------------------------------------------

const capturaStore = useCapturaStore();
const votos_Reservados = ref(null);
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
  if (props.tipo == "reservasMR") {
    rows.value.push({
      municipio: "reservasMR municipio",
      demarcacion: "demarcacion",
      seccion: "seccion",
      casilla: "casilla",
      causales: 3,
      id: 1,
    });
  } else if (props.tipo == "reservasRP") {
    rows.value.push({
      municipio: "reservasRP rp municipio",
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
    title: "Votos Reservados",
    html: `
    <p>Ingresa la cantidad de votos reservados para esta casilla y tipo de elección.</p>
    <input type="number" id="swal-input1" class="swal2-input">
  `,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i> `,
    preConfirm: () => {
      return [
        (votos_Reservados.value = document.getElementById("swal-input1").value),
      ];
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
    html: `
    <p>Ingresa el número de grupo de trabajo.</p>
    <input type="number" id="swal-input2" class="swal2-input">
  `,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i> `,
    preConfirm: () => {
      return [
        (grupo_Trabajo.value = document.getElementById("swal-input2").value),
      ];
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
    html: `
    <p>Ingresa el número de punto de recuento.</p>
    <input type="number" id="swal-input3" class="swal2-input">
  `,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i> `,
    preConfirm: () => {
      return [
        (punto_Recuento.value = document.getElementById("swal-input3").value),
      ];
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
