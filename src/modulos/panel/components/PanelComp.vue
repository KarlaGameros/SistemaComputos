<template>
  <q-page class="q-pa-sm">
    <div class="row bg-white q-ma-sm q-pa-md text-h6 text-grey-8">
      Avance Estatal
    </div>
    <div class="bg-white q-ma-sm q-pa-md">
      <div class="text-subtitle1 text-grey-8">
        Descarga las bases de datos de los diferentes tipos de elecciones.
      </div>
      <q-btn
        v-for="eleccion in list_Tipo_Elecciones"
        :key="eleccion"
        icon="fa-solid fa-file-excel"
        rounded
        color="grey-3"
        text-color="grey-7"
        unelevated
        :label="eleccion.nombre"
        class="q-ma-xs"
      />
    </div>
    <div class="row">
      <q-card
        v-for="(item, index) in items"
        :key="index"
        class="my-card q-ma-sm"
        flat
      >
        <q-card-section class="q-pa-none">
          <q-item class="q-pa-none">
            <q-item-section class="q-pa-md q-ml-none">
              <q-item-label class="text-h6 text-weight-bolder">{{
                item.progreso
              }}</q-item-label>
              <q-item-label>{{ item.eleccion }}</q-item-label>
            </q-item-section>
            <q-item-section side class="q-mr-md text-white">
              <q-circular-progress
                show-value
                class="text-light-blue q-ma-md"
                :value="item.progreso"
                size="70px"
                track-color="grey-3"
                color="light-blue"
              >
                {{ item.progreso }}%
              </q-circular-progress>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12 bg-white q-ma-sm">
      <chartEstadisticaEstatal />
    </div>
    <div class="bg-white q-ma-sm q-pa-md">
      <div class="text-h6 text-grey-8">
        Actas esperadas vs Actas capturadas por tipo de elección Estatal
      </div>
    </div>
    <div class="row">
      <div v-for="item in items" :key="item" class="col-4">
        <q-card flat class="my-card q-ma-sm">
          <q-card-section>
            <div class="text-center text-h6 text-grey-8">
              {{ item.siglas }}
            </div>
            <chartCapturadaEsperadas />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row">
      <div v-for="item in list_Municipios" :key="item" class="col-6">
        <q-card flat class="my-card q-ma-sm">
          <q-card-section>
            <div class="text-left text-h6 text-grey-8">
              {{ item.label }}
            </div>
            <charMunicipioCE />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import chartCapturadaEsperadas from "src/charts/chartCapturadaEsperadas.vue";
import chartEstadisticaEstatal from "src/charts/chartEstadisticaEstatal.vue";
import charMunicipioCE from "src/charts/chartMunicipioCE.vue";

const configuracionStore = useConfiguracionStore();
const { list_Tipo_Elecciones, list_Municipios } =
  storeToRefs(configuracionStore);

onBeforeMount(() => {
  cargarData();
});

const cargarData = async () => {
  await configuracionStore.loadMunicipios();
  await configuracionStore.loadTipoElecciones();
};

const items = ref([
  { siglas: "DIP MR", eleccion: "Diputaciones MR", progreso: 30 },
  { siglas: "DIP RP", eleccion: "Diputaciones RP", progreso: 10 },
  { siglas: "PYS", eleccion: "Presidencias y Sindicaturas", progreso: 90 },
  { siglas: "REG MR", eleccion: "Regidurías MR", progreso: 100 },
  { siglas: "REG RP", eleccion: "Regidurías RP", progreso: 35 },
]);
</script>

<style></style>
