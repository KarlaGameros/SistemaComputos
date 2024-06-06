<template>
  <q-dialog
    v-model="modalVa"
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
          <q-banner v-show="visible" class="bg-red">
            <template v-slot:avatar>
              <q-icon name="warning" color="white" />
            </template>
            <div class="text-white text-bold">
              El total de votos es mayor al número de boletas entregadas
            </div>
          </q-banner>
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
              v-for="(partido, index) in resultadosVa.partidos"
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
        <q-card-section>
          <div
            class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6"
          >
            Coaliciones
          </div>
          <br />
          <div class="row q-gutter-md q-pl-xl" style="margin: 20px">
            <q-card
              v-for="(coalicion, index) in resultadosVa.coaliciones"
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
                    resultadosVa.encabezado
                      .total_Votos_Candidatos_No_Registrados
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
                  v-model="resultadosVa.encabezado.total_Votos_Nulos"
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
                  v-model="resultadosVa.encabezado.total_Votos"
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
                icon-right="cancel"
                label="Cancelar"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                icon-right="check_circle"
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
import { computed, defineProps, onMounted, ref, watchEffect } from "vue";
import { useAuthStore } from "src/stores/auth-store";
import { useRerservasStore } from "src/stores/reservas-store";
import Swal from "sweetalert2";

//----------------------------------------------------------

const $q = useQuasar();
const reservasStore = useRerservasStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { modalVa, encabezado, resultadosVa } = storeToRefs(reservasStore);
const props = defineProps({
  eleccion: { type: String, required: true },
});
const siglas = "SC-RES-VA";
const visible = ref(false);
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
  if (
    totalVotos.value > resultadosVa.value.boletas ||
    resultadosVa.value.encabezado.total_Votos > resultadosVa.value.boletas
  ) {
    visible.value = true;
  } else {
    visible.value = false;
  }

  let total = 0;
  for (let partido of resultadosVa.value.partidos) {
    if (partido.votos == "" || partido.votos == NaN) {
      partido.votos = 0;
    }
    total += parseInt(partido.votos);
  }
  for (let coalicion of resultadosVa.value.coaliciones) {
    if (coalicion.votos == "" || coalicion.votos == NaN) {
      coalicion.votos = 0;
    }
    total += parseInt(coalicion.votos);
  }
  if (
    resultadosVa.value.encabezado.total_Votos_Candidatos_No_Registrados !== ""
  ) {
    total += parseInt(
      resultadosVa.value.encabezado.total_Votos_Candidatos_No_Registrados
    );
  }
  if (resultadosVa.value.encabezado.total_Votos_Nulos !== "") {
    total += parseInt(resultadosVa.value.encabezado.total_Votos_Nulos);
  }
  totalVotos.value = total;
});

const actualizarModal = (valor) => {
  reservasStore.actualizarModalVa(valor);
};

function getFocus(index, tipo) {
  let elementosPartidos = resultadosVa.value.partidos.length;
  let elementosCoaliciones = resultadosVa.value.coaliciones.length;
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
      color: "secondary",
      label: "Sí, enviar!",
    },
    cancel: {
      color: "red",
      label: " No, Cancelar!",
    },
  }).onOk(async () => {
    let total = 0;
    for (let partido of resultadosVa.value.partidos) {
      if (partido.votos == "" || partido.votos == NaN) {
        partido.votos = 0;
      }
      total += parseInt(partido.votos);
    }
    for (let coalicion of resultadosVa.value.coaliciones) {
      if (coalicion.votos == "" || coalicion.votos == NaN) {
        coalicion.votos = 0;
      }
      total += parseInt(coalicion.votos);
    }

    total += parseInt(
      resultadosVa.value.encabezado.total_Votos_Candidatos_No_Registrados != ""
        ? resultadosVa.value.encabezado.total_Votos_Candidatos_No_Registrados
        : 0
    );
    total += parseInt(
      resultadosVa.value.encabezado.total_Votos_Nulos != ""
        ? resultadosVa.value.encabezado.total_Votos_Candidatos_No_Registrados
        : 0
    );

    resultadosVa.value.encabezado.total_Sistema = parseInt(total);
    resultadosVa.value.encabezado.total_Votos = parseInt(
      resultadosVa.value.encabezado.total_Votos
    );
    $q.loading.show({
      spinner: QSpinnerCube,
      spinnerColor: "blue-grey",
      spinnerSize: 140,
      backgroundColor: "purple-2",
      message: "Espere un momento por favor...",
      messageColor: "black",
    });
    resp = await reservasStore.registrarResultadosVA(resultadosVa.value);

    if (resp.success) {
      $q.loading.hide();
      Swal.fire({
        icon: "success",
        title: resp.data,
        showConfirmButton: false,
        timer: 1500,
      });
      reservasStore.actualizarTablaReservasVA(true);
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
