<template>
  <q-dialog
    v-model="modalCausales"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-blue-grey-1" style="width: 1000px; max-width: 85vw">
      <q-card-section class="row">
        <div class="text-h6">Listado de causales de recuento</div>
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
        <div class="q-pa-md text-center">
          <q-icon name="check_circle" color="green" size="sm" />Sin causal.
          <q-icon name="cancel" color="red" size="sm" />Con causal.
        </div>
        <q-list bordered>
          <q-item v-for="causal in list_causales" :key="causal">
            <q-item-section avatar>
              <q-icon
                :color="causal.cumple == false ? 'green' : 'red'"
                :name="causal.cumple == false ? 'check_circle' : 'cancel'"
              />
            </q-item-section>
            <q-item-section>{{ causal.causal }}</q-item-section>
            <q-separator />
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <div class="col-12 justify-end">
          <div class="text-right q-gutter-xs">
            <q-btn
              label="Cancelar"
              color="red"
              @click="actualizarModal(false)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useCapturaStore } from "src/stores/captura-store";
import Swal from "sweetalert2";

//----------------------------------------------------------

const $q = useQuasar();
const capturaStore = useCapturaStore();
const { modalCausales, list_causales } = storeToRefs(capturaStore);

//----------------------------------------------------------

const actualizarModal = (valor) => {
  capturaStore.actualizarModalCausales(valor);
};
</script>
