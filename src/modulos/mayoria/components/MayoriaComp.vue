<template>
  <div class="q-pa-lg">
    <q-banner
      inline-actions
      :class="$q.dark.isActive ? 'text-justify' : 'text-justify bg-white'"
      style="border-radius: 20px"
    >
      <q-btn
        v-for="tipo in list_Tipo_Elecciones_Mayoria"
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
            class="col-2 q-pr-sm"
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
          <div class="col-2 q-pr-sm" v-if="eleccion == 'REG' && tab == 'MR'">
            <q-select
              dense
              outlined
              v-model="demarcacion_Id"
              :options="list_Demarcaciones"
              label="Seleccione demarcación"
            />
          </div>
          <q-btn
            v-if="tab == 'MR' || eleccion == 'REG'"
            :disable="
              eleccion == 'DIP'
                ? distrito_Id == null
                : eleccion == 'REG' && tab == 'MR'
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

          <q-select
            v-if="tab == 'RP'"
            :disable="eleccion == 'REG' && municipio_Id == null"
            class="col-3"
            dense
            outlined
            v-model="partido_Id"
            :options="list_Partidos_Politicos"
            label="Seleccione partido"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar v-if="scope.opt.logo_URL != null">
                  <q-img :src="scope.opt.logo_URL" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template></q-select
          >
          <q-select
            class="col-3"
            v-if="tab == 'RP'"
            dense
            outlined
            v-model="candidato_Id"
            :options="list_Candidatos_By_Partido"
            label="Seleccione la candidatura"
            lazy-rules
            :rules="[(val) => !!val || 'La candidatura es requerida']"
          />

          <q-btn
            :disable="
              (eleccion != 'REG' &&
                tab == 'MR' &&
                datos_grafica.ganador_Id == null) ||
              (eleccion == 'DIP' &&
                tab == 'RP' &&
                (partido_Id == null || candidato_Id == null)) ||
              (eleccion == 'REG' &&
                tab == 'MR' &&
                datos_grafica.ganador_Id == null) ||
              (eleccion == 'REG' &&
                tab == 'RP' &&
                (municipio_Id == null ||
                  partido_Id == null ||
                  candidato_Id == null))
            "
            icon="download"
            @click="generarConstancia"
            class="bg-pink-ieen"
            label="Descargar constancia"
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
import { EncryptStorage } from "storage-encryption";
import { useQuasar, QSpinnerCube } from "quasar";
import chartMayoria from "src/charts/chartMayoria.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const configuracionStore = useConfiguracionStore();
const mayoriaStore = useMayoriaStore();
const { datos_grafica } = storeToRefs(mayoriaStore);
const {
  list_Tipo_Elecciones_Mayoria,
  list_Municipios,
  list_Distritos,
  list_Demarcaciones,
  list_Partidos_Politicos,
  list_Candidatos_By_Partido,
} = storeToRefs(configuracionStore);
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const eleccion = ref("DIP");
const tipo_eleccion_id = ref(null);
const distrito_Id = ref(null);
const municipio_Id = ref(null);
const demarcacion_Id = ref(null);
const tab = ref("MR");
const loading = ref(false);
const oficina = encryptStorage.decrypt("oficina_Letra");
const candidato_Id = ref(null);
const partido_Id = ref(null);

//-----------------------------------------------------------

onBeforeMount(() => {
  mayoriaStore.initGrafica();
  limpiarFiltro();
  cargarData();
});

watch(partido_Id, async (val) => {
  if (val != null && tab.value == "RP" && eleccion.value == "REG") {
    $q.loading.show();
    await configuracionStore.loadCandidatosByPartido(
      val.value,
      tipo_eleccion_id.value,
      municipio_Id.value.value
    );
    candidato_Id.value = null;
    $q.loading.hide();
  }
  if (val != null && tab.value == "RP" && eleccion.value == "DIP") {
    $q.loading.show();
    await configuracionStore.loadCandidatosByPartido(
      val.value,
      tipo_eleccion_id.value,
      null
    );
    candidato_Id.value = null;
    $q.loading.hide();
  }
});

watch(municipio_Id, (val) => {
  if (val != null && eleccion.value == "REG") {
    demarcacion_Id.value = null;
    partido_Id.value = null;
    candidato_Id.value = null;
    configuracionStore.loadDemarcaciones(val.value);
  }
});

watch(eleccion, (val) => {
  if (val != null) {
    partido_Id.value = null;
    candidato_Id.value = null;
    tab.value = "MR";
    limpiarFiltro();
  }
});

watch(tab, async (val) => {
  if (val != null) {
    $q.loading.show();
    partido_Id.value = null;
    candidato_Id.value = null;
    mayoriaStore.initGrafica();
    limpiarFiltro();
    if (val == "RP" && eleccion.value == "DIP") {
      await mayoriaStore.cosultaResultadosRP(tipo_eleccion_id.value);
    }
    $q.loading.hide();
  }
});

watch(list_Tipo_Elecciones_Mayoria, (val) => {
  if (val.length > 0) {
    tipo_eleccion_id.value = val[0].id;
    eleccion.value = val[0].siglas;
  }
});

//-----------------------------------------------------------

const generar = async () => {
  $q.loading.show();

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
  $q.loading.hide();
};

const generarConstancia = async () => {
  if (
    tab.value == "RP" &&
    eleccion.value == "REG" &&
    candidato_Id.value == null
  ) {
    $q.dialog({
      title: "Atención",
      message: "Deberá seleccionar una candidatura",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: false,
      cancel: {
        color: "negative",
        label: "Regresar",
      },
    });
  } else {
    $q.loading.show({
      spinner: QSpinnerCube,
      spinnerColor: "blue-grey",
      spinnerSize: 140,
      backgroundColor: "purple-2",
      message: "Espere un momento porfavor...",
      messageColor: "black",
    });
    let resp = null;
    if (tab.value == "MR") {
      resp = await mayoriaStore.generarConstancia(
        datos_grafica.value.ganador_Id
      );
    } else {
      resp = await mayoriaStore.generarConstancia(candidato_Id.value.value);
    }
    if (resp.success == true) {
      const link = document.createElement("a");
      link.href = mayoriaStore.ganadorPDF;
      link.setAttribute("download", `Constancia.pdf`);
      document.body.appendChild(link);
      link.click();
    } else {
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
    $q.loading.hide();
  }
};

const limpiarFiltro = () => {
  distrito_Id.value = null;
  municipio_Id.value = null;
  demarcacion_Id.value = null;
};

const cargarData = async () => {
  await configuracionStore.loadMunicipios();
  await configuracionStore.loadDistritos();
  await configuracionStore.loadTipoEleccionesMayoria();
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
