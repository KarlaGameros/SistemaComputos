<template>
  <q-dialog
    v-model="modalIntegracion"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 850px; max-width: 85vw">
      <q-form @submit="onSubmit">
        <q-card-section class="row">
          <div class="text-h6 text-bold">Información complementaria</div>
          <q-space />
          <q-btn
            icon="close"
            @click="actualizarModal(false)"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>

        <q-card-section>
          <div class="text-h6 text-grey-9">Asistencia de consejerías</div>
          <q-table
            dense
            :rows="list_Integracion_Consejerias"
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
                      size="lg"
                      flat
                      round
                      :color="props.row.presente == true ? 'green' : 'red'"
                      :icon="
                        props.row.presente == true ? 'check_circle' : 'cancel'
                      "
                      @click="props.row.presente = !props.row.presente"
                    />
                  </div>
                  <div v-else-if="col.name === 'logo_Partido'">
                    <q-avatar
                      square
                      v-if="col.value != null"
                      style="width: auto; height: 35px"
                    >
                      <img :src="col.value" alt="" />
                      <q-tooltip>{{ props.row.partido }}</q-tooltip>
                    </q-avatar>
                  </div>
                  <label v-else>{{ col.value }}</label>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-separator />
        <q-card-section class="row">
          <div class="text-h6 text-grey-9 col-6">
            Asistencia de partidos políticos
          </div>
          <div class="text-right col-6">
            <q-btn
              label="Agregar"
              color="pink"
              icon-right="add"
              @click="actualizarModalPartidos(true)"
            />
          </div>
          <div v-for="partido in list_Integracion_Partidos" :key="partido">
            <q-avatar
              v-if="partido.presente_Propietario || partido.presente_Suplente"
              square
              style="width: auto; height: 45px"
              class="q-pa-xs"
            >
              <img :src="partido.logo_Partido" :alt="partido.partido" />
            </q-avatar>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-md">
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                icon-right="close"
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                icon-right="save"
                type="submit"
                label="Guardar"
                color="secondary"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerCube } from "quasar";
import { useConsultaStore } from "src/stores/consulta-store";
import { onBeforeMount, ref } from "vue";

//-----------------------------------------------------------

const $q = useQuasar();
const consultaStore = useConsultaStore();
const {
  modalIntegracion,
  list_Integracion_Partidos,
  list_Integracion_Consejerias,
} = storeToRefs(consultaStore);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "pink",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento porfavor...",
    messageColor: "black",
  });
  await consultaStore.loadIntegracionConsejerias();
  await consultaStore.loadIntegracionPartidosPoliticos();
  consultaStore.actualizarModal(true);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  consultaStore.actualizarModalIntegracion(valor);
};

const actualizarModalPartidos = (valor) => {
  consultaStore.actualizarModalPartidos(valor);
};

const onSubmit = () => {};

const columns = [
  {
    name: "oficina",
    align: "center",
    label: "Oficina",
    field: "oficina",
    sortable: true,
  },
  {
    name: "nombre_Completo",
    align: "center",
    label: "Nombre",
    field: "nombre_Completo",
    sortable: true,
  },
  {
    name: "puesto",
    align: "center",
    label: "Cargo",
    field: "puesto",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Asistencia",
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
