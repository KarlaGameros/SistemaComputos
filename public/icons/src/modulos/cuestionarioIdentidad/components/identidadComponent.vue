<template>
  <q-btn
    v-if="partido == null && is_Candidato == null"
    :to="{ name: 'lista_Candidatos' }"
    icon="groups"
    class="q-mb-sm bg-pink-1 text-white"
    label="Candidaturas"
  ></q-btn>
  <q-btn
    v-if="partido != null"
    :to="{ name: 'registro_Candidatos' }"
    icon="groups"
    class="q-mb-sm bg-pink-1 text-white"
    label="Candidaturas"
  ></q-btn>
  <q-btn
    @click="irCurricular"
    icon="arrow_forward"
    class="q-ml-sm q-mb-sm bg-pink-1 text-white"
    label="Ir a cuestionario curricular"
  ></q-btn>
  <!---------------------------BANNER--------------------------->
  <banner>
    <template v-slot:icono>
      <q-icon name="info" color="grey" />
    </template>
    <template v-slot:contenido>
      Cuestionario de Identidad. El icono
      <q-icon name="check_circle" size="xs" color="green" /> significa que el
      apartado esta completo, y el icono
      <q-icon name="cancel" size="xs" color="grey" /> significa que falta por
      capturar la información. Recuerda subir tu consentimiento expreso
      <q-icon name="upload" size="xs" color="pink" />.
    </template>
  </banner>
  <br />
  <q-card rounded class="row">
    <q-card-section class="col-lg-2 col-md-3 col-xs-6" align="center">
      <q-avatar
        class="shadow-10"
        rounded
        size="160px"
        v-if="candidato.url_Foto != null"
      >
        <q-img :src="candidato.url_Foto" />
      </q-avatar>
      <q-avatar rounded class="shadow-10" size="160px" v-else>
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
    </q-card-section>
    <q-card-section class="col-lg-6 col-md-6 col-xs-6">
      <q-item-section avatar>
        <q-avatar square>
          <img :src="candidato.url_Logo_Partido" alt="" />
        </q-avatar>
      </q-item-section>
      <q-item-section class="text-grey-8 text-weight-bold">
        <q-item-label>
          {{
            candidato.tipo_Eleccion == "Diputaciones"
              ? candidato.tipo_Candidato == "RP"
                ? ""
                : `Distrito ${candidato.no_Distrito} - ${candidato.distrito}`
              : candidato.tipo_Eleccion == "Presidencias y Sindicaturas"
              ? `Municipio ${candidato.municipio}`
              : candidato.tipo_Eleccion == "Regidurías"
              ? candidato.tipo_Candidato == "RP"
                ? `Municipio ${candidato.municipio} `
                : `Municipio ${candidato.municipio} - Demarcación ${candidato.demarcacion}`
              : ""
          }}</q-item-label
        >
      </q-item-section>
      <q-item-label class="text-grey-8 text-weight-bold"
        >Nombre: {{ candidato.nombre_Completo }}</q-item-label
      >
      <q-item-label class="text-grey-8">
        Género: {{ candidato.sexo }}
      </q-item-label>
      <q-item-label class="text-grey-8">
        Edad: {{ candidato.edad }}
      </q-item-label>
      <q-item-label class="text-grey-8">
        Cargo: {{ candidato.tipo_Eleccion }} -
        {{ candidato.tipo_Candidato }}
      </q-item-label>
      <q-item-label class="text-grey-8">
        Candidatura: {{ candidato.cargo }}
      </q-item-label>
    </q-card-section>
    <q-card-section class="text-center col-lg-4 col-sm-12">
      <q-btn
        :label="
          candidato.consentimiento_URL == null
            ? 'Cargar consentimiento expreso'
            : 'Ver consentimiento expreso'
        "
        @click="consentimientoExpreso"
        :color="candidato.consentimiento_URL == null ? 'pink' : 'green'"
        :icon="candidato.consentimiento_URL == null ? 'upload' : 'visibility'"
      />
    </q-card-section>
  </q-card>
  <br />
  <div class="row">
    <div class="q-gutter-y-md col-12">
      <q-banner
        v-if="faltante == ''"
        inline-actions
        class="text-justify bg-green-6"
        style="border-radius: 20px"
      >
        <div class="text-white text-subtitle2 text-bold">
          <q-icon name="check_circle" size="md" />
          Completo
          {{
            candidato.validado == true
              ? " - Validado"
              : " - El partido político por el que esta postulado tendrá que validar su información."
          }}
        </div>
      </q-banner>
      <div class="col-12 bg-white" v-if="candidato.consentimiento_URL != null">
        <div class="text-center text-subtitle1 text-bold">
          Aviso de privacidad
        </div>
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
                  :name="
                    !candidato.tres_Informe_Estadistico ? 'cancel' : 'done'
                  "
                />
              </q-item-section>
              <q-item-section
                >Autorizo que los datos generados por mi registro, sean parte de
                los informes que se elaboren con fines
                estadísticos.</q-item-section
              >
            </q-item>
          </q-list>
        </q-card-section>
      </div>
      <q-card v-if="candidato.validado == false">
        <q-list
          v-if="$q.screen.xs"
          dark
          padding
          bordered
          class="rounded-borders"
        >
          <q-expansion-item
            class="text-justify"
            :label="tab"
            header-class="text-pink"
            expand-icon-class="text-pink"
            v-model="open_tab"
            :icon="`${evaluaBadge(tab)}` == 'green' ? 'check_circle' : 'cancel'"
          >
            <q-tabs
              v-model="tab"
              vertical
              class="text-purple"
              active-color="white"
            >
              <q-tab
                v-for="apartado in apartado_List"
                :key="apartado"
                :name="apartado"
                :label="apartado"
                :class="
                  `${evaluaBadge(apartado)}` == 'green'
                    ? 'text-green'
                    : 'text-grey'
                "
                :icon="
                  `${evaluaBadge(apartado)}` == 'green'
                    ? 'check_circle'
                    : 'cancel'
                "
                @click="open_tab = !open_tab"
              />
            </q-tabs>
          </q-expansion-item>
        </q-list>
        <q-tabs
          v-else
          v-model="tab"
          dense
          class="text-pink"
          active-color="pink"
          indicator-color="pink"
          align="justify"
          narrow-indicator
          inline-label=""
        >
          <q-tab
            v-for="apartado in apartado_List"
            :key="apartado"
            :name="apartado"
            :label="apartado"
            :class="
              `${evaluaBadge(apartado)}` == 'green' ? 'text-green' : 'text-grey'
            "
            :icon="
              `${evaluaBadge(apartado)}` == 'green' ? 'check_circle' : 'cancel'
            "
          >
          </q-tab>
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel :name="tab">
            <q-form class="q-col-gutter-xs">
              <div class="q-pa-lg">
                <div
                  v-for="pregunta in cuestionariosFiltrado"
                  :key="pregunta.pregunta.id"
                >
                  <div v-if="pregunta.oculta == false">
                    <div class="text-subtitle2">
                      {{
                        `${pregunta.pregunta.numero}. ${pregunta.pregunta.pregunta}`
                      }}
                    </div>
                    <q-list>
                      <q-item
                        tag="label"
                        v-ripple
                        v-for="opcion in pregunta.opciones"
                        :key="opcion.id"
                      >
                        <div
                          :class="$q.screen.xs ? 'col-12' : 'col-3'"
                          v-if="pregunta.pregunta.tipo == 'opcion'"
                        >
                          <q-radio
                            v-if="
                              opcion.opcion != 'Otro' &&
                              opcion.opcion != 'Otra' &&
                              opcion.opcion != 'No aplica'
                            "
                            v-model="pregunta.resp"
                            dense
                            color="pink"
                            :val="opcion.opcion"
                            :label="opcion.opcion"
                            @click="
                              responder(
                                opcion.opcion,
                                opcion.id,
                                pregunta.pregunta,
                                null,
                                null
                              )
                            "
                          >
                          </q-radio>
                          <q-input
                            v-show="
                              (opcion.opcion == 'Otro' ||
                                opcion.opcion == 'Otra') &&
                              opcion.opcion != 'No aplica'
                            "
                            dense="dense"
                            autogrow
                            v-model="pregunta.resp_otros"
                            label="Otro"
                          >
                            <template
                              v-if="
                                pregunta.resp_otros != null &&
                                pregunta.resp_otros != ''
                              "
                              v-slot:after
                              ><q-btn
                                @click="
                                  responder(
                                    opcion.opcion,
                                    opcion.id,
                                    pregunta.pregunta,
                                    null,
                                    pregunta.resp_otros
                                  )
                                "
                                flat
                                round
                                color="pink"
                                icon="save"
                              >
                                <q-tooltip>Guardar respuesta </q-tooltip>
                              </q-btn>
                            </template>
                          </q-input>
                          <div
                            v-for="subOpcion in list_Sub_Sensorial"
                            :key="subOpcion"
                          >
                            <q-radio
                              class="q-pl-lg"
                              v-if="
                                opcion.opcion == 'Sensorial' &&
                                pregunta.resp == 'Sensorial'
                              "
                              v-model="pregunta.resp_Sub"
                              dense
                              color="pink"
                              :val="subOpcion.id"
                              :label="subOpcion.sub_Opcion"
                              @click="
                                responder(
                                  opcion.opcion,
                                  opcion.id,
                                  pregunta.pregunta,
                                  subOpcion.id,
                                  null
                                )
                              "
                            >
                            </q-radio>
                          </div>
                          <div
                            v-for="subOpcion in list_Sub_Negocio"
                            :key="subOpcion"
                          >
                            <q-radio
                              class="q-pl-lg"
                              v-if="
                                opcion.opcion == 'Negocio propio' &&
                                pregunta.resp == 'Negocio propio'
                              "
                              v-model="pregunta.resp_Sub"
                              dense
                              color="pink"
                              :val="subOpcion.id"
                              :label="subOpcion.sub_Opcion"
                              @click="
                                responder(
                                  opcion.opcion,
                                  opcion.id,
                                  pregunta.pregunta,
                                  subOpcion.id,
                                  null
                                )
                              "
                            >
                            </q-radio>
                          </div>
                        </div>
                        <div
                          :class="$q.screen.xs ? 'col-12' : 'col-3'"
                          v-if="pregunta.pregunta.tipo == 'mixto'"
                        >
                          <select
                            class="select"
                            v-if="
                              opcion.opcion == 'Listado de pueblos indígenas'
                            "
                            :v-model="pregunta.resp_otros"
                            @change="
                              responder(
                                opcion.opcion,
                                opcion.id,
                                pregunta.pregunta,
                                null,
                                $event.target.value
                              )
                            "
                          >
                            <option>
                              {{
                                pregunta.resp_otros != null
                                  ? pregunta.resp_otros
                                  : "Seleccione una opción"
                              }}
                            </option>
                            <option
                              v-for="list in list_Grupos"
                              :key="list"
                              :value="list.label"
                            >
                              {{ list.label }}
                            </option>
                          </select>
                          <q-input
                            v-if="opcion.opcion == 'Otro' && pueblo == true"
                            dense="dense"
                            autogrow
                            v-model="pregunta.resp_otros"
                            label="Otro"
                          >
                            <template v-slot:after
                              ><q-btn
                                @click="
                                  responder(
                                    opcion.opcion,
                                    opcion.id,
                                    pregunta.pregunta,
                                    null,
                                    pregunta.resp_otros
                                  ),
                                    (pregunta.resp_otros = null)
                                "
                                flat
                                round
                                color="pink"
                                icon="save"
                              >
                                <q-tooltip>Guardar respuesta </q-tooltip>
                              </q-btn>
                            </template>
                          </q-input>
                          <select
                            class="select"
                            v-if="
                              opcion.opcion == 'select entidades federativas'
                            "
                            :v-model="
                              pregunta.resp_otros == null
                                ? ''
                                : pregunta.resp_otros
                            "
                            @change="
                              responder(
                                opcion.opcion,
                                opcion.id,
                                pregunta.pregunta,
                                null,
                                $event.target.value
                              )
                            "
                          >
                            <option>
                              {{
                                pregunta.resp_otros != null
                                  ? pregunta.resp_otros
                                  : "Seleccione una opción"
                              }}
                            </option>
                            <option
                              v-for="list in list_Estados"
                              :key="list"
                              :value="list.label"
                            >
                              {{ list.label }}
                            </option>
                          </select>
                          <q-radio
                            v-if="
                              opcion.opcion != 'Otro' &&
                              opcion.opcion != 'Otra' &&
                              opcion.opcion != 'Listado de pueblos indígenas' &&
                              opcion.opcion != 'select entidades federativas'
                            "
                            v-model="pregunta.resp"
                            dense
                            color="pink"
                            :val="opcion.opcion"
                            :label="opcion.opcion"
                            @click="
                              responder(
                                opcion.opcion,
                                opcion.id,
                                pregunta.pregunta,
                                null,
                                null
                              )
                            "
                          >
                          </q-radio>
                        </div>
                        <div
                          v-if="pregunta.pregunta.tipo == 'mixto paises'"
                          :class="$q.screen.xs ? 'col-12' : 'col-3'"
                        >
                          <select
                            class="select"
                            v-if="opcion.opcion == 'select paises'"
                            :v-model="
                              pregunta.resp_otros == null
                                ? ''
                                : pregunta.resp_otros
                            "
                            @change="
                              responder(
                                opcion.opcion,
                                opcion.id,
                                pregunta.pregunta,
                                null,
                                $event.target.value
                              )
                            "
                          >
                            <option>
                              {{
                                pregunta.resp_otros != null
                                  ? pregunta.resp_otros
                                  : "Seleccione una opción"
                              }}
                            </option>
                            <option
                              v-for="list in list_Paises"
                              :key="list"
                              :value="list.label"
                            >
                              {{ list.label }}
                            </option>
                          </select>
                          <q-radio
                            v-if="
                              opcion.opcion != 'select paises' &&
                              opcion.opcion != 'Otro' &&
                              opcion.opcion != 'Otra' &&
                              opcion.opcion != 'Listado de pueblos indígenas' &&
                              opcion.opcion != 'select entidades federativas' &&
                              opcion.opcion != 'No aplica'
                            "
                            v-model="pregunta.resp"
                            dense
                            color="pink"
                            :val="opcion.opcion"
                            :label="opcion.opcion"
                            @click="
                              responder(
                                opcion.opcion,
                                opcion.id,
                                pregunta.pregunta,
                                null,
                                null
                              )
                            "
                          >
                          </q-radio>
                        </div>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
      <q-card v-else>
        <div class="row bg-white">
          <div class="q-gutter-y-md col-12">
            <q-list>
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
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerCube } from "quasar";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { onBeforeMount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth-store";
import { EncryptStorage } from "storage-encryption";
import banner from "src/components/BannerComp.vue";

//-----------------------------------------------------------------

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const $q = useQuasar();
const router = useRouter();
const candidatosStore = useCandidatosStore();
const configuracionStore = useConfiguracionStore();
const {
  list_Estados,
  list_Preguntas,
  list_Opciones,
  list_Respuestas_Candidatos,
  respuesta_Candidato,
  list_Paises,
  list_Grupos,
  list_Sub_Sensorial,
  list_Sub_Negocio,
} = storeToRefs(configuracionStore);
const { candidato, modalConsentimiento } = storeToRefs(candidatosStore);
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "SCC-REG-CI";
const tab = ref("Autoadscripción indígena");
const cuestionarios = ref([]);
const cuestionariosFiltrado = ref([]);
const apartado_List = ref([]);
const pueblo = ref(false);
const faltante = ref(null);
const open_tab = ref(false);
const partido = encryptStorage.decrypt("partido_id");
const is_Candidato = encryptStorage.decrypt("candidato_id");

//-----------------------------------------------------------------

onBeforeMount(() => {
  cargadata();
});

//-----------------------------------------------------------------

watch(modalConsentimiento, (val) => {
  if (val == true) {
    candidatosStore.loadCandidatoById(
      candidato.value.puesto,
      candidato.value.id
    );
  }
});

const evaluaBadge = (titulo) => {
  if (faltante.value != null) {
    let result = faltante.value.includes(titulo) ? "red" : "green";
    return result;
  } else {
    return "red";
  }
};

const cargarCandidato = async () => {
  await candidatosStore.loadCandidatoById(
    candidato.value.puesto,
    candidato.value.id
  );
  if (candidato.value.id != null) {
    cargarFaltante(candidato.value.faltante_Identidad);
  }
  load();
};

const cargadata = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "pink",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento por favor...",
    messageColor: "black",
  });
  if (candidato.value.id == null) {
    router.push({
      name: "inicio",
    });
  } else {
    cargarCandidato();
    await configuracionStore.loadGrupos();
    await configuracionStore.loadPaises();
    await configuracionStore.loadEstados();
    await configuracionStore.loadPreguntasCandidatos();
    await cargarRespuestas();
  }

  $q.loading.hide();
};

const irCurricular = async () => {
  candidatosStore.initDatosGenerales();
  await candidatosStore.loadCandidatoById(
    candidato.value.puesto,
    candidato.value.id
  );
  await candidatosStore.loadDatosGeneralesById(
    candidato.value.id,
    candidato.value.puesto
  );
  router.push({
    name: "cuestionario",
  });
};

const cargarRespuestas = async () => {
  $q.loading.show();
  cuestionarios.value = [];
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
    let apartado = apartado_List.value.includes(pregunta.apartado);
    if (!apartado) {
      apartado_List.value.push(pregunta.apartado);
    }
    if (
      pregunta.pregunta == "En caso afirmativo, ¿de qué tipo?" ||
      pregunta.pregunta == "Su fuente principal de ingresos es:"
    ) {
      list_Opciones.value.forEach((element) => {
        if (element.opcion == "Sensorial") {
          cargarSubOpciones(element.id, "Sensorial");
        } else if (element.opcion == "Negocio propio") {
          cargarSubOpciones(element.id, "Negocio propio");
        }
      });
    }

    cuestionarios.value.push({
      editar: resp_candidato == undefined ? false : true,
      apartado: pregunta.apartado,
      pregunta,
      opciones: list_Opciones.value,
      resp: opcion_candidato == undefined ? null : opcion_candidato.opcion,
      resp_otros: resp_candidato == undefined ? null : resp_candidato.otros,
      resp_candidato,
      resp_Sub:
        resp_candidato == undefined ? null : resp_candidato.sub_Opcion_Id,
      oculta: false,
    });

    cuestionariosFiltrado.value = cuestionarios.value.filter(
      (word) => word.apartado == tab.value
    );
  }
  load();
  $q.loading.hide();
};

const load = () => {
  const respuestaDiscapacidad = cuestionarios.value.find(
    (pregunta) =>
      pregunta.pregunta.numero === 4 &&
      (pregunta.resp == "No" ||
        pregunta.resp == "Prefiero no contestar" ||
        pregunta.resp == null)
  );
  const respuestaSexual = cuestionarios.value.find(
    (pregunta) =>
      pregunta.pregunta.numero === 9 &&
      (pregunta.resp == "No" ||
        pregunta.resp == "Prefiero no contestar" ||
        pregunta.resp == null)
  );
  const respuestaMigrantes = cuestionarios.value.find(
    (pregunta) =>
      pregunta.pregunta.numero === 11 &&
      (pregunta.resp == "No" ||
        pregunta.resp == "Prefiero no contestar" ||
        pregunta.resp == null)
  );

  if (respuestaDiscapacidad) {
    const preguntasOcultar = [5, 6, 7];
    for (const pregunta of cuestionarios.value) {
      if (preguntasOcultar.includes(pregunta.pregunta.numero)) {
        pregunta.oculta = true;
      }
    }
  } else {
    const preguntasOcultar = [5, 6, 7];
    for (const pregunta of cuestionarios.value) {
      if (preguntasOcultar.includes(pregunta.pregunta.numero)) {
        pregunta.oculta = false;
      }
    }
  }
  if (respuestaSexual) {
    const preguntasOcultar = [10];
    for (const pregunta of cuestionarios.value) {
      if (preguntasOcultar.includes(pregunta.pregunta.numero)) {
        pregunta.oculta = true;
      }
    }
  } else {
    const preguntasOcultar = [10];
    for (const pregunta of cuestionarios.value) {
      if (preguntasOcultar.includes(pregunta.pregunta.numero)) {
        pregunta.oculta = false;
      }
    }
  }
  if (respuestaMigrantes) {
    const preguntasOcultar = [12, 13, 14, 15];
    for (const pregunta of cuestionarios.value) {
      if (preguntasOcultar.includes(pregunta.pregunta.numero)) {
        pregunta.oculta = true;
      }
    }
  } else {
    const preguntasOcultar = [12, 13, 14, 15];
    for (const pregunta of cuestionarios.value) {
      if (preguntasOcultar.includes(pregunta.pregunta.numero)) {
        pregunta.oculta = false;
      }
    }
  }
};

const cargarFaltante = (faltante_Identidad) => {
  faltante.value = faltante_Identidad.split("|");
  if (faltante.value[0] != "") {
    tab.value = faltante.value[0];
  } else {
    tab.value = "Autoadscripción indígena";
  }
};

const updateApartado = async (id) => {
  cuestionariosFiltrado.value = cuestionarios.value.filter(
    (apartado) => apartado.apartado == id
  );
};

//-----------------------------------------------------------------

watch(tab, (val) => {
  if (val != null) {
    cuestionariosFiltrado.value = cuestionarios.value.filter(
      (word) => word.apartado == val
    );
  }
});

//-----------------------------------------------------------------

const cargarSubOpciones = async (id, pregunta) => {
  await configuracionStore.loadSubopcionesByOpcion(id, pregunta);
};

const consentimientoExpreso = async () => {
  await candidatosStore.loadCandidatoById(
    candidato.value.id,
    candidato.value.puesto
  );
  candidatosStore.actualizarConsentiento(true);
};

const consultarRespuesta = (pregunta) => {
  let encontro = list_Respuestas_Candidatos.value.find(
    (x) => x.pregunta_Id == pregunta
  );
  return encontro;
};

const responder = async (
  opcion,
  respuesta,
  pregunta,
  subOpcion,
  resp_otros
) => {
  let resp = null;
  $q.loading.show();

  await configuracionStore.loadRespuestasByCandidato(
    candidato.value.id,
    candidato.value.puesto
  );
  let consultar = consultarRespuesta(pregunta.id);

  if (tab.value == "Autoadscripción indígena" && resp_otros == "Otro") {
    pueblo.value = true;
  } else {
    pueblo.value = false;
  }
  respuesta_Candidato.value.opcion_Id = respuesta;
  respuesta_Candidato.value.pregunta_Id = pregunta.id;
  respuesta_Candidato.value.puesto_Candidato = candidato.value.puesto;
  respuesta_Candidato.value.sub_Opcion_Id = subOpcion;
  respuesta_Candidato.value.otros = resp_otros;

  if (
    (pregunta.numero == 19 &&
      opcion == "Negocio propio" &&
      subOpcion == null) ||
    (pregunta.numero == 3 && resp_otros == "Otro")
  ) {
  } else {
    if (consultar != undefined) {
      respuesta_Candidato.value.id = consultar.id;
      resp = await configuracionStore.updateRespueta(respuesta_Candidato.value);
    } else {
      resp = await configuracionStore.createRespuesta(
        candidato.value.id,
        respuesta_Candidato.value
      );
    }
  }

  //-------------------------------------------------------
  if (
    pregunta.numero == 4 &&
    (opcion == "No" || opcion == "Prefiero no contestar")
  ) {
    await guardarNoaplica(5);
    await guardarNoaplica(6);
    await guardarNoaplica(7);
  } else if (pregunta.numero == 4 && opcion == "Sí") {
    await eliminarNoaplica(5);
    await eliminarNoaplica(6);
    await eliminarNoaplica(7);
  }
  if (
    pregunta.numero == 9 &&
    (opcion == "No" || opcion == "Prefiero no contestar")
  ) {
    await guardarNoaplica(10);
  } else if (pregunta.numero == 9 && opcion == "Sí") {
    await eliminarNoaplica(10);
  }
  if (
    pregunta.numero == 11 &&
    (opcion == "No" || opcion == "Prefiero no contestar")
  ) {
    await guardarNoaplica(12);
    await guardarNoaplica(13);
    await guardarNoaplica(14);
    await guardarNoaplica(15);
  } else if (pregunta.numero == 11 && opcion == "Sí") {
    await eliminarNoaplica(12);
    await eliminarNoaplica(13);
    await eliminarNoaplica(14);
    await eliminarNoaplica(15);
  }
  //-------------------------------------------------------
  if (opcion != "Negocio propio" && resp_otros != "Otro") {
    if (resp.success) {
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      cargarCandidato();
    } else {
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  } else if (
    pregunta.numero == 19 &&
    opcion == "Negocio propio" &&
    subOpcion != null
  ) {
    if (resp.success) {
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      cargarCandidato();
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

const consultarPregunta = async (numero) => {
  let encontro = list_Preguntas.value.find((x) => x.numero == numero);
  await configuracionStore.loadRespuestasByPregunta(encontro.id);
  return encontro;
};

const consultarOpciones = (opcion) => {
  let encontro = list_Opciones.value.find((x) => x.opcion == opcion);
  return encontro;
};

const eliminarNoaplica = async (numeroPregunta) => {
  let resp = null;
  let encontrarPregunta = await consultarPregunta(numeroPregunta);
  let consultar = consultarRespuesta(encontrarPregunta.id);
  let encontroOpcion = consultarOpciones("No aplica");
  let respuestaCandidato = list_Respuestas_Candidatos.value.find(
    (x) => x.opcion_Id == encontroOpcion.id
  );
  if (consultar != undefined) {
    resp = await configuracionStore.deleteRespuesta(respuestaCandidato.id);
    cargarRespuestas();
  }
};

const guardarJovenesMayores = async (numeroPregunta, opcion) => {
  let resp = null;
  let encontrarPregunta = await consultarPregunta(numeroPregunta);
  let consultar = consultarRespuesta(encontrarPregunta.id);
  let encontroOpciones = consultarOpciones(opcion);

  respuesta_Candidato.value.opcion_Id = encontroOpciones.id;
  respuesta_Candidato.value.pregunta_Id = encontrarPregunta.id;
  respuesta_Candidato.value.puesto_Candidato = candidato.value.puesto;

  if (consultar != undefined) {
    respuesta_Candidato.value.id = consultar.id;
    resp = await configuracionStore.updateRespueta(respuesta_Candidato.value);
  } else {
    resp = await configuracionStore.createRespuesta(
      candidato.value.id,
      respuesta_Candidato.value
    );
  }
};

const guardarNoaplica = async (numeroPregunta) => {
  let resp = null;
  let encontrarPregunta = await consultarPregunta(numeroPregunta);
  let consultar = consultarRespuesta(encontrarPregunta.id);
  let encontroOpciones = consultarOpciones("No aplica");

  respuesta_Candidato.value.opcion_Id = encontroOpciones.id;
  respuesta_Candidato.value.pregunta_Id = encontrarPregunta.id;
  respuesta_Candidato.value.puesto_Candidato = candidato.value.puesto;

  if (consultar != undefined) {
    respuesta_Candidato.value.id = consultar.id;
    resp = await configuracionStore.updateRespueta(respuesta_Candidato.value);
  } else {
    resp = await configuracionStore.createRespuesta(
      candidato.value.id,
      respuesta_Candidato.value
    );
  }
};
</script>
<style scoped>
.select {
  font-family: "Verdana", sans-serif;
  color: #444;
  padding: 0.4em 1.4em 0.3em 0.8em;
  width: 400px;
  max-width: 100%;
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.03);
  border-radius: 0.3em;
  background-color: #fff;
}
</style>
