<template>
  <template v-if="loadingGeneral">
    <div class="q-pa-md">
      <div class="absolute-center">
        <q-spinner-cube color="blue-grey" size="10.5em" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="q-pa-lg">
      <q-banner
        :class="$q.dark.isActive ? 'text-justify' : 'bg-white'"
        inline-actions
        style="border-radius: 20px"
      >
        <q-btn
          v-for="tipo in list_Tipo_Elecciones"
          :key="tipo"
          @click="set_tipo_eleccion(tipo)"
          :flat="tipo.siglas != eleccion"
          rounded
          color="blue-grey"
          icon="how_to_vote"
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
            <q-tab name="MR" label="Mayoría relativa" />
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
                Listado de casillas sugeridas a cotejo
                <q-icon name="help" color="green">
                  <q-tooltip>No cuenta con causales para recuento</q-tooltip>
                </q-icon>
              </div>
              <br />
              <div>
                <TablaComputadaRecuento
                  :tipo="'cotejo'"
                  :rp="false"
                  :tipo_id="tipo_eleccion_id"
                  :tipo_siglas="eleccion"
                />
              </div>
              <q-separator /><br />
              <div class="text-h6 text-grey-8">
                Listado de casillas sugeridas a recuento
              </div>
              <br />
              <div>
                <TablaComputadaRecuento
                  :tipo="'recuento'"
                  :rp="false"
                  :tipo_id="tipo_eleccion_id"
                  :tipo_siglas="eleccion"
                />
              </div>
              <br />
            </q-tab-panel>
            <q-tab-panel name="RP">
              <div class="text-h6 text-grey-8">
                Listado de casillas sugeridas a cotejo
              </div>
              <br />
              <div>
                <TablaComputadaRecuento
                  :tipo="'cotejo'"
                  :rp="true"
                  :tipo_id="tipo_eleccion_id"
                  :tipo_siglas="eleccion"
                />
              </div>
              <q-separator /><br />
              <div class="text-h6 text-grey-8">
                Listado de casillas sugeridas a recuento
              </div>
              <br />
              <div>
                <TablaComputadaRecuento
                  :tipo="'recuento'"
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
</template>

<script setup>
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { useCapturaStore } from "src/stores/captura-store";
import { storeToRefs } from "pinia";
import TablaComputadaRecuento from "./TablaComputadaRecuento.vue";

//----------------------------------------------------------

const $q = useQuasar();
const capturaStore = useCapturaStore();
const configuracionStore = useConfiguracionStore();
const { list_Tipo_Elecciones } = storeToRefs(configuracionStore);
const eleccion = ref("DIP");
const tipo_eleccion_id = ref(null);
const loadingGeneral = ref(false);
const tab = ref("MR");

//----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//----------------------------------------------------------

const cargarData = async () => {
  loadingGeneral.value = true;
  await configuracionStore.loadMunicipios();
  await configuracionStore.loadTipoElecciones();
  await configuracionStore.loadPartidosPoliticos();
  await configuracionStore.loadCoaliciones();
  tipo_eleccion_id.value = list_Tipo_Elecciones.value[0].id;
  await capturaStore.load_cotejo(tipo_eleccion_id.value);
  await capturaStore.load_cotejo_rp(tipo_eleccion_id.value);
  await capturaStore.load_recuento(tipo_eleccion_id.value);
  await capturaStore.load_recuento_rp(tipo_eleccion_id.value);
  loadingGeneral.value = false;
};

const set_tipo_eleccion = async (tipo) => {
  loadingGeneral.value = true;
  tab.value = "MR";
  eleccion.value = tipo.siglas;
  tipo_eleccion_id.value = tipo.id;
  if (eleccion.value != "PYS") {
    await capturaStore.load_cotejo(tipo_eleccion_id.value);
    await capturaStore.load_cotejo_rp(tipo_eleccion_id.value);
    await capturaStore.load_recuento(tipo_eleccion_id.value);
    await capturaStore.load_recuento_rp(tipo_eleccion_id.value);
  } else {
    await capturaStore.load_cotejo(tipo_eleccion_id.value);
    await capturaStore.load_recuento(tipo_eleccion_id.value);
  }
  loadingGeneral.value = false;
};
</script>
