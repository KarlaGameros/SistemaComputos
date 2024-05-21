<template>
  <q-dialog
    v-model="modal_Requerir"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <q-space />
        <q-btn
          icon="close"
          @click="actualizarModal(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section
        ><div class="text-h6 text-center text-grey-8">
          Al aceptar se le notificará a la instancia interna encargada sobre la
          observación:
        </div>
        <div class="text-center text-subtitle2">
          Solo podrá realizar una observación por lo que se recomienda revisar
          cada rubro antes de aceptar.
        </div>
      </q-card-section>
      <q-card-section>
        <div
          v-if="
            props.identidad == [] &&
            props.propuesta_1 == [] &&
            props.propuesta_2 == [] &&
            props.genero == [] &&
            props.trayectoria == [] &&
            props.historia == [] &&
            props.formacion == []
          "
          class="absolute-center text-red text-h6"
        >
          No tiene observaciones por mandar
        </div>
        <q-list v-else>
          <q-item v-if="props.identidad.length > 0">
            <q-item-section>
              <q-item-label>Rubro identidad</q-item-label>
              <q-item-label
                v-for="item in props.identidad"
                :key="item"
                caption
                lines="2"
              >
                - {{ item }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="props.propuesta_1.length > 0">
            <q-item-section>
              <q-item-label>Rubro propuesta 1</q-item-label>
              <q-item-label
                v-for="item in props.propuesta_1"
                :key="item"
                caption
                lines="2"
              >
                - {{ item }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="props.propuesta_2.length > 0">
            <q-item-section>
              <q-item-label>Rubro propuesta 2</q-item-label>
              <q-item-label
                v-for="item in props.propuesta_2"
                :key="item"
                caption
                lines="2"
              >
                - {{ item }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="props.genero.length > 0">
            <q-item-section>
              <q-item-label>Rubro propuesta género</q-item-label>
              <q-item-label
                v-for="item in props.genero"
                :key="item"
                caption
                lines="2"
              >
                - {{ item }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="props.trayectoria.length > 0">
            <q-item-section>
              <q-item-label>Rubro trayectoria</q-item-label>
              <q-item-label
                v-for="item in props.trayectoria"
                :key="item"
                caption
                lines="2"
              >
                - {{ item }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="props.historia.length > 0">
            <q-item-section>
              <q-item-label
                >Rubro historia profesional y/o laboral</q-item-label
              >
              <q-item-label
                v-for="item in props.historia"
                :key="item"
                caption
                lines="2"
              >
                {{ item }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="props.formacion.length > 0">
            <q-item-section>
              <q-item-label>Rubro formación academica</q-item-label>
              <q-item-label
                v-for="item in props.formacion"
                :key="item"
                caption
                lines="2"
              >
                - {{ item }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="props.ocupar_Cargo.length > 0">
            <q-item-section>
              <q-item-label
                >Rubro ¿Por qué quiere ocupar un cargo público?</q-item-label
              >
              <q-item-label
                v-for="item in props.ocupar_Cargo"
                :key="item"
                caption
                lines="2"
              >
                - {{ item }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div class="col-12 justify-end">
          <div class="text-right q-gutter-xs">
            <q-btn
              label="Cancelar"
              type="reset"
              color="red"
              @click="actualizarModal(false)"
            />
            <q-btn
              label="Aceptar"
              @click="mandarObservaciones"
              color="positive"
              class="q-ml-sm"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { useObservacionStore } from "src/stores/observacion-store";
import { useValidarStore } from "src/stores/validar-store";
import { defineProps } from "vue";

//-----------------------------------------------------------------

const $q = useQuasar();
const validarStore = useValidarStore();
const candidatosStore = useCandidatosStore();
const observacionStore = useObservacionStore();
const { modal_Requerir, observaciones } = storeToRefs(validarStore);
const props = defineProps({
  id: { type: Number },
  tipo: { type: Number },
  identidad: { type: Array },
  propuesta_1: { type: Array },
  propuesta_2: { type: Array },
  genero: { type: Array },
  trayectoria: { type: Array },
  historia: { type: Array },
  formacion: { type: Array },
  ocupar_Cargo: { type: Array },
});

//-----------------------------------------------------------------

const actualizarModal = (valor) => {
  validarStore.initObservacion();
  validarStore.actualizarModalRequerir(valor);
};

const mandarObservaciones = async () => {
  validarStore.initObservacion();
  $q.loading.show();
  $q.dialog({
    title: "Esta seguro de hacer la observación",
    message:
      "La información de la candidatura de los rubros con observaciones se bajara del sitio de publicación.",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, Aceptar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    observaciones.value.candidato_Id = props.id;
    observaciones.value.puesto = props.tipo;
    if (props.identidad.length > 0) {
      observaciones.value.identidad = props.identidad.join("|");
    } else {
      observaciones.value.identidad = null;
    }
    if (props.propuesta_1.length > 0) {
      observaciones.value.propuesta_1 = props.propuesta_1.join("|");
    } else {
      observaciones.value.propuesta_1 = null;
    }
    if (props.propuesta_2.length > 0) {
      observaciones.value.propuesta_2 = props.propuesta_2.join("|");
    } else {
      observaciones.value.propuesta_2 = null;
    }
    if (props.genero.length > 0) {
      observaciones.value.genero = props.genero.join("|");
    } else {
      observaciones.value.genero = null;
    }
    if (props.trayectoria.length > 0) {
      observaciones.value.trayectoria = props.trayectoria.join("|");
    } else {
      observaciones.value.trayectoria = null;
    }
    if (props.historia.length > 0) {
      observaciones.value.historia_Profesional = props.historia.join("|");
    } else {
      observaciones.value.historia_Profesional = null;
    }
    if (props.formacion.length > 0) {
      observaciones.value.formacion = props.formacion.join("|");
    } else {
      observaciones.value.formacion = null;
    }
    if (props.ocupar_Cargo.length > 0) {
      observaciones.value.motivo_Cargo_Publico = props.ocupar_Cargo.join("|");
    } else {
      observaciones.value.motivo_Cargo_Publico = null;
    }

    let resp = await validarStore.createObservaciones(observaciones.value);

    if (resp.success) {
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      actualizarModal(false);
      await candidatosStore.observacionesByCandidatoByPuesto(
        props.id,
        props.tipo
      );
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  });

  $q.loading.hide();
};
//-----------------------------------------------------------------
</script>
