<template>
  <div class="q-pt-md">
    <div class="row items-start q-gutter-md flex-center">
      <q-card
        v-for="(partido, index) in list_Partidos_Politicos"
        :key="partido"
        class="my-card text-center"
      >
        <q-card-section>
          <q-avatar size="75px" square>
            <img :src="partido.logo_URL" />
          </q-avatar>
          <div class="text-grey-8 text-subtitle1 text-bold">
            {{ partido.siglas }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            filled
            mask="###"
            placeholder="0"
            :name="`input${index}`"
            dense
            input-class="text-right"
            v-model="partido.votos"
            @keydown.enter.prevent="getFocus(index)"
          />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { useConsultaStore } from "src/stores/consulta-store";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

const consultaStore = useConsultaStore();
const configuracionStore = useConfiguracionStore();
const { list_Partidos_Politicos } = storeToRefs(configuracionStore);

onMounted(() => {
  cargarData();
});

const cargarData = async () => {
  await configuracionStore.loadPartidosPoliticos();
};
</script>

<style></style>
