<template>
  <q-dialog
    v-model="modalConsentimiento"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="row">
        <div class="text-h6">Consentimiento expreso</div>
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
        <q-card-section class="text-subtitle2"
          >Por lo anterior, habiendo leído el aviso de privacidad integral
          publicado en el portal oficial del IEEN, a través del cual se me
          entera del uso, tratamiento, transferencia y divulgación de mis datos
          personales en el Sistema “Candidatas y Candidatos, Conóceles”, y
          plenamente enterada (o) de su contenido y alcance legal, manifiesto lo
          siguiente:</q-card-section
        >
        <q-card-section class="row">
          <div class="q-pa-xs">
            <q-btn
              :disable="candidato.validado == true"
              size="sm"
              :color="
                privacidad1 == false
                  ? 'red'
                  : privacidad1 == true
                  ? 'green'
                  : 'orange'
              "
              :icon="
                privacidad1 == false
                  ? 'close'
                  : privacidad1 == true
                  ? 'done'
                  : 'remove'
              "
              v-model="privacidad1"
              @click="privacidad1 = !privacidad1"
              round
            >
            </q-btn>
            Autorizo que mis datos personales sean tratados conforme a las
            finalidades específicas precisadas en el Aviso de Privacidad.
          </div>
          <div class="q-pa-xs">
            <q-btn
              :disable="candidato.validado == true"
              size="sm"
              :color="
                privacidad2 == false
                  ? 'red'
                  : privacidad2 == true
                  ? 'green'
                  : 'orange'
              "
              :icon="
                privacidad2 == false
                  ? 'close'
                  : privacidad2 == true
                  ? 'done'
                  : 'remove'
              "
              v-model="privacidad2"
              @click="privacidad2 = !privacidad2"
              round
            >
            </q-btn>
            Autorizo la publicación y divulgación de mis datos sensibles
            capturados en el cuestionario de identidad para integrar el sistema.
          </div>
          <div class="q-pa-xs">
            <q-btn
              :disable="candidato.validado == true"
              size="sm"
              :color="
                privacidad3 == false
                  ? 'red'
                  : privacidad3 == true
                  ? 'green'
                  : 'orange'
              "
              :icon="
                privacidad3 == false
                  ? 'close'
                  : privacidad3 == true
                  ? 'done'
                  : 'remove'
              "
              v-model="privacidad3"
              @click="privacidad3 = !privacidad3"
              round
            >
            </q-btn>
            Autorizo que los datos generados por mi registro, sean parte de los
            informes que se elaboren con fines estadísticos.
          </div>

          <div class="text-red text-bold">
            <br />
            Nota: Seleccionar lo que indicó en el aviso de privacidad que se
            subirá aqui mismo.
          </div>
        </q-card-section>
        <q-card-section class="row q-col-gutter-xs flex-center">
          <div
            v-if="candidato.validado == false || candidato.validado == null"
            class="col-lg-4 col-md-4 col-sm-4 col-xs-12"
          >
            <q-btn
              @click="descargar()"
              color="pink"
              outline
              icon-right="download"
              label="Descargar formato"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-file
              v-if="candidato.validado == false || candidato.validado == null"
              bottom-slots
              v-model="consentimiento_File"
              label="Consentimiento expreso"
              accept=".jpg, .jpeg, .png, .pdf"
              color="pink"
              @rejected="onRejected"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" @click.stop.prevent />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click.stop.prevent="consentimiento_File = null"
                  class="cursor-pointer"
                />
              </template>

              <template v-slot:hint> Subir consentimiento </template>
            </q-file>
          </div>
          <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
            <q-btn
              icon="save"
              v-if="candidato.validado == false || candidato.validado == null"
              label="Guardar"
              type="submit"
              color="secondary"
              class="q-ml-sm"
            />
          </div>
          <div v-if="candidato.consentimiento_URL != null" class="col-12">
            <iframe
              v-if="!extensionTif"
              :src="consentimiento"
              width="100%"
              height="500"
            ></iframe>
            <a v-else :href="consentimiento" target="_blank">Ver imagen</a>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerCube } from "quasar";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { onMounted, ref, watch } from "vue";

//-----------------------------------------------------------------

const $q = useQuasar();
const candidatosStore = useCandidatosStore();
const configuracionStore = useConfiguracionStore();
const { modalConsentimiento, candidato, documentoConsentimiento } =
  storeToRefs(candidatosStore);
const consentimiento_File = ref(null);
const privacidad1 = ref(null);
const privacidad2 = ref(null);
const privacidad3 = ref(null);
const consentimiento = ref(null);
const extensionTif = ref(false);
//-----------------------------------------------------------------

onMounted(() => {
  if (
    candidato.value.consentimiento_URL != null &&
    candidato.value.consentimiento_URL.startsWith("http")
  ) {
    const pathname = new URL(candidato.value.consentimiento_URL).pathname;
    const fileName = pathname.split("/").pop();
    const extension = fileName.split(".").pop();
    if (
      candidato.value.consentimiento_URL != null &&
      candidato.value.consentimiento_URL.startsWith("http")
    ) {
      consentimiento.value = candidato.value.consentimiento_URL.replace(
        "http",
        "https"
      );
      if (extension == "tif") {
        extensionTif.value = true;
      }
    } else {
      consentimiento.value = candidato.value.consentimiento_URL;
    }
  } else {
    consentimiento.value = candidato.value.consentimiento_URL;
  }
  privacidad1.value = candidato.value.uno_Aviso_Privacidad;
  privacidad2.value = candidato.value.dos_Publicacion;
  privacidad3.value = candidato.value.tres_Informe_Estadistico;
});

watch(candidato.value, (val) => {
  if (val.id != null) {
    consentimiento.value = candidato.value.consentimiento_URL;
    privacidad1.value = candidato.value.uno_Aviso_Privacidad;
    privacidad2.value = candidato.value.dos_Publicacion;
    privacidad3.value = candidato.value.tres_Informe_Estadistico;
    if (
      candidato.value.consentimiento_URL != null &&
      candidato.value.consentimiento_URL.startsWith("http")
    ) {
      consentimiento.value = candidato.value.consentimiento_URL.replace(
        "http",
        "https"
      );
    } else {
      consentimiento.value = candidato.value.consentimiento_URL;
    }
  }
});

const actualizarModal = async (valor) => {
  await candidatosStore.loadCandidatoById(
    candidato.value.puesto,
    candidato.value.id
  );
  consentimiento_File.value = null;
  extensionTif.value = false;
  candidatosStore.actualizarConsentiento(valor);
};

const descargar = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "pink",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento porfavor...",
    messageColor: "black",
  });
  await configuracionStore.downloadConsentimiento(
    candidato.value.id,
    candidato.value.puesto
  );
  const link = document.createElement("a");
  link.href = configuracionStore.documentoConsentimiento;
  link.setAttribute("download", "Consentimiento.pdf");
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};

const onSubmit = async () => {
  let resp = null;
  if (
    privacidad1.value == null ||
    privacidad2.value == null ||
    privacidad3.value == null
  ) {
    $q.dialog({
      title: "Atención",
      message: "Deberá marcar las tres opciones",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: false,
      cancel: {
        color: "negative",
        label: "Cerrar",
      },
    });
  } else if (
    consentimiento_File.value == null &&
    candidato.value.consentimiento_URL == null
  ) {
    $q.dialog({
      title: "Atención",
      message: "Subir el consentimiento expreso",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: false,
      cancel: {
        color: "negative",
        label: "Cerrar",
      },
    });
  } else {
    $q.loading.show();
    let consentimientoFormData = new FormData();
    consentimientoFormData.append("Uno_Aviso_Privacidad", privacidad1.value);
    consentimientoFormData.append("Dos_Publicacion", privacidad2.value);
    consentimientoFormData.append(
      "Tres_Informe_Estadistico",
      privacidad3.value
    );
    if (consentimiento_File.value != null) {
      consentimientoFormData.append(
        "Consentimiento",
        consentimiento_File.value
      );
    }

    if (candidato.value.consentimiento_URL == null) {
      resp = await candidatosStore.subirConsentimiento(
        candidato.value.id,
        candidato.value.puesto,
        consentimientoFormData
      );
    } else {
      resp = await candidatosStore.updateConsentimiento(
        candidato.value.id,
        candidato.value.puesto,
        consentimientoFormData
      );
    }

    if (resp.success) {
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      await candidatosStore.loadCandidatoById(
        candidato.value.id,
        candidato.value.puesto
      );
      actualizarModal(false);
    } else {
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
    $q.loading.hide();
  }
};

const onRejected = () => {
  $q.notify({
    type: "negative",
    message: "La extensión no es valida",
  });
};
//-----------------------------------------------------------------
</script>
