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
        Supervisión y verficación de la captura de contenidos del Cuestionario
        curricular y de identidad que realicen los PP, sus candidaturas y las
        candidaturas independientes en el sistema
      </template>
    </banner>

    <TablaComp />
  </q-page>
</template>

<script setup>
import TablaComp from "../components/TablaComp.vue";
import banner from "../../../components/BannerComp.vue";

//-----------------------------------------------------------------
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
progress {
  display: block;
  width: 100px;
  height: 7px;
  border-radius: 10px;
}
progress::-webkit-progress-bar {
  background-color: #eee;
  border-radius: 10px;
}

progress::-webkit-progress-value {
  background-color: #10b981;
  border-radius: 10px;
}
</style>
