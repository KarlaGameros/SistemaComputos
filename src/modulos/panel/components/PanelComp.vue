<template>
  <template v-if="loading">
    <div class="q-pa-md">
      <div class="absolute-center">
        <q-spinner-cube color="blue-grey" size="10.5em" />
      </div>
    </div>
  </template>
  <template v-else>
    <q-page class="q-pa-sm">
      <div class="text-right">
        <b>Ultima actualización:</b> {{ fecha.toLocaleString() }}
      </div>
      <div
        :style="$q.dark.isActive ? 'border: solid' : ''"
        :class="
          $q.dark.isActive
            ? 'row q-ma-sm q-pa-md text-h6'
            : 'row bg-white q-ma-sm q-pa-md text-h6 text-grey-8'
        "
      >
        <q-icon name="bar_chart" size="md"></q-icon>
        {{
          oficina == "CME central IEEN" ? "Avance Estatal" : `Avance ${oficina}`
        }}
      </div>
      <div
        :style="$q.dark.isActive ? 'border: solid' : ''"
        :class="
          $q.dark.isActive ? 'q-ma-sm q-pa-md' : 'bg-white q-ma-sm q-pa-md'
        "
      >
        <div
          :class="
            $q.dark.isActive ? 'text-subtitle1  ' : 'text-subtitle1 text-grey-8'
          "
        >
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
          @click="descargarExcel(eleccion)"
        />
      </div>
      <div class="row">
        <q-card
          v-for="(item, index) in items"
          :key="index"
          class="col-lg-2 col-sm-5 col-md-5 col-xs-12 q-ma-sm"
          flat
        >
          <q-card-section class="q-pa-none">
            <q-item class="q-pa-none">
              <q-item-section class="q-pa-sm">
                <q-item-label class="text-h6 text-weight-bolder">{{
                  item.progreso
                }}</q-item-label>
                <q-item-label class="text-bold">{{
                  item.eleccion
                }}</q-item-label>
              </q-item-section>
              <q-item-section side class="q-mr-sm text-white">
                <q-circular-progress
                  show-value
                  class="text-light-blue q-ma-sm"
                  :value="
                    item.siglas == 'DIP MR'
                      ? avance.capturadas_Dip_MR
                      : item.siglas == 'DIP RP'
                      ? avance.capturadas_Dip_RP
                      : item.siglas == 'PYS'
                      ? avance.capturadas_Pys
                      : item.siglas == 'REG MR'
                      ? avance.capturadas_Reg_MR
                      : item.siglas == 'REG RP'
                      ? avance.capturadas_Reg_Rp == null
                        ? 0
                        : avance.capturadas_Reg_Rp
                      : avance.capturadas_Va
                  "
                  size="70px"
                  track-color="grey-3"
                  color="light-blue"
                >
                  {{
                    item.siglas == "DIP MR"
                      ? avance.capturadas_Dip_MR.toFixed(1)
                      : item.siglas == "DIP RP"
                      ? avance.capturadas_Dip_RP.toFixed(1)
                      : item.siglas == "PYS"
                      ? avance.capturadas_Pys.toFixed(1)
                      : item.siglas == "REG MR"
                      ? avance.capturadas_Reg_MR.toFixed(1)
                      : item.siglas == "REG RP"
                      ? avance.capturadas_Reg_Rp == null
                        ? 0
                        : avance.capturadas_Reg_Rp.toFixed(1)
                      : avance.capturadas_Va.toFixed(1)
                  }}%
                </q-circular-progress>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
      <div
        v-if="oficina == 'CME central IEEN'"
        :class="$q.dark.isActive ? 'col-12 q-ma-sm' : 'col-12 bg-white q-ma-sm'"
      >
        <chartEstadisticaEstatal />
      </div>
      <div
        v-if="oficina == 'CME central IEEN'"
        :style="$q.dark.isActive ? 'border: solid' : ''"
        :class="
          $q.dark.isActive ? 'q-ma-sm q-pa-md' : 'bg-white q-ma-sm q-pa-md'
        "
      >
        <div :class="$q.dark.isActive ? 'text-h6' : 'text-h6 text-grey-8'">
          Actas esperadas vs Actas capturadas por tipo de elección Estatal
        </div>
      </div>
      <div v-if="oficina == 'CME central IEEN'" class="row">
        <div
          v-for="item in items"
          :key="item"
          class="col-lg-4 col-md-6 col-sm-12 col-xs-12"
        >
          <q-card flat class="my-card q-ma-sm">
            <q-card-section>
              <div class="text-center text-h6 text-grey-8">
                {{ item.siglas }}
              </div>
              <chartCapturadaEsperadas :tipo="item.siglas" />
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row">
        <div
          v-for="item in avance.municipios"
          :key="item"
          :class="
            oficina == 'CME central IEEN'
              ? 'col-lg-6 col-md-6 col-sm-12 col-xs-12'
              : 'col-12'
          "
        >
          <q-card flat class="my-card q-ma-sm">
            <q-card-section>
              <div
                :class="
                  $q.dark.isActive
                    ? 'text-left text-h6'
                    : 'text-left text-h6 text-grey-8'
                "
              >
                {{ item.nombre }}
              </div>
              <charMunicipioCE :municipio="item.nombre" :id="item.id" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </template>
</template>

<script setup>
import { useQuasar, QSpinnerCube } from "quasar";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { useDasboardStore } from "src/stores/dasboard-store";
import { EncryptStorage } from "storage-encryption";
import chartCapturadaEsperadas from "src/charts/chartCapturadaEsperadas.vue";
import chartEstadisticaEstatal from "src/charts/chartEstadisticaEstatal.vue";
import charMunicipioCE from "src/charts/chartMunicipioCE.vue";

//----------------------------------------------------------

const $q = useQuasar();
const configuracionStore = useConfiguracionStore();
const dashboardStore = useDasboardStore();
const { avance } = storeToRefs(dashboardStore);
const { list_Tipo_Elecciones } = storeToRefs(configuracionStore);
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const items = ref([
  { siglas: "DIP MR", eleccion: "Diputaciones MR" },
  { siglas: "DIP RP", eleccion: "Diputaciones RP" },
  { siglas: "PYS", eleccion: "Presidencias y Sindicaturas" },
  { siglas: "REG MR", eleccion: "Regidurías MR" },
  { siglas: "REG RP", eleccion: "Regidurías RP" },
  { siglas: "VA", eleccion: "Voto anticipado" },
]);
const loading = ref(false);
const oficina = encryptStorage.decrypt("oficina_Letra");
const fecha = ref(null);

//----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//----------------------------------------------------------

const cargarData = async () => {
  loading.value = true;
  dashboardStore.initAvance();
  dashboardStore.initAvanceCME();
  dashboardStore.initAvanceEstatal();
  await dashboardStore.loadAvance();
  await dashboardStore.loadAvanceEstatal();
  await configuracionStore.loadTipoElecciones();
  loading.value = false;
  let date = new Date();
  fecha.value = date;
};

setInterval(() => {
  cargarData();
}, 15 * 60 * 1000);

const descargarExcel = async (eleccion) => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "blue-grey",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento por favor...",
    messageColor: "black",
  });
  await dashboardStore.downloadExcel(eleccion.siglas);
  const link = document.createElement("a");
  link.href = dashboardStore.documentoExcel;
  link.setAttribute("download", `${eleccion.nombre}.xlsx`);
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};
</script>
