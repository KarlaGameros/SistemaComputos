<template>
  <q-page>
    <div :class="$q.dark.isActive ? 'row' : 'row bg-white'">
      <div class="col-9">
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
      <div class="col-3">
        <div class="q-pt-lg q-pr-sm q-pb-sm">
          <q-btn
            @click="actualizarModal(true)"
            color="blue-grey-5"
            icon-right="search"
            label="Nuevo filtro"
          />
        </div>
      </div>
    </div>
    <ReporteComp />
    <ModalComp />
    <ModalIntegracionOficinas />
    <ModalIntegracionPartidos />
    <ModalCambiarRep />
  </q-page>
</template>
<script setup>
import { useConsultaStore } from "src/stores/consulta-store";
import ReporteComp from "../components/ReporteComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalIntegracionOficinas from "../components/ModalIntegracionOficinas.vue";
import ModalIntegracionPartidos from "../components/ModalIntegracionPartidos.vue";
import ModalCambiarRep from "../components/ModalCambiarRep.vue";

//-----------------------------------------------------------

const consultaStore = useConsultaStore();

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  consultaStore.actualizarModalIntegracion(false);
  consultaStore.actualizarModal(valor);
};
</script>
<style></style>
