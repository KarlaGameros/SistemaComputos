<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      :class="$q.dark.isActive ? '' : 'bg-blue-grey-1'"
      style="width: auto; max-width: 200vw"
    >
      <q-form @submit="onSubmit">
        <div class="flotante">
          <div class="row bg-blue-grey-3 q-pl-md text-bold">
            <div class="text-h6">
              Resultados voto anticipado de la elección a
              {{
                encabezado.eleccion == "DIP"
                  ? "Diputaciones"
                  : encabezado.eleccion == "PYS"
                  ? "Presidencias y Sindicaturas"
                  : "Regidurías"
              }}.
              {{
                encabezado.eleccion == "DIP"
                  ? `Distrito ${encabezado.distrito}`
                  : encabezado.eleccion == "REG"
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
          <q-banner v-show="totalVotos > resultadosVA.boletas" class="bg-red">
            <template v-slot:avatar>
              <q-icon name="warning" color="white" />
            </template>
            <div class="text-white text-bold">
              El total de votos es mayor al número de boletas entregadas
            </div>
          </q-banner>
        </div>
        <q-card-section v-if="resultadosVA.partidos.length > 0">
          <div
            class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6"
          >
            Partidos políticos
          </div>
          <br />
          <div class="row q-gutter-md q-pl-xl" style="margin: 20px">
            <q-card
              v-for="(partido, index) in resultadosVA.partidos"
              :key="partido"
              style="border-radius: 8px"
              class="my-card text-center no-box-shadow"
            >
              <q-card-section>
                <q-avatar style="width: auto" square>
                  <img :src="partido.logo_Url" :alt="partido.partido" />
                </q-avatar>
                <div
                  :class="
                    $q.dark.isActive
                      ? 'text-h6 text-bold q-ma-sm'
                      : 'text-grey-8 text-bold q-ma-sm'
                  "
                >
                  {{ partido.partido }}
                </div>
              </q-card-section>
              <q-card-section>
                <q-input
                  :disable="visualizar"
                  :class="$q.dark.isActive ? 'text-h6 text-white' : 'text-h6'"
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
        <q-card-section v-if="resultadosVA.coaliciones.length > 0">
          <div
            class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6"
          >
            Coaliciones
          </div>
          <br />
          <div class="row q-gutter-md q-pl-xl" style="margin: 20px">
            <q-card
              v-for="(coalicion, index) in resultadosVA.coaliciones"
              :key="coalicion"
              style="border-radius: 8px"
              class="my-card text-center no-box-shadow"
            >
              <q-card-section>
                <q-avatar square style="width: auto">
                  <img :src="coalicion.logo_Url" :alt="coalicion.combinacion" />
                </q-avatar>
                <div
                  :class="
                    $q.dark.isActive
                      ? 'text-h6 text-bold q-ma-sm'
                      : 'text-grey-8 text-bold q-ma-sm'
                  "
                >
                  {{ coalicion.combinacion }}
                </div>
              </q-card-section>
              <q-card-section>
                <q-input
                  :disable="visualizar"
                  :class="$q.dark.isActive ? 'text-h6 text-white' : 'text-h6'"
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
                <div
                  :class="
                    $q.dark.isActive
                      ? 'text-h6 text-bold'
                      : 'text-h6 text-bold text-grey-8'
                  "
                >
                  Candidatos no registrados
                </div>
              </q-card-section>
              <q-card-section>
                <q-input
                  :disable="visualizar"
                  class="text-h6"
                  v-model="
                    resultadosVA.encabezado
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
                <div
                  :class="
                    $q.dark.isActive
                      ? 'text-h6 text-bold'
                      : 'text-h6 text-bold text-grey-8'
                  "
                >
                  Votos nulos
                </div>
              </q-card-section>
              <q-card-section>
                <q-input
                  :disable="visualizar"
                  class="text-h6"
                  v-model="resultadosVA.encabezado.total_Votos_Nulos"
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
                <div
                  :class="
                    $q.dark.isActive
                      ? 'text-h6 text-bold'
                      : 'text-h6 text-bold text-grey-8'
                  "
                >
                  Total votos
                </div>
              </q-card-section>
              <q-card-section>
                <q-input
                  :disable="visualizar"
                  class="text-h6"
                  v-model="resultadosVA.encabezado.total_Votos"
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
                v-if="modulo == null ? false : modulo.registrar && !visualizar"
                icon-right="check_circle"
                label="Guardar"
                type="submit"
                color="secondary"
                class="q-ml-sm"
              />
              <q-btn
                icon-right="check_circle"
                v-if="modulo == null ? false : modulo.registrar && visualizar"
                label="Solicitar corrección"
                @click="solicitarCorreccion"
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
import { computed, onBeforeMount, ref, watchEffect } from "vue";
import { useVotoAnticipadoStore } from "src/stores/votoAnticipado-store";
import { useSolicitudesStore } from "src/stores/solicitudes-store";
import { useAuthStore } from "src/stores/auth-store";
import Swal from "sweetalert2";

//----------------------------------------------------------

const $q = useQuasar();
const solicitudesStore = useSolicitudesStore();
const votoAnticipadoStore = useVotoAnticipadoStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { modal, resultadosVA, encabezado, visualizar } =
  storeToRefs(votoAnticipadoStore);
const siglas = "SC-CAP-VA";
const motivo = ref(null);
const totalVotos = ref(0);

//----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//----------------------------------------------------------

watchEffect(() => {
  let total = 0;
  for (let partido of resultadosVA.value.partidos) {
    if (partido.votos == "" || partido.votos == NaN) {
      partido.votos = 0;
    }
    total += parseInt(partido.votos);
  }
  for (let coalicion of resultadosVA.value.coaliciones) {
    if (coalicion.votos == "" || coalicion.votos == NaN) {
      coalicion.votos = 0;
    }
    total += parseInt(coalicion.votos);
  }
  if (
    resultadosVA.value.encabezado.total_Votos_Candidatos_No_Registrados !== ""
  ) {
    total += parseInt(
      resultadosVA.value.encabezado.total_Votos_Candidatos_No_Registrados
    );
  }
  if (resultadosVA.value.encabezado.total_Votos_Nulos !== "") {
    total += parseInt(resultadosVA.value.encabezado.total_Votos_Nulos);
  }
  totalVotos.value = total;
});
//----------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  motivo.value = null;
  votoAnticipadoStore.initResultado();
  votoAnticipadoStore.initEncabezado();
  votoAnticipadoStore.actualizarVisualizar(false);
  votoAnticipadoStore.actualizarModal(valor);
};

function getFocus(index, tipo) {
  let elementosPartidos = resultadosVA.value.partidos.length;
  let elementosCoaliciones = resultadosVA.value.coaliciones.length;
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

const solicitarCorreccion = async () => {
  votoAnticipadoStore.actualizarModal(false);
  Swal.fire({
    title: "¿Está seguro de solicitar corrección?",
    inputLabel: "Especifique motivo",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, solicitar!",
    cancelButtonText: "No, cancelar",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    customClass: {
      container: "my-swal",
    },
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value != "") {
          motivo.value = value;
          resolve();
        } else {
          resolve("Campo vacio");
        }
      });
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      $q.loading.show({
        spinner: QSpinnerCube,
        spinnerColor: "blue-grey",
        spinnerSize: 140,
        backgroundColor: "purple-2",
        message: "Espere un momento por favor...",
        messageColor: "black",
      });
      let motivoObj = { motivo: motivo.value };
      let resp = await solicitudesStore.solicitarCorreccion(
        resultadosVA.value.encabezado.id,
        "VA",
        motivoObj
      );
      if (resp.success == true) {
        Swal.fire({
          title: "Correccion solicitada!",
          text: "Su corrección ha sido solicitada",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        actualizarModal(false);
      } else {
        $q.loading.hide();
        $q.notify({
          position: "top-right",
          type: "negative",
          message: resp.data,
        });
      }
      $q.loading.hide();
    }
  });
};

const onSubmit = async () => {
  if (visualizar.value == true) {
    votoAnticipadoStore.actualizarModal(false);
    Swal.fire({
      title: "¿Está seguro de solicitar corrección?",
      inputLabel: "Especifique motivo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, solicitar!",
      cancelButtonText: "No, cancelar",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      customClass: {
        container: "my-swal",
      },
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value != "") {
            motivo.value = value;
            resolve();
          } else {
            resolve("Campo vacio");
          }
        });
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        $q.loading.show({
          spinner: QSpinnerCube,
          spinnerColor: "blue-grey",
          spinnerSize: 140,
          backgroundColor: "purple-2",
          message: "Espere un momento por favor...",
          messageColor: "black",
        });
        let motivoObj = { motivo: motivo.value };
        let resp = await solicitudesStore.solicitarCorreccion(
          resultado_casilla.value.id,
          resultado_casilla.value.tipoCandidatura,
          motivoObj
        );
        if (resp.success == true) {
          Swal.fire({
            title: "Correccion solicitada!",
            text: "Su corrección ha sido solicitada",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          $q.loading.hide();
          $q.notify({
            position: "top-right",
            type: "negative",
            message: resp.data,
          });
        }
        $q.loading.hide();
      }
    });
  } else {
    let resp = null;
    $q.dialog({
      title: "¿Esta seguro de enviar los resultados?",
      message: `<ul>
      <li>Elección: ${
        encabezado.value.eleccion == "DIP"
          ? "Diputaciones"
          : encabezado.value.eleccion == "PYS"
          ? "Presidencias y Sindicaturas"
          : "Regidurías"
      }</li>
      <li>Municipio: ${encabezado.value.municipio}</li>
      <li>Distrito: ${encabezado.value.distrito}</li>
      </ul>`,
      icon: "Warning",
      html: true,
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
      for (let partido of resultadosVA.value.partidos) {
        if (partido.votos == "" || partido.votos == NaN) {
          partido.votos = 0;
        }
        total += parseInt(partido.votos);
      }
      for (let coalicion of resultadosVA.value.coaliciones) {
        if (coalicion.votos == "" || coalicion.votos == NaN) {
          coalicion.votos = 0;
        }
        total += parseInt(coalicion.votos);
      }

      total += parseInt(
        resultadosVA.value.encabezado.total_Votos_Candidatos_No_Registrados !=
          ""
          ? parseInt(
              resultadosVA.value.encabezado
                .total_Votos_Candidatos_No_Registrados
            )
          : 0
      );
      total += parseInt(
        resultadosVA.value.encabezado.total_Votos_Nulos != ""
          ? parseInt(resultadosVA.value.encabezado.total_Votos_Nulos)
          : 0
      );

      resultadosVA.value.encabezado.total_Sistema = parseInt(
        total == 0 ? totalVotos.value : total
      );
      resultadosVA.value.encabezado.total_Votos = parseInt(
        resultadosVA.value.encabezado.total_Votos
      );
      $q.loading.show({
        spinner: QSpinnerCube,
        spinnerColor: "blue-grey",
        spinnerSize: 140,
        backgroundColor: "purple-2",
        message: "Espere un momento por favor...",
        messageColor: "black",
      });

      resp = await votoAnticipadoStore.createResultadosVA(resultadosVA.value);
      if (resp.success) {
        $q.loading.hide();
        Swal.fire({
          icon: "success",
          title: resp.data,
          showConfirmButton: false,
          timer: 1500,
        });
        votoAnticipadoStore.actualizarTabla(true);
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
  }
};
</script>
<style scoped>
.flotante {
  position: sticky;
  top: 10px;
  z-index: 999;
}
</style>
