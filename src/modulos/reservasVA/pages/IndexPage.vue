<template>
  <q-page>
    <div :class="$q.dark.isActive ? 'row' : 'row bg-white'">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-blue-grey-5 text-h6">
            Casillas con votos reservados de Voto Anticipado
          </div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              class="text-grey-7"
              label="Votos reservados Voto Anticipado"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <TablaComp />
  </q-page>
</template>
<script setup>
import TablaComp from "../components/TablaComp.vue";
</script>
