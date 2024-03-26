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
  </div>
</template>

<script setup>
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
</script>

<style></style>
