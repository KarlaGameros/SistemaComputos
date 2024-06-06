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
                  :mask="
                    encabezado.casilla.includes('Especial') ? '####' : '###'
                  "
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
                v-if="modulo == null ? false : modulo.registrar"
                label="Guardar"
                type="submit"
                color="secondary"
                class="q-ml-sm"
                icon-right="check_circle"
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
import { useCapturaStore } from "src/stores/captura-store";
import { defineProps, onBeforeMount, ref, watchEffect } from "vue";
import { useAuthStore } from "src/stores/auth-store";
import Swal from "sweetalert2";

//----------------------------------------------------------

const $q = useQuasar();
const capturaStore = useCapturaStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { modal, resultados, encabezado, loading } = storeToRefs(capturaStore);
const props = defineProps({
  rp: { type: Boolean, required: true },
  tipo_id: { type: Number, required: true },
  tipo_siglas: { type: String, required: true },
});
const visible = ref(false);
const siglas = "SC-CAP-RES";
const totalVotos = ref(0);

//----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//----------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

watchEffect(() => {
  if (
    totalVotos.value > resultados.value.boletas ||
    resultados.value.encabezado.total_Votos > resultados.value.boletas
  ) {
    visible.value = true;
  } else {
    visible.value = false;
  }

  let total = 0;
  for (let partido of resultados.value.partidos) {
    if (partido.votos == "" || partido.votos == NaN) {
      partido.votos = 0;
    }
    total += parseInt(partido.votos);
  }
  for (let coalicion of resultados.value.coaliciones) {
    if (coalicion.votos == "" || coalicion.votos == NaN) {
      coalicion.votos = 0;
    }
    total += parseInt(coalicion.votos);
  }
  // if (resultados.value.encabezado.total_Votos_Candidatos_No_Registrados != "") {
  //   total += parseInt(
  //     resultados.value.encabezado.total_Votos_Candidatos_No_Registrados
  //   );
  // }
  if (
    resultados.value.encabezado.total_Votos_Candidatos_No_Registrados == "" ||
    resultados.value.encabezado.total_Votos_Candidatos_No_Registrados == NaN
  ) {
    resultados.value.encabezado.total_Votos_Candidatos_No_Registrados = 0;
  }
  total += parseInt(
    resultados.value.encabezado.total_Votos_Candidatos_No_Registrados
  );
  // if (resultados.value.encabezado.total_Votos_Nulos != "") {
  //   total += parseInt(resultados.value.encabezado.total_Votos_Nulos);
  // }
  if (
    resultados.value.encabezado.total_Votos_Nulos == "" ||
    resultados.value.encabezado.total_Votos_Nulos == NaN
  ) {
    resultados.value.encabezado.total_Votos_Nulos = 0;
  }
  total += parseInt(resultados.value.encabezado.total_Votos_Nulos);
  totalVotos.value = total;
});

const actualizarModal = (valor) => {
  if (resultados.value.encabezado.total_Sistema == 0) {
    $q.dialog({
      title: "Atención",
      message: "Deberá guardar la información",
      icon: "Warning",
      html: true,
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      cancel: "Regresar",
      ok: false,
    });
  } else {
    capturaStore.initResultados();
    capturaStore.intiEncabezado();
    capturaStore.actualizarModal(valor);
  }
};

const reload = async () => {
  loading.value = true;
  if (props.tipo_siglas == "PYS") {
    await capturaStore.load_cotejo(props.tipo_id);
    await capturaStore.load_recuento(props.tipo_id);
  } else {
    await capturaStore.load_cotejo(props.tipo_id);
    await capturaStore.load_recuento(props.tipo_id);
    await capturaStore.load_cotejo_rp(props.tipo_id);
    await capturaStore.load_recuento_rp(props.tipo_id);
  }
  capturaStore.cargarFiltrosTabla(true);
  loading.value = false;
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
  let total = 0;
  $q.dialog({
    title: "¿Esta seguro de enviar los resultados?",
    message:
      props.tipo_siglas == "DIP"
        ? `<ul>
      <li>Elección: ${encabezado.value.eleccion}</li>
      <li>Municipio: ${encabezado.value.municipio}</li>
      <li>Distrito: ${encabezado.value.distrito}</li>
      <li>Sección: ${encabezado.value.seccion}</li>
      <li>Casilla: ${encabezado.value.casilla}</li>
      </ul>`
        : props.tipo_siglas == "PYS"
        ? `<ul>
      <li>Elección: ${encabezado.value.eleccion}</li>
      <li>Municipio: ${encabezado.value.municipio}</li>
      <li>Sección: ${encabezado.value.seccion}</li>
      <li>Casilla: ${encabezado.value.casilla}</li>
      </ul>`
        : `<ul>
      <li>Elección: ${encabezado.value.eleccion}</li>
      <li>Municipio: ${encabezado.value.municipio}</li>
      <li>Demarcación: ${encabezado.value.demarcacion}</li>
      <li>Sección: ${encabezado.value.seccion}</li>
      </ul>`,
    icon: "Warning",
    html: true,
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    cancel: {
      iconRight: "red",
      color: "red",
      label: " No, Cancelar!",
    },
    ok: {
      color: "secondary",
      label: "Sí, enviar!",
      iconRight: "check_circle",
    },
  }).onOk(async () => {
    $q.loading.show({
      spinner: QSpinnerCube,
      spinnerColor: "blue-grey",
      spinnerSize: 140,
      backgroundColor: "purple-2",
      message: "Espere un momento por favor...",
      messageColor: "black",
    });

    for (let partido of resultados.value.partidos) {
      if (partido.votos == "" || partido.votos == NaN) {
        partido.votos = 0;
      }
      total += parseInt(partido.votos);
    }
    for (let coalicion of resultados.value.coaliciones) {
      if (coalicion.votos == "" || coalicion.votos == NaN) {
        coalicion.votos = 0;
      }
      total += parseInt(coalicion.votos);
    }
    // if (
    //   resultados.value.encabezado.total_Votos_Candidatos_No_Registrados != ""
    // ) {
    //   total += parseInt(
    //     resultados.value.encabezado.total_Votos_Candidatos_No_Registrados
    //   );
    // }
    total += parseInt(
      resultados.value.encabezado.total_Votos_Candidatos_No_Registrados
    );
    // if (resultados.value.encabezado.total_Votos_Nulos != "") {
    //   total += parseInt(resultados.value.encabezado.total_Votos_Nulos);
    // }
    total += parseInt(resultados.value.encabezado.total_Votos_Nulos);
    resultados.value.encabezado.total_Sistema = parseInt(
      total == 0 ? totalVotos.value : total
    );
    resultados.value.encabezado.total_Votos = parseInt(
      resultados.value.encabezado.total_Votos
    );
    parseInt(resultados.value.encabezado.total_Votos_Candidatos_No_Registrados);
    parseInt(resultados.value.encabezado.total_Votos_Nulos);
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
      reload();
      actualizarModal(false);
      capturaStore.cargarFiltrosTabla(false);
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
