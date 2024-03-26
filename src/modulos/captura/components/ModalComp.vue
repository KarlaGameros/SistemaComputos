<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 2000px; max-width: 200vw">
      <q-card-section class="row">
        <div class="text-h6">
          Resultados de la sección 1 de la casilla Basica de la elección a
          Diputaciones.
        </div>
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
        <q-card-section>
          <div class="bg-blue-grey-3 q-pa-sm text-bold">Total de votos:</div>
          <div
            class="bg-grey-3 q-pa-sm text-bold text-grey-8 text-center text-h6"
          >
            Partidos políticos
          </div>
          <br />
          <div class="row items-start q-gutter-md flex-center">
            <q-card
              v-for="(partido, index) in list_Partidos_Politicos"
              :key="partido"
              class="my-card text-center"
            >
              <q-card-section>
                <q-avatar size="70px" font-size="82px" square>
                  <img :src="partido.logo_URL" />
                </q-avatar>
                <div class="text-grey-8 text-bold">{{ partido.siglas }}</div>
              </q-card-section>
              <q-card-section>
                <q-input
                  mask="###"
                  placeholder="0"
                  :name="`input${index}`"
                  dense
                  input-class="text-right"
                  v-model="partido.votos"
                  @keydown.enter.prevent="getFocus(index)"
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section>
          <div
            class="bg-grey-3 q-pa-sm text-bold text-grey-8 text-center text-h6"
          >
            Coaliciones
          </div>
          <br />
          <div class="row items-start q-gutter-md flex-center">
            <q-card
              v-for="(coalicion, index) in list_Coaliciones"
              :key="coalicion"
              class="my-card text-center"
            >
              <q-card-section>
                <q-avatar style="width: auto; height: 35px" square>
                  <img :src="coalicion.logo_URL" />
                </q-avatar>
                <div class="text-grey-8 text-bold">{{ coalicion.siglas }}</div>
              </q-card-section>
              <q-card-section>
                <q-input
                  mask="###"
                  placeholder="0"
                  :name="`input${index}`"
                  dense
                  input-class="text-right"
                  v-model="coalicion.votos"
                  @keydown.enter.prevent="getFocus(index)"
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section>
          <div
            class="bg-grey-3 q-pa-sm text-bold text-grey-8 text-center text-h6"
          >
            Totales
          </div>
          <br />
        </q-card-section>
        <q-card-section class="row">
          <div class="col-lg-4 col-md-6 col-xs-6 q-pa-sm">
            <div class="text-subtitle1 text-bold text-grey-8">
              Candidatos no registrados
            </div>
            <q-input
              mask="###"
              placeholder="0"
              :name="`input${index}`"
              dense
              input-class="text-right"
              @keydown.enter.prevent="getFocus(index)"
            />
          </div>
          <div class="col-lg-4 col-md-6 col-xs-6 q-pa-sm">
            <div class="text-subtitle1 text-bold text-grey-8">Votos nulos</div>
            <q-input
              mask="###"
              placeholder="0"
              :name="`input${index}`"
              dense
              input-class="text-right"
              @keydown.enter.prevent="getFocus(index)"
            />
          </div>
          <div class="col-lg-4 col-md-6 col-xs-6 q-pa-sm">
            <div class="text-subtitle1 text-bold text-grey-8">Total votos</div>
            <q-input
              mask="###"
              placeholder="0"
              :name="`input${index}`"
              dense
              input-class="text-right"
              @keydown.enter.prevent="getFocus(index)"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Guardar"
                type="submit"
                color="secondary"
                class="q-ml-sm"
              />
              <q-btn
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useCapturaStore } from "src/stores/captura-store";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import Swal from "sweetalert2";

//-----------------------------------------------------------

const $q = useQuasar();
const capturaStore = useCapturaStore();
const configuracionStore = useConfiguracionStore();
const { modal } = storeToRefs(capturaStore);
const { list_Partidos_Politicos, list_Coaliciones } =
  storeToRefs(configuracionStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  capturaStore.actualizarModal(valor);
};

function getFocus(index) {
  let docu = document.getElementsByName(`input${index + 1}`);
  docu[0].focus();
}

const onSubmit = () => {
  Swal.fire({
    title: "¿Esta seguro de enviar los resultados?",
    text: "Será afectada la base de datos",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, enviar!",
    cancelButtonText: "No, cancelar!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Guardado",
        text: "La información se guardo.",
        icon: "success",
      });
    } else {
    }
  });
};
</script>

<style></style>
