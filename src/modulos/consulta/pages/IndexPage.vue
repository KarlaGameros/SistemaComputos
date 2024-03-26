<template>
  <q-page>
    <div class="row bg-white">
      <div class="col-10">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-blue-grey-5 text-h6">Reporte de resultados</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              class="text-grey-7"
              label="Reporte de resultados"
            />
          </q-breadcrumbs>
        </div>
      </div>
      <div class="col-2">
        <div class="q-pt-lg">
          <q-btn
            @click="actualizarModal(true)"
            color="blue-grey-5"
            icon="search"
            label="Nuevo filtro"
          />
        </div>
      </div>
    </div>
    <ReporteComp />
    <ModalComp />
  </q-page>
</template>
<script setup>
import { useConsultaStore } from "src/stores/consulta-store";
import ReporteComp from "../components/ReporteComp.vue";
import ModalComp from "../components/ModalComp.vue";

const consultaStore = useConsultaStore();

const actualizarModal = (valor) => {
  consultaStore.actualizarModal(valor);
};
</script>
<style></style>
