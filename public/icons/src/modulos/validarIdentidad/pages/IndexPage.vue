<template>
  <div class="row bg-white">
    <div class="col">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el
            icon="groups"
            label="Candidaturas"
            to="lista_Candidatos"
          />
          <q-breadcrumbs-el
            icon="list_alt"
            label="Validar cuestionario de identidad"
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
      @click="irCurricular"
      icon="arrow_forward"
      class="q-mb-sm q-ml-sm bg-pink-1 text-white"
      label="Ir a cuestionario curricular"
    ></q-btn>
    <ValidarIdentidad />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { useRouter } from "vue-router";
import ValidarIdentidad from "../components/ValidarIdentidad.vue";

const router = useRouter();
const candidatosStore = useCandidatosStore();
const { candidato } = storeToRefs(candidatosStore);

const irCurricular = async (row) => {
  await candidatosStore.loadCandidatoById(
    candidato.value.puesto,
    candidato.value.id
  );
  router.push({
    name: "cuestionario_visualizar",
  });
};
</script>
