<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 400px; max-width: 45vw">
      <q-card-section class="row">
        <div class="text-subtitle1 text-bold">
          Seleccione que resultados desea revisar
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
        <q-select
          v-model="tipo_Eleccion"
          :options="list_Tipo_Elecciones"
          label="Tipo de elección"
        />
      </q-card-section>
      <q-card-section v-if="tipo_Eleccion != null">
        <div
          v-if="tipo_Eleccion.siglas == 'DIP' || tipo_Eleccion.siglas == 'REG'"
        >
          <q-radio
            color="pink"
            v-model="tipo_Candidatura"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="MR"
            label="MR"
          />
          <q-radio
            color="pink"
            v-model="tipo_Candidatura"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="RP"
            label="RP"
          />
        </div>
        <q-select
          v-if="tipo_Eleccion.siglas == 'DIP'"
          v-model="distrito_Id"
          :options="list_Distritos"
          label="Distrio"
        />
        <q-select
          v-if="tipo_Eleccion.siglas == 'PYS' || tipo_Eleccion.siglas == 'REG'"
          v-model="municipio_Id"
          :options="list_Municipios"
          label="Municipio"
        />
        <q-select
          v-if="tipo_Eleccion.siglas == 'REG'"
          v-model="demarcacion_Id"
          :options="list_Demarcaciones"
          label="Demarcación"
        />
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
              @click="consultar(false)"
              label="Consultar"
              color="secondary"
              class="q-ml-sm"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { useConsultaStore } from "src/stores/consulta-store";
import { onBeforeMount, ref, watch } from "vue";

//-----------------------------------------------------------

const consultaStore = useConsultaStore();
const configuracionStore = useConfiguracionStore();
const { modal } = storeToRefs(consultaStore);
const {
  list_Tipo_Elecciones,
  list_Municipios,
  list_Demarcaciones,
  list_Distritos,
} = storeToRefs(configuracionStore);
const tipo_Eleccion = ref(null);
const tipo_Candidatura = ref("MR");
const distrito_Id = ref(null);
const municipio_Id = ref(null);
const demarcacion_Id = ref(null);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  await configuracionStore.loadTipoElecciones();
  await configuracionStore.loadMunicipios();
  await configuracionStore.loadDistritos();
  actualizarModal(true);
};

const actualizarModal = (valor) => {
  consultaStore.actualizarModal(valor);
};

const consultar = (valor) => {
  consultaStore.actualizarModal(valor);
};

const cargarDemarcacion = async (id) => {
  await configuracionStore.loadDemarcaciones(id);
};
//-----------------------------------------------------------

watch(municipio_Id, (val) => {
  if (val != null) {
    demarcacion_Id.value = null;
    cargarDemarcacion(val.value);
  }
});
</script>

<style></style>
