<template>
  <div class="row bg-white">
    <div class="col">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el
            icon="groups"
            label="Candidaturas"
            :to="{ name: 'lista_Candidatos' }"
          />
          <q-breadcrumbs-el
            icon="list_alt"
            label="Validar cuestionario curricular"
          />
        </q-breadcrumbs>
      </div>
    </div>
  </div>
  <q-page padding>
    <q-btn
      :to="{ name: 'lista_Candidatos' }"
      icon="groups"
      class="q-mb-sm bg-pink-1 text-white"
      label="Regresar"
    ></q-btn>
    <q-btn
      @click="irIdentidad"
      icon="arrow_forward"
      class="q-mb-sm q-ml-sm bg-pink-1 text-white"
      label="Ir a cuestionario de identidad"
    ></q-btn>
    <validarCurricular />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { useRouter } from "vue-router";
import validarCurricular from "../components/ValidarCurricular.vue";

//-----------------------------------------------------------------

const candidatosStore = useCandidatosStore();
const router = useRouter();
const { candidato } = storeToRefs(candidatosStore);

const irIdentidad = async (row) => {
  await candidatosStore.loadCandidatoById(
    candidato.value.puesto,
    candidato.value.id
  );
  router.push({
    name: "validarIdentidad",
  });
};
</script>

<style></style>
