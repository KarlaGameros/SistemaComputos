<template>
  <div class="q-pa-lg">
    <q-banner
      inline-actions
      class="text-justify bg-white"
      style="border-radius: 20px"
    >
      <q-btn
        v-for="tipo in list_Tipo_Elecciones"
        :key="tipo"
        @click="eleccion = tipo.siglas"
        :flat="tipo.siglas != eleccion"
        rounded
        icon="layers"
        color="blue-grey"
        :label="tipo.nombre"
      />
    </q-banner>
    <div class="q-pt-md">
      <q-card>
        <q-card-section class="row">
          <div class="col-4 q-pr-sm">
            <q-select
              dense
              outlined
              v-model="model"
              :options="options"
              label="Outlined"
            />
          </div>
          <q-btn color="secondary" icon="bar_chart" label="Generar" />
        </q-card-section>
        <q-card-section>
          <chartMayoria />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { storeToRefs } from "pinia";
import chartMayoria from "src/charts/chartMayoria.vue";

//-----------------------------------------------------------

const configuracionStore = useConfiguracionStore();
const { list_Tipo_Elecciones } = storeToRefs(configuracionStore);
const eleccion = ref("DIP");

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  await configuracionStore.loadTipoElecciones();
  await configuracionStore.loadPartidosPoliticos();
  await configuracionStore.loadCoaliciones();
};

const list_Cargo = ref([
  { siglas: "MR", nombre: "Mayoria relativa" },
  { siglas: "RP", nombre: "Representación proporcional" },
]);
const tab = ref("MR");
</script>

<style></style>
