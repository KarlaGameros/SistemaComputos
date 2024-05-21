<template>
  <div class="row bg-white">
    <div class="col">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el icon="list_alt" label="Candidaturas" />
        </q-breadcrumbs>
      </div>
    </div>
  </div>
  <q-page padding>
    <!---------------------------BANNER--------------------------->
    <banner>
      <template v-slot:icono>
        <q-icon name="info" color="grey" />
      </template>
      <template v-slot:contenido>
        En este módulo podrá descargar el Excel con el avance curricular y de
        identidad de todas sus candidaturas
        <q-icon name="download" size="sm" color="pink" />.
        <q-icon name="looks_one" size="sm" color="pink" /> Cuestionario
        curricular.
        <q-icon name="looks_two" size="sm" color="pink" /> Cuestionario de
        identidad.
      </template>
    </banner>
    <div class="row">
      <div class="col">
        <div class="text-right q-pa-md items-start q-gutter-md">
          <q-btn
            type="button"
            color="pink-1"
            icon-right="download"
            label="Descargar Excel"
            @click="descargarExcel(true)"
          />
        </div>
      </div>
    </div>
    <TablaComp />
    <ModalFaltante />
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerCube } from "quasar";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import TablaComp from "../components/TablaComp.vue";
import banner from "../../../components/BannerComp.vue";
import ModalFaltante from "src/modulos/cuestionarioCurricular/components/ModalFaltante.vue";
//-----------------------------------------------------------------

const $q = useQuasar();
const configuracionStore = useConfiguracionStore();

//-----------------------------------------------------------------

const descargarExcel = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "pink",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento porfavor...",
    messageColor: "black",
  });
  await configuracionStore.downloadExcel();
  const link = document.createElement("a");
  link.href = configuracionStore.documentoExcel;
  link.setAttribute("download", "BD_CANDIDATURAS_2024.xlsx");
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};
</script>

<style scope>
.user__info {
  display: flex;
  align-items: left;
  gap: 12px;
}
.user__name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  text-align: left;
}
.user__email {
  font-size: 12px;
  color: #4b5563;
}
</style>
