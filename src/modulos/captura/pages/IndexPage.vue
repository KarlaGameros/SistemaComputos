<template>
  <q-page>
    <div class="row bg-white">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-blue-grey-5 text-h6">Captura de resultados</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              class="text-grey-7"
              label="Captura de resultados"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <TablaComp />
    <ModalCausales />
  </q-page>
</template>
<script setup>
import TablaComp from "../components/TablaComp.vue";
import ModalCausales from "../components/ModalCausales.vue";
</script>
