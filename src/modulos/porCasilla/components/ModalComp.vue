<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-blue-grey-1" style="width: auto; max-width: 200vw">
      <q-form @submit="solicitarCorreccion">
        <div class="flotante">
          <div class="row bg-blue-grey-3 text-bold q-pl-md">
            <div class="text-h6">
              Resultados de la sección {{ resultado_casilla.seccion }} de la
              casilla {{ resultado_casilla.casilla }} de la elección a
              {{
                props.eleccion == "DIP"
                  ? "Diputaciones"
                  : props.eleccion == "PYS"
                  ? "Presidencias y Sindicaturas"
                  : "Regidurías"
              }}.
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
            Total de votos sistema: {{ resultados.encabezado.total_Sistema }}
          </div>
        </div>
        <br />
        <div class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6">
          Partidos políticos
        </div>
        <q-card-section>
          <br />
          <div class="row q-gutter-md q-pl-xl" style="margin: 20px">
            <q-card
              v-for="partido in resultados.partidos"
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
                <q-input
                  class="text-h6"
                  disable
                  mask="###"
                  dense
                  input-class="text-right"
                  v-model="partido.votos"
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <div
          v-if="props.rp == false"
          class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6"
        >
          Coaliciones
        </div>
        <q-card-section v-if="props.rp == false">
          <br />
          <div class="row q-gutter-md q-pl-xl" style="margin: 20px">
            <q-card
              v-for="coalicion in resultados.coaliciones"
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
                  disable
                  mask="###"
                  dense
                  input-class="text-right"
                  v-model="coalicion.votos"
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <div class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6">
          Totales
        </div>
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
                  disable
                  mask="###"
                  dense
                  input-class="text-right"
                  v-model="
                    resultados.encabezado.total_Votos_Candidatos_No_Registrados
                  "
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
                  disable
                  v-model="resultados.encabezado.total_Votos_Nulos"
                  mask="###"
                  placeholder="0"
                  dense
                  input-class="text-right"
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
                  disable
                  v-model="resultados.encabezado.total_Votos"
                  mask="###"
                  placeholder="0"
                  dense
                  input-class="text-right"
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
                label="Solicitar corrección"
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
import { defineProps, onBeforeMount, ref } from "vue";
import { useCasillaStore } from "src/stores/casilla-store";
import { useAuthStore } from "src/stores/auth-store";
import { useSolicitudesStore } from "src/stores/solicitudes-store";
import Swal from "sweetalert2";

//----------------------------------------------------------

const $q = useQuasar();
const casillaStore = useCasillaStore();
const authStore = useAuthStore();
const solicitudesStore = useSolicitudesStore();
const { modulo } = storeToRefs(authStore);
const { resultados, modal, resultado_casilla } = storeToRefs(casillaStore);
const props = defineProps({
  eleccion: { type: String, required: true },
  rp: { type: Boolean, required: true },
});
const siglas = "SC-REG-CAS";
const motivo = ref(null);

//--------------------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//----------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  casillaStore.actualizarModal(valor);
};

const solicitarCorreccion = async () => {
  casillaStore.actualizarModal(false);
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
        spinnerColor: "pink",
        spinnerSize: 140,
        backgroundColor: "purple-2",
        message: "Espere un momento porfavor...",
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
          cancelButtonText: "Cerrar",
        });
      } else {
        Swal.fire({
          title: "Ha ocurrido un error",
          text: resp.data,
          icon: "error",
          cancelButtonText: "Cerrar",
        });
      }
      $q.loading.hide();
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
