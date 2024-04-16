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
          <q-banner
            inline-actions
            class="text-justify bg-white"
            style="border-radius: 20px"
          >
            <q-btn
              :flat="integracion == false"
              @click="integracion = true"
              rounded
              color="blue-grey"
              label="Integración CLE"
            />
            <q-btn
              @click="integracion = false"
              rounded
              :flat="integracion == true"
              color="blue-grey"
              label="Partidos políticos"
            />
          </q-banner>
        </q-card-section>
        <q-card-section>
          <q-table
            :rows="
              integracion == false
                ? list_Integracion_Partidos
                : list_Integracion_Consejerias
            "
            :columns="columns"
            :filter="filter"
            :visible-columns="visible_columns"
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

        <q-card-section class="q-pa-md">
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                type="submit"
                label="Consultar"
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
import { onBeforeMount, ref, watch } from "vue";

//-----------------------------------------------------------

const $q = useQuasar();
const consultaStore = useConsultaStore();
const {
  modalIntegracion,
  list_Integracion_Partidos,
  list_Integracion_Consejerias,
} = storeToRefs(consultaStore);
const integracion = ref(true);
const visible_columns = ref([]);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

watch(integracion, (val) => {
  if (val != null) {
    evalua_columnas();
  }
});

//-----------------------------------------------------------

const evalua_columnas = () => {
  switch (integracion.value) {
    case true:
      visible_columns.value = ["nombre_Completo", "puesto", "id"];
      break;
    case false:
      visible_columns.value = [
        "nombre_Completo",
        "puesto",
        "logo_Partido",
        "id",
      ];
      break;
  }
};

const cargarData = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "pink",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento porfavor...",
    messageColor: "black",
  });
  evalua_columnas();
  await consultaStore.loadIntegracionConsejerias();
  await consultaStore.loadIntegracionPartidosPoliticos();
  consultaStore.actualizarModal(true);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  consultaStore.actualizarModalIntegracion(valor);
};

const onSubmit = () => {};

const columns = [
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
    label: "Puesto",
    field: "puesto",
    sortable: true,
  },
  {
    name: "logo_Partido",
    align: "center",
    label: "Partido",
    field: "logo_Partido",
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
