<template>
  <q-dialog
    v-model="modalPartidos"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 1000px; max-width: 85vw">
      <q-form @submit="onSubmit">
        <q-card-section class="row">
          <div class="text-h6 text-bold">
            Registrar asistencia de partidos políticos
          </div>
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
          <q-table
            :rows="list_Integracion_Partidos"
            :columns="columns"
            :filter="filter"
            :pagination="pagination"
            row-key="name"
            color="pink"
            v-model:pagination="pagination"
            style="height: 600px"
            flat
            bordered
            virtual-scroll
            :rows-per-page-options="[0]"
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
                  <div v-if="col.name === 'id_Propietario'">
                    <q-btn
                      size="lg"
                      flat
                      round
                      :color="
                        props.row.presente_Propietario == true ? 'green' : 'red'
                      "
                      :icon="
                        props.row.presente_Propietario == true
                          ? 'check_circle'
                          : 'cancel'
                      "
                      @click="
                        props.row.presente_Propietario =
                          !props.row.presente_Propietario
                      "
                    />
                  </div>
                  <div v-else-if="col.name === 'id_Suplente'">
                    <q-btn
                      size="lg"
                      flat
                      round
                      :color="
                        props.row.presente_Suplente == true ? 'green' : 'red'
                      "
                      :icon="
                        props.row.presente_Suplente == true
                          ? 'check_circle'
                          : 'cancel'
                      "
                      @click="
                        props.row.presente_Suplente =
                          !props.row.presente_Suplente
                      "
                    />
                  </div>
                  <div v-else-if="col.name === 'logo_Partido'">
                    <q-avatar
                      square
                      v-if="col.value != null"
                      style="width: auto; height: 45px"
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
        <q-card-section class="q-pa-md">
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                @click="cambiarRepresentante(true)"
                label="Cambiar representante"
                type="reset"
                icon-right="sync_alt"
                color="orange"
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
const { modalPartidos, list_Integracion_Partidos } = storeToRefs(consultaStore);

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
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  consultaStore.actualizarModalPartidos(valor);
};

const cambiarRepresentante = (valor) => {
  consultaStore.actualizarModalPartidos(false);
  consultaStore.actualizarModalCambiar(valor);
};

const onSubmit = () => {};

const columns = [
  {
    name: "logo_Partido",
    align: "center",
    label: "Partido político",
    field: "logo_Partido",
    sortable: true,
  },
  {
    name: "nombre_Completo_Propietario",
    align: "center",
    label: "Nombre propietario",
    field: "nombre_Completo_Propietario",
    sortable: true,
  },
  {
    name: "id_Propietario",
    align: "center",
    label: "Asistencia",
    field: "id_Propietario",
    sortable: true,
  },
  {
    name: "nombre_Completo_Suplente",
    align: "center",
    label: "Nombre suplente",
    field: "nombre_Completo_Suplente",
    sortable: true,
  },
  {
    name: "id_Suplente",
    align: "center",
    label: "Asistencia",
    field: "id_Suplente",
    sortable: true,
  },
];

const filter = ref("");
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 11,
});
</script>
