<template>
  <div class="row bg-white">
    <div class="col">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el icon="list_alt" label="Observaciones" />
        </q-breadcrumbs>
      </div>
    </div>
  </div>
  <q-page>
    <TablaComp />
    <ModalComp />
  </q-page>
</template>
<script setup>
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
</script>
