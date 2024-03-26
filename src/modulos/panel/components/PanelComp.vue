<template>
  <q-page class="q-pa-sm">
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
  </q-page>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import chartEstadisticaEstatal from "src/charts/chartEstadisticaEstatal.vue";

const configuracionStore = useConfiguracionStore();

onBeforeMount(() => {
  cargarData();
});

const cargarData = async () => {
  await configuracionStore.loadMunicipios();
};

const items = ref([
  { eleccion: "Diputaciones MR", progreso: 30 },
  { eleccion: "Diputaciones RP", progreso: 10 },
  { eleccion: "Presidencias y Sindicaturas", progreso: 90 },
  { eleccion: "Regidurías MR", progreso: 100 },
  { eleccion: "Regidurías RP", progreso: 35 },
]);
</script>

<style></style>
