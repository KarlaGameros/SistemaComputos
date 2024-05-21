<template>
  <q-dialog
    v-model="modalFotogafia"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Aquí podrá subir su fotografía</div>
        <q-space />
        <q-btn
          icon="close"
          @click="actualizarModal(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="row q-col-gutter-xs flex-center">
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-file
              filled
              bottom-slots
              v-model="foto"
              label="Fotografía"
              accept=".jpg, image/*"
              color="pink"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" @click.stop.prevent />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click.stop.prevent="foto = null"
                  class="cursor-pointer"
                />
              </template>

              <template v-slot:hint> Subir fotografía </template>
            </q-file>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                label="Guardar"
                type="submit"
                color="secondary"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { ref } from "vue";

//-----------------------------------------------------------------

const $q = useQuasar();
const candidatosStore = useCandidatosStore();
const { modalFotogafia, candidato } = storeToRefs(candidatosStore);
const foto = ref(null);

//-----------------------------------------------------------------

const actualizarModal = (valor) => {
  foto.value = null;
  candidatosStore.actualizarFotografia(valor);
};

const onSubmit = async () => {
  $q.loading.show();
  let resp = null;
  let candidatoFormData = new FormData();
  candidatoFormData.append("Foto", foto.value);
  if (foto.value == null) {
    $q.dialog({
      title: "Atención",
      message: "No ha cargado la fotografía",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: "Aceptar",
    });
  } else {
    resp = await candidatosStore.updateFotografia(
      candidato.value.id,
      candidato.value.puesto,
      candidatoFormData
    );
    if (resp.success) {
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      actualizarModal(false);
      candidatosStore.loadCandidatoById(
        candidato.value.puesto,
        candidato.value.id
      );
    } else {
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  }
  $q.loading.hide();
};
//-----------------------------------------------------------------
</script>
