<template>
  <div class="row q-pr-lg q-pl-lg q-pt-md">
    <div class="col-9">
      <q-btn
        v-if="partido == null && is_Candidato == null"
        :to="{ name: 'lista_Candidatos' }"
        icon="groups"
        class="bg-pink-1 text-white"
        label="Candidaturas"
      ></q-btn>
      <q-btn
        v-if="partido != null"
        :to="{ name: 'registro_Candidatos' }"
        icon="groups"
        class="bg-pink-1 text-white"
        label="Candidaturas"
      ></q-btn>
      <q-btn
        @click="irIdentidad"
        icon="arrow_forward"
        class="q-ml-sm bg-pink-1 text-white"
        label="Ir a cuestionario de identidad"
      ></q-btn>
    </div>
    <div class="col-2 text-right">
      <q-btn
        @click="instrucciones(true)"
        round
        icon="question_mark"
        class="bg-orange q-mb-sm text-white"
      ></q-btn>
    </div>
  </div>
  <!---------------------------BANNER--------------------------->
  <div class="q-pr-lg q-pl-lg q-pb-md">
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
        capturar la información y
        <q-icon name="warning" size="xs" color="orange" /> significa que existen
        observaciones que atender. Recuerda guardar la información capturada por
        cada apartado <q-icon name="save" size="xs" color="green" />.
      </template>
    </banner>
  </div>
  <!---------------------------CUESTIONARIO CURRICULAR--------------------------->
  <div class="row q-pl-lg q-pr-lg">
    <div class="q-gutter-y-md col-12">
      <q-banner
        v-if="
          (faltante == '' || faltante == null) &&
          candidato.informacion_Pausada == null &&
          candidato.avance_Curricular == 100
        "
        inline-actions
        class="text-justify bg-green-6"
        style="border-radius: 20px"
      >
        <div class="text-white text-subtile2 text-bold">
          <q-icon name="check_circle" size="md" />
          Completo
          {{
            candidato.validado == true
              ? " - Validado"
              : " - El partido político por el que esta postulado tendrá que validar su información."
          }}
        </div>
      </q-banner>
      <q-banner
        v-if="
          candidato.informacion_Pausada != null &&
          candidato.informacion_Pausada != ''
        "
        inline-actions
        class="text-justify bg-orange-6"
        style="border-radius: 20px"
      >
        <div class="text-white text-subtile2 text-bold">
          <q-icon name="warning" size="md" />
          Información pausada
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
            :icon="`${evaluaBadge(tab)}` == 'green' ? 'check_circle' : 'cancel'"
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
            <q-checkbox
              v-if="
                list_Observaciones.length == 0 &&
                candidato.validado &&
                !candidato.informacion_Actualizada &&
                !solicitarRubro.includes(rubro) &&
                (candidato.informacion_Pausada == null ||
                  candidato.informacion_Pausada == '')
              "
              v-model="solicitarRubro"
              :val="rubro"
              @click="mostrarAlerta"
            />
          </q-tab>
        </q-tabs>
        <q-form @submit="onSubmit">
          <q-tab-panels v-model="tab" animated>
            <!---------------------------DATOS GENERALES--------------------------->
            <q-tab-panel name="Datos generales">
              <q-banner
                style="border-radius: 10px"
                v-if="
                  list_Observaciones.length > 0 &&
                  faltanteObservacion.includes('Identidad') == true &&
                  observacion.validadas == true
                "
                class="bg-orange-5 text-white row"
              >
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                Supuestos:
                <div
                  v-for="item in list_Observaciones[0].identidad
                    .split('||')[0]
                    .split('|')"
                  :key="item"
                >
                  - {{ item }}
                </div>
              </q-banner>
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
                        <q-img :src="candidato.url_Foto">
                          <div
                            v-if="
                              faltanteObservacion.includes('Identidad') ||
                              solicitarRubro.includes('Datos generales')
                            "
                            class="absolute-center text-subtitle1 text-center"
                          >
                            <q-btn
                              flat
                              @click="subirFotografia(true)"
                              label="Subir foto"
                            />
                          </div>
                        </q-img>
                      </q-avatar>
                      <q-avatar
                        rounded
                        class="shadow-10"
                        size="160px"
                        v-else-if="
                          (candidato.validado &&
                            !faltanteObservacion.includes('Identidad')) ||
                          !solicitarRubro.includes('Datos generales')
                        "
                      >
                        <q-img
                          v-if="candidato.sexo == 'Mujer'"
                          src="../../../assets/avatarmujer.jpg"
                        >
                          <div
                            v-if="
                              !candidato.validado ||
                              (candidato.validado == true &&
                                faltanteObservacion.includes('Identidad') ==
                                  true) ||
                              solicitarRubro.includes('Datos generales')
                            "
                            class="absolute-center text-subtitle1 text-center"
                          >
                            <q-btn
                              flat
                              @click="subirFotografia(true)"
                              label="Subir foto"
                            />
                          </div>
                        </q-img>
                        <q-img
                          v-else-if="candidato.sexo == 'Hombre'"
                          src="../../../assets/avatarHombre.jpg"
                        >
                          <div
                            v-if="
                              !candidato.validado ||
                              (candidato.validado == true &&
                                faltanteObservacion.includes('Identidad') ==
                                  true) ||
                              solicitarRubro.includes('Datos generales')
                            "
                            class="absolute-center text-subtitle1 text-center"
                          >
                            <q-btn
                              flat
                              @click="subirFotografia(true)"
                              label="Subir foto"
                            />
                          </div>
                        </q-img>
                        <q-img
                          v-if="candidato.sexo == 'No binario'"
                          src="../../../assets/noBinario.png"
                        >
                          <div
                            v-if="
                              !candidato.validado ||
                              (candidato.validado == true &&
                                faltanteObservacion.includes('Identidad') ==
                                  true) ||
                              solicitarRubro.includes('Datos generales')
                            "
                            class="absolute-center text-subtitle1 text-center"
                          >
                            <q-btn
                              flat
                              @click="subirFotografia(true)"
                              label="Subir foto"
                            />
                          </div>
                        </q-img>
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
                            candidato.no_Distrito != null
                              ? `Distrito: ${candidato.no_Distrito}`
                              : candidato.municipio != null &&
                                candidato.demarcacion == null
                              ? `Municipio: ${candidato.municipio}`
                              : candidato.demarcacion != null
                              ? `Municipio: ${candidato.municipio}, ${candidato.demarcacion}`
                              : ""
                          }}
                        </q-item-label>
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
                        Candidatura: {{ candidato.cargo }}
                      </q-item-label>
                      <q-item-label class="text-grey-8">
                        Tipo de elección: {{ candidato.tipo_Eleccion }} -
                        {{ candidato.tipo_Candidato }}
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
                    :readonly="
                      candidato.validado &&
                      !faltanteObservacion.includes('Identidad') &&
                      !solicitarRubro.includes('Datos generales')
                    "
                    label="Facebook"
                    v-model="datos_Generales.facebook"
                  >
                    <template v-slot:prepend>
                      <i class="fa-brands fa-facebook"></i>
                    </template>
                  </q-input>
                  <q-input
                    :readonly="
                      candidato.validado &&
                      !faltanteObservacion.includes('Identidad') &&
                      !solicitarRubro.includes('Datos generales')
                    "
                    v-model="datos_Generales.twitter"
                    label="X (antes Twitter)"
                  >
                    <template v-slot:prepend>
                      <i class="fa-brands fa-x-twitter"></i>
                    </template>
                  </q-input>
                  <q-input
                    :readonly="
                      candidato.validado &&
                      !faltanteObservacion.includes('Identidad') &&
                      !solicitarRubro.includes('Datos generales')
                    "
                    v-model="datos_Generales.youtube"
                    label="YouTube"
                  >
                    <template v-slot:prepend>
                      <i class="fa-brands fa-youtube"></i>
                    </template>
                  </q-input>
                  <q-input
                    :readonly="
                      candidato.validado &&
                      !faltanteObservacion.includes('Identidad') &&
                      !solicitarRubro.includes('Datos generales')
                    "
                    v-model="datos_Generales.instagram"
                    label="Instagram"
                  >
                    <template v-slot:prepend>
                      <i class="fa-brands fa-instagram"></i>
                    </template>
                  </q-input>
                  <q-input
                    :readonly="
                      candidato.validado &&
                      !faltanteObservacion.includes('Identidad') &&
                      !solicitarRubro.includes('Datos generales')
                    "
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
                    :readonly="
                      candidato.validado &&
                      !faltanteObservacion.includes('Identidad') &&
                      !solicitarRubro.includes('Datos generales')
                    "
                    v-model="datos_Generales.pagina_Web"
                    label="Página web"
                  >
                    <template v-slot:prepend>
                      <q-avatar square size="50px" icon="computer"> </q-avatar>
                    </template>
                  </q-input>
                  <q-input
                    :readonly="
                      candidato.validado &&
                      !faltanteObservacion.includes('Identidad') &&
                      !solicitarRubro.includes('Datos generales')
                    "
                    v-model.trim="datos_Generales.email"
                    label="Correo electrónico público"
                    autogrow
                  >
                    <template v-slot:prepend>
                      <q-avatar square size="50px" icon="mail"> </q-avatar>
                    </template>
                  </q-input>
                  <q-input
                    :readonly="
                      candidato.validado &&
                      !faltanteObservacion.includes('Identidad') &&
                      !solicitarRubro.includes('Datos generales')
                    "
                    mask="### - ### - ####"
                    v-model="datos_Generales.telefono"
                    label="Teléfono público de contacto"
                  >
                    <template v-slot:prepend>
                      <q-avatar square size="50px" icon="call"> </q-avatar>
                    </template>
                  </q-input>
                  <q-input
                    :readonly="
                      candidato.validado &&
                      !faltanteObservacion.includes('Identidad') &&
                      !solicitarRubro.includes('Datos generales')
                    "
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
              <q-banner
                style="border-radius: 10px"
                v-if="
                  list_Observaciones.length > 0 &&
                  faltanteObservacion.includes('Formacion') == true &&
                  observacion.validadas == true
                "
                class="bg-orange-5 text-white row"
              >
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                Supuestos:
                <div
                  v-for="item in list_Observaciones[0].formacion
                    .split('||')[0]
                    .split('|')"
                  :key="item"
                >
                  - {{ item }}
                </div>
              </q-banner>
              <div class="text-h6 text-grey-8">
                Grado máximo de estudios y su estatus
              </div>
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-xs">
                  <q-select
                    :readonly="
                      candidato.validado &&
                      !faltanteObservacion.includes('Formacion') &&
                      !solicitarRubro.includes('Formación académica')
                    "
                    v-model="datos_Generales.grado_Maximo_Estudios"
                    :options="grado_Maximo_Estudios"
                    label="Grado máximo de estudios"
                    lazy-rules
                    :rules="[
                      (val) =>
                        !!val || 'El grado máximo de estudios es requerido',
                    ]"
                  >
                    <template v-slot:prepend>
                      <p class="text-red">*</p>
                    </template>
                  </q-select>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    :readonly="
                      candidato.validado &&
                      !faltanteObservacion.includes('Formacion') &&
                      !solicitarRubro.includes('Formación académica')
                    "
                    v-if="
                      datos_Generales.grado_Maximo_Estudios != 'Sin estudios'
                    "
                    v-model="estatus_Id"
                    :options="estatus"
                    label="Estatus"
                    lazy-rules
                    :rules="[(val) => !!val || 'El estatus es requerido']"
                  >
                    <template v-slot:prepend>
                      <p class="text-red">*</p>
                    </template>
                  </q-select>
                </div>
              </div>
              <q-form @submit="addFormacionAcademica" class="col-12">
                <br />
                <div class="text-h6 text-grey-8">Formación académica</div>
                <q-input
                  v-if="
                    !candidato.validado ||
                    (candidato.validado &&
                      faltanteObservacion.includes('Formacion') &&
                      !observacion.aplicadas) ||
                    solicitarRubro.includes('Formación académica')
                  "
                  @keydown="limitarCaracteresFormacion"
                  :readonly="
                    candidato.validado &&
                    !faltanteObservacion.includes('Formacion') &&
                    !solicitarRubro.includes('Formación académica')
                  "
                  v-model="formacion"
                  label="Cursos, diplomados, seminarios, entre otros."
                  type="textarea"
                  hint="Ingrese máximo 250 caracteres"
                  autofocus
                  :rules="[
                    (formacion) =>
                      formacion != null
                        ? formacion.replace(/\s+/g, '').length < 251 ||
                          'Máximo 250 caracteres'
                        : 'Campo vacio',
                    (formacion) =>
                      formacion.replace(/\s+/g, '').length > 0 || 'Campo vacío',
                  ]"
                  lazy-rules
                >
                  <template v-slot:append>
                    <div class="text-overline">
                      {{
                        `${
                          formacion != null
                            ? formacion.replace(/\s+/g, "").length
                            : 0
                        }/250`
                      }}
                    </div>
                  </template>
                </q-input>
                <div
                  v-if="
                    !candidato.validado ||
                    (candidato.validado &&
                      faltanteObservacion.includes('Formacion') &&
                      !observacion.aplicadas) ||
                    solicitarRubro.includes('Formación académica')
                  "
                  class="col-12 justify-end q-pb-md"
                >
                  <div class="text-right q-gutter-xs">
                    <q-btn
                      :readonly="
                        candidato.validado &&
                        !faltanteObservacion.includes('Formacion') &&
                        !solicitarRubro.includes('Formación académica')
                      "
                      :icon="formacion_Academica.id == null ? 'add' : 'edit'"
                      :label="
                        formacion_Academica.id == null ? 'Agregar' : 'Editar'
                      "
                      type="submit"
                      color="teal"
                      class="q-ml-sm"
                    />
                  </div>
                </div>
                <q-table
                  v-if="
                    !candidato.validado ||
                    (candidato.validado &&
                      faltanteObservacion.includes('Formacion') &&
                      !observacion.aplicadas) ||
                    solicitarRubro.includes('Formación académica')
                  "
                  class="col-12"
                  :rows="list_Formacion_Academica"
                  :columns="columns"
                  row-key="name"
                  :visible-columns="visible_columns"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        <div v-if="col.name === 'id'">
                          <q-btn
                            :readonly="
                              candidato.validado &&
                              !faltanteObservacion.includes('Formacion') &&
                              !solicitarRubro.includes('Formación académica')
                            "
                            flat
                            round
                            color="pink"
                            icon="edit"
                            @click="editarFormacion(col.value)"
                          >
                            <q-tooltip>Editar registro</q-tooltip>
                          </q-btn>
                          <q-btn
                            :readonly="
                              candidato.validado &&
                              !faltanteObservacion.includes('Formacion') &&
                              !solicitarRubro.includes('Formación académica')
                            "
                            flat
                            round
                            color="pink"
                            icon="delete"
                            @click="eliminarFormacion(col.value)"
                          >
                            <q-tooltip>Eliminar registro</q-tooltip>
                          </q-btn>
                        </div>
                        <div v-else-if="col.name == 'nombre'">
                          <label>{{ col.value }}</label>
                          <q-tooltip
                            :offset="[10, 10]"
                            v-if="
                              col.value.length !=
                              props.row['nombre_Completo'].length
                            "
                          >
                            {{ props.row["nombre_Completo"] }}
                          </q-tooltip>
                        </div>
                        <label v-else>{{ col.value }}</label>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
                <div v-else class="col-12 q-pt-lg">
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
              </q-form>
              <div class="text-red q-pt-lg text-bold">
                *Campos obligatorios.
              </div>
            </q-tab-panel>
            <!---------------------------HISTORIA PROFESIONAL Y/O LABORAL--------------------------->
            <q-tab-panel name="Historia profesional y/o laboral">
              <q-banner
                style="border-radius: 10px"
                v-if="
                  list_Observaciones.length > 0 &&
                  faltanteObservacion.includes('Historia_Profesional') &&
                  observacion.validadas == true
                "
                class="bg-orange-5 text-white row"
              >
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                Supuestos:
                <div
                  v-for="item in list_Observaciones[0].historia_Profesional
                    .split('||')[0]
                    .split('|')"
                  :key="item"
                >
                  <div>- {{ item }}</div>
                </div>
              </q-banner>
              <div class="text-h6 text-grey-8">
                Historia profesional y/o laboral
              </div>
              <div class="col-12">
                <q-input
                  @keydown="limitarCaracteresHistoria"
                  :readonly="
                    candidato.validado &&
                    !faltanteObservacion.includes('Historia_Profesional') &&
                    !solicitarRubro.includes('Historia profesional y/o laboral')
                  "
                  v-model="historia"
                  label="Experiencia, años y actividades realizadas"
                  type="textarea"
                  hint="Mínimo 280 caracteres y máximo 5,000 caracteres"
                  autofocus
                  :rules="[
                    (historia) => !!historia || 'Es requerido',
                    (historia) =>
                      historia.replace(/\s+/g, '').length < 5001 ||
                      'Máximo 5,000 caracteres',
                    (historia) =>
                      historia.replace(/\s+/g, '').length > 279 ||
                      'Mínimo 280 caracteres',
                  ]"
                  lazy-rules
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
              <q-banner
                style="border-radius: 10px"
                v-if="
                  list_Observaciones.length > 0 &&
                  observacion.validadas == true &&
                  (faltanteObservacion.includes('Trayectoria') ||
                    faltanteObservacion.includes('Motivo_Cargo_Publico'))
                "
                class="bg-orange-5 text-white row"
              >
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                <div v-if="faltanteObservacion.includes('Trayectoria')">
                  Supuestos trayectoria:
                  <div
                    v-for="item in list_Observaciones[0].trayectoria
                      .split('||')[0]
                      .split('|')"
                    :key="item"
                  >
                    - {{ item }}
                  </div>
                </div>
                <div
                  v-if="faltanteObservacion.includes('Motivo_Cargo_Publico')"
                >
                  Supuestos motivo cargo público:
                  <div
                    v-for="item in list_Observaciones[0].motivo_Cargo_Publico
                      .split('||')[0]
                      .split('|')"
                    :key="item"
                  >
                    - {{ item }}
                  </div>
                </div>
              </q-banner>
              <div class="text-h6 text-grey-8">
                Trayectoria política y/o participación social
              </div>
              <div class="row">
                <q-input
                  @keydown="limitarCaracteresTrayectoria"
                  :readonly="
                    candidato.validado &&
                    !faltanteObservacion.includes('Trayectoria') &&
                    !solicitarRubro.includes(
                      'Trayectoria política y/o participación social'
                    )
                  "
                  class="col-12"
                  autofocus
                  v-model="trayectoria"
                  label="Trayectoria política y/o participación social en organizaciones ciudadanas o de la sociedad civil"
                  type="textarea"
                  hint="Trayectoria, años y actividades realizadas (Minimo 280 caracteres y máximo 5,000 caracteres)"
                  lazy-rules
                  :rules="[
                    (trayectoria) => !!trayectoria || 'Es requerido',
                    (trayectoria) =>
                      trayectoria.replace(/\s+/g, '').length < 5001 ||
                      'Máximo 5,000 caracteres',
                    (trayectoria) =>
                      trayectoria.trim().length > 0
                        ? trayectoria.replace(/\s+/g, '').length > 279 ||
                          'Mínimo 280 caracteres'
                        : true,
                  ]"
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
                <div
                  v-if="
                    candidato.validado == true &&
                    (ocuparCargo == null || ocuparCargo == '') &&
                    !faltanteObservacion.includes('Motivo_Cargo_Publico') &&
                    !solicitarRubro.includes(
                      'Trayectoria política y/o participación social'
                    )
                  "
                  class="text-bold text-subtitle1 q-pt-md"
                >
                  La candidatura no proporcionó información.
                </div>
                <q-input
                  v-else
                  @keydown="limitarCaracteresMotivaciones"
                  :readonly="
                    candidato.validado &&
                    !faltanteObservacion.includes('Motivo_Cargo_Publico') &&
                    !solicitarRubro.includes(
                      'Trayectoria política y/o participación social'
                    )
                  "
                  v-model="ocuparCargo"
                  class="col-12"
                  lazy-rules
                  label="Motivaciones de ocupar un cargo público"
                  type="textarea"
                  hint="Mínimo 280 caracteres y máximo 5,000 caracteres"
                  :rules="[
                    (ocuparCargo) =>
                      ocuparCargo.replace(/\s+/g, '').length < 5001 ||
                      'Máximo 5,000 caracteres',
                    (ocuparCargo) =>
                      ocuparCargo.trim().length > 0
                        ? ocuparCargo.replace(/\s+/g, '').length > 279 ||
                          'Mínimo 280 caracteres'
                        : true,
                  ]"
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
              <q-form @submit="addPropuesta">
                <q-banner
                  style="border-radius: 10px"
                  v-if="
                    list_Observaciones.length > 0 &&
                    (faltanteObservacion.includes('Propuesta_1') == true ||
                      faltanteObservacion.includes('Propuesta_2') == true ||
                      faltanteObservacion.includes('Genero') == true) &&
                    observacion.validadas == true
                  "
                  class="bg-orange-5 text-white row"
                >
                  <template v-slot:avatar>
                    <q-icon name="warning" color="white" />
                  </template>
                  <div
                    v-if="
                      faltanteObservacion.includes('Propuesta_1') == true &&
                      list_Observaciones[0].propuesta_1 != null
                    "
                  >
                    Supuestos propuesta 1:
                    <div
                      v-for="item in list_Observaciones[0].propuesta_1
                        .split('||')[0]
                        .split('|')"
                      :key="item"
                    >
                      - {{ item }}
                    </div>
                  </div>
                  <div
                    v-if="
                      faltanteObservacion.includes('Propuesta_2') == true &&
                      list_Observaciones[0].propuesta_2 != null
                    "
                  >
                    Supuestos propuesta 2:
                    <div
                      v-for="item in list_Observaciones[0].propuesta_2
                        .split('||')[0]
                        .split('|')"
                      :key="item"
                    >
                      - {{ item }}
                    </div>
                  </div>
                  <div
                    v-if="
                      faltanteObservacion.includes('Genero') == true &&
                      list_Observaciones[0].genero != null
                    "
                  >
                    Supuestos propuesta género:
                    <div
                      v-for="item in list_Observaciones[0].genero
                        .split('||')[0]
                        .split('|')"
                      :key="item"
                    >
                      - {{ item }}
                    </div>
                  </div>
                </q-banner>
                <div class="text-h6 text-grey-8">
                  ¿Cuáles son sus dos principales propuestas?
                </div>
                <div v-if="!candidato.validado" class="col-12">
                  <q-input
                    @keydown="limitarCaracteresPropuesta"
                    :disable="
                      list_Propuestas.length == 2 &&
                      pricipalesPropuestas == null
                    "
                    v-model="pricipalesPropuestas"
                    label="Describa la población objetivo, metas y plazos para su promoción como iniciativa de ley o política pública"
                    type="textarea"
                    hint="Mínimo 280 caracteres y máximo 1,600 caracteres"
                    autofocus
                    :rules="[
                      (pricipalesPropuestas) =>
                        pricipalesPropuestas != null
                          ? pricipalesPropuestas.replace(/\s+/g, '').length <
                              1601 || 'Máximo 1,600 caracteres'
                          : 'Campo vacio',
                      (pricipalesPropuestas) =>
                        pricipalesPropuestas != null
                          ? pricipalesPropuestas.replace(/\s+/g, '').length >
                              279 || 'Mínimo 280 caracteres'
                          : 'Campo vacio',
                    ]"
                    lazy-rules
                  >
                    <template v-slot:append>
                      <div class="text-overline">
                        {{
                          `${
                            pricipalesPropuestas != null
                              ? pricipalesPropuestas.replace(/\s+/g, "").length
                              : 0
                          }/1600`
                        }}
                      </div>
                    </template>
                  </q-input>
                </div>
                <div
                  v-if="
                    candidato.validado &&
                    (faltanteObservacion.includes('Propuesta_1') ||
                      faltanteObservacion.includes('Propuesta_2') ||
                      solicitarRubro.includes('Propuestas')) &&
                    !observacion.aplicadas
                  "
                  class="col-12"
                >
                  <q-input
                    :disable="pricipalesPropuestas == null"
                    @keydown="limitarCaracteresPropuesta"
                    v-model="pricipalesPropuestas"
                    label="Describa la población objetivo, metas y plazos para su promoción como iniciativa de ley o política pública"
                    type="textarea"
                    hint="Mínimo 280 caracteres y máximo 1,600 caracteres"
                    autofocus
                    :rules="[
                      (pricipalesPropuestas) =>
                        pricipalesPropuestas.replace(/\s+/g, '').length <
                          1601 || 'Máximo 1,600 caracteres',
                      (pricipalesPropuestas) =>
                        pricipalesPropuestas.replace(/\s+/g, '').length > 279 ||
                        'Mínimo 280 caracteres',
                    ]"
                    lazy-rules
                  >
                    <template v-slot:append>
                      <div class="text-overline">
                        {{
                          `${
                            pricipalesPropuestas != null
                              ? pricipalesPropuestas.replace(/\s+/g, "").length
                              : 0
                          }/1600`
                        }}
                      </div>
                    </template>
                  </q-input>
                </div>
                <div v-if="!candidato.validado" class="col-12 justify-end">
                  <div class="text-right q-gutter-xs">
                    <q-btn
                      v-if="!candidato.validado"
                      @submit="addPropuesta"
                      :disable="
                        (candidato.validado || list_Propuestas.length >= 2) &&
                        pricipalesPropuestas == null
                      "
                      :icon="propuesta.id == null ? 'add' : 'edit'"
                      :label="propuesta.id == null ? 'Agregar' : 'Editar'"
                      type="submit"
                      color="teal"
                      class="q-ml-sm"
                    />
                  </div>
                </div>
                <div
                  v-if="
                    candidato.validado &&
                    (faltanteObservacion.includes('Propuesta_1') == true ||
                      faltanteObservacion.includes('Propuesta_2') == true ||
                      solicitarRubro.includes('Propuestas')) &&
                    !observacion.aplicadas
                  "
                  class="col-12 justify-end"
                >
                  <div class="text-right q-gutter-xs">
                    <q-btn
                      @submit="addPropuesta"
                      :disable="
                        list_Propuestas.length >= 2 &&
                        pricipalesPropuestas == null
                      "
                      :icon="propuesta.id == null ? 'add' : 'edit'"
                      :label="propuesta.id == null ? 'Agregar' : 'Editar'"
                      type="submit"
                      color="teal"
                      class="q-ml-sm"
                    />
                  </div>
                </div>
                <div v-if="!candidato.validado" class="col-12 q-pt-md">
                  <q-table
                    class="col-12"
                    :rows="list_Propuestas"
                    :columns="columns"
                    row-key="name"
                    :visible-columns="visible_columns"
                  >
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          <div v-if="col.name === 'id'">
                            <q-btn
                              v-if="candidato.validado == false"
                              flat
                              round
                              color="pink"
                              icon="delete"
                              @click="eliminarPropuesta(col.value)"
                            >
                              <q-tooltip>Eliminar propuesta</q-tooltip>
                            </q-btn>
                            <q-btn
                              flat
                              round
                              color="pink"
                              icon="edit"
                              @click="editarPropuesta(col.value)"
                            >
                              <q-tooltip>Editar propuesta</q-tooltip>
                            </q-btn>
                          </div>
                          <div v-else-if="col.name == 'nombre'">
                            <label>{{ col.value }}</label>
                            <q-tooltip
                              :offset="[10, 10]"
                              v-if="
                                col.value.length !=
                                props.row['nombre_Completo'].length
                              "
                            >
                              {{ props.row["nombre_Completo"] }}
                            </q-tooltip>
                          </div>
                          <label v-else>{{ col.value }}</label>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
                <div
                  v-if="
                    candidato.validado &&
                    (faltanteObservacion.includes('Propuesta_1') ||
                      faltanteObservacion.includes('Propuesta_2') ||
                      solicitarRubro.includes('Propuestas')) &&
                    !observacion.aplicadas &&
                    (candidato.informacion_Actualizada == false ||
                      candidato.informacion_Actualizada == null)
                  "
                  class="col-12 q-pt-md"
                >
                  <q-table
                    class="col-12"
                    :rows="list_Propuestas"
                    :columns="columns"
                    row-key="name"
                    :visible-columns="visible_columns"
                  >
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          <div v-if="col.name === 'id'">
                            <q-btn
                              v-if="candidato.validado == false"
                              flat
                              round
                              color="pink"
                              icon="delete"
                              @click="eliminarPropuesta(col.value)"
                            >
                              <q-tooltip>Eliminar propuesta</q-tooltip>
                            </q-btn>
                            <q-btn
                              flat
                              round
                              color="pink"
                              icon="edit"
                              @click="editarPropuesta(col.value)"
                            >
                              <q-tooltip>Editar propuesta</q-tooltip>
                            </q-btn>
                          </div>
                          <div v-else-if="col.name == 'nombre'">
                            <label>{{ col.value }}</label>
                          </div>
                          <label v-else>{{ col.value }}</label>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
                <div v-if="candidato.validado" class="q-pt-lg">
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
              </q-form>

              <div class="col-12">
                <div class="text-h6 text-grey-8 q-pt-xl">
                  Propuesta en materia de género, o en su caso, del grupo en
                  situación de discriminación que representa
                </div>
                <div
                  v-if="
                    candidato.validado == true &&
                    (propuestaGenero == null || propuestaGenero == '') &&
                    !solicitarRubro.includes('Propuestas')
                  "
                  class="text-bold text-subtitle1 q-pt-md"
                >
                  La candidatura no proporcionó información.
                </div>
                <q-input
                  v-else-if="
                    candidato.validado &&
                    (faltanteObservacion.includes('Genero') ||
                      solicitarRubro.includes('Propuestas'))
                  "
                  @keydown="limitarCaracteresPropuestaGenero"
                  v-model="propuestaGenero"
                  label="Describa la población objetivo, metas y plazos para su promoción como iniciativa de ley o política pública"
                  type="textarea"
                  hint="Mínimo 280 caracteres y máximo 1,600 caracteres"
                  autofocus
                  :rules="[
                    (propuestaGenero) =>
                      propuestaGenero.replace(/\s+/g, '').length < 1601 ||
                      'Máximo 1,600 caracteres',
                    (propuestaGenero) =>
                      propuestaGenero.replace(/\s+/g, '').length > 279 ||
                      'Mínimo 280 caracteres',
                  ]"
                  lazy-rules
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
                <q-input
                  v-else
                  @keydown="limitarCaracteresPropuestaGenero"
                  :readonly="candidato.validado"
                  v-model="propuestaGenero"
                  label="Describa la población objetivo, metas y plazos para su promoción como iniciativa de ley o política pública"
                  type="textarea"
                  hint="Mínimo 280 caracteres y máximo 1,600 caracteres"
                  autofocus
                  :rules="[
                    (propuestaGenero) =>
                      propuestaGenero != null
                        ? propuestaGenero.replace(/\s+/g, '').length < 1601 ||
                          'Máximo 1,600 caracteres'
                        : 'Campo vacío',
                    (propuestaGenero) =>
                      propuestaGenero.replace(/\s+/g, '').length > 279 ||
                      'Mínimo 280 caracteres',
                  ]"
                  lazy-rules
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
          <div class="col-12 justify-end q-pa-md">
            <div class="text-right q-gutter-xs">
              <q-btn
                v-if="!candidato.validado"
                type="submit"
                icon-right="save"
                color="secondary"
                label="Guardar"
              />
              <q-btn
                v-if="
                  candidato.validado &&
                  observacion.validadas == true &&
                  observacion.aplicadas == false &&
                  faltanteObservacion.length > 0 &&
                  !candidato.informacion_Actualizada
                "
                @click="guardarCorreccion"
                icon-right="save"
                color="secondary"
                label="Guardar correción"
              />
              <q-btn
                v-if="
                  candidato.validado &&
                  list_Observaciones.length == 0 &&
                  !candidato.informacion_Actualizada &&
                  (candidato.informacion_Pausada == null ||
                    candidato.informacion_Pausada == '')
                "
                @click="solicitarCorreccion"
                icon-right="save"
                color="secondary"
                label="Solicitar correción"
              />
            </div>
          </div>
        </q-form>
      </q-card>
    </div>
    <ModalFotografia />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { EncryptStorage } from "storage-encryption";
import { useQuasar, QSpinnerCube } from "quasar";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { useValidarStore } from "src/stores/validar-store";
import { onBeforeMount, ref, watch } from "vue";
import { useObservacionStore } from "src/stores/observacion-store";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import ModalFotografia from "../components/ModalFotografia.vue";
import banner from "../../../components/BannerComp.vue";

//-----------------------------------------------------------------

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const $q = useQuasar();
const router = useRouter();
const candidatosStore = useCandidatosStore();
const validarStore = useValidarStore();
const observacionStores = useObservacionStore();
const configuracionStore = useConfiguracionStore();
const {
  candidato,
  datos_Generales,
  list_Formacion_Academica,
  formacion_Academica,
  propuesta,
  list_Propuestas,
  list_Observaciones,
  actualizar,
} = storeToRefs(candidatosStore);
const { observacion, correcion, solicitudCorreccion } =
  storeToRefs(observacionStores);
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
const faltanteObservacion = ref("");
const open_tab = ref(false);
const estatus_Id = ref(null);
const solicitarRubro = ref([]);
const partido = encryptStorage.decrypt("partido_id");
const is_Candidato = encryptStorage.decrypt("candidato_id");
const propuesta1 = ref(null);
const propuesta2 = ref(null);
const propuesta3 = ref(null);

//-----------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------------

const limitarCaracteresFormacion = (event) => {
  if (formacion.value != null) {
    let maxLength = 250;
    let valueWithoutSpaces = formacion.value.replace(/\s/g, "");
    if (valueWithoutSpaces.length >= maxLength && event.key.length === 1) {
      event.preventDefault();
    }
  }
};

const limitarCaracteresHistoria = (event) => {
  if (historia.value != null) {
    let maxLength = 5000;
    let valueWithoutSpaces = historia.value.replace(/\s/g, "");
    if (valueWithoutSpaces.length >= maxLength && event.key.length === 1) {
      event.preventDefault();
    }
  }
};

const limitarCaracteresTrayectoria = (event) => {
  if (trayectoria.value != null) {
    let maxLength = 5000;
    let valueWithoutSpaces = trayectoria.value.replace(/\s/g, "");
    if (valueWithoutSpaces.length >= maxLength && event.key.length === 1) {
      event.preventDefault();
    }
  }
};

const limitarCaracteresMotivaciones = (event) => {
  if (ocuparCargo.value != null) {
    let maxLength = 5000;
    let valueWithoutSpaces = ocuparCargo.value.replace(/\s/g, "");
    if (valueWithoutSpaces.length >= maxLength && event.key.length === 1) {
      event.preventDefault();
    }
  }
};

const limitarCaracteresPropuesta = (event) => {
  if (pricipalesPropuestas.value != null) {
    let maxLength = 1600;
    let valueWithoutSpaces = pricipalesPropuestas.value.replace(/\s/g, "");
    if (valueWithoutSpaces.length >= maxLength && event.key.length === 1) {
      event.preventDefault();
    }
  }
};

const limitarCaracteresPropuestaGenero = (event) => {
  if (propuestaGenero.value != null) {
    let maxLength = 1600;
    let valueWithoutSpaces = propuestaGenero.value.replace(/\s/g, "");
    if (valueWithoutSpaces.length >= maxLength && event.key.length === 1) {
      event.preventDefault();
    }
  }
};

const mostrarAlerta = () => {
  $q.dialog({
    title: "Atención",
    message: `Por cada rubro que seleccione deberá capturar la información que desee cambiar, antes de dar click en <b>'Solicitar correción'</b>. Solo tendrá una oportunidad para corregir.`,
    html: true,
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
  if (solicitarRubro.value.includes("Propuestas")) {
    if (
      list_Propuestas.value.length > 0 &&
      list_Propuestas.value[0].propuesta != null
    ) {
      propuesta1.value = list_Propuestas.value[0].propuesta;
    }
    if (
      list_Propuestas.value.length > 1 &&
      list_Propuestas.value[1].propuesta != null
    ) {
      propuesta2.value = list_Propuestas.value[1].propuesta;
    }
    propuesta3.value = datos_Generales.value.propuesta_Genero;
  }
};

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

const columns = [
  {
    name: "numero",
    align: "center",
    label: "",
    field: "numero",
    sortable: true,
  },
  {
    name: "nombre_Completo",
    align: "center",
    label: "",
    field: "nombre_Completo",
    sortable: true,
  },
  {
    name: "nombre",
    align: "center",
    label: "",
    field: "nombre",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: true,
  },
];

const visible_columns = ["numero", "nombre", "id"];

const evaluaBadge = (titulo) => {
  if (faltante.value != null) {
    let result = null;
    result = faltante.value.includes(titulo.toUpperCase()) ? "red" : "green";
    if (faltanteObservacion.value != null) {
      result = faltanteObservacion.value.includes(
        titulo == "Datos generales"
          ? "Identidad"
          : titulo == "Formación académica"
          ? "Formacion"
          : titulo == "Trayectoria política y/o participación social"
          ? "Trayectoria" || "Motivo_Cargo_Publico"
          : titulo == "Propuestas"
          ? "Propuesta_1" || "Propuesta_2" || "Genero"
          : "Historia_Profesional"
      )
        ? "white"
        : (result = faltante.value.includes(titulo.toUpperCase())
            ? "red"
            : "green");
    }
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
    if (list_Observaciones.value.length > 0) {
      await observacionStores.loadObservacionId(list_Observaciones.value[0].id);
    }
    historia.value = datos_Generales.value.historia_Laboral;
    trayectoria.value = datos_Generales.value.trayectoria;
    ocuparCargo.value = datos_Generales.value.motivo_Cargo_Publico;
    propuestaGenero.value = datos_Generales.value.propuesta_Genero;

    cargarFaltante(candidato.value.faltante_Curricular);

    if (list_Observaciones.value.length > 0) {
      faltanteObservaciones(list_Observaciones.value);
    }

    if (datos_Generales.value.motivo_Cargo_Publico == null) {
      ocuparCargo.value = "";
    }
    if (datos_Generales.value.trayectoria == null) {
      trayectoria.value = "";
    }
  }
  $q.loading.hide();
};

const irIdentidad = async () => {
  await candidatosStore.loadCandidatoById(
    candidato.value.puesto,
    candidato.value.id
  );
  await configuracionStore.loadRespuestasByCandidato(
    candidato.value.id,
    candidato.value.puesto
  );
  router.push({
    name: "cuestionario_Identidad",
  });
};

const instrucciones = (valor) => {
  candidatosStore.actualizarModalInstrucciones(valor);
};

const cargarFaltante = (faltante_Curricular) => {
  faltante.value = faltante_Curricular.split("|");
};

const faltanteObservaciones = (list_Observaciones) => {
  if (
    list_Observaciones[0].validadas == true &&
    list_Observaciones[0].informacion_Pausada != null
  ) {
    let faltante = list_Observaciones[0].informacion_Pausada.split("|");
    if (faltante[0] != "" || faltante[0] != null) {
      faltanteObservacion.value = faltante;
    }
  }
};

const editarFormacion = async (id) => {
  $q.loading.show();
  await candidatosStore.loadFormacionById(id, candidato.value.puesto);
  $q.loading.hide();
};

const eliminarFormacion = async (id) => {
  $q.dialog({
    title: "Eliminar formación academica",
    message: "¿Está seguro de eliminar la formación academica?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, eliminar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await candidatosStore.deleteFormacionAcademica(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      candidatosStore.initFormacion();
      await candidatosStore.loadFormacionAcademica(
        candidato.value.id,
        candidato.value.puesto
      );
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  });
};

const addFormacionAcademica = async () => {
  let resp = null;
  $q.loading.show();
  formacion_Academica.value.formacion = formacion.value;
  formacion_Academica.value.puesto_Candidato = candidato.value.puesto;

  if (formacion_Academica.value.id != null) {
    resp = await candidatosStore.updateFormacionAcademica(
      formacion_Academica.value
    );
  } else {
    resp = await candidatosStore.createFormacionAcademica(
      candidato.value.id,
      formacion_Academica.value
    );
  }
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    await candidatosStore.loadFormacionAcademica(
      candidato.value.id,
      candidato.value.puesto
    );
    //cargarData();
    formacion.value = "";
    candidatosStore.initFormacion();
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
    });
  }
  $q.loading.hide();
};

const addPropuesta = async () => {
  let resp = null;
  $q.loading.show();
  if (list_Propuestas.value.length == 2 && propuesta.value.id == null) {
    $q.dialog({
      title: "Atención",
      message: "Solo puedes agregar 2 propuestas",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else {
    propuesta.value.propuesta = pricipalesPropuestas.value;
    propuesta.value.puesto_Candidato = candidato.value.puesto;
    if (propuesta.value.id != null) {
      resp = await candidatosStore.updatePropuesta(propuesta.value);
    } else {
      resp = await candidatosStore.createPropuesta(
        candidato.value.id,
        propuesta.value
      );
    }
    if (resp.success) {
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      //cargarData();
      await candidatosStore.loadPropuestas(
        candidato.value.id,
        candidato.value.puesto
      );
      pricipalesPropuestas.value = "";
      candidatosStore.initPropuesta();
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

const editarPropuesta = async (id) => {
  $q.loading.show();
  await candidatosStore.loadPropuestaById(id);
  $q.loading.hide();
};

const eliminarPropuesta = async (id) => {
  $q.dialog({
    title: "Eliminar propuesta",
    message:
      "¿Está seguro de eliminar la propuesta? Si elimina, deberá agregar otra para completar el rubro",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, eliminar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await candidatosStore.deletePropuesta(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      candidatosStore.initPropuesta();
      cargarData();
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  });
};

const validarCandidato = async (valor) => {
  validarStore.actualizarModalFaltante(valor);
};

const subirFotografia = async (valor) => {
  candidatosStore.actualizarFotografia(valor);
};

const guardarCorreccion = async () => {
  let resp = null;
  let respGenerales = null;
  if (
    faltanteObservacion.value.includes("Historia_Profesional") &&
    historia.value == datos_Generales.value.historia_Laboral
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "No se detectó algun cambio en el rubro 'Historia profesional y/o laboral', deberá realizar la modificación para poder realizar la corrección.",
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
    faltanteObservacion.value.includes("Trayectoria") &&
    trayectoria.value == datos_Generales.value.trayectoria
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "No se detectó algun cambio en el rubro 'Trayectoria política y/o participación social', deberá realizar la modificación para poder realizar la corrección.",
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
    faltanteObservacion.value.includes("Propuesta_1") &&
    list_Propuestas.value[0].propuesta ==
      list_Observaciones.value[0].propuesta_1.split("||")[1]
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "No se detectó algun cambio en la 'Propuesta 1', deberá realizar la modificación para poder realizar la corrección.",
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
    faltanteObservacion.value.includes("Propuesta_2") &&
    list_Propuestas.value[1].propuesta ==
      list_Observaciones.value[0].propuesta_2.split("||")[1]
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "No se detectó algun cambio en la 'Propuesta 2', deberá realizar la modificación para poder realizar la corrección.",
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
    faltanteObservacion.value.includes("Genero") &&
    propuestaGenero.value != null &&
    propuestaGenero.value == datos_Generales.value.propuesta_Genero
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "No se detectó algun cambio en la 'Propuesta en materia de género, o en su caso, del grupo en situación de discriminación que representa', deberá realizar la modificación para poder realizar la corrección.",
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
    historia.value != null &&
    historia.value.replace(/\s+/g, "").length < 279
  ) {
    $q.dialog({
      title: "Atención",
      message: "Completar el campo Historia profesional y/o laboral.",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: "Cerrar",
    });
  } else if (
    trayectoria.value != "" &&
    trayectoria.value.replace(/\s+/g, "").length < 279
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "Completar el campo Trayectoria política y/o participación social en organizaciones ciudadanas o de la sociedad civil.",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: "Cerrar",
    });
  } else if (
    propuestaGenero.value != null &&
    propuestaGenero.value.replace(/\s+/g, "").length < 279
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "Completar el campo Propuesta en materia de género, o en su caso, del grupo en situación de discriminación que representa.",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: "Cerrar",
    });
  } else if (
    ocuparCargo.value != "" &&
    ocuparCargo.value.replace(/\s+/g, "").length < 279
  ) {
    $q.dialog({
      title: "Atención",
      message: "Completar el campo  ¿Por qué quiere ocupar un cargo público?.",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: "Cerrar",
    });
  } else {
    $q.dialog({
      title: "¿Está seguro de mandar las correciones realizadas?",
      message: "Recuerda que solo tiene una oportunidad de corregir.",
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
      correcion.value.candidato_Id = candidato.value.id;
      correcion.value.puesto = candidato.value.puesto;
      if (faltanteObservacion.value.includes("Identidad")) {
        correcion.value.identidad = "Se actualizó rubro identidad";
      } else {
        correcion.value.identidad = null;
      }

      if (faltanteObservacion.value.includes("Formacion")) {
        correcion.value.formacion = "Se actualizó rubro formación académica";
      } else {
        correcion.value.formacion = null;
      }

      if (faltanteObservacion.value.includes("Motivo_Cargo_Publico")) {
        correcion.value.motivo_Cargo_Publico = ocuparCargo.value;
      } else {
        correcion.value.motivo_Cargo_Publico = null;
      }

      if (faltanteObservacion.value.includes("Historia_Profesional")) {
        correcion.value.historia_Profesional = historia.value;
      } else {
        correcion.value.historia_Profesional = null;
      }

      if (faltanteObservacion.value.includes("Trayectoria")) {
        correcion.value.trayectoria = trayectoria.value;
      } else {
        correcion.value.trayectoria = null;
      }

      if (faltanteObservacion.value.includes("Propuesta_1")) {
        correcion.value.propuesta_1 = list_Propuestas.value[0].propuesta;
      } else {
        correcion.value.propuesta_1 = null;
      }

      if (faltanteObservacion.value.includes("Propuesta_2")) {
        correcion.value.propuesta_2 = list_Propuestas.value[1].propuesta;
      } else {
        correcion.value.propuesta_2 = null;
      }

      if (faltanteObservacion.value.includes("Genero")) {
        correcion.value.genero = propuestaGenero.value;
      } else {
        correcion.value.genero = null;
      }

      if (datos_Generales.value.grado_Maximo_Estudios == "Sin estudios") {
        datos_Generales.value.estatus_Grado_Estudios = "";
      } else {
        datos_Generales.value.estatus_Grado_Estudios = estatus_Id.value;
      }

      datos_Generales.value.puesto_Candidato = candidato.value.puesto;
      datos_Generales.value.propuesta_Genero = propuestaGenero.value;
      datos_Generales.value.trayectoria =
        trayectoria.value == "" ? null : trayectoria.value;
      datos_Generales.value.motivo_Cargo_Publico =
        ocuparCargo.value == "" ? null : ocuparCargo.value;
      datos_Generales.value.historia_Laboral = historia.value;
      resp = await observacionStores.enviarCorreciones(
        observacion.value.id,
        correcion.value
      );

      if (resp.success) {
        respGenerales = await candidatosStore.updateDatosGenerales(
          datos_Generales.value
        );
        $q.notify({
          position: "top-right",
          type: "positive",
          message: resp.data,
        });
        $q.loading.hide();
        cargarData();
      } else {
        $q.notify({
          position: "top-right",
          type: "negative",
          message: resp.data,
        });
        $q.loading.hide();
      }
    });
  }
};

const solicitarCorreccion = async () => {
  let resp = null;
  let respGenerales = null;
  if (
    solicitarRubro.value.includes("Formación académica") &&
    list_Formacion_Academica.value.length == 0
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "No se detectó algun cambio en el rubro 'Formación académica', deberá realizar la modificación para poder solicitar la corrección.",
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
    solicitarRubro.value.includes("Historia profesional y/o laboral") &&
    historia.value == datos_Generales.value.historia_Laboral
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "No se detectó algun cambio en el rubro 'Historia profesional y/o laboral', deberá realizar la modificación para poder solicitar la corrección.",
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
    solicitarRubro.value.includes(
      "Trayectoria política y/o participación social"
    ) &&
    trayectoria.value == datos_Generales.value.trayectoria
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "No se detectó algun cambio en el rubro 'Trayectoria política y/o participación social', deberá realizar la modificación para poder solicitar la corrección.",
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
    solicitarRubro.value.includes("Propuestas") &&
    propuesta1.value != null &&
    propuesta1.value == list_Propuestas.value[0].propuesta
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "No se detectó algun cambio en la 'Propuesta 1', deberá realizar la modificación para poder solicitar la corrección.",
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
    solicitarRubro.value.includes("Propuestas") &&
    propuesta2.value != null &&
    propuesta2.value == list_Propuestas.value[1].propuesta
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "No se detectó algun cambio en la 'Propuesta 2', deberá realizar la modificación para poder solicitar la corrección.",
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
    solicitarRubro.value.includes("Propuestas") &&
    propuestaGenero.value != null &&
    propuestaGenero.value == datos_Generales.value.propuesta_Genero
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "No se detectó algun cambio en la 'Propuesta en materia de género, o en su caso, del grupo en situación de discriminación que representa', deberá realizar la modificación para poder solicitar la corrección.",
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
    if (solicitarRubro.value.length == 0) {
      $q.dialog({
        title: "Atención",
        message: "No seleccionó algún rubro para correccion",
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
      });
    } else {
      $q.dialog({
        title: "¿Está seguro de mandar las correciones realizadas?",
        message: "La instancia interna deberá aprobar su corrección",
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
        solicitudCorreccion.value.candidato_Id = candidato.value.id;
        solicitudCorreccion.value.puesto = candidato.value.puesto;
        solicitudCorreccion.value.partido_Id = candidato.value.partido_Id;
        if (solicitarRubro.value.includes("Datos generales"))
          solicitudCorreccion.value.identidad = true;
        if (solicitarRubro.value.includes("Formación académica"))
          solicitudCorreccion.value.formacion = true;
        if (solicitarRubro.value.includes("Historia profesional y/o laboral"))
          solicitudCorreccion.value.historia_Profesional = true;
        if (
          solicitarRubro.value.includes(
            "Trayectoria política y/o participación social"
          )
        ) {
          solicitudCorreccion.value.trayectoria = true;
          solicitudCorreccion.value.motivo_Cargo_Publico = true;
        }
        if (solicitarRubro.value.includes("Propuestas")) {
          solicitudCorreccion.value.propuesta_1 = true;
          solicitudCorreccion.value.propuesta_2 = true;
          solicitudCorreccion.value.genero = true;
        }

        datos_Generales.value.puesto_Candidato = candidato.value.puesto;
        datos_Generales.value.propuesta_Genero = propuestaGenero.value;
        datos_Generales.value.trayectoria =
          trayectoria.value == "" ? null : trayectoria.value;
        datos_Generales.value.motivo_Cargo_Publico =
          ocuparCargo.value == "" ? null : ocuparCargo.value;
        datos_Generales.value.historia_Laboral = historia.value;

        resp = await observacionStores.crearCorreccion(
          solicitudCorreccion.value
        );

        if (resp.success) {
          respGenerales = await candidatosStore.updateDatosGenerales(
            datos_Generales.value
          );
          $q.notify({
            position: "top-right",
            type: "positive",
            message: resp.data,
          });
          cargarData();
        } else {
          $q.notify({
            position: "top-right",
            type: "negative",
            message: resp.data,
          });
        }
      });

      $q.loading.hide();
    }
  }
};

const onSubmit = async () => {
  let resp = null;
  if (
    historia.value != null &&
    historia.value.replace(/\s+/g, "").length < 279
  ) {
    $q.dialog({
      title: "Atención",
      message: "Completar el campo Historia profesional y/o laboral.",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: "Cerrar",
    });
  } else if (
    trayectoria.value != "" &&
    trayectoria.value.replace(/\s+/g, "").length < 279
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "Completar el campo Trayectoria política y/o participación social en organizaciones ciudadanas o de la sociedad civil.",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: "Cerrar",
    });
  } else if (
    propuestaGenero.value != null &&
    propuestaGenero.value.replace(/\s+/g, "").length < 279
  ) {
    $q.dialog({
      title: "Atención",
      message:
        "Completar el campo Propuesta en materia de género, o en su caso, del grupo en situación de discriminación que representa.",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: "Cerrar",
    });
  } else if (
    ocuparCargo.value != "" &&
    ocuparCargo.value.replace(/\s+/g, "").length < 279
  ) {
    $q.dialog({
      title: "Atención",
      message: "Completar el campo  ¿Por qué quiere ocupar un cargo público?.",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: "Cerrar",
    });
  } else {
    if (
      tab.value == "Datos generales" &&
      (datos_Generales.value.facebook == null ||
        datos_Generales.value.facebook.trim() == "") &&
      (datos_Generales.value.twitter == null ||
        datos_Generales.value.twitter.trim() == "") &&
      (datos_Generales.value.youtube == null ||
        datos_Generales.value.youtube.trim() == "") &&
      (datos_Generales.value.instagram == null ||
        datos_Generales.value.instagram.trim() == "") &&
      (datos_Generales.value.tik_Tok == null ||
        datos_Generales.value.tik_Tok.trim() == "") &&
      (datos_Generales.value.pagina_Web == null ||
        datos_Generales.value.pagina_Web.trim() == "") &&
      (datos_Generales.value.email == null ||
        datos_Generales.value.email.trim() == "") &&
      (datos_Generales.value.telefono == null ||
        datos_Generales.value.telefono.trim() == "") &&
      (datos_Generales.value.domicilio == null ||
        datos_Generales.value.domicilio.trim() == "")
    ) {
      $q.dialog({
        title: "Atención",
        message:
          "Se debará capturar indistintivamente alguno o algunos de los medios de contacto públicos.",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
        ok: "Cerrar",
      });
    } else if (
      tab.value == "Formación académica" &&
      datos_Generales.value.grado_Maximo_Estudios == null
    ) {
      $q.dialog({
        title: "Campos vacios",
        message: "Ingrese información faltante",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    } else if (
      tab.value == "Trayectoria política y/o participación social" &&
      trayectoria.value == ""
    ) {
      $q.dialog({
        title: "Campos vacios",
        message: "Ingrese trayectoria política y/o participación social",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    } else {
      if (datos_Generales.value.grado_Maximo_Estudios == "Sin estudios") {
        datos_Generales.value.estatus_Grado_Estudios = "";
      } else {
        datos_Generales.value.estatus_Grado_Estudios = estatus_Id.value;
      }
      if (
        datos_Generales.value.facebook != null &&
        datos_Generales.value.facebook.trim() == ""
      ) {
        datos_Generales.value.facebook = null;
      }

      if (
        datos_Generales.value.twitter != null &&
        datos_Generales.value.twitter.trim() == ""
      ) {
        datos_Generales.value.twitter = null;
      }

      if (
        datos_Generales.value.youtube != null &&
        datos_Generales.value.youtube.trim() == ""
      ) {
        datos_Generales.value.youtube = null;
      }

      if (
        datos_Generales.value.instagram != null &&
        datos_Generales.value.instagram.trim() == ""
      ) {
        datos_Generales.value.instagram = null;
      }

      if (
        datos_Generales.value.tik_Tok != null &&
        datos_Generales.value.tik_Tok.trim() == ""
      ) {
        datos_Generales.value.tik_Tok = null;
      }

      if (
        datos_Generales.value.pagina_Web != null &&
        datos_Generales.value.pagina_Web.trim() == ""
      ) {
        datos_Generales.value.pagina_Web = null;
      }

      if (
        datos_Generales.value.email != null &&
        datos_Generales.value.email.trim() == ""
      ) {
        datos_Generales.value.email = null;
      }

      if (
        datos_Generales.value.telefono != null &&
        datos_Generales.value.telefono.trim() == ""
      ) {
        datos_Generales.value.telefono = null;
      }

      if (
        datos_Generales.value.domicilio != null &&
        datos_Generales.value.domicilio.trim() == ""
      ) {
        datos_Generales.value.domicilio = null;
      }
      datos_Generales.value.puesto_Candidato = candidato.value.puesto;
      datos_Generales.value.propuesta_Genero = propuestaGenero.value;
      datos_Generales.value.trayectoria =
        trayectoria.value == "" ? null : trayectoria.value;
      datos_Generales.value.motivo_Cargo_Publico =
        ocuparCargo.value == "" ? null : ocuparCargo.value;
      datos_Generales.value.historia_Laboral = historia.value;
      $q.loading.show();
      if (datos_Generales.value.id != null) {
        resp = await candidatosStore.updateDatosGenerales(
          datos_Generales.value
        );
      } else {
        resp = await candidatosStore.createDatosGenerales(
          candidato.value.id,
          datos_Generales.value
        );
      }
      if (resp.success) {
        $q.notify({
          position: "top-right",
          type: "positive",
          message: resp.data,
        });
        cargarData();
        $q.loading.hide();
      } else {
        $q.notify({
          position: "top-right",
          type: "negative",
          message: resp.data,
        });
        $q.loading.hide();
      }
    }
  }
};
</script>
