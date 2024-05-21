<template>
  <q-dialog
    v-model="modal_Foto"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 700px; max-width: 70vw">
      <q-card-section class="row">
        <div class="text-h6">Ver fotografía</div>
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
        <div v-if="props.foto != ''" class="col-12 justify-end">
          <q-img :src="props.foto"> </q-img>
        </div>
        <div v-else>No ha subido su fotografía.</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useValidarStore } from "src/stores/validar-store";

//-----------------------------------------------------------------

const validarStore = useValidarStore();
const { modal_Foto } = storeToRefs(validarStore);
const props = defineProps({
  foto: { type: String, required: true },
});

//-----------------------------------------------------------------

const actualizarModal = (valor) => {
  validarStore.actualizarModalFoto(valor);
};

//-----------------------------------------------------------------
</script>

<style></style>
