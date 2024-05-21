<template>
  <!---------------------------BANNER--------------------------->
  <banner>
    <template v-slot:icono>
      <q-icon name="info" color="grey" />
    </template>
    <template v-slot:contenido
      >Módulo de verificación y validación.
      <q-icon name="warning" size="xs" color="orange" /> es para requerir
      observaciones en caso de caer en algun supuesto.
      <q-icon name="save" size="xs" color="secondary" /> es para guardar en
      cualquier momento las variables de evaluación de cada rubro.
      <q-icon name="done" size="xs" color="pink" /> es para validar la
      candidatura despues de completar la evaluación.
    </template>
  </banner>
  <br />
  <div class="row">
    <div class="col-6 text-h5 q-pl-sm text-bold text-grey-8 text-left">
      Puntuación: {{ total_Puntos }}
    </div>
    <div class="col-4 text-h5 q-pl-sm text-bold text-grey-8 text-right">
      Porcentaje: {{ ((total_Puntos / 49) * 100).toFixed(3) }}
    </div>
  </div>
  <q-card class="no-shadow q-pa-xs q-ml-xs" bordered>
    <q-item>
      <q-item-section avatar>
        <q-avatar size="130px" v-if="candidato.url_Foto != null" rounded>
          <img :src="candidato.url_Foto" />
        </q-avatar>
        <q-avatar rounded size="130px" v-else>
          <q-img
            v-if="candidato.sexo == 'Mujer'"
            src="../../../assets/avatarmujer.jpg"
          />
          <q-img
            v-if="candidato.sexo == 'Hombre'"
            src="porcentaje../../../assets/avatarHombre.jpg"
          />
          <q-img
            v-if="candidato.sexo == 'No binario'"
            src="../../../assets/noBinario.png"
          />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle1">{{
          candidato.nombre_Completo
        }}</q-item-label>
        <q-item-label class="text-subtitle2">
          {{ candidato.partido }}
        </q-item-label>
        <q-item-label class="text-subtitle2">
          Elección: {{ candidato.tipo_Eleccion }} -
          {{ candidato.tipo_Candidato }}
        </q-item-label>
        <q-item-label class="text-subtitle2">
          Género: {{ candidato.sexo }}
        </q-item-label>
        <q-item-label class="text-subtitle2">
          Edad: {{ candidato.edad }}
        </q-item-label>
        <q-item-label class="text-subtitle2">
          Cargo: {{ candidato.cargo }}
        </q-item-label>
        <q-item-label class="text-subtitle2">
          Número de fórmula: {{ candidato.no_Formula }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-avatar class="q-pt-xs" square size="60px">
            <img :src="candidato.url_Logo_Partido" alt="" />
          </q-avatar>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
  <div class="row">
    <div class="col-lg-7 col-md-7 col-sm-6 col-xs-12 q-pa-xs">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          active-color="pink"
          indicator-color="pink"
          align="justify"
          narrow-indicator
          inline-label
          class="text-pink"
        >
          <q-tab
            v-for="rubro in list_Rubros_Evaluacion"
            :key="rubro"
            :name="rubro.rubro"
            :label="rubro.rubro"
            rounded
            :class="
              `${evaluaBadge(rubro.rubro)}` == 'white'
                ? 'text-orange'
                : 'text-grey'
            "
            :icon="`${evaluaBadge(rubro.rubro)}` == 'white' ? 'warning' : ''"
          />
          <q-tab
            name="¿Por qué quiere ocupar un cargo público?"
            label="¿Por qué quiere ocupar un cargo público?"
            rounded
            :class="
              `${evaluaBadge('¿Por qué quiere ocupar un cargo público?')}` ==
              'white'
                ? 'text-orange'
                : 'text-grey'
            "
            :icon="
              `${evaluaBadge('¿Por qué quiere ocupar un cargo público?')}` ==
              'white'
                ? 'warning'
                : 'none'
            "
          />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Identidad">
            <q-form class="q-col-gutter-xs">
              <q-banner
                style="border-radius: 10px"
                v-if="
                  observacion.faltantes != null &&
                  observacion.faltantes != '' &&
                  observacion.faltantes.includes('Identidad')
                "
                class="bg-orange-5 text-white row"
              >
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                Supuestos:
                <div>
                  <div>- {{ observacion.identidad.split("||")[0] }}</div>
                </div>
              </q-banner>
              <div align="center">
                <q-avatar
                  v-if="candidato.url_Foto != null"
                  rounded
                  class="shadow-10"
                  size="190px"
                >
                  <q-img :src="candidato.url_Foto" />
                  <div
                    class="bg-grey text-white absolute-bottom text-subtitle1 text-center"
                  >
                    <q-btn flat @click="verFoto(true)" label="Ver fotografía" />
                  </div>
                </q-avatar>
                <q-avatar rounded size="190px" v-else>
                  <q-img
                    v-if="candidato.sexo == 'Mujer'"
                    src="../../../assets/avatarmujer.jpg"
                  >
                    <div class="absolute-bottom text-subtitle1 text-center">
                      <q-btn
                        flat
                        @click="verFoto(true)"
                        label="Ver fotografía"
                      />
                    </div>
                  </q-img>
                  <q-img
                    v-if="candidato.sexo == 'Hombre'"
                    src="../../../assets/avatarHombre.jpg"
                  >
                    <div class="absolute-bottom text-subtitle1 text-center">
                      <q-btn
                        flat
                        @click="verFoto(true)"
                        label="Ver fotografía"
                      />
                    </div>
                  </q-img>
                  <q-img
                    v-if="candidato.sexo == 'No binario'"
                    src="../../../assets/noBinario.png"
                  >
                    <div class="absolute-bottom text-subtitle1 text-center">
                      <q-btn
                        flat
                        @click="verFoto(true)"
                        label="Ver fotografía"
                      />
                    </div>
                  </q-img>
                </q-avatar>
              </div>
              <br />
              <div class="q-pa-md">
                <div class="text-bold text-subtitle1">Supuestos</div>
                <q-list>
                  <q-item
                    tag="label"
                    v-ripple
                    v-for="supuesto in list_Supuestos"
                    :key="supuesto"
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        color="pink"
                        v-model="supuestoIdentidad"
                        :val="supuesto"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ supuesto }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div
                  v-if="
                    observacion.id != null &&
                    observacion.identidad != null &&
                    observacion.publicadas == true
                  "
                  class="text-right"
                >
                  <q-btn
                    @click="subsanarObservacion('Identidad')"
                    label="Subsanar"
                    color="secondary"
                    icon-right="task_alt"
                  ></q-btn>
                </div>
              </div>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="Formación académica">
            <q-form class="row q-col-gutter-xs">
              <q-banner
                style="border-radius: 10px"
                v-if="
                  observacion.faltantes != null &&
                  observacion.faltantes != '' &&
                  observacion.faltantes.includes('Formacion')
                "
                class="bg-orange-5 text-white row"
              >
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                Supuestos:
                <div>
                  <div>- {{ observacion.formacion.split("||")[0] }}</div>
                </div>
              </q-banner>
              <div class="col-12">
                <div class="text-h6 text-grey-8">
                  Grado máximo de estudios y su estatus
                </div>
                <br />
                <q-input
                  v-model="datos_Generales.grado_Maximo_Estudios"
                  class="q-pb-xs"
                  label="Grado máximo de estudios"
                  stack-label
                  readonly
                />
                <q-input
                  v-model="datos_Generales.estatus_Grado_Estudios"
                  label="Estatus"
                  stack-label
                  readonly
                />
                <br />
                <div class="text-h6 text-grey-8">Formación académica</div>
                <q-table
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
                        <label>{{ col.value }}</label>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
                <br />
                <div class="q-pa-md">
                  <div class="text-bold text-subtitle1">Supuestos</div>
                  <q-list>
                    <q-item
                      tag="label"
                      v-ripple
                      v-for="supuesto in list_Supuestos"
                      :key="supuesto"
                    >
                      <q-item-section avatar>
                        <q-checkbox
                          color="pink"
                          v-model="supuestoEstudios"
                          :val="supuesto"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ supuesto }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div
                    v-if="
                      observacion.id != null &&
                      observacion.formacion != null &&
                      observacion.publicadas == true
                    "
                    class="text-right"
                  >
                    <q-btn
                      @click="subsanarObservacion('Formacion')"
                      label="Subsanar"
                      color="secondary"
                      icon-right="task_alt"
                    ></q-btn>
                  </div>
                </div>
              </div>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="Historia profesional y/o laboral">
            <q-form class="row q-col-gutter-xs">
              <q-banner
                style="border-radius: 10px"
                v-if="
                  observacion.faltantes != null &&
                  observacion.faltantes != '' &&
                  observacion.faltantes.includes('Historia_Profesional')
                "
                class="bg-orange-5 text-white row"
              >
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                Supuestos:
                <div>
                  <div>
                    - {{ observacion.historia_Profesional.split("||")[0] }}
                  </div>
                </div>
              </q-banner>
              <div class="col-12">
                <div class="text-h6 text-grey-8">
                  Historia profesional y/o laboral
                </div>
                <q-input
                  v-model="datos_Generales.historia_Laboral"
                  label="Experiencia, años y actividades realizadas"
                  type="textarea"
                  counter
                  maxlength="5000"
                  hint="Máximo 5,000 caracteres"
                  autofocus
                  readonly
                />
                <br />
                <div class="q-pa-md">
                  <div class="text-bold text-subtitle1">Supuestos</div>
                  <q-list>
                    <q-item
                      tag="label"
                      v-ripple
                      v-for="supuesto in list_Supuestos"
                      :key="supuesto"
                    >
                      <q-item-section avatar>
                        <q-checkbox
                          color="pink"
                          v-model="supuestoHistoria"
                          :val="supuesto"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ supuesto }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div
                    v-if="
                      observacion.id != null &&
                      observacion.historia_Profesional != null &&
                      observacion.publicadas == true
                    "
                    class="text-right"
                  >
                    <q-btn
                      @click="subsanarObservacion('Historia_Profesional')"
                      label="Subsanar"
                      color="secondary"
                      icon-right="task_alt"
                    ></q-btn>
                  </div>
                </div>
              </div>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="Trayectoria política y/o participación social">
            <q-form class="row q-col-gutter-xs">
              <q-banner
                style="border-radius: 10px"
                v-if="
                  observacion.faltantes != null &&
                  observacion.faltantes != '' &&
                  observacion.faltantes.includes('Trayectoria')
                "
                class="bg-orange-5 text-white row"
              >
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                Supuestos:
                <div>
                  <div>- {{ observacion.trayectoria.split("||")[0] }}</div>
                </div>
              </q-banner>
              <div class="col-12">
                <div class="text-h6 text-grey-8">
                  Trayectoria política y/o participación social
                </div>
                <q-input
                  v-model="datos_Generales.trayectoria"
                  label="Trayectoria, años y actividades realizadas"
                  type="textarea"
                  counter
                  maxlength="5000"
                  hint="Máximo 5,000 caracteres"
                  readonly
                />
                <div class="q-pa-md">
                  <div class="text-bold text-subtitle1">Supuestos</div>
                  <q-list>
                    <q-item
                      tag="label"
                      v-ripple
                      v-for="supuesto in list_Supuestos"
                      :key="supuesto"
                    >
                      <q-item-section avatar>
                        <q-checkbox
                          color="pink"
                          v-model="supuestoTrayectoria"
                          :val="supuesto"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ supuesto }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div
                    v-if="
                      observacion.id != null &&
                      observacion.trayectoria != null &&
                      observacion.publicadas == true
                    "
                    class="text-right"
                  >
                    <q-btn
                      @click="subsanarObservacion('Trayectoria')"
                      label="Subsanar"
                      color="secondary"
                      icon-right="task_alt"
                    ></q-btn>
                  </div>
                </div>
              </div>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="¿Por qué quiere ocupar un cargo público?">
            <q-form class="row q-col-gutter-xs">
              <q-banner
                style="border-radius: 10px"
                v-if="
                  observacion.faltantes != null &&
                  observacion.faltantes != '' &&
                  observacion.faltantes.includes('Motivo_Cargo_Publico')
                "
                class="bg-orange-5 text-white row"
              >
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                Supuestos:
                <div>
                  <div>
                    - {{ observacion.motivo_Cargo_Publico.split("||")[0] }}
                  </div>
                </div>
              </q-banner>
              <div class="col-12">
                <div class="text-h6 text-grey-8">
                  ¿Por qué quiere ocupar un cargo público?
                </div>
                <q-input
                  v-model="datos_Generales.motivo_Cargo_Publico"
                  label="Motivaciones de ocupar un cargo público"
                  type="textarea"
                  counter
                  maxlength="5000"
                  hint="Máximo 5,000 caracteres"
                  readonly
                />
                <br />
                <div class="q-pa-md">
                  <div class="text-bold text-subtitle1">Supuestos</div>
                  <q-list>
                    <q-item
                      tag="label"
                      v-ripple
                      v-for="supuesto in list_Supuestos"
                      :key="supuesto"
                    >
                      <q-item-section avatar>
                        <q-checkbox
                          color="pink"
                          v-model="supuestoOcuparCargo"
                          :val="supuesto"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ supuesto }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div
                    v-if="
                      observacion.id != null &&
                      observacion.motivo_Cargo_Publico != null &&
                      observacion.publicadas == true
                    "
                    class="text-right"
                  >
                    <q-btn
                      @click="subsanarObservacion('Motivo_Cargo_Publico')"
                      label="Subsanar"
                      color="secondary"
                      icon-right="task_alt"
                    ></q-btn>
                  </div>
                </div>
              </div>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="Propuesta 1">
            <q-banner
              style="border-radius: 10px"
              v-if="
                observacion.faltantes != null &&
                observacion.faltantes != '' &&
                observacion.faltantes.includes('Propuesta_1')
              "
              class="bg-orange-5 text-white row"
            >
              <template v-slot:avatar>
                <q-icon name="warning" color="white" />
              </template>
              Supuestos:
              <div>
                <div>- {{ observacion.propuesta_1.split("||")[0] }}</div>
              </div>
            </q-banner>
            <q-form class="q-col-gutter-xs">
              <div class="row">
                <div class="col-12">
                  <div class="text-h6 text-grey-8">Propuesta 1</div>
                  <div v-if="list_Propuestas.length > 0">
                    <q-input
                      v-model="list_Propuestas[0].propuesta"
                      autofocus
                      readonly
                      type="textarea"
                      counter
                      maxlength="1600"
                      hint="Máximo 1,600 caracteres"
                    />
                  </div>
                  <div v-else>No agregó la propuesta 2</div>
                  <br />
                  <div class="q-pa-md">
                    <div class="text-bold text-subtitle1">Supuestos</div>
                    <q-list>
                      <q-item
                        tag="label"
                        v-ripple
                        v-for="supuesto in list_Supuestos"
                        :key="supuesto"
                      >
                        <q-item-section avatar>
                          <q-checkbox
                            color="pink"
                            v-model="supuestoPropuesta1"
                            :val="supuesto"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ supuesto }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                    <div
                      v-if="
                        observacion.id != null &&
                        observacion.propuesta_1 != null &&
                        observacion.publicadas == true
                      "
                      class="text-right"
                    >
                      <q-btn
                        @click="subsanarObservacion('Propuesta_1')"
                        label="Subsanar"
                        color="secondary"
                        icon-right="task_alt"
                      ></q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="Propuesta 2">
            <q-form class="q-col-gutter-xs">
              <q-banner
                style="border-radius: 10px"
                v-if="
                  observacion.faltantes != null &&
                  observacion.faltantes != '' &&
                  observacion.faltantes.includes('Propuesta_2')
                "
                class="bg-orange-5 text-white row"
              >
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                Supuestos:
                <div>
                  <div>- {{ observacion.propuesta_2.split("||")[0] }}</div>
                </div>
              </q-banner>
              <div class="row">
                <div class="col-12">
                  <div class="text-h6 text-grey-8">Propuesta 2</div>
                  <div v-if="list_Propuestas.length > 1">
                    <q-input
                      v-model="list_Propuestas[1].propuesta"
                      autofocus
                      readonly
                      type="textarea"
                      counter
                      maxlength="1600"
                      hint="Máximo 1,600 caracteres"
                    />
                  </div>
                  <div v-else>No agregó la propuesta 2</div>
                  <br />
                  <div class="q-pa-md">
                    <div class="text-bold text-subtitle1">Supuestos</div>
                    <q-list>
                      <q-item
                        tag="label"
                        v-ripple
                        v-for="supuesto in list_Supuestos"
                        :key="supuesto"
                      >
                        <q-item-section avatar>
                          <q-checkbox
                            color="pink"
                            v-model="supuestoPropuesta2"
                            :val="supuesto"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ supuesto }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                    <div
                      v-if="
                        observacion.id != null &&
                        observacion.propuesta_2 != null &&
                        observacion.publicadas == true
                      "
                      class="text-right"
                    >
                      <q-btn
                        @click="subsanarObservacion('Propuesta_2')"
                        label="Subsanar"
                        color="secondary"
                        icon-right="task_alt"
                      ></q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="Propuesta Género">
            <q-form class="q-col-gutter-xs">
              <q-banner
                style="border-radius: 10px"
                v-if="
                  observacion.faltantes != null &&
                  observacion.faltantes != '' &&
                  observacion.faltantes.includes('Genero')
                "
                class="bg-orange-5 text-white row"
              >
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                Supuestos:
                <div>
                  <div>- {{ observacion.genero.split("||")[0] }}</div>
                </div>
              </q-banner>
              <div class="row">
                <div class="col-12">
                  <div class="text-h6 text-grey-8">Propuesta Género</div>
                  <q-input
                    v-if="datos_Generales.propuesta_Genero != null"
                    v-model="datos_Generales.propuesta_Genero"
                    autofocus
                    readonly
                    type="textarea"
                    counter
                    maxlength="1600"
                    hint="Máximo 1,600 caracteres"
                  />
                  <div v-else>No agregó propuesta género</div>
                  <br />
                  <div class="q-pa-md">
                    <div class="text-bold text-subtitle1">Supuestos</div>
                    <q-list>
                      <q-item
                        tag="label"
                        v-ripple
                        v-for="supuesto in list_Supuestos"
                        :key="supuesto"
                      >
                        <q-item-section avatar>
                          <q-checkbox
                            color="pink"
                            v-model="supuestoGenero"
                            :val="supuesto"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ supuesto }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                    <div
                      v-if="
                        observacion.id != null &&
                        observacion.genero != null &&
                        observacion.publicadas == true
                      "
                      class="text-right"
                    >
                      <q-btn
                        @click="subsanarObservacion('Genero')"
                        label="Subsanar"
                        color="secondary"
                        icon-right="task_alt"
                      ></q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <template v-if="loading == true">
      <div class="row absolute-center">
        <q-spinner-cube color="pink" size="9.5em" /></div
    ></template>
    <template v-else>
      <div class="col-lg-5 col-md-5 col-sm-6 col-xs-12 q-pt-sm q-pl-sm">
        <q-form class="q-col-gutter-xs" @submit="onSubmit">
          <q-card>
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel
                v-if="tab != '¿Por qué quiere ocupar un cargo público?'"
                :name="tab"
                class="col-6"
              >
                <div class="q-pl-md text-h6 text-pink-8">
                  Variables a evaluar
                </div>
                <br />
                <q-list>
                  <div
                    class="text-caption absolute-top-right text-bold q-pr-md"
                  >
                    Puntos:
                    {{
                      rubros_Filtrado.total_Puntos != undefined
                        ? rubros_Filtrado.total_Puntos
                        : ""
                    }}
                  </div>
                  <q-item
                    v-for="item in rubros_Filtrado.variables"
                    :key="item"
                    tag="label"
                    v-ripple
                  >
                    <q-item-section>
                      <q-item-label class="text-bold">{{
                        item.variable
                      }}</q-item-label>
                      <q-item-label class="text-subtitle2 text-grey-8">{{
                        item.descripcion
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-checkbox
                        color="pink"
                        left-label
                        v-model="item.cumple"
                        :val="
                          item.cumple == true
                            ? (item.punto = item.puntos_Cumple)
                            : (item.punto = item.no_Cumple)
                        "
                        checked-icon="check"
                        unchecked-icon="clear"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-tab-panel>
              <q-tab-panel
                name="¿Por qué quiere ocupar un cargo público?"
                class="col-6"
              >
                <div class="q-pl-md text-h6 text-pink-8">
                  Este rubro no tiene variables a evaluar
                </div>
                <br />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
          <div class="col-12 justify-end q-pt-md">
            <div class="text-right q-gutter-xs">
              <q-btn
                v-if="
                  modulo == null
                    ? false
                    : modulo.registrar &&
                      candidato.validado == true &&
                      list_Observaciones.length < 2
                "
                outline
                @click="requerir"
                icon-right="warning"
                color="orange"
                label="Observaciones"
                class="q-ml-sm"
              >
              </q-btn>
              <q-btn
                v-if="modulo == null ? false : modulo.registrar"
                outline
                :disable="candidato.validado == false"
                icon-right="save"
                label="Guardar"
                type="submit"
                color="secondary"
                class="q-ml-sm"
              >
              </q-btn>
              <q-btn
                v-if="modulo == null ? false : modulo.registrar"
                outline
                icon-right="done"
                label="Validar candidatura"
                :disable="habilitarBoton == true || candidato.validado == false"
                @click="validarCandidato"
                color="pink"
                class="q-ml-sm"
              >
              </q-btn>
            </div>
          </div>
        </q-form>
      </div>
      <ModalFoto :foto="candidato.url_Foto == null ? '' : candidato.url_Foto" />
      <ModalRequerir
        :id="candidato.id"
        :tipo="candidato.puesto"
        :identidad="supuestoIdentidad"
        :propuesta_1="supuestoPropuesta1"
        :propuesta_2="supuestoPropuesta2"
        :genero="supuestoGenero"
        :trayectoria="supuestoTrayectoria"
        :historia="supuestoHistoria"
        :formacion="supuestoEstudios"
        :ocupar_Cargo="supuestoOcuparCargo"
      />
    </template>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth-store";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { useValidarStore } from "src/stores/validar-store";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { onBeforeMount, ref, watch, watchEffect, computed } from "vue";
import { useObservacionStore } from "src/stores/observacion-store";
import banner from "../../../components/BannerComp.vue";
import ModalFoto from "../components/ModalFotografia.vue";
import ModalRequerir from "./ModalRequerir.vue";

//-----------------------------------------------------------------

const $q = useQuasar();
const validarStore = useValidarStore();
const configuracionStore = useConfiguracionStore();
const router = useRouter();
const candidatosStore = useCandidatosStore();
const observacionStore = useObservacionStore();
const {
  validar,
  evaluacion,
  list_Variables_Evaluacion_By_Rubro,
  list_Rubros_By_Evaluacion,
} = storeToRefs(validarStore);
const { list_Rubros_Evaluacion, list_Variables_By_Rubro } =
  storeToRefs(configuracionStore);
const { observacion } = storeToRefs(observacionStore);
const {
  candidato,
  list_Propuestas,
  datos_Generales,
  list_Formacion_Academica,
  list_Observaciones,
} = storeToRefs(candidatosStore);
const loading = ref(false);
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "SCC-VAL-CA";
const tab = ref("Identidad");
const rubros_Evaluacion = ref([]);
const rubros_Filtrado = ref([]);
const total_Puntos = ref(null);
const variables_gral = ref([]);
const identidad = ref(null);
const propuesta_1 = ref(null);
const propuesta_2 = ref(null);
const genero = ref(null);
const trayectoria = ref(null);
const historia = ref(null);
const formacion = ref(null);
const ocuparCargo = ref(null);
const faltanteObservacion = ref([]);
const habilitarBoton = ref(false);
const supuestoIdentidad = ref([]);
const supuestoEstudios = ref([]);
const supuestoHistoria = ref([]);
const supuestoTrayectoria = ref([]);
const supuestoOcuparCargo = ref([]);
const supuestoPropuesta1 = ref([]);
const supuestoPropuesta2 = ref([]);
const supuestoGenero = ref([]);

const list_Supuestos = ref([
  "Publicar información que sea copia íntegra de las propuestas de otras candidaturas.",
  "Publicar contenidos ofensivos o discriminatorios respecto de otros partidos políticos o personas candidatas.",
  "Hacer uso de lenguage sexista, ofensivo o discriminatorio.",
  "Publicar información o imágenes relacioanadas con otra candidatura.",
  "Hacer alusiones o menciones a otro partido político o candidatura",
  "Publicar contenidos restringidos por la legislación electoral federal y local.",
  "Utilizar lemas o imágenes de campaña en sus contenidos.",
]);
//-----------------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
  cargarData();
});

//-----------------------------------------------------------------

watchEffect(() => {
  if (rubros_Filtrado.value != undefined) {
    let { variables } = rubros_Filtrado.value;
    if (variables !== undefined) {
      if (variables[0].cumple != null && variables[0].cumple == false) {
        variables[1].cumple = false;
        variables[2].cumple = false;
      }
      rubros_Filtrado.value.total_Puntos = rubros_Filtrado.value.variables
        .filter((x) => x.cumple === true)
        .reduce(
          (accumulator, currentValue) => accumulator + currentValue.punto,
          0
        );
    }
  }
  if (rubros_Evaluacion.value != undefined) {
    total_Puntos.value = 0;
    for (var rubro of rubros_Evaluacion.value) {
      total_Puntos.value +=
        rubro.total_Puntos == undefined ? 0 : rubro.total_Puntos;
    }
  }
  if (variables_gral.value.length != 0) {
    habilitarBoton.value = variables_gral.value.some((x) => x.cumple == null);
  } else {
    habilitarBoton.value = true;
  }
});

watch(tab, (val) => {
  if (val != null) {
    if (rubros_Evaluacion.value.length > 0) {
      rubros_Filtrado.value = rubros_Evaluacion.value.find(
        (rubro) => rubro.rubro == tab.value
      );
    }
  }
});

//-----------------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const evaluaBadge = (titulo) => {
  if (faltanteObservacion.value != null) {
    let result = null;
    result = faltanteObservacion.value.includes(
      titulo == "Formación académica"
        ? "Formacion"
        : titulo == "Historia profesional y/o laboral"
        ? "Historia_Profesional"
        : titulo == "Trayectoria política y/o participación social"
        ? "Trayectoria"
        : titulo == "Propuesta 1"
        ? "Propuesta_1"
        : titulo == "Propuesta 2"
        ? "Propuesta_2"
        : titulo == "Propuesta Género"
        ? "Genero"
        : titulo == "¿Por qué quiere ocupar un cargo público?"
        ? "Motivo_Cargo_Publico"
        : "Identidad"
    )
      ? "white"
      : "transparent";
    return result;
  } else {
    return "transparent";
  }
};

const requerir = async () => {
  if (
    supuestoIdentidad.value.length == 0 &&
    supuestoEstudios.value.length == 0 &&
    supuestoHistoria.value.length == 0 &&
    supuestoTrayectoria.value.length == 0 &&
    supuestoOcuparCargo.value.length == 0 &&
    supuestoPropuesta1.value.length == 0 &&
    supuestoPropuesta2.value.length == 0 &&
    supuestoGenero.value.length == 0
  ) {
    $q.dialog({
      title: "Atención",
      message: "No ha seleccionado ningún supuesto",
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
    validarStore.initObservacion();
    validarStore.actualizarModalRequerir(true);
  }
};

const verFoto = (valor) => {
  validarStore.actualizarModalFoto(valor);
};

const estadoBoton = computed(() => {
  let existenulo;
  if (variables_gral.value.length != 0) {
    existenulo = variables_gral.value.some((x) => x.cumple == null);
  } else {
    existenulo = true;
  }
  return existenulo;
});

const cargarData = async () => {
  $q.loading.show();
  loading.value = true;
  if (candidato.value.id == null) {
    router.push({
      name: "inicio",
    });
  } else {
    variables_gral.value = [];
    rubros_Evaluacion.value = [];
    limpiar();
    validarStore.initEvaluacion();
    await candidatosStore.observacionesByCandidatoByPuesto(
      candidato.value.id,
      candidato.value.puesto
    );
    if (list_Observaciones.value.length > 0) {
      await observacionStore.loadObservacionId(list_Observaciones.value[0].id);
    }
    await candidatosStore.loadCandidatoById(
      candidato.value.puesto,
      candidato.value.id
    );
    await candidatosStore.loadDatosGeneralesById(
      candidato.value.id,
      candidato.value.puesto
    );
    await candidatosStore.loadFormacionAcademica(
      candidato.value.id,
      candidato.value.puesto
    );
    await candidatosStore.loadPropuestas(
      candidato.value.id,
      candidato.value.puesto
    );
    await configuracionStore.loadRubrosEvaluacion();
    await validarStore.loadVariableByCandidato(
      candidato.value.id,
      candidato.value.puesto
    );
    if (evaluacion.value.id != null) {
      await validarStore.loadRubrosByEvaluacion(evaluacion.value.id);
      for (var rubro of list_Rubros_By_Evaluacion.value) {
        await configuracionStore.loadVariablesByRubro(rubro.rubro_Id);
        await validarStore.loadRespuestasdByRubro(rubro.id);
        for (let variable of list_Variables_By_Rubro.value) {
          variable.cumple = list_Variables_Evaluacion_By_Rubro.value.find(
            (x) => x.variable_Id == variable.variable_Id
          ).cumple;
          variables_gral.value.push(variable);
        }
        rubros_Evaluacion.value.push({
          total_Puntos: rubro.total_Puntos == null ? 0 : rubro.total_Puntos,
          rubro_Id: rubro.id,
          rubro: rubro.rubro,
          variables: list_Variables_By_Rubro.value,
        });
      }
      rubros_Filtrado.value = rubros_Evaluacion.value.find(
        (rubro) => rubro.rubro == tab.value
      );
    } else {
      for (var rubro of list_Rubros_Evaluacion.value) {
        await configuracionStore.loadVariablesByRubro(rubro.id);

        rubros_Evaluacion.value.push({
          total_Puntos: rubro.total_Puntos,
          rubro_Id: rubro.id,
          rubro: rubro.rubro,
          variables: list_Variables_By_Rubro.value,
        });
        rubros_Filtrado.value = rubros_Evaluacion.value.find(
          (rubro) => rubro.rubro == tab.value
        );
      }
    }
  }
  if (variables_gral.value.length != 0) {
    habilitarBoton.value = variables_gral.value.some((x) => x.cumple == null);
  } else {
    habilitarBoton.value = true;
  }
  loading.value = false;
  $q.loading.hide();
};

watch(list_Observaciones, (val) => {
  if (val.length > 0) {
    faltanteObservacion.value = val[0].faltantes.split("|");
  }
  if (val.length > 0 && val[0].aplicadas == false) {
    if (faltanteObservacion.value.includes("Identidad")) {
      identidad.value = val[0].identidad;
      let seperar = val[0].identidad.split("|");
      supuestoIdentidad.value = seperar;
    }
    if (faltanteObservacion.value.includes("Formacion")) {
      formacion.value = val[0].formacion;
      let seperar = val[0].formacion.split("|");
      supuestoEstudios.value = seperar;
    }
    if (faltanteObservacion.value.includes("Historia_Profesional")) {
      historia.value = val[0].historia_Profesional;
      let seperar = val[0].historia_Profesional.split("|");
      supuestoHistoria.value = seperar;
    }
    if (faltanteObservacion.value.includes("Trayectoria")) {
      trayectoria.value = val[0].trayectoria;
      let seperar = val[0].trayectoria.split("|");
      supuestoTrayectoria.value = seperar;
    }
    if (faltanteObservacion.value.includes("Propuesta_1")) {
      propuesta_1.value = val[0].propuesta_1;
      let seperar = val[0].propuesta_1.split("|");
      supuestoPropuesta1.value = seperar;
    }
    if (faltanteObservacion.value.includes("Propuesta_2")) {
      propuesta_2.value = val[0].propuesta_2;
      let seperar = val[0].propuesta_2.split("|");
      supuestoPropuesta2.value = seperar;
    }
    if (faltanteObservacion.value.includes("Genero")) {
      genero.value = val[0].genero;
      let seperar = val[0].genero.split("|");
      supuestoGenero.value = seperar;
    }
    if (faltanteObservacion.value.includes("Motivo_Cargo_Publico")) {
      ocuparCargo.value = val[0].motivo_Cargo_Publico;
      let seperar = val[0].motivo_Cargo_Publico.split("|");
      supuestoOcuparCargo.value = seperar;
    }
  }
});

const limpiar = () => {
  identidad.value = null;
  propuesta_1.value = null;
  propuesta_2.value = null;
  genero.value = null;
  trayectoria.value = null;
  historia.value = null;
  formacion.value = null;
};

const columns = [
  {
    name: "formacion",
    align: "center",
    label: "Formación",
    field: "formacion",
    sortable: true,
  },
];

const visible_columns = ["formacion"];

const subsanarObservacion = async (rubro) => {
  $q.dialog({
    title: "Subsanar rubro",
    message: "¿Está seguro de subsanar la observación señalada en el rubro?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, subsanar",
    },
    cancel: {
      color: "negative",
      label: "No, Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await candidatosStore.subsanarObservacion(
      observacion.value.id,
      rubro
    );
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      await candidatosStore.observacionesByCandidatoByPuesto(
        candidato.value.id,
        candidato.value.puesto
      );
      if (list_Observaciones.value.length > 0) {
        await observacionStore.loadObservacionId(
          list_Observaciones.value[0].id
        );
      }
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

const validarCandidato = async () => {
  let resp = null;
  let respValidar = null;
  if (
    list_Observaciones.value.length == 0 &&
    (supuestoIdentidad.value.length != 0 ||
      supuestoEstudios.value.length != 0 ||
      supuestoHistoria.value.length != 0 ||
      supuestoTrayectoria.value.length != 0 ||
      supuestoOcuparCargo.value.length != 0 ||
      supuestoPropuesta1.value.length != 0 ||
      supuestoPropuesta2.value.length != 0 ||
      supuestoGenero.value.length != 0)
  ) {
    $q.dialog({
      title: "Atención",
      message: `Tiene supuestos seleccionados, antes de validar deberá mandar las observaciones en el botón <b>'Observaciones'.</b>`,
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
  } else {
    $q.dialog({
      title: "¿Está seguro de aceptar la verificación y validación?",
      message:
        "Al aceptar le asigna la puntuación que le dio y una vez validado no podrá realizar modificaciones.",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "secondary",
        label: "¡Sí!, validar",
      },
      cancel: {
        color: "red",
        label: " No Cancelar",
      },
    }).onOk(async () => {
      $q.loading.show();
      total_Puntos.value = 0;
      validar.value.candidato_Id = candidato.value.id;
      validar.value.puesto_Candidato = candidato.value.puesto;

      for (var rubro of rubros_Evaluacion.value) {
        if (rubro.total_Puntos == null) {
          rubro.total_Puntos = 0;
        } else {
          total_Puntos.value += rubro.total_Puntos;
        }
      }
      validar.value.total_Puntos = total_Puntos.value;
      validar.value.rubros = rubros_Evaluacion.value;
      if (evaluacion.value.id != null) {
        resp = await validarStore.updateEvaluacionCandidato(validar.value);
      } else {
        resp = await validarStore.createValidar(validar.value);
      }
      if (resp.success) {
        respValidar = await validarStore.validarCandidatoByIEEN(
          candidato.value.id,
          candidato.value.puesto
        );
        if (respValidar.success) {
          $q.loading.hide();
          $q.notify({
            position: "top-right",
            type: "positive",
            message: "Candidato validado con exito",
          });
          await candidatosStore.loadCandidatoById(
            candidato.value.puesto,
            candidato.value.id
          );
        } else {
          $q.loading.hide();
          $q.notify({
            position: "top-right",
            type: "negative",
            message: resp.data,
          });
        }
      } else {
        $q.loading.hide();
        $q.notify({
          position: "top-right",
          type: "negative",
          message: resp.data,
        });
      }
    });
  }
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();

  total_Puntos.value = 0;
  validar.value.candidato_Id = candidato.value.id;
  validar.value.puesto_Candidato = candidato.value.puesto;

  for (var rubro of rubros_Evaluacion.value) {
    if (rubro.total_Puntos == null) {
      rubro.total_Puntos = 0;
    } else {
      total_Puntos.value += rubro.total_Puntos;
    }
  }
  validar.value.total_Puntos = total_Puntos.value;
  validar.value.rubros = rubros_Evaluacion.value;
  if (evaluacion.value.id != null) {
    resp = await validarStore.updateEvaluacionCandidato(validar.value);
  } else {
    resp = await validarStore.createValidar(validar.value);
  }

  if (resp.success) {
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
  $q.loading.hide();
};
</script>
