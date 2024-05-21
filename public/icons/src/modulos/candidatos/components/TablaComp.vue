<template>
  <div class="q-pt-md">
    <q-card class="bg-transparent no-shadow no-border q-pb-sm" bordered>
      <q-card-section class="q-pa-none">
        <div class="row q-col-gutter-sm">
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-item class="q-pa-none bg-blue-grey-3" style="border-radius: 5px">
              <q-item-section class="q-pa-md q-ml-none text-white">
                <q-item-label class="text-white text-h6 text-weight-bolder">
                  Curricular: {{ estadistica1 }}
                </q-item-label>
                <q-item-label class="text-subtitle2 text-grey-8"
                  >Estos datos corresponden al total de candidaturas con avance
                  curricular del 100%
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-item class="q-pa-none bg-blue-grey-3" style="border-radius: 5px">
              <q-item-section class="q-pa-md q-ml-none text-white">
                <q-item-label class="text-white text-h6 text-weight-bolder">
                  Identidad: {{ estadistica2 }}
                </q-item-label>
                <q-item-label class="text-subtitle2 text-grey-8"
                  >Estos datos corresponden al total de candidaturas con avance
                  de identidad del 100%
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-item class="q-pa-none bg-blue-grey-3" style="border-radius: 5px">
              <q-item-section class="q-pa-md q-ml-none text-white">
                <q-item-label class="text-white text-h6 text-weight-bolder">
                  Validado partido: {{ validadoPartido }}
                </q-item-label>
                <q-item-label class="text-subtitle2 text-grey-8"
                  >Estos datos corresponden al total de candidaturas validadas
                  por el partido político
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col q-ma-sm">
            <div class="text-right">
              <q-btn
                type="button"
                color="pink-1"
                icon-right="download"
                label="Descargar Excel"
                @click="descargarExcel(true)"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-tabs
        v-model="tab_Eleccion"
        dense
        class="bg-grey-2 text-grey-7"
        active-color="blue-grey-4"
        indicator-color="blue-grey-4"
        align="justify"
      >
        <q-tab
          v-for="tipo in tipo_Elecciones"
          :key="tipo"
          :name="tipo.siglas"
          :label="tipo.nombre"
          @click="cambiarTab(tipo)"
        ></q-tab>
      </q-tabs>
      <q-tab-panels v-model="tab_Eleccion" animated>
        <q-tab-panel
          v-for="tipo in tipo_Elecciones"
          :key="tipo"
          :name="tipo.siglas"
        >
          <q-table
            :grid="$q.screen.xs"
            flat
            bordered
            :rows="listFiltrado"
            :columns="columns"
            :visible-columns="visisble_columns"
            row-key="name"
            class="my-sticky-last-column-table"
            v-model:pagination="pagination"
          >
            <template v-slot:top-left>
              <q-select
                v-if="tab_Eleccion != 'PYS'"
                filled
                color="pink"
                class="q-pr-md"
                v-model="cargo_Id"
                :options="list_Cargo"
                label="Selecciona cargo"
                hint="Filtrar por cargo"
                style="width: 180px"
              />
              <q-select
                v-if="tab_Eleccion == 'DIP' && cargo_Id != 'RP'"
                filled
                color="pink"
                class="q-pr-md"
                v-model="distrito_Id"
                :options="list_Distritos"
                label="Selecciona distrito"
                hint="Filtrar por distrito"
                style="width: 180px"
              />
              <q-select
                v-if="tab_Eleccion != 'DIP'"
                filled
                color="pink"
                class="q-pr-md"
                v-model="municipio_Id"
                :options="list_Municipios"
                label="Selecciona municipio"
                hint="Filtrar por municipio"
                style="width: 220px"
              />
              <q-select
                filled
                color="pink"
                class="q-pr-md"
                v-model="coalicion_Id"
                :options="list_Coaliciones"
                label="Selecciona coalición"
                hint="Filtrar por coalición"
                style="width: 220px"
              />
              <q-select
                v-if="cargo_Id == 'MR'"
                filled
                color="pink"
                class="q-pr-md"
                v-model="coalicion_Id"
                :options="list_Coaliciones"
                label="Selecciona coalición"
                hint="Filtrar por coalición"
                style="width: 220px"
              >
              </q-select>
              <q-select
                filled
                color="pink"
                class="q-pr-md"
                v-model="partido_Id"
                :options="list_Filtro_Partidos"
                label="Selecciona partido"
                hint="Filtrar por partidos"
                style="width: 220px"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar v-if="scope.opt.logo_URL != null">
                      <q-img :src="scope.opt.logo_URL" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-select
                filled
                color="pink"
                class="q-pr-md"
                v-model="estatus_ieen"
                :options="list_Estatus_IEEN"
                label="Selecciona estatus IEEN"
                hint="Filtrar por estatus IEEN"
                style="width: 220px"
              >
              </q-select>
              <q-select
                filled
                color="pink"
                class="q-pr-md"
                v-model="estatus_partido"
                :options="list_Estatus"
                label="Selecciona estatus Partido"
                hint="Filtrar por estatus Partido"
                style="width: 220px"
              >
              </q-select>
            </template>
            <template v-slot:top-right>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filtro"
                placeholder="Search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-if="$q.screen.xs" v-slot:item="props">
              <div
                class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              >
                <q-card bordered class="no-shadow">
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar size="60px" class="shadow-10">
                        <img :src="props.row.url_Foto" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-grey-8 text-weight-bold">
                        {{ props.row.nombre_Completo }}
                      </q-item-label>
                      <q-item-label class="text-grey-8">
                        {{ props.row.correo }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator></q-separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label
                        v-if="props.row.is_Coalicion == true"
                        class="text-grey-8 text-weight-medium"
                      >
                        Coalición: {{ props.row.coalicion }}
                      </q-item-label>
                      <q-item-label class="text-grey-8 text-weight-medium">
                        Partido: {{ props.row.partido }}
                      </q-item-label>
                      <q-item-label class="text-grey-8 text-weight-medium">
                        Género: {{ props.row.sexo }}
                      </q-item-label>
                      <q-item-label
                        class="text-grey-8"
                        v-if="props.row.distrito != null"
                      >
                        Distrito: {{ props.row.no_Distrito }}
                      </q-item-label>
                      <q-item-label
                        class="text-grey-8"
                        v-if="props.row.municipio != null"
                      >
                        Municipio: {{ props.row.municipio }}
                      </q-item-label>
                      <q-item-label
                        class="text-grey-8"
                        v-if="props.row.demarcacion != null"
                      >
                        Demarcación: {{ props.row.demarcacion }}
                      </q-item-label>
                      <div>
                        <q-btn
                          label="Validado por partido"
                          flat
                          round
                          :color="props.row.validado == true ? 'green' : 'red'"
                          :icon="props.row.validado == true ? 'done' : 'close'"
                        >
                        </q-btn>
                        <q-btn
                          label="Validado por IEEN"
                          flat
                          round
                          :color="
                            props.row.validado_IEEN == true ? 'green' : 'red'
                          "
                          :icon="
                            props.row.validado_IEEN == true ? 'done' : 'close'
                          "
                        >
                        </q-btn>
                      </div>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label>
                        <q-btn
                          flat
                          round
                          color="pink"
                          icon="looks_one"
                          @click="validarCurricular(props.row)"
                        >
                          <q-tooltip>Validar cuestionario curricular</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat
                          round
                          color="pink"
                          icon="looks_two"
                          @click="validarIdentidad(props.row)"
                        >
                          <q-tooltip
                            >Validar cuestionario de identidad</q-tooltip
                          >
                        </q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card>
              </div>
            </template>
            <template v-else v-slot:body="props">
              <q-tr :props="props" :class="props.row.color ? '' : 'bg-grey-3'">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <div v-if="col.name === 'nombre'">
                    <div class="user__info">
                      <q-item-section avatar>
                        <q-avatar v-if="props.row.url_Foto != null">
                          <img :src="props.row.url_Foto" />
                        </q-avatar>
                        <q-avatar v-else>
                          <q-img
                            v-if="props.row.sexo == 'Mujer'"
                            src="../../../assets/avatarmujer.jpg"
                          />
                          <q-img
                            v-if="props.row.sexo == 'Hombre'"
                            src="../../../assets/avatarHombre.jpg"
                          />
                          <q-img
                            v-if="props.row.sexo == 'No binario'"
                            src="../../../assets/noBinario.png"
                          />
                        </q-avatar>
                      </q-item-section>
                      <div>
                        <div class="user__name">
                          {{ props.row.nombre_Completo }}
                        </div>
                        <div class="user__email">
                          {{ props.row.correo }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="col.name === 'logo_Partido'">
                    <q-avatar square>
                      <img :src="col.value" alt="" />
                      <q-tooltip>{{ props.row.partido }}</q-tooltip>
                    </q-avatar>
                  </div>
                  <div v-else-if="col.name === 'validado'">
                    <q-icon
                      flat
                      round
                      size="sm"
                      :color="
                        props.row.informacion_Actualizada == true &&
                        props.row.faltantes != ''
                          ? 'orange'
                          : props.row.informacion_Pausada != null &&
                            props.row.informacion_Pausada != '' &&
                            props.row.informacion_Actualizada == false
                          ? 'red'
                          : col.value == true
                          ? 'green'
                          : 'red'
                      "
                      :name="
                        props.row.informacion_Actualizada == true &&
                        props.row.faltantes != ''
                          ? 'hourglass_empty'
                          : props.row.informacion_Pausada != null &&
                            props.row.informacion_Actualizada == false
                          ? 'warning'
                          : props.row.faltantes == '' &&
                            props.row.informacion_Actualizada == true
                          ? 'done'
                          : col.value == true
                          ? 'done'
                          : 'close'
                      "
                    >
                      <q-tooltip>{{
                        props.row.informacion_Actualizada == true &&
                        props.row.faltantes != ""
                          ? "Información actualizada"
                          : props.row.informacion_Pausada != null &&
                            props.row.informacion_Actualizada == false
                          ? "Con correcciones"
                          : col.value
                          ? "Validado"
                          : "Sin validar"
                      }}</q-tooltip>
                    </q-icon>
                  </div>
                  <div v-else-if="col.name === 'validado_IEEN'">
                    <q-icon
                      size="sm"
                      flat
                      round
                      :color="col.value == true ? 'green' : 'red'"
                      :name="col.value == true ? 'done' : 'close'"
                    />
                  </div>
                  <div v-else-if="col.name === 'logo_Coalicion'">
                    <q-avatar
                      style="width: auto; height: 35px"
                      square
                      v-if="props.row.is_Coalicion == true"
                    >
                      <img :src="props.row.logo_Coalicion" alt="" />
                      <q-tooltip>{{ props.row.coalicion }}</q-tooltip>
                    </q-avatar>
                  </div>
                  <div v-else-if="col.name === 'avance_Curricular'">
                    <q-item>
                      <q-item-section>
                        <q-item-label>
                          <q-item-section>
                            <q-linear-progress
                              style="
                                display: block;
                                width: 150px;
                                height: 20px;
                                border-radius: 10px;
                              "
                              color="blue-grey-4"
                              :value="col.value / 100"
                            >
                              <div class="absolute-full flex flex-center">
                                <div
                                  class="text-subtitle2 absolute-full flex flex-center text-black"
                                >
                                  Curricular {{ col.value }}%
                                </div>
                              </div>
                            </q-linear-progress>
                          </q-item-section>
                        </q-item-label>
                        <q-item-label>
                          <q-item-section>
                            <q-linear-progress
                              style="
                                display: block;
                                width: 150px;
                                height: 20px;
                                border-radius: 10px;
                              "
                              color="teal-3"
                              :value="props.row.avance_Identidad / 100"
                            >
                              <div
                                class="text-subtitle2 absolute-full flex flex-center text-black"
                              >
                                Identidad {{ props.row.avance_Identidad }}%
                              </div>
                            </q-linear-progress>
                          </q-item-section>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div v-else-if="col.name === 'id'">
                    <q-btn
                      v-if="modulo == null ? false : modulo.leer"
                      flat
                      round
                      color="pink"
                      icon="visibility"
                      @click="verInformacion(props.row)"
                    >
                      <q-tooltip>Ver</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="modulo == null ? false : modulo.registrar"
                      flat
                      round
                      color="pink"
                      icon="looks_one"
                      @click="validarCurricular(props.row)"
                    >
                      <q-tooltip>Validar cuestionario curricular</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="modulo == null ? false : modulo.registrar"
                      flat
                      round
                      color="pink"
                      icon="looks_two"
                      @click="validarIdentidad(props.row)"
                    >
                      <q-tooltip>Validar cuestionario de identidad</q-tooltip>
                    </q-btn>
                  </div>
                  <label v-else>{{ col.value }}</label>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { useQuasar, QSpinnerCube } from "quasar";
import { storeToRefs } from "pinia";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { useAuthStore } from "src/stores/auth-store";

//-----------------------------------------------------------------

const $q = useQuasar();
const configuracionStore = useConfiguracionStore();
const candidatosStore = useCandidatosStore();
const router = useRouter();
const {
  list_Candidatos_By_Eleccion,
  cargo_Id,
  distrito_Id,
  municipio_Id,
  coalicion_Id,
  partido_Id,
} = storeToRefs(candidatosStore);
const {
  tipo_Elecciones,
  list_Coaliciones,
  list_Partidos_Politicos,
  list_Distritos,
  list_Municipios,
} = storeToRefs(configuracionStore);
const listFiltrado = ref([]);
const visisble_columns = ref("");
const tab_Eleccion = ref("DIP");
const tipo_Eleccion_Id = ref(2);
const filtro = ref(null);
const estatus_partido = ref(null);
const estatus_ieen = ref(null);
const list_Cargo = ref(["Todos", "MR", "RP"]);
const list_Filtro_Partidos = ref([]);
const estadistica1 = ref(null);
const estadistica2 = ref(null);
const list_Estatus = ref([
  "Todos",
  "Validado",
  "Pendiente de validar",
  "Con observaciones",
  "Observaciones aplicadas",
]);
const list_Estatus_IEEN = ref(["Todos", "Validado", "Pendiente de validar"]);
const validadoPartido = ref(null);

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "SCC-VAL-CA";

//-----------------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
  cargarData();
  cargarColumnas(tab_Eleccion.value);
});

//--------------------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};
//-----------------------------------------------------------------

watch(tipo_Elecciones, (val) => {
  if (val.length > 0) {
    if (
      localStorage.getItem("tab") != null &&
      localStorage.getItem("tab") != ""
    ) {
      tab_Eleccion.value = localStorage.getItem("tab");
      let filtrar = val.find((x) => x.siglas == localStorage.getItem("tab"));
      tipo_Eleccion_Id.value = filtrar.id;
    } else {
      tab_Eleccion.value = val[0].siglas;
      tipo_Eleccion_Id.value = val[0].id;
    }
  }
});

watch(list_Candidatos_By_Eleccion, (val) => {
  if (val.length > 0) {
    listFiltrado.value = val;
    cargarColumnas(tab_Eleccion.value);
  }
});

watch(tab_Eleccion, (val) => {
  if (val != null) {
    localStorage.setItem("tab", val);
    filtro.value = "";
    cargarColumnas(val);
    cargarData();
  }
});

watch(filtro, (val) => {
  if (val != null) {
    listFiltrado.value = list_Candidatos_By_Eleccion.value.filter((x) =>
      x.nombre_Completo.toLowerCase().includes(val.toLowerCase())
    );
  }
});

watch(coalicion_Id, (val) => {
  if (val != null) {
    partido_Id.value = { value: 0, label: "Todos" };
  }
});

watch(listFiltrado, (val) => {
  if (val.length > 0) {
    let totalCurricular = val.filter((x) => x.avance_Curricular == 100);
    let totalIdentidad = val.filter((x) => x.avance_Identidad == 100);
    let totalValidado = val.filter((x) => x.validado == true);
    estadistica1.value = `${totalCurricular.length} de ${val.length}`;
    estadistica2.value = `${totalIdentidad.length} de ${val.length}`;
    validadoPartido.value = `${totalValidado.length} de ${val.length}`;
  }
});

//-----------------------------------------------------------------

const cargarData = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "pink",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento por favor...",
    messageColor: "black",
  });
  await configuracionStore.loadMunicipios();
  await configuracionStore.loadDistritos();
  await configuracionStore.loadCoaliciones();
  await configuracionStore.loadTipoElecciones();
  await configuracionStore.loadPartidosPoliticosTodos();
  await candidatosStore.loadCandidatosByEleccion(tipo_Eleccion_Id.value);
  $q.loading.hide();
};

const validarCurricular = async (row) => {
  candidatosStore.initDatosGenerales();
  candidatosStore.initCandidato();
  candidatosStore.initFormacion();
  candidatosStore.initPropuesta();
  await candidatosStore.loadCandidatoById(row.puesto, row.id);
  router.push({
    name: "validarCurricular",
  });
};

const validarIdentidad = async (row) => {
  candidatosStore.initCandidato();
  candidatosStore.initDatosGenerales();
  candidatosStore.initFormacion();
  candidatosStore.initPropuesta();
  await candidatosStore.loadCandidatoById(row.puesto, row.id);
  router.push({
    name: "validarIdentidad",
  });
};

const cambiarTab = (tipo) => {
  limpiarFiltros();
  tipo_Eleccion_Id.value = tipo.id;
};

const cargarColumnas = (tab_Eleccion) => {
  switch (tab_Eleccion) {
    case "GUB":
      visisble_columns.value = [
        "nombre",
        "puestoLetra",
        "tipo_Candidato",
        "validado",
        "validado_IEEN",
        "avance_Curricular",
        "evaluacion_Candidato",
        "porcentaje",
        "progreso",
        "genero",
        "no_Distrito",
        "orden",
        "logo_Partido",
        "logo_Coalicion",
        "id",
      ];
      break;
    case "DIP":
      visisble_columns.value = [
        "nombre",
        "puestoLetra",
        "tipo_Candidato",
        "validado",
        "validado_IEEN",
        "avance_Curricular",
        "evaluacion_Candidato",
        "porcentaje",
        "progreso",
        "genero",
        "no_Distrito",
        "orden",
        "logo_Partido",
        "logo_Coalicion",
        "id",
      ];
      break;
    case "PYS":
      visisble_columns.value = [
        "nombre",
        "puestoLetra",
        "tipo_Candidato",
        "validado",
        "validado_IEEN",
        "avance_Curricular",
        "evaluacion_Candidato",
        "porcentaje",
        "progreso",
        "genero",
        "municipio",
        "logo_Partido",
        "logo_Coalicion",
        "id",
      ];
      break;
    case "REG":
      visisble_columns.value = [
        "nombre",
        "puestoLetra",
        "tipo_Candidato",
        "validado",
        "validado_IEEN",
        "avance_Curricular",
        "evaluacion_Candidato",
        "porcentaje",
        "progreso",
        "genero",
        "municipio",
        "demarcacion",
        "orden",
        "logo_Partido",
        "logo_Coalicion",
        "id",
      ];
      break;
    default:
      break;
  }
  pagination.value = {
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 8,
  };
};

const limpiarFiltros = () => {
  cargo_Id.value = "Todos";
  estatus_ieen.value = "Todos";
  estatus_partido.value = "Todos";
  coalicion_Id.value = { value: 0, label: "Todos" };
  distrito_Id.value = { value: 0, label: "Todos" };
  municipio_Id.value = { value: 0, label: "Todos" };
  partido_Id.value = { value: 0, label: "Todos" };
};

const descargarExcel = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "pink",
    spinnerSize: 140,
    backgroundColor: "purple-2",
    message: "Espere un momento porfavor...",
    messageColor: "black",
  });
  await configuracionStore.downloadExcel();
  const link = document.createElement("a");
  link.href = configuracionStore.documentoExcel;
  link.setAttribute("download", "BD_CANDIDATURAS_2024.xlsx");
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};

const verInformacion = async (row) => {
  candidatosStore.initDatosGenerales();
  candidatosStore.actualizarVisualizar(true);
  await candidatosStore.loadCandidatoById(row.puesto, row.id);
  await candidatosStore.loadDatosGeneralesById(row.id, row.puesto);
  router.push({
    name: "cuestionario_visualizar",
  });
};

const columns = [
  {
    name: "nombre",
    align: "center",
    label: "Nombre",
    field: "nombre",
    sortable: true,
  },
  {
    name: "puestoLetra",
    align: "center",
    label: "Candidatura",
    field: "puestoLetra",
    sortable: true,
  },
  {
    name: "tipo_Candidato",
    align: "center",
    label: "Tipo",
    field: "tipo_Candidato",
    sortable: true,
  },
  {
    name: "avance_Curricular",
    align: "center",
    label: "Progeso",
    field: "avance_Curricular",
    sortable: true,
  },
  {
    name: "evaluacion_Candidato",
    align: "center",
    label: "Puntuación",
    field: "evaluacion_Candidato",
    sortable: true,
  },
  {
    name: "porcentaje",
    align: "center",
    label: "Porcentaje",
    field: "porcentaje",
    sortable: true,
  },
  {
    name: "validado",
    align: "center",
    label: "Validado partido",
    field: "validado",
    sortable: true,
  },
  {
    name: "validado_IEEN",
    align: "center",
    label: "Validado IEEN",
    field: "validado_IEEN",
    sortable: true,
  },
  {
    name: "no_Distrito",
    align: "center",
    label: "Distrito",
    field: "no_Distrito",
    sortable: true,
  },
  {
    name: "orden",
    align: "center",
    label: "Orden de prelación",
    field: "orden",
    sortable: true,
  },
  {
    name: "logo_Partido",
    align: "center",
    label: "Partido",
    field: "logo_Partido",
    sortable: true,
  },
  {
    name: "logo_Coalicion",
    align: "center",
    label: "Coalición",
    field: "logo_Coalicion",
    sortable: true,
  },
  {
    name: "municipio",
    align: "center",
    label: "Municipio",
    field: "municipio",
    sortable: true,
  },
  {
    name: "demarcacion",
    align: "center",
    label: "Demarcación",
    field: "demarcacion",
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

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 8,
});

const filtrar = (list_Candidatos, filtro) => {
  listFiltrado.value = list_Candidatos.filter((item) => {
    let cumple = true;
    if (filtro.estatus_ieen !== undefined) {
      if (filtro.estatus_ieen == "Todos") {
        cumple = cumple && item.validado_IEEN === item.validado_IEEN;
      } else {
        if (filtro.estatus_ieen == "Validado") {
          cumple = cumple && item.validado_IEEN === true;
        } else {
          cumple = cumple && item.validado_IEEN === false;
        }
      }
    }
    if (filtro.estatus_partido !== undefined) {
      if (filtro.estatus_partido == "Todos") {
        cumple = cumple && item.validado === item.validado;
      } else {
        if (filtro.estatus_partido == "Validado") {
          cumple =
            cumple &&
            item.validado === true &&
            (item.faltantes == "" || item.faltantes == null);
        } else if (filtro.estatus_partido == "Pendiente de validar") {
          cumple = cumple && item.validado === false;
        } else if (filtro.estatus_partido == "Observaciones aplicadas") {
          cumple =
            cumple &&
            item.informacion_Actualizada === true &&
            item.faltantes != "" &&
            item.validado === true;
        } else {
          cumple =
            cumple &&
            item.informacion_Pausada != null &&
            item.informacion_Pausada != "" &&
            item.informacion_Actualizada === false;
        }
      }
    }
    if (filtro.distrito !== undefined) {
      if (filtro.distrito == 0) {
        cumple = cumple && item.distrito_Id === item.distrito_Id;
      } else {
        cumple = cumple && item.distrito_Id === filtro.distrito;
      }
    }
    if (filtro.municipio !== undefined) {
      if (filtro.municipio == 0) {
        cumple = cumple && item.municipio_Id === item.municipio_Id;
      } else {
        cumple = cumple && item.municipio_Id === filtro.municipio;
      }
    }
    if (filtro.cargo !== undefined) {
      if (filtro.cargo == "Todos") {
        cumple = cumple && item.tipo_Candidato === item.tipo_Candidato;
      } else {
        cumple = cumple && item.tipo_Candidato === filtro.cargo;
      }
    }
    if (filtro.coalicion !== undefined) {
      if (filtro.coalicion == 0) {
        cumple = cumple && item.coalicion_Id === item.coalicion_Id;
      } else {
        cumple = cumple && item.coalicion_Id === filtro.coalicion;
      }
    }
    if (filtro.partido !== undefined) {
      if (filtro.partido == 0) {
        cumple = cumple && item.partido_Id === item.partido_Id;
      } else {
        cumple = cumple && item.partido_Id === filtro.partido;
      }
    }
    return cumple;
  });
};

watchEffect(() => {
  const filtro = {};
  if (tab_Eleccion.value != null)
    filtro.eleccion =
      tab_Eleccion.value == "PYS"
        ? "Presidencias y Sindicaturas"
        : tab_Eleccion.value == "REG"
        ? "Regidurías"
        : "Diputaciones";
  if (cargo_Id.value != null) filtro.cargo = cargo_Id.value;
  if (municipio_Id.value != null) filtro.municipio = municipio_Id.value.value;
  if (distrito_Id.value != null) filtro.distrito = distrito_Id.value.value;
  if (partido_Id.value != null) filtro.partido = partido_Id.value.value;
  if (estatus_ieen.value != null) filtro.estatus_ieen = estatus_ieen.value;
  if (estatus_partido.value != null)
    filtro.estatus_partido = estatus_partido.value;
  if (coalicion_Id.value != null) {
    filtro.coalicion = coalicion_Id.value.value;
    if (coalicion_Id.value.value != 0) {
      list_Filtro_Partidos.value = list_Partidos_Politicos.value.filter(
        (x) => x.coalicion_Id == coalicion_Id.value.value
      );
    } else {
      list_Filtro_Partidos.value = list_Partidos_Politicos.value;
    }
  }
  filtrar(list_Candidatos_By_Eleccion.value, filtro);
});
</script>

<style lang="sass">
.my-sticky-last-column-table
  thead tr:last-child th:last-child
    /* bg color is important for th; just specify one */
    background-color: white

  td:last-child
    background-color: white

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
