<template>
  <div class="q-pa-lg">
    <q-table
      title="Listado de solicitudes"
      :rows="rows"
      :columns="columns"
      :filter="filter"
      row-key="name"
      v-model:pagination="pagination"
      color="pink"
      class="text-grey-8"
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
                icon="search"
                @click="verCaptura(props.row)"
              >
                <q-tooltip>Ver captura</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="pink"
                icon="check_circle"
                @click="aprobarSolicitud(props.row)"
              >
                <q-tooltip>Aprobar solicitud</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="pink"
                icon="cancel"
                @click="rechazarSolicitud(props.row)"
              >
                <q-tooltip>Rechazar solicitud</q-tooltip>
              </q-btn>
            </div>
            <label v-else>{{ col.value }}</label>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCasillaStore } from "src/stores/casilla-store";
import Swal from "sweetalert2";

//-----------------------------------------------------------

const casillaStore = useCasillaStore();
const rows = ref([
  {
    tipo_eleccion: "Diputaciones",
    municipio: "Tepic",
    seccion: 5,
    casilla: 10,
    usuario: "Karla",
    estatus: "Pendiente",
    id: 1,
  },
]);
const columns = [
  {
    name: "tipo_eleccion",
    align: "center",
    label: "Tipo elección",
    field: "tipo_eleccion",
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
    name: "usuario",
    align: "center",
    label: "Usuario",
    field: "usuario",
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

//-----------------------------------------------------------

const verCaptura = async (row) => {
  await casillaStore.load_resultados_mr(row.id);
  casillaStore.actualizarModal(true);
};

const aprobarSolicitud = () => {
  Swal.fire({
    title: "¿Está seguro de aprobar la solicitud de corrección?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, aprobar",
    cancelButtonText: "No, cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Aprobada",
        text: "Su solicitud de corrección ha sido aprobada.",
        icon: "success",
      });
    }
  });
};

const rechazarSolicitud = () => {
  Swal.fire({
    title: "¿Está seguro de rechazar la solicitud de corrección?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, rechazar",
    cancelButtonText: "No, cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Solicitud rechazada",
        text: "Su solicitud de corrección ha sido rechazada.",
        icon: "success",
      });
    }
  });
};
</script>
