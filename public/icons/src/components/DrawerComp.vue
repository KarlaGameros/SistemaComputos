<template>
  <q-list v-show="tab == true">
    <q-expansion-item
      expand-separator
      icon="menu_book"
      label="Ver avance"
      class="label-title text-bold text-grey-8"
    >
      <q-item clickable v-ripple @click="click('Datos generales')">
        <q-item-section avatar>
          <q-avatar color="positive" text-color="white" icon="check" />
        </q-item-section>

        <q-item-section>Datos generales</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="click('Formación académica')">
        <q-item-section avatar>
          <q-avatar color="positive" text-color="white" icon="check" />
        </q-item-section>

        <q-item-section>Formación académica</q-item-section>
      </q-item>
      <q-item
        clickable
        v-ripple
        @click="click('Historia profesional y/o laboral')"
      >
        <q-item-section avatar>
          <q-avatar color="orange" text-color="white" icon="priority_high" />
        </q-item-section>

        <q-item-section>Historia profesional y/o laboral</q-item-section>
      </q-item>
      <q-item
        clickable
        v-ripple
        @click="click('Trayectoria política y/o participación social')"
      >
        <q-item-section avatar>
          <q-avatar color="negative" text-color="white" icon="close" />
        </q-item-section>

        <q-item-section
          >Trayectoria política y/o participación social</q-item-section
        >
      </q-item>
      <q-item clickable v-ripple @click="click('Propuestas')">
        <q-item-section avatar>
          <q-avatar color="negative" text-color="white" icon="close" />
        </q-item-section>

        <q-item-section>Propuestas</q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>

  <q-list v-show="tab == false">
    <q-expansion-item
      expand-separator
      icon="menu_book"
      label="Ver avance"
      class="label-title text-bold text-grey-8"
    >
      <q-item clickable v-ripple @click="click('Autoadscripción indígena')">
        <q-item-section avatar>
          <q-avatar color="positive" text-color="white" icon="check" />
        </q-item-section>

        <q-item-section>Autoadscripción indígena</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="click('Población con discapacidad')">
        <q-item-section avatar>
          <q-avatar color="positive" text-color="white" icon="check" />
        </q-item-section>

        <q-item-section>Población con discapacidad</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="click('Población afromexicana')">
        <q-item-section avatar>
          <q-avatar color="positive" text-color="white" icon="check" />
        </q-item-section>

        <q-item-section>Población afromexicana</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="click('Diversidad sexual')">
        <q-item-section avatar>
          <q-avatar color="orange" text-color="white" icon="priority_high" />
        </q-item-section>

        <q-item-section>Diversidad sexual</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="click('Personas mexicanas migrantes')">
        <q-item-section avatar>
          <q-avatar color="negative" text-color="white" icon="close" />
        </q-item-section>

        <q-item-section>Personas mexicanas migrante</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="click('Generales')">
        <q-item-section avatar>
          <q-avatar color="negative" text-color="white" icon="close" />
        </q-item-section>

        <q-item-section>Generales</q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useExampleStore } from "src/stores/example-store";

const exampleStore = useExampleStore();
const { tab } = storeToRefs(exampleStore);

const click = (id) => {
  exampleStore.actualizarSelection(id);
};
</script>

<style></style>
