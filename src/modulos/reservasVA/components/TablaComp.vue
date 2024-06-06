<template>
  <template v-if="loading">
    <div class="q-pa-md">
      <div class="absolute-center">
        <q-spinner-cube color="blue-grey" size="10.5em" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="q-pa-lg">
      <q-banner
        inline-actions
        :class="$q.dark.isActive ? 'text-justify' : 'bg-white'"
        style="border-radius: 20px"
      >
        <q-btn
          v-for="tipo in list_Tipo_Elecciones"
          :key="tipo"
          @click="set_tipo_eleccion(tipo)"
          :flat="tipo.siglas != eleccion"
          rounded
          icon="how_to_vote"
          color="blue-grey"
          :label="tipo.nombre"
        />
      </q-banner>
      <div class="q-pt-md">
        <q-card>
          <q-table
            :rows="list_reservas_va"
            :columns="columns"
            :visible-columns="visible_columns"
            :filter="filter"
            row-key="name"
            v-model:pagination="pagination"
            color="pink"
          >
            <template v-slot:top-right>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filter"
                placeholder="Buscar"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <div v-if="col.name === 'id'">
                    <q-btn
                      v-if="modulo == null ? false : modulo.registrar"
                      flat
                      round
                      color="pink"
                      icon="edit_square"
                      @click="recuentoAlert(props.row)"
                    >
                      <q-tooltip>Capturar resultados</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="modulo == null ? false : modulo.registrar"
                      flat
                      round
                      color="pink"
                      icon="undo"
                      @click="quitarReserva(col.value)"
                    >
                      <q-tooltip>Quitar reserva</q-tooltip>
                    </q-btn>
                  </div>

                  <label v-else>{{ col.value }}</label>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <ModalComp :eleccion="eleccion" />
        </q-card>
      </div>
    </div>
  </template>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { storeToRefs } from "pinia";
import { useRerservasStore } from "src/stores/reservas-store";
import { useAuthStore } from "src/stores/auth-store";
import { useQuasar, QSpinnerCube } from "quasar";
import ModalComp from "../components/ModalComp.vue";
import Swal from "sweetalert2";

//-----------------------------------------------------------

const $q = useQuasar();
const configuracionStore = useConfiguracionStore();
const reservasStore = useRerservasStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { list_Tipo_Elecciones } = storeToRefs(configuracionStore);
const { cargar, list_reservas_va, encabezado } = storeToRefs(reservasStore);
const eleccion = ref("DIP");
const tipo_eleccion_id = ref(null);
const loading = ref(false);
const casilla_Id = ref(null);
const votos_Reservados = ref(null);
const grupo_Trabajo = ref(null);
const punto_Recuento = ref(null);
const tipo_Computo = ref(null);
const siglas = "SC-RES-VA";
const visible_columns = ref([
  "usuario",
  "municipio",
  "distrito",
  "listado_Nominal",
  "id",
]);
const filter = ref("");
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
});
const columns = [
  {
    name: "usuario",
    align: "center",
    label: "Usuario",
    field: "usuario",
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
    name: "distrito",
    align: "center",
    label: "Distrito",
    field: "distrito",
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
    name: "listado_Nominal",
    align: "center",
    label: "Listado nominal",
    field: "listado_Nominal",
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

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
  cargarData();
});

watch(cargar, (val) => {
  if (val == true) {
    cargarData();
  }
});

//-----------------------------------------------------------

const evalua_columnas = () => {
  switch (eleccion.value) {
    case "DIP":
      visible_columns.value = [
        "usuario",
        "municipio",
        "distrito",
        "listado_Nominal",
        "id",
      ];
      break;
    case "PYS":
      visible_columns.value = ["usuario", "municipio", "listado_Nominal", "id"];
      break;
    case "REG":
      visible_columns.value = [
        "usuario",
        "municipio",
        "demarcacion",
        "listado_Nominal",
        "id",
      ];
      break;
  }
};

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const cargarData = async () => {
  loading.value = true;
  await configuracionStore.loadTipoElecciones();
  tipo_eleccion_id.value = list_Tipo_Elecciones.value[0].id;
  await reservasStore.load_reservas_va(tipo_eleccion_id.value);
  loading.value = false;
};

const set_tipo_eleccion = async (tipo) => {
  loading.value = true;
  eleccion.value = tipo.siglas;
  tipo_eleccion_id.value = tipo.id;
  evalua_columnas();
  await reservasStore.load_reservas_va(tipo_eleccion_id.value);
  loading.value = false;
};

const limpiar = () => {
  casilla_Id.value = null;
  votos_Reservados.value = null;
  grupo_Trabajo.value = null;
  punto_Recuento.value = null;
  tipo_Computo.value = null;
};

const recuentoAlert = (row) => {
  limpiar();
  reservasStore.initEncabezado();
  encabezado.value.distrito = row.distrito;
  encabezado.value.municipio = row.municipio;
  encabezado.value.demarcacion = row.demarcacion;
  encabezado.value.eleccion =
    eleccion.value == "DIP"
      ? "Diputaciones"
      : eleccion.value == "PYS"
      ? "Presidencias y Sindicaturas"
      : "Regidurías";
  casilla_Id.value = row.casilla_Id;
  Swal.fire({
    padding: "30px",
    title: "Votos Reservados Voto Anticipado",
    input: "number",
    inputLabel: `Ingrese la cantidad de votos reservados de la elección de ${
      eleccion.value == "DIP"
        ? "Diputaciones"
        : eleccion.value == "PYS"
        ? "Presidencias y Sindicaturas"
        : "Regidurías"
    }.`,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i> `,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value != "") {
          votos_Reservados.value = value;
          resolve();
        } else {
          resolve("Campo vacio");
        }
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      tipoComputoAlert(row);
    }
  });
};

const tipoComputoAlert = (row) => {
  Swal.fire({
    title: "Tipo de cómputo",
    input: "select",
    inputOptions: {
      cotejo: "Cotejo",
      recuento_Parcial: "Recuento parcial",
      recuento_Total: "Recuento total",
    },
    inputPlaceholder: "Selecciona una opción",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i>`,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value != "") {
          tipo_Computo.value =
            value == "cotejo" ? 1 : value == "recuento_Parcial" ? 2 : 3;
          resolve();
        } else {
          resolve("Se necesita seleccionar una opción:)");
        }
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (tipo_Computo.value == 1) {
        resumen(row);
      } else {
        grupoTrabajoAlert(row);
      }
    }
  });
};

const grupoTrabajoAlert = (row) => {
  Swal.fire({
    title: "Grupo de trabajo",
    input: "number",
    inputLabel: "Ingresa el número de grupo de trabajo",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i> `,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value != "") {
          grupo_Trabajo.value = value;
          resolve();
        } else {
          resolve("Campo vacio");
        }
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      puntoRecuentoAlert(row);
    }
  });
};

const puntoRecuentoAlert = (row) => {
  Swal.fire({
    title: "Punto de recuento",
    input: "number",
    inputLabel: "Ingresa el número de punto de recuento",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Siguiente&nbsp;<i class="fa fa-arrow-right"></i> `,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value != "") {
          punto_Recuento.value = value;
          resolve();
        } else {
          resolve("Campo vacio");
        }
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      resumen(row);
    }
  });
};

const resumen = (row) => {
  Swal.fire({
    title: "Resumen",
    html:
      tipo_Computo.value == "1"
        ? `Votos reservados: <b>${votos_Reservados.value}</b>
    <br /> `
        : `Votos reservados: <b>${votos_Reservados.value}</b>
    <br />
    Grupo de trabajo: <b>${grupo_Trabajo.value}</b>
    <br />
    Punto de recuento: <b>${punto_Recuento.value}</b>`,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Iniciar captura&nbsp;<i class="fa fa-arrow-right"></i>`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      $q.loading.show({
        spinner: QSpinnerCube,
        spinnerColor: "blue-grey",
        spinnerSize: 140,
        backgroundColor: "purple-2",
        message: "Espere un momento por favor...",
        messageColor: "black",
      });
      await reservasStore.incicializar_resultados_va(
        row.id,
        tipo_Computo.value,
        grupo_Trabajo.value == null ? 0 : grupo_Trabajo.value,
        punto_Recuento.value == null ? 0 : punto_Recuento.value,
        votos_Reservados.value == null ? 0 : votos_Reservados.value
      );
      reservasStore.actualizarModalVa(true);
      $q.loading.hide();
    } else if (result.isDenied) {
      Swal.fire("Los datos capturados no se guardarán", "", "info");
    }
  });
};

const quitarReserva = async (id) => {
  Swal.fire({
    title: "Quitar reserva",
    text: "¿Está seguro de quitar la reserva?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, quitar!",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      $q.loading.show({
        spinner: QSpinnerCube,
        spinnerColor: "blue-grey",
        spinnerSize: 140,
        backgroundColor: "purple-2",
        message: "Espere un momento por favor...",
        messageColor: "black",
      });
      let resp = null;
      resp = await reservasStore.quitarReservaVA(id);
      if (resp.success) {
        $q.loading.hide();
        Swal.fire({
          icon: "success",
          title: resp.data,
          showConfirmButton: false,
          timer: 1500,
        });
        await reservasStore.load_reservas_va(tipo_eleccion_id.value);
      } else {
        $q.loading.hide();
        $q.notify({
          position: "top-right",
          type: "negative",
          message: resp.data,
        });
      }
    }
  });
};
</script>
