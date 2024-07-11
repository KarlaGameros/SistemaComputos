<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-blue-grey-1" style="width: auto; max-width: 200vw">
      <q-form @submit="onSubmit">
        <div class="flotante">
          <div class="row bg-blue-grey-3 q-pl-md text-bold">
            <div class="text-h6">
              Resultados de la sección {{ encabezado.seccion }} de la casilla
              {{ encabezado.casilla }} de la elección a
              {{ encabezado.eleccion }}.
              {{
                encabezado.eleccion == "Diputaciones"
                  ? `Municipio ${encabezado.municipio} - Distrito ${encabezado.distrito}`
                  : encabezado.eleccion == "Regidurías"
                  ? `Municipio ${encabezado.municipio} - ${encabezado.demarcacion}`
                  : `Municipio ${encabezado.municipio}`
              }}
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
          </div>
          <div class="row bg-blue-grey-3 q-pl-md text-bold text-h6">
            Total de votos sistema: {{ totalVotos }}
          </div>
        </div>
        <q-card-section>
          <div
            class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6"
          >
            Partidos políticos
          </div>
          <br />
          <div class="row q-gutter-md q-pl-xl" style="margin: 20px">
            <q-card
              v-for="(partido, index) in resultados.partidos"
              :key="partido"
              style="border-radius: 8px"
              class="my-card text-center no-box-shadow"
            >
              <q-card-section>
                <q-avatar style="width: auto" square>
                  <img :src="partido.logo_Url" :alt="partido.partido" />
                </q-avatar>
                <div class="text-grey-8 text-bold q-ma-sm">
                  {{ partido.partido }}
                </div>
              </q-card-section>
              <q-card-section>
                <q-input
                  class="text-h6"
                  mask="###"
                  :name="`myText${index}`"
                  dense
                  input-class="text-right"
                  v-model="partido.votos"
                  @keydown.enter.prevent="getFocus(index, 'partido')"
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section v-if="props.rp == false">
          <div
            class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6"
          >
            Coaliciones
          </div>
          <br />
          <div class="row q-gutter-md q-pl-xl" style="margin: 20px">
            <q-card
              v-for="(coalicion, index) in resultados.coaliciones"
              :key="coalicion"
              style="border-radius: 8px"
              class="my-card text-center no-box-shadow"
            >
              <q-card-section>
                <q-avatar square style="width: auto">
                  <img :src="coalicion.logo_Url" :alt="coalicion.combinacion" />
                </q-avatar>
                <div class="text-grey-8 text-bold q-pa-sm">
                  {{ coalicion.combinacion }}
                </div>
              </q-card-section>
              <q-card-section>
                <q-input
                  class="text-h6"
                  mask="###"
                  :name="`myTextCoalicion${index}`"
                  dense
                  input-class="text-right"
                  v-model="coalicion.votos"
                  @keydown.enter.prevent="getFocus(index, 'coalicion')"
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section>
          <div
            class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6"
          >
            Totales
          </div>
          <br />
        </q-card-section>
        <q-card-section class="row">
          <div class="col-lg-4 col-md-6 col-xs-6 q-pa-sm">
            <q-card
              style="border-radius: 8px"
              class="my-card text-center no-box-shadow"
            >
              <q-card-section>
                <div class="text-h6 text-bold text-grey-8">
                  Candidatos no registrados
                </div>
              </q-card-section>
              <q-card-section>
                <q-input
                  class="text-h6"
                  v-model="
                    resultados.encabezado.total_Votos_Candidatos_No_Registrados
                  "
                  mask="###"
                  :name="`myTextTotales1`"
                  dense
                  input-class="text-right"
                  @keydown.enter.prevent="getFocus(1, 'totales')"
                />
              </q-card-section>
            </q-card>
          </div>
          <div class="col-lg-4 col-md-6 col-xs-6 q-pa-sm">
            <q-card
              style="border-radius: 8px"
              class="my-card text-center no-box-shadow"
            >
              <q-card-section>
                <div class="text-h6 text-bold text-grey-8">Votos nulos</div>
              </q-card-section>
              <q-card-section>
                <q-input
                  class="text-h6"
                  v-model="resultados.encabezado.total_Votos_Nulos"
                  mask="###"
                  :name="`myTextTotales2`"
                  dense
                  input-class="text-right"
                  @keydown.enter.prevent="getFocus(2, 'totales')"
                />
              </q-card-section>
            </q-card>
          </div>
          <div class="col-lg-4 col-md-6 col-xs-6 q-pa-sm">
            <q-card
              style="border-radius: 8px"
              class="my-card text-center no-box-shadow"
            >
              <q-card-section>
                <div class="text-h6 text-bold text-grey-8">Total votos</div>
              </q-card-section>
              <q-card-section>
                <q-input
                  class="text-h6"
                  v-model="resultados.encabezado.total_Votos"
                  mask="###"
                  :name="`myTextTotales3`"
                  dense
                  input-class="text-right"
                  @keydown.enter.prevent="getFocus(3, 'totales')"
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                v-if="modulo == null ? false : modulo.registrar"
                label="Guardar"
                type="submit"
                color="secondary"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar, QSpinnerCube } from "quasar";
import { storeToRefs } from "pinia";
import {
  computed,
  defineProps,
  onBeforeMount,
  onMounted,
  ref,
  watchEffect,
} from "vue";
import { useAuthStore } from "src/stores/auth-store";
import { useRerservasStore } from "src/stores/reservas-store";
import { useCapturaStore } from "src/stores/captura-store";
import Swal from "sweetalert2";

//----------------------------------------------------------

const $q = useQuasar();
const reservasStore = useRerservasStore();
const capturaStore = useCapturaStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { modal, encabezado } = storeToRefs(reservasStore);
const { resultados } = storeToRefs(capturaStore);
const props = defineProps({
  eleccion: { type: String, required: true },
  rp: { type: Boolean, required: true },
});
const siglas = "SC-REG-RES";
const totalVotos = ref(0);

//----------------------------------------------------------

onMounted(() => {
  leerPermisos();
});

//--------------------------------------------------------------------

const leerPermisos = async () => {
  await authStore.loadModulo(siglas);
};

watchEffect(() => {
  let total = 0;
  let totalPartido = resultados.value.partidos.reduce(
    (accumulator, partido) =>
      accumulator +
      parseInt(partido.votos == "" || partido.votos == NaN ? 0 : partido.votos),
    total
  );
  let totalCoalicion = resultados.value.coaliciones.reduce(
    (accumulator, coalicion) =>
      accumulator +
      parseInt(
        coalicion.votos == "" || coalicion.votos == NaN ? 0 : coalicion.votos
      ),
    total
  );
  total += parseInt(
    resultados.value.encabezado.total_Votos_Candidatos_No_Registrados == ""
      ? 0
      : resultados.value.encabezado.total_Votos_Candidatos_No_Registrados
  );
  total += parseInt(
    resultados.value.encabezado.total_Votos_Nulos == ""
      ? 0
      : resultados.value.encabezado.total_Votos_Nulos
  );
  totalVotos.value = totalPartido + totalCoalicion + total;
});

const actualizarModal = (valor) => {
  reservasStore.actualizarModal(valor);
};

function getFocus(index, tipo) {
  let elementosPartidos = resultados.value.partidos.length;
  let elementosCoaliciones = resultados.value.coaliciones.length;
  if (tipo == "coalicion") {
    if (elementosCoaliciones == index + 1) {
      let docu = document.getElementsByName(`myTextTotales1`);
      docu[0].focus();
      docu[0].select();
    } else {
      let docu = document.getElementsByName(`myTextCoalicion${index + 1}`);
      docu[0].focus();
      docu[0].select();
    }
  } else if (tipo == "partido") {
    if (elementosPartidos == index + 1) {
      let docu = document.getElementsByName(`myTextCoalicion0`);
      docu[0].focus();
      docu[0].select();
    } else {
      let docu = document.getElementsByName(`myText${index + 1}`);
      docu[0].focus();
      docu[0].select();
    }
  } else {
    let docu = document.getElementsByName(`myTextTotales${index + 1}`);
    docu[0].focus();
    docu[0].select();
  }
}

const onSubmit = async () => {
  let resp = null;
  $q.dialog({
    title: "¿Esta seguro de enviar los resultados?",
    message: "Será afectada la base de datos.",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "Sí, enviar!",
    },
    cancel: {
      color: "negative",
      label: " No, Cancelar!",
    },
  }).onOk(async () => {
    resultados.value.encabezado.total_Sistema = parseInt(totalVotos.value);
    resultados.value.encabezado.total_Votos = parseInt(
      resultados.value.encabezado.total_Votos
    );
    resultados.value.encabezado.total_Votos_Candidatos_No_Registrados =
      parseInt(
        resultados.value.encabezado.total_Votos_Candidatos_No_Registrados
      );
    resultados.value.encabezado.total_Votos_Nulos = parseInt(
      resultados.value.encabezado.total_Votos_Nulos
    );
    $q.loading.show({
      spinner: QSpinnerCube,
      spinnerColor: "blue-grey",
      spinnerSize: 140,
      backgroundColor: "purple-2",
      message: "Espere un momento por favor...",
      messageColor: "black",
    });
    if (props.rp == true) {
      resp = await capturaStore.registrarResultadosRp(resultados.value);
    } else {
      resp = await capturaStore.registrarResultados(resultados.value);
    }

    if (resp.success) {
      $q.loading.hide();
      Swal.fire({
        icon: "success",
        title: resp.data,
        showConfirmButton: false,
        timer: 1500,
      });
      reservasStore.actualizarTabla(true);
      actualizarModal(false);
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  });
};
</script>
<style scoped>
.flotante {
  position: sticky;
  top: 10px;
  z-index: 999;
}
</style>
