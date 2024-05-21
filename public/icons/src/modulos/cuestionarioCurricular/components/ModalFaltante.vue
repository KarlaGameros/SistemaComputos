<template>
  <q-dialog
    v-model="modal_Faltante"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">¿Está seguro de aceptar?</div>
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
          <div class="col-10 text-subtitle2">
            Si acepta la información curricular será publica. Aquellos campos
            que digan "Requerido", es necesario completarlos para poder validar
            la candidatura.
          </div>
        </q-card-section>
        <q-card-section class="row q-col-gutter-xs flex-center">
          <q-list dense bordered class="rounded-borders col-10">
            <q-item
              v-for="item in candidato.faltante_Curricular.split('|')"
              :key="item"
            >
              <q-item-section> {{ item }} </q-item-section>
              <div class="text-red">
                {{
                  item == "DATOS GENERALES" ||
                  item == "FORMACIÓN ACADÉMICA" ||
                  item == "HISTORIA PROFESIONAL Y/O LABORAL" ||
                  item == "TRAYECTORIA POLÍTICA Y/O PARTICIPACIÓN SOCIAL" ||
                  item == "PROPUESTAS"
                    ? "Requerido"
                    : ""
                }}
              </div>
            </q-item>
            <q-item
              v-if="
                datos_Generales.historia_Laboral != null &&
                datos_Generales.historia_Laboral.replace(/\s+/g, '').length <
                  279
              "
            >
              <q-item-section>
                HISTORIA PROFESIONAL Y/O LABORAL.
              </q-item-section>
              <div class="text-red">Completar</div>
            </q-item>
            <q-item
              v-if="
                datos_Generales.trayectoria != null &&
                datos_Generales.trayectoria.replace(/\s+/g, '').length < 279
              "
            >
              <q-item-section>
                TRAYECTORIA POLÍTICA Y/O PARTICIPACIÓN SOCIAL.
              </q-item-section>
              <div class="text-red">Completar</div>
            </q-item>
            <q-item
              v-if="
                datos_Generales.propuesta_Genero != null &&
                datos_Generales.propuesta_Genero.replace(/\s+/g, '').length <
                  279
              "
            >
              <q-item-section>
                PROPUESTA EN MATERIA DE GÉNERO, O EN SU CASO, DEL GRUPO EN
                SITUACIÓN DE DISCRIMINACION QUE REPRESENTA.
              </q-item-section>
              <div class="text-red">Completar</div>
            </q-item>
            <q-item
              v-if="
                datos_Generales.motivo_Cargo_Publico != null &&
                datos_Generales.motivo_Cargo_Publico.replace(/\s+/g, '')
                  .length < 279
              "
            >
              <q-item-section>
                ¿POR QUÉ QUIERE OCUPAR UN CARGO PÚBLICO?.
              </q-item-section>
              <div class="text-red">Completar</div>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section
          v-if="
            candidato.consentimiento_URL == null ||
            candidato.avance_Identidad != 100
          "
          class="row q-col-gutter-xs flex-center"
        >
          <q-list dense bordered class="rounded-borders col-10">
            <q-item-label header class="text-red text-bold">
              Cuestionario de identidad:
            </q-item-label>
            <q-item v-if="candidato.consentimiento_URL == null">
              <q-item-section>
                - Cargar el consentimiento expreso y por escrito en el módulo de
                "Cuestionario de identiad"</q-item-section
              >
              <div class="text-red">Requerido</div>
            </q-item>
            <q-item v-if="candidato.avance_Identidad != 100">
              <q-item-section
                >- El cuestionario de identidad esta incompleto. Completar el
                100% de avance.</q-item-section
              >
              <div class="text-red">Requerido</div>
            </q-item>
          </q-list>
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
                :disable="
                  candidato.avance_Curricular != 100 ||
                  candidato.avance_Identidad != 100 ||
                  candidato.consentimiento_URL == null ||
                  (datos_Generales.historia_Laboral != null &&
                    datos_Generales.historia_Laboral.replace(/\s+/g, '')
                      .length < 279) ||
                  (datos_Generales.trayectoria != null &&
                    datos_Generales.trayectoria.replace(/\s+/g, '').length <
                      279) ||
                  (datos_Generales.propuesta_Genero != null &&
                    datos_Generales.propuesta_Genero.replace(/\s+/g, '')
                      .length < 279) ||
                  (datos_Generales.motivo_Cargo_Publico != null &&
                    datos_Generales.motivo_Cargo_Publico.replace(/\s+/g, '')
                      .length < 279)
                "
                label="Validar"
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
import { useValidarStore } from "src/stores/validar-store";

//-----------------------------------------------------------------

const $q = useQuasar();
const validarStore = useValidarStore();
const candidatosStore = useCandidatosStore();
const { modal_Faltante } = storeToRefs(validarStore);
const { candidato, datos_Generales } = storeToRefs(candidatosStore);

//-----------------------------------------------------------------

const actualizarModal = (valor) => {
  validarStore.actualizarModalFaltante(valor);
};

const onSubmit = async () => {
  $q.loading.show();
  $q.dialog({
    title: `¿Esta seguro de validar la candidatura?`,
    message:
      "La información se mostrará en el sitio de publicación 'Candidatas y Candidatos, Conóceles'",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, aceptar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await validarStore.validarCandidatoByPartido(
      candidato.value.id,
      candidato.value.puesto
    );
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      validarStore.actualizarModalFaltante(false);
      await candidatosStore.loadCandidatoById(
        candidato.value.puesto,
        candidato.value.id
      );
      candidatosStore.actualizarTabla(true);
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  });
  $q.loading.hide();
};
//-----------------------------------------------------------------
</script>

<style></style>
