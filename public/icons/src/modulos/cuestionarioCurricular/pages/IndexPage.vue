<template>
  <q-page>
    <div class="row bg-white">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs active-color="pink-5">
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="pink" />
            </template>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el icon="list_alt" label="Cuestionario curricular" />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <cuestionarioComponent v-if="visualizar == false" />
    <cuestionarioVisualizar v-if="visualizar == true" />
    <ModalFaltante />
    <ModalComp />
  </q-page>
</template>

<script setup>
import { useCandidatosStore } from "src/stores/candidatos-store";
import { storeToRefs } from "pinia";
import cuestionarioComponent from "../components/cuestionarioComponent.vue";
import cuestionarioVisualizar from "../components/cuestionarioVisualizar.vue";
import ModalFaltante from "../components/ModalFaltante.vue";
import ModalComp from "../components/ModalComp.vue";

//-----------------------------------------------------------------

const candidatosStore = useCandidatosStore();
const { visualizar } = storeToRefs(candidatosStore);

//-----------------------------------------------------------------
</script>
