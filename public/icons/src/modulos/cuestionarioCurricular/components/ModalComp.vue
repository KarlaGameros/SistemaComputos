<template>
  <q-dialog
    v-model="modalInstrucciones"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="row">
        <div class="text-h6">Pasos para solicitar corrección</div>
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
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label
                >Seleccionar los apartados que desee hacer correciones en el
                símbolo <q-checkbox disable v-model="val" />
              </q-item-label>
              <q-item-label caption lines="2">
                Al seleccionar se activa el apartado y le permitirá realizar
                cambios.
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced inset />
          <q-item>
            <q-item-section>
              <q-item-label
                >Después de habilitar el rubro podrá hacer las modificaciones
                correspondientes
              </q-item-label>
              <q-item-label caption lines="2"
                >Solo tendrá una oportunidad de corregir</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-separator spaced inset />
          <q-item>
            <q-item-section>
              <q-item-label>
                Al hacer las correcciones en los rubros deseados, deberá dar
                click en el botón <b>"Solicitar corrección"</b>
              </q-item-label>
              <q-item-label caption lines="2"
                >Solo tendrá una oportunidad de corregir</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-separator spaced inset />
          <q-item>
            <q-item-section>
              <q-item-label>
                Despues de solicitar la corrección, la instancia interna deberá
                aprobar su solictud.
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced inset />
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { ref } from "vue";

//-----------------------------------------------------------------

const $q = useQuasar();
const candidatoStore = useCandidatosStore();
const { modalInstrucciones } = storeToRefs(candidatoStore);
const val = ref(false);

//-----------------------------------------------------------------

const actualizarModal = (valor) => {
  candidatoStore.actualizarModalInstrucciones(valor);
};

//-----------------------------------------------------------------
</script>
