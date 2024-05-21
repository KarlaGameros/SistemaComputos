<template>
  <div class="q-pa-lg">
    <q-banner
      inline-actions
      :class="$q.dark.isActive ? 'text-justify' : 'text-justify bg-white'"
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
          <q-tab name="MR" label="Mayoría relativa" />
          <q-tab
            v-if="eleccion == 'DIP' || eleccion == 'REG'"
            name="RP"
            label="Representación proporcional"
          />
        </q-tabs>
        <q-card-section class="row">
          <div class="col-4 q-pr-sm" v-if="eleccion == 'DIP' && tab == 'MR'">
            <q-select
              dense
              outlined
              v-model="distrito_Id"
              :options="list_Distritos"
              label="Seleccione distrito"
            />
          </div>
          <div
            class="col-4 q-pr-sm"
            v-if="eleccion == 'PYS' || eleccion == 'REG'"
          >
            <q-select
              dense
              outlined
              v-model="municipio_Id"
              :options="list_Municipios"
              label="Seleccione municipio"
            />
          </div>
          <div class="col-4 q-pr-sm" v-if="eleccion == 'REG' && tab == 'MR'">
            <q-select
              dense
              outlined
              v-model="demarcacion_Id"
              :options="list_Demarcaciones"
              label="Seleccione demarcación"
            />
          </div>
          <q-btn
            v-if="tab == 'MR'"
            :disable="
              eleccion == 'DIP'
                ? distrito_Id == null
                : eleccion == 'REG'
                ? municipio_Id == null || demarcacion_Id == null
                : eleccion == 'PYS'
                ? municipio_Id == null
                : eleccion == 'REG'
                ? municipio_Id == null
                : eleccion == 'DIP' && tab == 'RP'
                ? distrito_Id != null
                : ''
            "
            @click="generar"
            color="secondary"
            icon="bar_chart"
            label="Generar"
          />
        </q-card-section>
        <q-card-section v-if="datos_grafica.primero != null">
          <div class="row q-col-gutter-sm">
            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item
                class="q-pa-none bg-blue-grey-3"
                style="border-radius: 5px"
              >
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">
                    Primero: {{ datos_grafica.primero.toLocaleString("en-US") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item
                class="q-pa-none bg-blue-grey-3"
                style="border-radius: 5px"
              >
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">
                    Segundo:
                    {{ datos_grafica.segundo.toLocaleString("en-US") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item
                class="q-pa-none bg-blue-grey-3"
                style="border-radius: 5px"
              >
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">
                    Diferencia:
                    {{ datos_grafica.diferecia.toLocaleString("en-US") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item
                class="q-pa-none bg-blue-grey-3"
                style="border-radius: 5px"
              >
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">
                    Porcentaje: {{ datos_grafica.porcentaje }}%
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-card-section>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="MR">
            <q-card-section>
              <chartMayoria />
            </q-card-section>
          </q-tab-panel>
          <q-tab-panel name="RP">
            <q-card-section>
              <chartMayoria />
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { storeToRefs } from "pinia";
import { useMayoriaStore } from "src/stores/mayoria-store";
import chartMayoria from "src/charts/chartMayoria.vue";

//-----------------------------------------------------------

const configuracionStore = useConfiguracionStore();
const mayoriaStore = useMayoriaStore();
const { datos_grafica } = storeToRefs(mayoriaStore);
const {
  list_Tipo_Elecciones,
  list_Municipios,
  list_Distritos,
  list_Demarcaciones,
} = storeToRefs(configuracionStore);
const eleccion = ref("DIP");
const tipo_eleccion_id = ref(null);
const distrito_Id = ref(null);
const municipio_Id = ref(null);
const demarcacion_Id = ref(null);
const tab = ref("MR");
const loading = ref(false);

//-----------------------------------------------------------

onBeforeMount(() => {
  mayoriaStore.initGrafica();
  limpiarFiltro();
  cargarData();
});

watch(municipio_Id, (val) => {
  if (val != null && eleccion.value == "REG") {
    configuracionStore.loadDemarcaciones(val.value);
  }
});

watch(eleccion, (val) => {
  if (val != null) {
    tab.value = "MR";
    limpiarFiltro();
  }
});

watch(tab, (val) => {
  if (val != null) {
    mayoriaStore.initGrafica();
    limpiarFiltro();
    if (val == "RP" && eleccion.value == "DIP") {
      mayoriaStore.cosultaResultadosRP(tipo_eleccion_id.value);
    }
  }
});

watch(list_Tipo_Elecciones, (val) => {
  if (val.length > 0) {
    tipo_eleccion_id.value = val[0].id;
  }
});

//-----------------------------------------------------------

const generar = async () => {
  loading.value = true;
  if (eleccion.value == "DIP") {
    if (tab.value == "MR") {
      await mayoriaStore.cosultaResultadosMr(
        tipo_eleccion_id.value,
        distrito_Id.value.value
      );
    } else {
      await mayoriaStore.cosultaResultadosRP(tipo_eleccion_id.value);
    }
  } else if (eleccion.value == "PYS") {
    await mayoriaStore.cosultaResultadosPYS(
      tipo_eleccion_id.value,
      municipio_Id.value.value
    );
  } else if (eleccion.value == "REG") {
    if (tab.value == "MR") {
      await mayoriaStore.cosultaResultadosREGMr(
        tipo_eleccion_id.value,
        municipio_Id.value.value,
        demarcacion_Id.value.value
      );
    } else {
      await mayoriaStore.cosultaResultadosREGRP(
        tipo_eleccion_id.value,
        municipio_Id.value.value
      );
    }
  }
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};

const limpiarFiltro = () => {
  distrito_Id.value = null;
  municipio_Id.value = null;
  demarcacion_Id.value = null;
};

const cargarData = async () => {
  await configuracionStore.loadMunicipios();
  await configuracionStore.loadDistritos();
  await configuracionStore.loadTipoElecciones();
  await configuracionStore.loadPartidosPoliticos();
  await configuracionStore.loadCoaliciones();
  limpiarFiltro();
};

const set_tipo_eleccion = (tipo) => {
  tab.value = "MR";
  eleccion.value = tipo.siglas;
  tipo_eleccion_id.value = tipo.id;
  mayoriaStore.initGrafica();
  limpiarFiltro();
};
</script>
