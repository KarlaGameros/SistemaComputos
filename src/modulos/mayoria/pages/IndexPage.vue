<template>
  <q-page>
    <div class="row bg-white">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-blue-grey-5 text-h6">
            Constancias de mayoría y validez
          </div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el class="text-grey-7" label="Constancias" />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <MayoriaComp />
  </q-page>
</template>
<script setup>
import MayoriaComp from "../components/MayoriaComp.vue";
</script>
