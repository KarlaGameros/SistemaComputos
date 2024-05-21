<template>
  <div class="q-pa-lg">
    <q-banner
      inline-actions
      :class="$q.dark.isActive ? 'text-justify' : 'bg-white'"
      style="border-radius: 20px"
    >
      <q-btn
        v-for="tipo in list_Tipo_Elecciones"
        :key="tipo"
        @click="set_tipo_eleccion(tipo)"
        :flat="tipo.siglas != eleccion"
        rounded
        icon="how_to_vote"
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
            <div>
              <TablaReservasComp
                :rp="false"
                :tipo_id="tipo_eleccion_id"
                :tipo_siglas="eleccion"
              />
            </div>
            <br />
          </q-tab-panel>

          <q-tab-panel name="RP">
            <div class="text-h6 text-grey-8">
              Listado de casillas reservadas
            </div>
            <br />
            <div>
              <TablaReservasComp
                :rp="true"
                :tipo_id="tipo_eleccion_id"
                :tipo_siglas="eleccion"
              />
            </div>
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
import { useRerservasStore } from "src/stores/reservas-store";
import TablaReservasComp from "../components/TablaReservasComp.vue";

//-----------------------------------------------------------

const configuracionStore = useConfiguracionStore();
const reservasStore = useRerservasStore();
const { list_Tipo_Elecciones } = storeToRefs(configuracionStore);
const eleccion = ref("DIP");
const tipo_eleccion_id = ref(null);
const loading = ref(false);
const tab = ref("MR");

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  loading.value = true;
  await configuracionStore.loadTipoElecciones();
  tipo_eleccion_id.value = list_Tipo_Elecciones.value[0].id;
  await configuracionStore.loadPartidosPoliticos();
  await configuracionStore.loadCoaliciones();
  await reservasStore.load_reservas_mr(tipo_eleccion_id.value);
  await reservasStore.load_reservas_rp(tipo_eleccion_id.value);
  loading.value = false;
};

const set_tipo_eleccion = (tipo) => {
  tab.value = "MR";
  eleccion.value = tipo.siglas;
  tipo_eleccion_id.value = tipo.id;

  switch (eleccion.value) {
    case "DIP":
    case "REG":
      reservasStore.load_reservas_mr(tipo_eleccion_id.value);
      reservasStore.load_reservas_rp(tipo_eleccion_id.value);
      break;
    case "PYS":
      reservasStore.load_reservas_mr(tipo_eleccion_id.value);
      break;
  }
};
</script>

<style></style>
