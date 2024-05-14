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
        <q-card-section v-if="resultados.partidos.length > 0">
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
                  <img :src="partido.logo_Url" />
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
        <q-card-section
          v-if="props.rp == false && resultados.coaliciones.length > 0"
        >
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
                  <img :src="coalicion.logo_Url" />
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
                  placeholder="0"
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
                  placeholder="0"
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
                  placeholder="0"
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
                label="Guardar"
                @click="onSubmit"
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
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useCapturaStore } from "src/stores/captura-store";
import { computed, defineProps, watch } from "vue";
import Swal from "sweetalert2";

//----------------------------------------------------------

const $q = useQuasar();
const capturaStore = useCapturaStore();
const { modal, resultados, encabezado } = storeToRefs(capturaStore);
const props = defineProps({
  rp: { type: Boolean, required: true },
  tipo_id: { type: Number, required: true },
  tipo_siglas: { type: String, required: true },
});

//----------------------------------------------------------

const totalVotos = computed(() => {
  let total = 0;
  for (let partido of resultados.value.partidos) {
    total += parseInt(partido.votos);
  }
  for (let coalicion of resultados.value.coaliciones) {
    total += parseInt(coalicion.votos);
  }

  if (
    resultados.value.encabezado.total_Votos_Candidatos_No_Registrados !== ""
  ) {
    total += parseInt(
      resultados.value.encabezado.total_Votos_Candidatos_No_Registrados
    );
  }

  if (resultados.value.encabezado.total_Votos_Nulos !== "") {
    total += parseInt(resultados.value.encabezado.total_Votos_Nulos);
  }

  return total;
});

const actualizarModal = (valor) => {
  capturaStore.actualizarModal(valor);
};

const reload = async () => {
  if (props.tipo_siglas == "PYS") {
    await capturaStore.load_cotejo(props.tipo_id);
    await capturaStore.load_recuento(props.tipo_id);
  } else {
    await capturaStore.load_cotejo(props.tipo_id);
    await capturaStore.load_recuento(props.tipo_id);
    await capturaStore.load_cotejo_rp(props.tipo_id);
    await capturaStore.load_recuento_rp(props.tipo_id);
  }
};

function getFocus(index, tipo) {
  let elementosPartidos = resultados.value.partidos.length;
  let elementosCoaliciones = resultados.value.coaliciones.length;
  if (tipo == "coalicion") {
    if (elementosCoaliciones == index + 1) {
      let docu = document.getElementsByName(`myTextTotales1`);
      docu[1].focus();
      docu[1].select();
    } else {
      let docu = document.getElementsByName(`myTextCoalicion${index + 1}`);
      docu[1].focus();
      docu[1].select();
    }
  } else if (tipo == "partido") {
    if (elementosPartidos == index + 1) {
      let docu = document.getElementsByName(`myTextCoalicion0`);
      docu[1].focus();
      docu[1].select();
    } else {
      let docu = document.getElementsByName(`myText${index + 1}`);
      docu[1].focus();
      docu[1].select();
    }
  } else {
    let docu = document.getElementsByName(`myTextTotales${index + 1}`);
    docu[1].focus();
    docu[1].select();
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
    let total = 0;
    for (let partido of resultados.value.partidos) {
      total += parseInt(partido.votos);
    }
    for (let coalicion of resultados.value.coaliciones) {
      total += parseInt(coalicion.votos);
    }

    total += parseInt(
      resultados.value.encabezado.total_Votos_Candidatos_No_Registrados != ""
        ? resultados.value.encabezado.total_Votos_Candidatos_No_Registrados
        : 0
    );
    total += parseInt(
      resultados.value.encabezado.total_Votos_Nulos != ""
        ? resultados.value.encabezado.total_Votos_Nulos
        : 0
    );

    resultados.value.encabezado.total_Sistema = parseInt(total);
    resultados.value.encabezado.total_Votos = parseInt(
      resultados.value.encabezado.total_Votos
    );
    $q.loading.show();
    if (props.rp == true) {
      resp = await capturaStore.registrarResultadosRp(resultados.value);
    } else {
      resp = await capturaStore.registrarResultados(resultados.value);
    }

    if (resp.success) {
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      reload();
      actualizarModal(false);
    } else {
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
    $q.loading.hide();
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
