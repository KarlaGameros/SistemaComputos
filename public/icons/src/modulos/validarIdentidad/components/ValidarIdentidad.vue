<template>
  <div class="q-gutter-sm">
    <q-banner rounded>
      <div class="row">
        <div class="col-lg-2 col-md-4 col-sm-4 text-center">
          <q-avatar
            rounded
            class="shadow-10"
            size="130px"
            v-if="candidato.url_Foto != null"
          >
            <q-img :src="candidato.url_Foto" />
          </q-avatar>
          <q-avatar rounded class="shadow-10" size="130px" v-else>
            <q-img
              v-if="candidato.sexo == 'Mujer'"
              src="../../../assets/avatarmujer.jpg"
            />
            <q-img
              v-else-if="candidato.sexo == 'Hombre'"
              src="../../../assets/avatarHombre.jpg"
            />
            <q-img
              v-if="candidato.sexo == 'No binario'"
              src="../../../assets/noBinario.png"
            />
          </q-avatar>
        </div>
        <div class="col-lg-7 col-md-6">
          <div class="text-subtitle2">
            {{ candidato.nombre_Completo }}
          </div>
          <div class="text-caption">
            {{ candidato.partido }}
          </div>
          <div class="text-caption">Género: {{ candidato.sexo }}</div>
          <div class="text-caption">Edad: {{ candidato.edad }}</div>
          <div class="text-caption">
            Cargo: {{ candidato.tipo_Eleccion }} -
            {{ candidato.tipo_Candidato }}
          </div>
          <div class="text-caption">Candidatura: {{ candidato.cargo }}</div>
        </div>
        <div class="col-lg-3 col-sm-12">
          <q-btn
            :label="
              candidato.consentimiento_URL == null
                ? 'Consentimiento expreso'
                : 'Consentimiento expreso'
            "
            :color="candidato.consentimiento_URL != null ? 'green' : 'red'"
            :icon="candidato.consentimiento_URL != null ? 'done' : 'cancel'"
            @click="verConsentimiento(candidato.consentimiento_URL)"
          >
          </q-btn>
        </div>
      </div>
    </q-banner>
  </div>
  <br />
  <div class="col-12 bg-white" v-if="candidato.consentimiento_URL != null">
    <div class="text-center text-subtitle1 text-bold">Aviso de privacidad</div>
    <q-card-section v-if="candidato.consentimiento_URL != null" class="row">
      <q-list dense>
        <q-item>
          <q-item-section avatar>
            <q-icon
              :color="!candidato.uno_Aviso_Privacidad ? 'red' : 'green'"
              :name="!candidato.uno_Aviso_Privacidad ? 'cancel' : 'done'"
            />
          </q-item-section>
          <q-item-section
            >Autorizo que mis datos personales sean tratados conforme a las
            finalidades específicas precisadas en el Aviso de
            Privacidad.</q-item-section
          >
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon
              :color="!candidato.dos_Publicacion ? 'red' : 'green'"
              :name="!candidato.dos_Publicacion ? 'cancel' : 'done'"
            />
          </q-item-section>
          <q-item-section
            >Autorizo la publicación y divulgación de mis datos sensibles
            capturados en el cuestionario de identidad para integrar el
            sistema.</q-item-section
          >
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon
              :color="!candidato.tres_Informe_Estadistico ? 'red' : 'green'"
              :name="!candidato.tres_Informe_Estadistico ? 'cancel' : 'done'"
            />
          </q-item-section>
          <q-item-section
            >Autorizo que los datos generados por mi registro, sean parte de los
            informes que se elaboren con fines estadísticos.</q-item-section
          >
        </q-item>
      </q-list>
    </q-card-section>
  </div>
  <template v-if="apartado_List.length < 8">
    <q-spinner-cube class="absolute-center" color="pink" size="10em" />
  </template>
  <template v-else>
    <br />
    <div class="row bg-white">
      <div class="q-gutter-y-md col-12">
        <q-list bordered>
          <br />
          <div class="text-center text-subtitle1 text-bold">
            Respuestas del cuestionario de identidad
          </div>
          <q-separator />
          <q-expansion-item
            group="somegroup"
            v-for="apartado in apartado_List"
            :key="apartado"
            expand-separator
            color="pink"
            :label="apartado"
            @click="updateApartado(apartado)"
          >
            <q-card>
              <q-card-section>
                <div
                  v-for="pregunta in cuestionariosFiltrado"
                  :key="pregunta.pregunta.id"
                >
                  <div class="text-suptitle2">
                    {{
                      `${pregunta.pregunta.numero}. ${pregunta.pregunta.pregunta}`
                    }}
                  </div>
                  <div class="text-caption text-weight-bold">
                    <ul style="list-style-type: square">
                      <li>
                        {{
                          pregunta.resp_otros != null
                            ? pregunta.resp_otros
                            : pregunta.resp
                        }}
                      </li>
                    </ul>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
  </template>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { useExampleStore } from "src/stores/example-store";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

//-----------------------------------------------------------------

const $q = useQuasar();
const configuracionStore = useConfiguracionStore();
const candidatosStore = useCandidatosStore();
const exampleStore = useExampleStore();
const router = useRouter();
const { list_Preguntas, list_Respuestas_Candidatos, list_Opciones } =
  storeToRefs(configuracionStore);
const { candidato } = storeToRefs(candidatosStore);
const cuestionarios = ref([]);
const cuestionariosFiltrado = ref([]);
const apartado_List = ref([]);

//-----------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------------

const updateApartado = async (id) => {
  cuestionariosFiltrado.value = cuestionarios.value.filter(
    (apartado) => apartado.apartado == id
  );
};

const cargarData = async () => {
  if (candidato.value.id == null) {
    router.push({
      name: "inicio",
    });
  } else {
    await configuracionStore.loadPreguntasCandidatos();
    await configuracionStore.loadRespuestasByCandidato(
      candidato.value.id,
      candidato.value.puesto
    );
    for (var pregunta of list_Preguntas.value) {
      await configuracionStore.loadRespuestasByPregunta(pregunta.id);

      let resp_candidato = list_Respuestas_Candidatos.value.find(
        (x) => x.pregunta_Id == pregunta.id
      );
      let opcion_candidato = list_Opciones.value.find(
        (x) => x.id == resp_candidato?.opcion_Id
      );
      cuestionarios.value.push({
        apartado: pregunta.apartado,
        pregunta,
        resp: opcion_candidato == undefined ? null : opcion_candidato.opcion,
        resp_otros: resp_candidato == undefined ? null : resp_candidato.otros,
      });
      let apartado = apartado_List.value.includes(pregunta.apartado);
      if (!apartado) {
        apartado_List.value.push(pregunta.apartado);
      }
    }
  }
};

const verConsentimiento = (consentimiento) => {
  let extension = false;
  let url = consentimiento;
  if (url != null && consentimiento.startsWith("http")) {
    const pathname = new URL(consentimiento).pathname;
    const fileName = pathname.split("/").pop();
    extension = fileName.split(".").pop();
    url = url.replace("http", "https");
  }
  if (extension == "tif") {
    $q.dialog({
      title: `Consentimiento expreso`,
      style: "width: 800px; max-width: 80vw",
      message: `<a href="${url}" target="_blank">Ver imagen</a>
`,
      html: true,
      ok: "Cerrar",
    });
  } else {
    $q.dialog({
      title: `Consentimiento expreso`,
      style: "width: 800px; max-width: 80vw",
      message:
        consentimiento != null
          ? `<iframe
            src="${url}"
            width="100%"
            height="650"
          ></iframe>`
          : '<div class="text-subtitle2">Sin consentimiento expreso</div>',
      html: true,
      ok: "Cerrar",
    });
  }
};

//-----------------------------------------------------------------
</script>
