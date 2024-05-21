<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-form @submit="onSubmit">
        <q-card-section class="row">
          <div class="text-subtitle1 text-bold">
            {{ candidato.nombre_Completo }}
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
          <q-list bordered class="rounded-borders">
            <q-checkbox
              v-if="!observacion.publicadas"
              v-model="todos"
              val="teal"
              color="pink"
              label="Seleccionar todos"
            />
            <br />
            <q-expansion-item
              v-for="correccion in correcciones"
              :key="correccion"
            >
              <template v-slot:header>
                <q-item-section avatar v-if="!isVisualizar">
                  <q-checkbox
                    v-model="correccion.selection"
                    val="teal"
                    color="pink"
                  />
                </q-item-section>
                <q-item-section avatar v-if="observacion.publicadas == true">
                  <q-icon
                    :name="
                      correccion.publico == 'true' ||
                      correccion.publico == 'True'
                        ? 'done'
                        : 'cancel'
                    "
                    :color="
                      correccion.publico == 'true' ||
                      correccion.publico == 'True'
                        ? 'green'
                        : 'red'
                    "
                  />
                </q-item-section>
                <q-item-section> {{ correccion.rubro }} </q-item-section>
              </template>
              <q-card>
                <q-card-section v-if="correccion.tipo == 'observacion'">
                  <div class="text-bold text-subtitle2">Supuestos</div>
                  <q-list dense>
                    <q-item v-for="item in correccion.supuesto" :key="item">
                      <q-item-section> - {{ item }} </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section>
                  <div class="text-bold text-subtitle2">Dice:</div>
                  <q-list dense>
                    <q-item
                      v-if="
                        correccion.rubro != 'Identidad' &&
                        correccion.rubro != 'Formación académica'
                      "
                    >
                      <q-item-section> - {{ correccion.dice }} </q-item-section>
                    </q-item>
                    <q-item v-else-if="correccion.rubro == 'Identidad'">
                      <q-avatar v-if="candidato.url_Foto" rounded size="160px">
                        <q-img :src="candidato.url_Foto" />
                      </q-avatar>
                      <div v-else>Sin fotografía</div>
                    </q-item>
                    <q-item
                      v-else-if="
                        correccion.rubro == 'Formación académica' &&
                        correccion.dice !=
                          'La candidatura no proporcionó información'
                      "
                      v-for="formacion in correccion.dice"
                      :key="formacion"
                    >
                      <q-item-section class="text-justify">
                        - {{ formacion.formacion }}
                      </q-item-section>
                    </q-item>
                    <q-item v-else>
                      <q-item-section class="text-justify">
                        - {{ correcion.dice }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section
                  v-if="
                    correccion.debeDecir != undefined &&
                    correccion.tipo == 'observacion'
                  "
                >
                  <div class="text-bold text-subtitle2">Debe ser:</div>
                  <q-list
                    dense
                    v-if="correccion.rubro == 'Formación académica'"
                  >
                    <q-item v-for="item in correccion.debeDecir" :key="item">
                      <q-item-section> - {{ item.formacion }} </q-item-section>
                    </q-item>
                  </q-list>

                  <q-list v-else dense>
                    <q-item>
                      <q-item-section>
                        - {{ correccion.debeDecir }}
                      </q-item-section>
                    </q-item>
                  </q-list></q-card-section
                >
              </q-card>
            </q-expansion-item>
            <q-separator />
          </q-list>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                :label="!isVisualizar ? 'Cancelar' : 'Cerrar'"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                v-if="!isVisualizar"
                type="submit"
                label="Aceptar"
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
import { useObservacionStore } from "src/stores/observacion-store";
import { watch, ref } from "vue";

//-----------------------------------------------------------------

const $q = useQuasar();
const observacionStore = useObservacionStore();
const candidatoStore = useCandidatosStore();
const { modal, observacion, correcion, aprobar, isVisualizar } =
  storeToRefs(observacionStore);
const {
  datos_Generales,
  list_Propuestas,
  list_Formacion_Academica,
  candidato,
} = storeToRefs(candidatoStore);
const correcciones = ref([]);
const todos = ref(false);

//-----------------------------------------------------------------

watch(modal, (val) => {
  if (val == true) {
    cargarData();
  }
});

watch(todos, (val) => {
  if (val == true) {
    correcciones.value.forEach((element) => {
      element.selection = true;
    });
  } else {
    correcciones.value.forEach((element) => {
      element.selection = false;
    });
  }
});

const actualizarModal = (valor) => {
  todos.value = false;
  observacionStore.initAprobar();
  observacionStore.actualizarModal(valor);
  observacionStore.initObservacion();
  observacionStore.initCorreccion();
  observacionStore.actualizarTabla(true);
};

const agregarCorreccion = (
  tipo,
  rubro,
  supuestos,
  decia,
  debeDecir,
  publico
) => {
  if (tipo == "correcion") {
    correcciones.value.push({
      tipo: tipo,
      selection: false,
      rubro: rubro,
      dice: decia,
    });
  } else {
    if (
      supuestos != null &&
      supuestos != "" &&
      observacion.value.publicadas == false
    ) {
      correcciones.value.push({
        tipo: tipo,
        selection: false,
        rubro: rubro,
        supuesto: supuestos.split("||")[0].split("|"),
        dice: decia,
        debeDecir: debeDecir,
      });
    } else {
      correcciones.value.push({
        tipo: tipo,
        selection: false,
        rubro: rubro,
        supuesto: supuestos.split("||")[0].split("|"),
        dice: decia,
        debeDecir: debeDecir,
        publico: publico,
      });
    }
  }
};

const cargarData = async () => {
  correcciones.value = [];
  if (correcion.value.id != null) {
    if (correcion.value.identidad == true) {
      agregarCorreccion("correcion", "Identidad", "", "Identidad");
    }
    if (correcion.value.propuesta_1 == true) {
      agregarCorreccion(
        "correcion",
        "Propuesta 1",
        "",
        list_Propuestas.value.length == 0
          ? "La candidatura no proporcionó información"
          : list_Propuestas.value[0].propuesta
      );
    }
    if (correcion.value.propuesta_2 == true) {
      agregarCorreccion(
        "correcion",
        "Propuesta 2",
        "",
        list_Propuestas.value.length == 1 || list_Propuestas.value.length == 0
          ? "La candidatura no proporcionó información"
          : list_Propuestas.value[1].propuesta
      );
    }
    if (correcion.value.genero == true) {
      agregarCorreccion(
        "correcion",
        "Género",
        "",
        datos_Generales.value.propuesta_Genero == null
          ? "La candidatura no proporcionó información"
          : datos_Generales.value.propuesta_Genero
      );
    }

    if (correcion.value.trayectoria == true) {
      agregarCorreccion(
        "correcion",
        "Trayectoria",
        "",
        datos_Generales.value.trayectoria == null
          ? "La candidatura no proporcionó información"
          : datos_Generales.value.trayectoria
      );
    }
    if (correcion.value.historia_Profesional == true) {
      agregarCorreccion(
        "correcion",
        "Historia profesional y/o laboral",
        "",
        datos_Generales.value.historia_Laboral == null
          ? "La candidatura no proporcionó información"
          : datos_Generales.value.historia_Laboral
      );
    }
    if (correcion.value.motivo_Cargo_Publico == true) {
      agregarCorreccion(
        "correcion",
        "Motivo de cargo público",
        "",
        datos_Generales.value.motivo_Cargo_Publico
      );
    }
    if (correcion.value.formacion == true) {
      agregarCorreccion(
        "correcion",
        "Formación académica",
        "",
        list_Formacion_Academica.value.length == 0
          ? "La candidatura no proporcionó información"
          : list_Formacion_Academica.value
      );
    }
  } else if (
    observacion.value.id != null &&
    observacion.value.validadas == true &&
    observacion.value.publicadas == false
  ) {
    if (observacion.value.informacion_Pausada.includes("Identidad")) {
      agregarCorreccion(
        "observacion",
        "Identidad",
        observacion.value.identidad,
        "Rubro identidad",
        "Actualizo en rubro Identidad"
      );
    }
    if (observacion.value.informacion_Pausada.includes("Propuesta_1")) {
      agregarCorreccion(
        "observacion",
        "Propuesta 1",
        observacion.value.propuesta_1,
        list_Propuestas.value.length == 0
          ? "La candidatura no proporcionó información"
          : observacion.value.propuesta_1.split("||")[1],
        observacion.value.propuesta_1.split("||")[2]
      );
    }
    if (observacion.value.informacion_Pausada.includes("Propuesta_2")) {
      agregarCorreccion(
        "observacion",
        "Propuesta 2",
        observacion.value.propuesta_2,
        list_Propuestas.value.length == 1 || list_Propuestas.value.length == 0
          ? "La candidatura no proporcionó información"
          : observacion.value.propuesta_2.split("||")[1],
        observacion.value.propuesta_2.split("||")[2]
      );
    }
    if (observacion.value.informacion_Pausada.includes("Genero")) {
      agregarCorreccion(
        "observacion",
        "Género",
        observacion.value.genero,
        datos_Generales.value.propuesta_Genero == null
          ? "La candidatura no proporcionó información"
          : observacion.value.genero.split("||")[1],
        observacion.value.genero.split("||")[2]
      );
    }
    if (observacion.value.informacion_Pausada.includes("Trayectoria")) {
      agregarCorreccion(
        "observacion",
        "Trayectoria",
        observacion.value.trayectoria,
        datos_Generales.value.trayectoria == null
          ? "La candidatura no proporcionó información"
          : observacion.value.trayectoria.split("||")[1],
        observacion.value.trayectoria.split("||")[2]
      );
    }
    if (observacion.value.informacion_Pausada.includes("Historia")) {
      agregarCorreccion(
        "observacion",
        "Historia profesional y/o laboral",
        observacion.value.historia_Profesional,
        datos_Generales.value.historia_Laboral == null
          ? "La candidatura no proporcionó información"
          : observacion.value.historia_Profesional.split("||")[1],
        observacion.value.historia_Profesional.split("||")[2]
      );
    }
    if (
      observacion.value.informacion_Pausada.includes("Motivo_Cargo_Publico")
    ) {
      agregarCorreccion(
        "observacion",
        "Motivo de cargo público",
        observacion.value.motivo_Cargo_Publico,
        datos_Generales.value.motivo_Cargo_Publico == null
          ? "La candidatura no proporcionó información"
          : observacion.value.motivo_Cargo_Publico.split("||")[1],
        observacion.value.motivo_Cargo_Publico.split("||")[2]
      );
    }
    if (observacion.value.informacion_Pausada.includes("Formacion")) {
      agregarCorreccion(
        "observacion",
        "Formación académica",
        observacion.value.formacion,
        list_Formacion_Academica.value.length == 0
          ? "La candidatura no proporcionó información"
          : list_Formacion_Academica.value,
        list_Formacion_Academica.value
      );
    }
  } else if (observacion.value.id != null && !observacion.value.validadas) {
    if (observacion.value.faltantes.includes("Identidad")) {
      agregarCorreccion(
        "observacion",
        "Identidad",
        observacion.value.identidad,
        "Rubro identidad"
      );
    }
    if (observacion.value.faltantes.includes("Propuesta_1")) {
      agregarCorreccion(
        "observacion",
        "Propuesta 1",
        observacion.value.propuesta_1,
        list_Propuestas.value.length == 0
          ? "La candidatura no proporcionó información"
          : list_Propuestas.value[0].propuesta
      );
    }
    if (observacion.value.faltantes.includes("Propuesta_2")) {
      agregarCorreccion(
        "observacion",
        "Propuesta 2",
        observacion.value.propuesta_2,
        list_Propuestas.value.length == 1 || list_Propuestas.value.length == 0
          ? "La candidatura no proporcionó información"
          : list_Propuestas.value[1].propuesta
      );
    }
    if (observacion.value.faltantes.includes("Genero")) {
      agregarCorreccion(
        "observacion",
        "Género",
        observacion.value.genero,
        datos_Generales.value.propuesta_Genero == null
          ? "La candidatura no proporcionó información"
          : datos_Generales.value.propuesta_Genero
      );
    }
    if (observacion.value.faltantes.includes("Trayectoria")) {
      agregarCorreccion(
        "observacion",
        "Trayectoria",
        observacion.value.trayectoria,
        datos_Generales.value.trayectoria == null
          ? "La candidatura no proporcionó información"
          : datos_Generales.value.trayectoria
      );
    }
    if (observacion.value.faltantes.includes("Historia")) {
      agregarCorreccion(
        "observacion",
        "Historia profesional y/o laboral",
        observacion.value.historia_Profesional,
        datos_Generales.value.historia_Laboral == null
          ? "La candidatura no proporcionó información"
          : datos_Generales.value.historia_Laboral
      );
    }
    if (observacion.value.faltantes.includes("Motivo_Cargo_Publico")) {
      agregarCorreccion(
        "observacion",
        "Motivo de cargo público",
        observacion.value.motivo_Cargo_Publico,
        datos_Generales.value.motivo_Cargo_Publico == null
          ? "La candidatura no proporcionó información"
          : datos_Generales.value.motivo_Cargo_Publico
      );
    }
    if (observacion.value.faltantes.includes("Formacion")) {
      agregarCorreccion(
        "observacion",
        "Formación académica",
        observacion.value.formacion,
        list_Formacion_Academica.value.length == 0
          ? "La candidatura no proporcionó información"
          : list_Formacion_Academica.value
      );
    }
  } else if (
    observacion.value.id != null &&
    observacion.value.validadas == true &&
    observacion.value.publicadas == true
  ) {
    if (
      observacion.value.identidad != null &&
      observacion.value.informacion_Pausada != null &&
      observacion.value.informacion_Pausada.includes("Identidad")
    ) {
      agregarCorreccion(
        "observacion",
        "Identidad",
        observacion.value.identidad,
        "Rubro identidad",
        "Actualizo en rubro Identidad"
      );
    }

    if (observacion.value.propuesta_1 != null) {
      agregarCorreccion(
        "observacion",
        "Propuesta 1",
        observacion.value.propuesta_1,
        list_Propuestas.value.length == 0
          ? "La candidatura no proporcionó información"
          : observacion.value.propuesta_1.split("||")[1],
        observacion.value.propuesta_1.split("||")[2],
        observacion.value.propuesta_1.split("||")[3]
      );
    }
    if (observacion.value.propuesta_2 != null) {
      agregarCorreccion(
        "observacion",
        "Propuesta 2",
        observacion.value.propuesta_2,
        list_Propuestas.value.length == 1 || list_Propuestas.value.length == 0
          ? "La candidatura no proporcionó información"
          : observacion.value.propuesta_2.split("||")[1],
        observacion.value.propuesta_2.split("||")[2],
        observacion.value.propuesta_2.split("||")[3]
      );
    }
    if (observacion.value.genero != null) {
      agregarCorreccion(
        "observacion",
        "Género",
        observacion.value.genero,
        datos_Generales.value.propuesta_Genero == null
          ? "La candidatura no proporcionó información"
          : observacion.value.genero.split("||")[1],
        observacion.value.genero.split("||")[2],
        observacion.value.genero.split("||")[3]
      );
    }
    if (observacion.value.trayectoria != null) {
      agregarCorreccion(
        "observacion",
        "Trayectoria",
        observacion.value.trayectoria,
        datos_Generales.value.trayectoria == null
          ? "La candidatura no proporcionó información"
          : observacion.value.trayectoria.split("||")[1],
        observacion.value.trayectoria.split("||")[2],
        observacion.value.trayectoria.split("||")[3]
      );
    }

    if (observacion.value.motivo_Cargo_Publico != null) {
      agregarCorreccion(
        "observacion",
        "Motivo de cargo público",
        observacion.value.motivo_Cargo_Publico,
        datos_Generales.value.motivo_Cargo_Publico == null
          ? "La candidatura no proporcionó información"
          : observacion.value.motivo_Cargo_Publico.split("||")[1],
        observacion.value.motivo_Cargo_Publico.split("||")[2],
        observacion.value.motivo_Cargo_Publico.split("||")[3]
      );
    }
  }
};

const onSubmit = async () => {
  $q.loading.show();
  let resp = null;
  observacionStore.initAprobar();
  $q.dialog({
    title: "¿Esta seguro de aprobar?",
    message: "Verifica si la información es correcta.",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, Aceptar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    aprobar.value.aprobar_Rechazar = "Aprobar";
    const rubrosAprobados = {
      Identidad: "identidad",
      "Propuesta 1": "propuesta_1",
      "Propuesta 2": "propuesta_2",
      Género: "genero",
      Trayectoria: "trayectoria",
      "Historia profesional y/o laboral": "historia_Profesional",
      "Motivo de cargo público": "motivo_Cargo_Publico",
      "Formación académica": "formacion",
    };
    for (const item of correcciones.value) {
      const rubro = rubrosAprobados[item.rubro];
      if (rubro && item.selection) {
        aprobar.value[rubro] = item.selection;
      }
    }
    if (correcciones.value[0].tipo == "observacion") {
      if (!observacion.value.validadas) {
        resp = await observacionStore.aprobarObservacion(
          observacion.value.id,
          aprobar.value
        );
      } else if (
        observacion.value.validadas == true &&
        observacion.value.aplicadas == true
      ) {
        resp = await observacionStore.aprobarPublicacion(
          observacion.value.id,
          aprobar.value
        );
      }
    } else {
      resp = await observacionStore.aprobarSolicitudCorreccion(
        correcion.value.id,
        aprobar.value
      );
    }
    if (resp.success) {
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      observacionStore.actualizarTabla(true);
      actualizarModal(false);
    } else {
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
