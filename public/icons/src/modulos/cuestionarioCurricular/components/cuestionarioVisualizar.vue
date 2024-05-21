<template>
  <div class="row q-pr-lg q-pl-lg q-pt-md">
    <div class="col-9">
      <q-btn
        :to="{ name: 'lista_Candidatos' }"
        icon="groups"
        class="bg-pink-1 text-white"
        label="Regresar"
      ></q-btn>
      <q-btn
        @click="irIdentidad"
        icon="arrow_forward"
        class="q-ml-sm bg-pink-1 text-white"
        label="Ir a cuestionario de identidad"
      ></q-btn>
    </div>
  </div>
  <!---------------------------BANNER--------------------------->
  <div class="q-pa-lg">
    <banner>
      <template v-slot:icono>
        <q-icon name="info" color="grey" />
      </template>
      <template v-slot:contenido>
        Los Partidos Politicos, sus candidaturas y las personas candidatas
        independientes serán responsables del llenado de la información
        curricular.
        <q-icon name="check_circle" size="xs" color="green" /> significa que el
        apartado esta completo,
        <q-icon name="cancel" size="xs" color="grey" /> significa que falta por
        capturar la información
      </template>
    </banner>
  </div>
  <!---------------------------CUESTIONARIO CURRICULAR--------------------------->
  <template v-if="candidato.id == null">
    <q-spinner-cube color="pink" size="5.5em" />
  </template>
  <template v-else>
    <div class="row q-pa-lg">
      <div class="q-gutter-y-md col-12">
        <q-banner
          v-if="candidato.validado == true"
          inline-actions
          class="text-justify bg-green-6"
          style="border-radius: 20px"
        >
          <div class="text-white text-h6 text-bold">
            <q-icon name="check_circle" size="md" />
            Completo
            {{ candidato.validado == true ? "- Validado" : "" }}
          </div>
        </q-banner>
        <q-card>
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
              :icon="
                `${evaluaBadge(tab)}` == 'green' ? 'check_circle' : 'cancel'
              "
            >
              <q-tabs
                v-model="tab"
                vertical
                class="text-purple"
                active-color="white"
              >
                <q-tab
                  v-for="rubro in list_Rubros"
                  :key="rubro"
                  :name="rubro"
                  :label="rubro"
                  :class="
                    `${evaluaBadge(rubro)}` == 'white'
                      ? 'text-orange'
                      : `${evaluaBadge(rubro)}` == 'green'
                      ? 'text-green'
                      : 'text-grey'
                  "
                  :icon="
                    `${evaluaBadge(rubro)}` == 'white'
                      ? 'warning'
                      : `${evaluaBadge(rubro)}` == 'green'
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
            active-color="pink"
            indicator-color="pink"
            align="justify"
            narrow-indicator
            inline-label
          >
            <q-tab
              v-for="rubro in list_Rubros"
              :key="rubro"
              :class="
                `${evaluaBadge(rubro)}` == 'white'
                  ? 'text-orange'
                  : `${evaluaBadge(rubro)}` == 'green'
                  ? 'text-green'
                  : 'text-grey'
              "
              :icon="
                `${evaluaBadge(rubro)}` == 'white'
                  ? 'warning'
                  : `${evaluaBadge(rubro)}` == 'green'
                  ? 'check_circle'
                  : 'cancel'
              "
              :name="rubro"
              :label="rubro"
            >
            </q-tab>
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <!---------------------------DATOS GENERALES--------------------------->
            <q-tab-panel name="Datos generales">
              <div class="row">
                <q-card bordered class="no-shadow col-12">
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar
                        rounded
                        class="shadow-10"
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
                    </q-item-section>
                    <q-item-section>
                      <q-item-label avatar>
                        <q-avatar square>
                          <img :src="candidato.url_Logo_Partido" alt="" />
                        </q-avatar>
                      </q-item-label>
                      <q-item-section class="text-grey-8 text-weight-bold">
                        <q-item-label>
                          {{
                            candidato.tipo_Eleccion == "Diputaciones"
                              ? candidato.distrito_Id == null
                                ? ""
                                : `Distrito  ${candidato.distrito}`
                              : candidato.tipo_Eleccion ==
                                "Presidencias y Sindicaturas"
                              ? `Municipio ${candidato.municipio}`
                              : candidato.tipo_Eleccion == "Regidurías"
                              ? candidato.demarcacion_Id == null
                                ? `Municipio ${candidato.municipio}`
                                : `Municipio ${candidato.municipio} - Demarcación ${demarcacion}`
                              : ""
                          }}</q-item-label
                        >
                      </q-item-section>
                      <q-item-label class="text-grey-8 text-weight-bold">
                        Nombre: {{ candidato.nombre_Completo }}
                      </q-item-label>
                      <q-item-label class="text-grey-8">
                        Género: {{ candidato.sexo }}
                      </q-item-label>
                      <q-item-label class="text-grey-8">
                        Edad: {{ candidato.edad }}
                      </q-item-label>
                      <q-item-label class="text-grey-8">
                        Tipo de elección: {{ candidato.tipo_Eleccion }} -
                        {{ candidato.tipo_Candidato }}
                      </q-item-label>
                      <q-item-label class="text-grey-8">
                        Cargo: {{ candidato.cargo }}
                      </q-item-label>
                      <q-item-label class="text-grey-8">
                        Número de fórmula: {{ candidato.no_Formula }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card>
              </div>
              <br />
              <div class="text-red text-bold">
                * Se deberá capturar alguno o algunos de los siguientes campos.
              </div>
              <div class="row">
                <q-card-section
                  class="col-lg-6 col-md-12 col-sm-12 col-xs-12 text-center"
                >
                  <div class="text-h6 text-grey-8">Redes sociales</div>
                  <q-input
                    readonly
                    label="Facebook"
                    v-model="datos_Generales.facebook"
                  >
                    <template v-slot:prepend>
                      <i class="fa-brands fa-facebook"></i>
                    </template>
                  </q-input>
                  <q-input
                    readonly
                    v-model="datos_Generales.twitter"
                    label="X (antes Twitter)"
                  >
                    <template v-slot:prepend>
                      <i class="fa-brands fa-x-twitter"></i>
                    </template>
                  </q-input>
                  <q-input
                    readonly
                    v-model="datos_Generales.youtube"
                    label="YouTube"
                  >
                    <template v-slot:prepend>
                      <i class="fa-brands fa-youtube"></i>
                    </template>
                  </q-input>
                  <q-input
                    readonly
                    v-model="datos_Generales.instagram"
                    label="Instagram"
                  >
                    <template v-slot:prepend>
                      <i class="fa-brands fa-instagram"></i>
                    </template>
                  </q-input>
                  <q-input
                    readonly
                    v-model="datos_Generales.tik_Tok"
                    label="Tik Tok"
                  >
                    <template v-slot:prepend>
                      <i class="fa-brands fa-tiktok"></i>
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-section
                  class="col-lg-6 col-md-12 col-sm-12 col-xs-12 text-center"
                >
                  <div class="text-h6 text-grey-8">
                    Otros medios de contacto público
                  </div>
                  <q-input
                    readonly
                    v-model="datos_Generales.pagina_Web"
                    label="Página web"
                  >
                    <template v-slot:prepend>
                      <q-avatar square size="50px" icon="computer"> </q-avatar>
                    </template>
                  </q-input>
                  <q-input
                    readonly
                    v-model="datos_Generales.email"
                    label="Correo electrónico público"
                    type="email"
                    autogrow
                  >
                    <template v-slot:prepend>
                      <q-avatar square size="50px" icon="mail"> </q-avatar>
                    </template>
                  </q-input>
                  <q-input
                    readonly
                    mask="### - ### - ####"
                    v-model="datos_Generales.telefono"
                    label="Teléfono público de contacto"
                  >
                    <template v-slot:prepend>
                      <q-avatar square size="50px" icon="call"> </q-avatar>
                    </template>
                  </q-input>
                  <q-input
                    readonly
                    v-model="datos_Generales.domicilio"
                    label="Domicilio de casa de campaña"
                  >
                    <template v-slot:prepend>
                      <q-avatar square size="50px" icon="location_on">
                      </q-avatar>
                    </template>
                  </q-input>
                  <br />
                </q-card-section>
              </div>
            </q-tab-panel>
            <!---------------------------FORMACIÓN ACADÉMICA--------------------------->
            <q-tab-panel name="Formación académica">
              <div class="text-h6 text-grey-8">
                Grado máximo de estudios y su estatus
              </div>
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-xs">
                  <q-select
                    readonly
                    v-model="datos_Generales.grado_Maximo_Estudios"
                    :options="grado_Maximo_Estudios"
                    label="Grado máximo de estudios"
                  >
                    <template v-slot:prepend>
                      <p class="text-red">*</p>
                    </template>
                  </q-select>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    readonly
                    v-if="
                      datos_Generales.grado_Maximo_Estudios != 'Sin estudios'
                    "
                    v-model="estatus_Id"
                    :options="estatus"
                    label="Estatus"
                  >
                    <template v-slot:prepend>
                      <p class="text-red">*</p>
                    </template>
                  </q-select>
                </div>
              </div>
              <br />
              <div class="text-h6 text-grey-8">Formación académica</div>

              <div class="col-12 q-pt-lg">
                <q-list bordered v-if="list_Formacion_Academica.length > 0">
                  <q-expansion-item
                    v-for="(formacion, index) in list_Formacion_Academica"
                    :key="formacion"
                  >
                    <template v-slot:header>
                      <q-item-section avatar>
                        <q-icon color="pink" name="looks_one" />
                      </q-item-section>

                      <q-item-section>
                        Formación académica {{ index + 1 }}
                      </q-item-section>
                    </template>
                    <q-card>
                      <q-card-section>
                        {{ formacion.formacion }}
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                  <q-separator />
                </q-list>
                <div v-else class="text-bold text-subtitle1">
                  La candidatura no proporcionó información.
                </div>
              </div>
              <q-space />
              <div class="text-red q-pt-lg text-bold">
                *Campos obligatorios.
              </div>
            </q-tab-panel>
            <!---------------------------HISTORIA PROFESIONAL Y/O LABORAL--------------------------->
            <q-tab-panel name="Historia profesional y/o laboral">
              <div class="text-h6 text-grey-8">
                Historia profesional y/o laboral
              </div>
              <div class="col-12">
                <q-input
                  readonly
                  v-model="historia"
                  label="Experiencia, años y actividades realizadas"
                  type="textarea"
                  hint="Mínimo 280 caracteres y máximo 5,000 caracteres"
                  autofocus
                >
                  <template v-slot:prepend>
                    <p class="text-red">*</p>
                  </template>
                  <template v-slot:append>
                    <div class="text-overline">
                      {{
                        `${
                          historia != null
                            ? historia.replace(/\s+/g, "").length
                            : 0
                        }/5000`
                      }}
                    </div>
                  </template>
                </q-input>
              </div>
              <div class="text-red q-pt-lg text-bold">*Campo obligatorio.</div>
            </q-tab-panel>
            <!---------------------------TRAYECTORIA POLÍTICA Y/O PARTICIPACIÓN SOCIAL--------------------------->
            <q-tab-panel name="Trayectoria política y/o participación social">
              <div class="text-h6 text-grey-8">
                Trayectoria política y/o participación social
              </div>
              <div class="row">
                <q-input
                  readonly
                  class="col-12"
                  autofocus
                  v-model="trayectoria"
                  label="Trayectoria política y/o participación social en organizaciones ciudadanas o de la sociedad civil"
                  type="textarea"
                  hint="Trayectoria, años y actividades realizadas (Minimo 280 caracteres y máximo 5,000 caracteres)"
                >
                  <template v-slot:prepend>
                    <p class="text-red">*</p>
                  </template>
                  <template v-slot:append>
                    <div class="text-overline">
                      {{
                        `${
                          trayectoria != null
                            ? trayectoria.replace(/\s+/g, "").length
                            : 0
                        }/5000`
                      }}
                    </div>
                  </template>
                </q-input>
              </div>
              <div class="text-h6 text-grey-8">
                ¿Por qué quiere ocupar un cargo público?
              </div>
              <div class="row">
                <q-input
                  readonly
                  v-model="ocuparCargo"
                  class="col-12"
                  lazy-rules
                  label="Motivaciones de ocupar un cargo público"
                  type="textarea"
                  hint="Mínimo 280 caracteres y máximo 5,000 caracteres"
                >
                  <template v-slot:append>
                    <div class="text-overline">
                      {{
                        `${
                          ocuparCargo != null
                            ? ocuparCargo.replace(/\s+/g, "").length
                            : 0
                        }/5000`
                      }}
                    </div>
                  </template>
                </q-input>
              </div>
              <div class="text-red q-pt-lg text-bold">*Campo obligatorio.</div>
            </q-tab-panel>
            <!---------------------------PROPUESTAS--------------------------->
            <q-tab-panel name="Propuestas">
              <div class="text-h6 text-grey-8">
                ¿Cuáles son sus dos principales propuestas?
              </div>
              <div class="q-pt-lg">
                <q-list bordered v-if="list_Propuestas.length > 0">
                  <q-expansion-item>
                    <template v-slot:header>
                      <q-item-section avatar>
                        <q-icon color="pink" name="looks_one" />
                      </q-item-section>

                      <q-item-section> Propuesta 1 </q-item-section>
                    </template>
                    <q-card>
                      <q-card-section>
                        {{ list_Propuestas[0].propuesta }}
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                  <q-separator />
                  <q-expansion-item v-if="list_Propuestas.length > 1">
                    <template v-slot:header>
                      <q-item-section avatar>
                        <q-icon color="pink" name="looks_two" />
                      </q-item-section>

                      <q-item-section> Propuesta 2 </q-item-section>
                    </template>

                    <q-card>
                      <q-card-section>
                        {{ list_Propuestas[1].propuesta }}
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
                <div v-else class="text-bold text-subtitle1 q-pt-md">
                  La candidatura no proporcionó información.
                </div>
              </div>
              <div class="col-12">
                <div class="text-h6 text-grey-8 q-pt-xl">
                  Propuesta en materia de género, o en su caso, del grupo en
                  situación de discriminación que representa
                </div>
                <div
                  v-if="
                    candidato.validado == true &&
                    (propuestaGenero == null || propuestaGenero == '')
                  "
                  class="text-bold text-subtitle1 q-pt-md"
                >
                  La candidatura no proporcionó información.
                </div>
                <q-input
                  readonly
                  v-model="propuestaGenero"
                  label="Describa la población objetivo, metas y plazos para su promoción como iniciativa de ley o política pública"
                  type="textarea"
                  hint="Mínimo 280 caracteres y máximo 1,600 caracteres"
                  autofocus
                >
                  <template v-slot:append>
                    <div class="text-overline">
                      {{
                        `${
                          propuestaGenero != null
                            ? propuestaGenero.replace(/\s+/g, "").length
                            : 0
                        }/1600`
                      }}
                    </div>
                  </template>
                </q-input>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </template>
</template>

<script setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerCube } from "quasar";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { onBeforeMount, ref, watch } from "vue";
import banner from "../../../components/BannerComp.vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";

//-----------------------------------------------------------------

const $q = useQuasar();
const router = useRouter();
const candidatosStore = useCandidatosStore();
const configuracionStore = useConfiguracionStore();
const {
  candidato,
  datos_Generales,
  list_Formacion_Academica,
  formacion_Academica,
  propuesta,
  list_Propuestas,
  actualizar,
} = storeToRefs(candidatosStore);
const tab = ref("Datos generales");
const list_Rubros = ref([
  "Datos generales",
  "Formación académica",
  "Historia profesional y/o laboral",
  "Trayectoria política y/o participación social",
  "Propuestas",
]);
const formacion = ref(null);
const historia = ref(null);
const trayectoria = ref(null);
const ocuparCargo = ref(null);
const pricipalesPropuestas = ref(null);
const propuestaGenero = ref(null);
const grado_Maximo_Estudios = ref([
  "Sin estudios",
  "Primaria",
  "Secundaria",
  "Preparatoria",
  "Técnica",
  "Licenciatura",
  "Maestría",
  "Doctorado",
  "Especialidad",
  "Postdoctorado",
]);
const estatus = ref([
  "Reconocimiento",
  "Carta pasante",
  "Constancia",
  "Certificado",
  "Título",
  "Cédula",
]);
const faltante = ref(null);
const open_tab = ref(false);
const estatus_Id = ref(null);

//-----------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------------

watch(tab, (val) => {
  if (val != null) {
    candidatosStore.initFormacion();
    candidatosStore.initPropuesta();
  }
});

watch(formacion_Academica.value, (val) => {
  if (val != null) {
    formacion.value = val.formacion;
  }
});

watch(propuesta.value, (val) => {
  if (val != null) {
    pricipalesPropuestas.value = val.propuesta;
  }
});

watch(actualizar, (val) => {
  if (val == true) {
    cargarData();
  } else {
    candidatosStore.actualizarTabla(false);
  }
});

//-----------------------------------------------------------------

const irIdentidad = async () => {
  await candidatosStore.loadCandidatoById(
    candidato.value.puesto,
    candidato.value.id
  );
  router.push({
    name: "validarIdentidad",
  });
};

const evaluaBadge = (titulo) => {
  if (faltante.value != null) {
    let result = null;
    result = faltante.value.includes(titulo.toUpperCase()) ? "red" : "green";
    return result;
  } else {
    return "red";
  }
};

const cargarData = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "pink",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento por favor...",
    messageColor: "black",
  });
  if (candidato.value.id == null && candidato.value.puesto == null) {
    router.push({
      name: "inicio",
    });
  } else {
    await candidatosStore.loadCandidatoById(
      candidato.value.puesto,
      candidato.value.id
    );
    await candidatosStore.loadDatosGeneralesById(
      candidato.value.id,
      candidato.value.puesto
    );
    estatus_Id.value = datos_Generales.value.estatus_Grado_Estudios;
    await candidatosStore.loadFormacionAcademica(
      candidato.value.id,
      candidato.value.puesto
    );
    await candidatosStore.loadPropuestas(
      candidato.value.id,
      candidato.value.puesto
    );
    await candidatosStore.observacionesByCandidatoByPuesto(
      candidato.value.id,
      candidato.value.puesto
    );
    historia.value = datos_Generales.value.historia_Laboral;
    trayectoria.value = datos_Generales.value.trayectoria;
    ocuparCargo.value = datos_Generales.value.motivo_Cargo_Publico;
    propuestaGenero.value = datos_Generales.value.propuesta_Genero;

    cargarFaltante(candidato.value.faltante_Curricular);

    if (datos_Generales.value.motivo_Cargo_Publico == null) {
      ocuparCargo.value = "";
    }
    if (datos_Generales.value.trayectoria == null) {
      trayectoria.value = "";
    }
  }
  $q.loading.hide();
};

const cargarFaltante = (faltante_Curricular) => {
  faltante.value = faltante_Curricular.split("|");
};
</script>
