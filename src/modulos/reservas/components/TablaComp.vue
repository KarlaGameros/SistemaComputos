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
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="blue-grey"
          indicator-color="blue-grey"
          align="justify"
          :breakpoint="0"
        >
          <q-tab name="MR" label="Mayoria relativa" />
          <q-tab
            v-if="eleccion == 'DIP' || eleccion == 'REG'"
            name="RP"
            label="Representación proporcional"
          />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="MR">
            <div class="text-h6 text-grey-8">
              Listado de casillas reservadas
            </div>
            <br />
            <div><TablaReservasComp :tipo="'reservasMR'" /></div>
            <br />
          </q-tab-panel>

          <q-tab-panel name="RP">
            <div class="text-h6 text-grey-8">
              Listado de casillas reservadas
            </div>
            <br />
            <div><TablaReservasComp :tipo="'reservasRP'" /></div>
            <br />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { storeToRefs } from "pinia";
import TablaReservasComp from "../components/TablaReservasComp.vue";
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
