<template>
  <q-dialog
    v-model="modalCambiarRep"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 850px; max-width: 85vw">
      <q-form @submit="onSubmit">
        <q-card-section class="row">
          <div class="text-h6 text-bold">
            Registrar nueva representación de partido político
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
        <q-card-section class="row">
          <div class="col-lg-6 col-md-6 col-sm-12 q-pa-xs">
            <q-select
              filled
              color="pink"
              v-model="partido_Id"
              :options="list_Partidos_Politicos"
              label="Selecciona partido político"
              hint="Filtrar por partidos"
              lazy-rules
              :rules="[(val) => !!val || 'Es requerido']"
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
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 q-pa-xs">
            <q-select
              filled
              v-model="cargo_Id"
              :options="list_Cargo"
              label="Cargo"
              hint="Selecciona cargo"
              lazy-rules
              :rules="[(val) => !!val || 'Es requerido']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 q-pa-xs">
            <q-input
              filled
              v-model.trim="representacion.nombre_Completo"
              label="Nombre completo"
              hint="Nombre completo de la representación"
              lazy-rules
              :rules="[(val) => !!val || 'Es requerido']"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 q-pa-xs">
            <q-select
              filled
              v-model="sexo_Id"
              :options="list_Sexo"
              label="Sexo"
              hint="Selecciona sexo"
              lazy-rules
              :rules="[(val) => !!val || 'Es requerido']"
            />
          </div>
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
                label="Guardar"
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
import { onBeforeMount, ref } from "vue";
import { EncryptStorage } from "storage-encryption";
import Swal from "sweetalert2";

//-----------------------------------------------------------

const $q = useQuasar();
const consultaStore = useConsultaStore();
const configuracionStore = useConfiguracionStore();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const { modalCambiarRep, encabezado, representacion } =
  storeToRefs(consultaStore);
const { list_Partidos_Politicos } = storeToRefs(configuracionStore);
const partido_Id = ref(null);
const sexo_Id = ref(null);
const cargo_Id = ref(null);
const list_Cargo = ref([
  "Representante Propietaria Local",
  "Representante Propietario Local",
  "Representante Suplente Local",
]);
const list_Sexo = ref(["Mujer", "Hombre"]);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  partido_Id.value = null;
  sexo_Id.value = null;
  cargo_Id.value = null;
  consultaStore.initRepresentacion();
  consultaStore.actualizarModalCambiar(valor);
  consultaStore.actualizarModalPartidos(true);
};

const onSubmit = async () => {
  let resp = null;
  representacion.value.oficina_Id = parseInt(
    encryptStorage.decrypt("oficina_Id")
  );
  representacion.value.puesto = cargo_Id.value;
  representacion.value.sexo = sexo_Id.value;
  representacion.value.partido_Id = partido_Id.value.value;
  resp = await consultaStore.createNuevoRepresentante(representacion.value);
  if (resp.success) {
    $q.loading.hide();
    Swal.fire({
      icon: "success",
      title: resp.data,
      showConfirmButton: false,
      timer: 1500,
    });
    actualizarModal(false);
    await consultaStore.loadIntegracionPartidosPoliticos();
  } else {
    $q.loading.hide();
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
    });
  }
};
</script>
