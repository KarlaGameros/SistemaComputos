<template>
  <q-card class="bg-transparent no-shadow no-border q-pb-sm" bordered>
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm" v-if="tab_Eleccion != 'PYS'">
        <div class="col-md-3 col-sm-12 col-xs-12">
          <q-item class="q-pa-none bg-blue-grey-3" style="border-radius: 5px">
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">
                Curricular MR: {{ estadistica1 }}
              </q-item-label>
              <q-item-label class="text-subtitle2"
                >Estos datos corresponden al total de candidaturas de mayoria
                relativa con avance curricular del 100%
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <q-item class="q-pa-none bg-blue-grey-3" style="border-radius: 5px">
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">
                Identidad MR: {{ estadistica2 }}
              </q-item-label>
              <q-item-label class="text-subtitle2"
                >Estos datos corresponden al total de candidaturas de mayoria
                relativa con avance identidad del 100%
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <q-item class="q-pa-none bg-blue-grey-3" style="border-radius: 5px">
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">
                Curricular RP: {{ estadistica3 }}
              </q-item-label>
              <q-item-label class="text-subtitle2"
                >Estos datos corresponden al total de candidaturas de
                representación proporcional con avance curricular del 100%
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <q-item class="q-pa-none bg-blue-grey-3" style="border-radius: 5px">
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">
                Identidad RP: {{ estadistica4 }}
              </q-item-label>
              <q-item-label class="text-subtitle2"
                >Estos datos corresponden al total de candidaturas de
                representación proporcional con avance identidad del 100%
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
      <div class="row q-col-gutter-sm" v-else>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <q-item class="q-pa-none bg-blue-grey-3" style="border-radius: 5px">
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">
                Presidencia curricular: {{ estadistica1 }}
              </q-item-label>
              <q-item-label caption>
                Estos datos corresponden al total de candidaturas de
                presidencias con avance curricular del 100%
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <q-item class="q-pa-none bg-blue-grey-3" style="border-radius: 5px">
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">
                Presidencia identidad: {{ estadistica2 }}
              </q-item-label>
              <q-item-label caption>
                Estos datos corresponden al total de candidaturas con avance de
                identidad del 100%
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <q-item class="q-pa-none bg-blue-grey-3" style="border-radius: 5px">
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">
                Sindicatura curricular: {{ estadistica3 }}
              </q-item-label>
              <q-item-label caption>
                Estos datos corresponden al total de candidaturas de
                sindicaturas con avance curricular del 100%
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <q-item class="q-pa-none bg-blue-grey-3" style="border-radius: 5px">
            <q-item-section class="q-pa-md q-ml-none text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">
                Sindicatura identidad: {{ estadistica4 }}
              </q-item-label>
              <q-item-label caption>
                Estos datos corresponden al total de candidaturas de
                sindicaturas con avance de identidad del 100%
              </q-item-label>
            </q-item-section>
          </q-item>
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
        @click="cambiarEleccion(tipo)"
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
              label="Seleccione cargo"
              hint="Filtrar por cargo"
              style="width: 200px"
            />
            <q-select
              v-if="tab_Eleccion == 'DIP' && cargo_Id != 'RP'"
              filled
              color="pink"
              class="q-pr-md"
              v-model="distrito_Id"
              :options="list_Distritos"
              label="Seleccione distrito"
              hint="Filtrar por distrito"
              style="width: 200px"
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
              style="width: 200px"
            />
            <q-select
              v-if="
                tab_Eleccion == 'REG' &&
                municipio_Id.label != 'Todos' &&
                cargo_Id == 'MR'
              "
              filled
              color="pink"
              class="q-pr-md"
              v-model="demarcacion_Id"
              :options="list_Demarcaciones"
              label="Seleccione demarcación"
              hint="Filtrar por demarcación"
              style="width: 200px"
            />
            <q-select
              filled
              color="pink"
              class="q-pr-md"
              v-model="genero_Id"
              :options="list_Genero"
              label="Seleccione género"
              hint="Filtrar por género"
              style="width: 200px"
            />
            <q-select
              filled
              color="pink"
              class="q-pr-md"
              v-model="estatus_Id"
              :options="list_Estatus"
              label="Seleccione estatus"
              hint="Filtrar por estatus"
              style="width: 200px"
            />
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
                  <q-item-section>
                    <q-item-label class="text-grey-8 text-weight-bold">
                      {{ props.row.nombre_Completo }}
                    </q-item-label>
                    <q-item-label class="text-grey-8">
                      {{ props.row.correo }}
                    </q-item-label>
                    <q-item-label class="text-grey-8">
                      {{ props.row.partido }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator></q-separator>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-grey-8 text-weight-bold">
                      Género: {{ props.row.sexo }}
                    </q-item-label>
                    <q-item-label caption v-if="props.row.distrito != null">
                      Distrito: {{ props.row.distrito }}
                    </q-item-label>
                    <q-item-label caption v-if="props.row.orden != null">
                      Orden de prelación: {{ props.row.orden }}
                    </q-item-label>
                    <q-item-label caption v-if="props.row.municipio != null">
                      Municipio: {{ props.row.municipio }}
                    </q-item-label>
                    <q-item-label caption v-if="props.row.demarcacion != null">
                      Demarcación: {{ props.row.demarcacion }}
                    </q-item-label>
                    <q-item-label caption>
                      Validado:
                      <q-icon
                        flat
                        round
                        size="sm"
                        :color="
                          props.row.validado == true
                            ? 'green'
                            : props.row.informacion_Pausada != null
                            ? 'orange'
                            : 'red'
                        "
                        :name="
                          props.row.validado == true
                            ? 'done'
                            : props.row.informacion_Pausada != null
                            ? 'warning'
                            : 'close'
                        "
                      />
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>
                      <q-btn
                        flat
                        round
                        color="pink"
                        icon="looks_one"
                        @click="cuestionarioCurricular(props.row)"
                      >
                        <q-tooltip>Ver cuestionario curricular</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        color="pink"
                        icon="looks_two"
                        @click="cuestionarioIdentidad(props.row)"
                      >
                        <q-tooltip>Ver cuestionario de identidad</q-tooltip>
                      </q-btn>
                      <q-btn
                        dense
                        label="Validar"
                        v-if="
                          props.row.validado == false ||
                          props.row.validado == null
                        "
                        color="green"
                        stack
                        @click="validarCandidatura(props.row, true)"
                      >
                        <q-tooltip>Validar candidatura</q-tooltip>
                      </q-btn>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </template>
          <template v-else v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <div v-if="col.name === 'nombre'">
                  <div class="user__info">
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
                <div v-else-if="col.name === 'puesto'">
                  <label>{{ props.row.puestoLetra }}</label>
                </div>
                <div v-else-if="col.name === 'logo_Partido'">
                  <q-avatar square>
                    <img :src="col.value" alt="" />
                  </q-avatar>
                </div>
                <div v-else-if="col.name === 'logo_Coalicion'">
                  <q-avatar
                    style="width: auto; height: 35px"
                    square
                    v-if="
                      props.row.is_Coalicion == true ||
                      props.row.is_Comun == true
                    "
                  >
                    <img
                      :src="
                        props.row.is_Coalicion == true
                          ? props.row.logo_Coalicion
                          : props.row.logo_Comun
                      "
                      alt=""
                    />
                    <q-tooltip>{{ props.row.coalicion }}</q-tooltip>
                  </q-avatar>
                </div>
                <div v-else-if="col.name === 'validado'">
                  <q-icon
                    flat
                    round
                    size="sm"
                    :color="
                      props.row.informacion_Pausada != null &&
                      props.row.informacion_Pausada != ''
                        ? 'orange'
                        : col.value == true
                        ? 'green'
                        : 'red'
                    "
                    :name="
                      props.row.informacion_Pausada != null &&
                      props.row.informacion_Pausada != ''
                        ? 'warning'
                        : col.value == true
                        ? 'done'
                        : 'close'
                    "
                  >
                    <q-tooltip>{{
                      props.row.informacion_Pausada != null &&
                      props.row.informacion_Pausada != ""
                        ? "Con correcciones"
                        : col.value
                        ? "Validado"
                        : "Sin validar"
                    }}</q-tooltip>
                  </q-icon>
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
                    size="lg"
                    flat
                    round
                    color="pink"
                    icon="looks_one"
                    @click="cuestionarioCurricular(props.row)"
                  >
                    <q-tooltip>Ver cuestionario curricular</q-tooltip>
                  </q-btn>
                  <q-btn
                    size="lg"
                    flat
                    round
                    color="pink"
                    icon="looks_two"
                    @click="cuestionarioIdentidad(props.row)"
                  >
                    <q-tooltip>Ver cuestionario de identidad</q-tooltip>
                  </q-btn>
                  <q-btn
                    dense
                    label="Validar"
                    v-if="
                      props.row.validado == false || props.row.validado == null
                    "
                    color="green"
                    stack
                    @click="validarCandidatura(props.row, true)"
                  >
                    <q-tooltip>Validar candidatura</q-tooltip>
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
</template>

<script setup>
import { useQuasar, QSpinnerCube } from "quasar";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { useCandidatosStore } from "src/stores/candidatos-store";
import { EncryptStorage } from "storage-encryption";
import { useValidarStore } from "src/stores/validar-store";

//-----------------------------------------------------------------

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const $q = useQuasar();
const candidatosStore = useCandidatosStore();
const configuracionStore = useConfiguracionStore();
const validarStore = useValidarStore();
const router = useRouter();
const { tipo_Elecciones, list_Distritos, list_Municipios, list_Demarcaciones } =
  storeToRefs(configuracionStore);
const {
  list_Candidatos_By_Partido,
  actualizar,
  distrito_Id,
  municipio_Id,
  demarcacion_Id,
  genero_Id,
  cargo_Id,
  estatus_Id,
} = storeToRefs(candidatosStore);
const listFiltrado = ref([]);
const visisble_columns = ref("");
const tab_Eleccion = ref(null);
const tipo_Eleccion_Id = ref(null);
const filtro = ref(null);
const list_Cargo = ref(["Todos", "MR", "RP"]);
const list_Genero = ref(["Todos", "Mujer", "Hombre", "No binario"]);
const estadistica1 = ref(null);
const estadistica2 = ref(null);
const estadistica3 = ref(null);
const estadistica4 = ref(null);
const list_Estatus = ref([
  "Todos",
  "Validado",
  "Sin validar",
  "Con observaciones",
]);

//-----------------------------------------------------------------

onBeforeMount(async () => {
  //limpiarFiltros();
  await configuracionStore.loadTipoElecciones();
  cargarData();
  cargarColumnas(tab_Eleccion.value);
});

//-----------------------------------------------------------------

watch(list_Candidatos_By_Partido, (val) => {
  if (val.length > 0) {
    if (tab_Eleccion.value != "PYS") {
      //-----------------------------------------------------------------
      let totalMR = val.filter((x) => x.tipo_Candidato == "MR");
      let totalCurricular = val.filter(
        (x) => x.tipo_Candidato == "MR" && x.avance_Curricular == 100
      );
      let totalIdentidad = val.filter(
        (x) => x.tipo_Candidato == "MR" && x.avance_Identidad == 100
      );
      estadistica1.value = `${totalCurricular.length} de ${totalMR.length}`;
      estadistica2.value = `${totalIdentidad.length} de ${totalMR.length}`;
      //-----------------------------------------------------------------
      let totalRP = val.filter((x) => x.tipo_Candidato == "RP");
      let totalCurricularRP = val.filter(
        (x) => x.tipo_Candidato == "RP" && x.avance_Curricular == 100
      );
      let totalIdentidadRP = val.filter(
        (x) => x.tipo_Candidato == "RP" && x.avance_Identidad == 100
      );
      estadistica3.value = `${totalCurricularRP.length} de ${totalRP.length}`;
      estadistica4.value = `${totalIdentidadRP.length} de ${totalRP.length}`;
    } else {
      //-----------------------------------------------------------------
      let totalPresidencia = val.filter((x) => x.puesto == 0 || x.puesto == 1);
      let totalPresidenciaCurricular = val.filter(
        (x) => x.avance_Curricular == 100 && (x.puesto == 0 || x.puesto == 1)
      );
      let totalPresidenciaIdentidad = val.filter(
        (x) => x.avance_Identidad == 100 && (x.puesto == 0 || x.puesto == 1)
      );

      let totalSindicatura = val.filter((x) => x.puesto == 2 || x.puesto == 3);
      let totalSindicaturaCurricular = val.filter(
        (x) => x.avance_Curricular == 100 && (x.puesto == 2 || x.puesto == 3)
      );
      let totalSindicaturaIdentidad = val.filter(
        (x) => x.avance_Identidad == 100 && (x.puesto == 2 || x.puesto == 3)
      );
      estadistica1.value = `${totalPresidenciaCurricular.length} de ${totalPresidencia.length}`;
      estadistica2.value = `${totalPresidenciaIdentidad.length} de ${totalPresidencia.length}`;
      estadistica3.value = `${totalSindicaturaCurricular.length} de ${totalSindicatura.length}`;
      estadistica4.value = `${totalSindicaturaIdentidad.length} de ${totalSindicatura.length}`;
      //-----------------------------------------------------------------
    }
    listFiltrado.value = val;
    cargarColumnas(tab_Eleccion.value);
  }
});

const cambiarEleccion = (tipo) => {
  limpiarFiltros();
  tipo_Eleccion_Id.value = tipo.id;
};

watch(tab_Eleccion, (val) => {
  if (val != null) {
    localStorage.setItem("tab", val);
    filtro.value = "";
    cargarData();
    cargarColumnas(val);
  }
});

watch(filtro, (val) => {
  if (val != null) {
    listFiltrado.value = list_Candidatos_By_Partido.value.filter((x) =>
      x.nombre_Completo.toLowerCase().includes(val.toLowerCase())
    );
  }
});

watch(municipio_Id, (val) => {
  if (val != null) {
    configuracionStore.loadDemarcaciones(val.value);
  }
});

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

watch(cargo_Id, (val) => {
  if (val == "Todos") {
    genero_Id.value = "Todos";
    estatus_Id.value = "Todos";
    distrito_Id.value = { value: 0, label: "Todos" };
    municipio_Id.value = { value: 0, label: "Todos" };
    demarcacion_Id.value = { value: 0, label: "Todos" };
  }
});

watch(actualizar, (val) => {
  if (val == true) {
    cargarData();
    candidatosStore.actualizarTabla(false);
  }
});
//-----------------------------------------------------------------

const validarCandidatura = async (row, valor) => {
  await candidatosStore.loadDatosGeneralesById(row.id, row.puesto);
  await candidatosStore.loadCandidatoById(row.puesto, row.id);
  validarStore.actualizarModalFaltante(valor);
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
  const partido_id = encryptStorage.decrypt("partido_id");
  await configuracionStore.loadMunicipios();
  await configuracionStore.loadDistritos();
  await candidatosStore.loadCandidatosByPartido(
    partido_id,
    tipo_Eleccion_Id.value
  );
  //limpiarFiltros();
  $q.loading.hide();
};

const cuestionarioCurricular = async (row) => {
  candidatosStore.initDatosGenerales();
  await candidatosStore.loadCandidatoById(row.puesto, row.id);
  await candidatosStore.loadDatosGeneralesById(row.id, row.puesto);
  router.push({
    name: "cuestionario",
  });
};

const cuestionarioIdentidad = async (row) => {
  await candidatosStore.loadCandidatoById(row.puesto, row.id);
  await configuracionStore.loadRespuestasByCandidato(row.id, row.puesto);
  router.push({
    name: "cuestionario_Identidad",
  });
};

const cargarColumnas = async (tab_Eleccion) => {
  switch (tab_Eleccion) {
    case "GUB":
      visisble_columns.value = [
        "nombre",
        "puesto",
        "tipo_Candidato",
        "validado",
        "avance_Curricular",
        "sexo",
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
        "puesto",
        "tipo_Candidato",
        "validado",
        "avance_Curricular",
        "sexo",
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
        "puesto",
        "validado",
        "avance_Curricular",
        "sexo",
        "municipio",
        "logo_Partido",
        "logo_Coalicion",
        "id",
      ];
      break;
    case "REG":
      visisble_columns.value = [
        "nombre",
        "puesto",
        "tipo_Candidato",
        "validado",
        "avance_Curricular",
        "sexo",
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
    rowsPerPage: 5,
  };
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
    name: "puesto",
    align: "center",
    label: "Candidatura",
    field: "puesto",
    sortable: true,
  },
  {
    name: "sexo",
    align: "center",
    label: "Género",
    field: "sexo",
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
    name: "validado",
    align: "center",
    label: "Validado",
    field: "validado",
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
    name: "logo_Partido",
    align: "center",
    label: "Partido",
    field: "logo_Partido",
    sortable: true,
  },
  {
    name: "logo_Coalicion",
    align: "center",
    label: "Coalición/Común",
    field: "logo_Coalicion",
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
  rowsPerPage: 5,
});

const limpiarFiltros = () => {
  cargo_Id.value = "Todos";
  genero_Id.value = "Todos";
  estatus_Id.value = "Todos";
  distrito_Id.value = { value: 0, label: "Todos" };
  municipio_Id.value = { value: 0, label: "Todos" };
  demarcacion_Id.value = { value: 0, label: "Todos" };
};

const filtrar = (list_Candidatos, filtro) => {
  listFiltrado.value = list_Candidatos.filter((item) => {
    let cumple = true;
    if (filtro.estatus !== undefined) {
      if (filtro.estatus == "Todos") {
        cumple = cumple && item.validado === item.validado;
      } else {
        if (filtro.estatus == "Validado") {
          cumple = cumple && item.validado === true;
        } else if (filtro.estatus == "Sin validar") {
          cumple = cumple && item.validado === false;
        } else {
          cumple =
            cumple &&
            item.informacion_Pausada != null &&
            item.informacion_Pausada != "";
        }
      }
    }
    if (filtro.cargo !== undefined) {
      if (filtro.cargo == "Todos") {
        cumple = cumple && item.tipo_Candidato === item.tipo_Candidato;
      } else {
        cumple = cumple && item.tipo_Candidato === filtro.cargo;
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
    if (filtro.demarcacion !== undefined) {
      if (filtro.demarcacion == 0) {
        cumple = cumple && item.demarcacion_Id === item.demarcacion_Id;
      } else {
        cumple = cumple && item.demarcacion_Id === filtro.demarcacion;
      }
    }
    if (filtro.genero !== undefined) {
      if (filtro.genero == "Todos") {
        cumple = cumple && item.sexo === item.sexo;
      } else {
        cumple = cumple && item.sexo === filtro.genero;
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
  if (distrito_Id.value != null) filtro.distrito = distrito_Id.value.value;
  if (municipio_Id.value != null) filtro.municipio = municipio_Id.value.value;
  if (demarcacion_Id.value != null)
    filtro.demarcacion = demarcacion_Id.value.value;
  if (estatus_Id.value != null) filtro.estatus = estatus_Id.value;
  if (genero_Id.value != null) filtro.genero = genero_Id.value;
  filtrar(list_Candidatos_By_Partido.value, filtro);
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
