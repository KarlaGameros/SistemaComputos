<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      :style="
        $q.screen.xs
          ? 'width: 800px; max-width: 85vw'
          : 'width: 400px; max-width: 45vw'
      "
    >
      <q-form @submit="consultar">
        <q-card-section class="row">
          <div class="text-subtitle1 text-bold">
            Seleccione que resultados desea revisar
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
        <q-card-section>
          <q-select
            lazy-rules
            :rules="[(val) => !!val || 'Seleccione tipo de elección']"
            v-model="tipo_Eleccion"
            :options="list_Tipo_Elecciones"
            label="Tipo de elección"
          />
        </q-card-section>
        <q-card-section v-if="tipo_Eleccion != null">
          <div
            v-if="
              tipo_Eleccion.siglas == 'DIP' || tipo_Eleccion.siglas == 'REG'
            "
          >
            <q-radio
              color="pink"
              v-model="tipo_Candidatura"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="MR"
              label="MR"
            />
            <q-radio
              color="pink"
              v-model="tipo_Candidatura"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="RP"
              label="RP"
            />
          </div>
          <q-select
            v-if="tipo_Eleccion.siglas == 'DIP'"
            v-model="distrito_Id"
            :options="list_Distritos"
            label="Distrito"
            lazy-rules
            :rules="[(val) => !!val || 'Seleccione distrito']"
          />
          <q-select
            v-if="
              tipo_Eleccion.siglas == 'PYS' || tipo_Eleccion.siglas == 'REG'
            "
            :readonly="perfil == 'Capturista CME'"
            v-model="municipio_Id"
            :options="list_Municipios"
            label="Municipio"
            lazy-rules
            :rules="[(val) => !!val || 'Seleccione municipio']"
          />
          <q-select
            v-if="tipo_Eleccion.siglas == 'REG' && tipo_Candidatura == 'MR'"
            v-model="demarcacion_Id"
            :options="list_Demarcaciones"
            label="Demarcación"
            lazy-rules
            :rules="[(val) => !!val || 'Seleccione demarcación']"
          />
        </q-card-section>
        <q-card-section class="q-pa-md">
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                type="submit"
                label="Consultar"
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
import { useQuasar, QSpinnerCube } from "quasar";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { useConsultaStore } from "src/stores/consulta-store";
import { onBeforeMount, ref, watch } from "vue";
import { EncryptStorage } from "storage-encryption";

//-----------------------------------------------------------

const $q = useQuasar();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const consultaStore = useConsultaStore();
const configuracionStore = useConfiguracionStore();
const {
  modal,
  encabezado,
  tipo_Eleccion,
  tipo_Candidatura,
  distrito_Id,
  municipio_Id,
  demarcacion_Id,
} = storeToRefs(consultaStore);
const {
  list_Tipo_Elecciones,
  list_Municipios,
  list_Demarcaciones,
  list_Distritos,
} = storeToRefs(configuracionStore);
const perfil = ref(encryptStorage.decrypt("perfil"));

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

watch(tipo_Eleccion, (val) => {
  if (val != null) {
    limpiar();
    tipo_Candidatura.value = "MR";
    if (perfil.value == "Capturista CME") {
      cargarMunicipio();
    }
  }
});

watch(tipo_Candidatura, (val) => {
  if (val != null) {
    limpiar();
    if (perfil.value == "Capturista CME") {
      cargarMunicipio();
    }
  }
});

//-----------------------------------------------------------

const cargarMunicipio = () => {
  if (municipio_Id.value == null) {
    let municipioFiltrado = list_Municipios.value.find(
      (x) => x.value == encryptStorage.decrypt("municipio_Id")
    );
    municipio_Id.value = municipioFiltrado;
  }
};

const limpiar = () => {
  distrito_Id.value = null;
  municipio_Id.value = null;
  demarcacion_Id.value = null;
};

const cargarData = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "blue-grey",
    spinnerSize: 140,
    backgroundColor: "blue-grey",
    message: "Espere un momento por favor...",
    messageColor: "black",
  });
  await configuracionStore.loadTipoElecciones();
  await configuracionStore.loadMunicipios();
  await configuracionStore.loadDistritos();
  actualizarModal(true);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  consultaStore.actualizarModal(valor);
};

const consultar = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    spinnerColor: "blue-grey",
    spinnerSize: 140,
    backgroundColor: "blue-grey",
    message: "Espere un momento por favor...",
    messageColor: "black",
  });
  encabezado.value.tipo_Candidatura = tipo_Candidatura.value;
  encabezado.value.eleccion = tipo_Eleccion.value.siglas;
  encabezado.value.distrito =
    distrito_Id.value == null ? null : distrito_Id.value.no_Distrito;
  encabezado.value.municipio =
    municipio_Id.value == null ? null : municipio_Id.value.label;
  encabezado.value.demarcacion =
    demarcacion_Id.value == null ? null : demarcacion_Id.value.label;
  consultaStore.initConsultaResultados();
  consultaStore.actualizarModal(false);
  if (tipo_Candidatura.value == "MR") {
    await consultaStore.cosultaResultadosMr(
      tipo_Eleccion.value.siglas,
      tipo_Eleccion.value.id,
      encryptStorage.decrypt("oficina_Letra") == "CME central IEEN"
        ? municipio_Id.value
        : encryptStorage.decrypt("municipio_Id"),
      distrito_Id.value,
      demarcacion_Id.value
    );
  } else {
    if (tipo_Eleccion.value.siglas != "DIP") {
      await consultaStore.cosultaResultadosRP(
        tipo_Eleccion.value.id,
        municipio_Id.value,
        distrito_Id.value
      );
    } else {
      await consultaStore.cosultaResultadosRP(
        tipo_Eleccion.value.id,
        encryptStorage.decrypt("municipio_Id"),
        distrito_Id.value
      );
    }
  }
  $q.loading.hide();
};

const cargarDemarcacion = async (id) => {
  await configuracionStore.loadDemarcaciones(id);
};
//-----------------------------------------------------------

watch(municipio_Id, (val) => {
  if (val != null) {
    demarcacion_Id.value = null;
    cargarDemarcacion(val.value);
  }
});
</script>

<style></style>
