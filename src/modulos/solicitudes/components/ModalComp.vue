<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-blue-grey-1" style="width: auto; max-width: 200vw">
      <div class="flotante">
        <div class="row bg-blue-grey-3 text-bold q-pl-md">
          <div class="text-h6">
            Resultados de la sección {{ resultado_casilla.seccion }} de la
            casilla {{ resultado_casilla.casilla }} de la elección a
            {{
              resultado_casilla.eleccion == "DIP"
                ? "Diputaciones"
                : resultado_casilla.eleccion == "PYS"
                ? "Presidencias y Sindicaturas"
                : "Regidurías"
            }}.
            {{
              resultado_casilla.eleccion == "DIP"
                ? `Municipio ${resultado_casilla.municipio} - Distrito ${resultado_casilla.distrito}`
                : resultado_casilla.eleccion == "REG" && props.rp == false
                ? `Municipio ${resultado_casilla.municipio} - ${resultado_casilla.demarcacion}`
                : `Municipio ${resultado_casilla.municipio}`
            }}
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
        </div>
        <div class="row bg-blue-grey-3 q-pl-md text-bold text-h6">
          Total de votos sistema: {{ resultados.encabezado.total_Sistema }}
        </div>
        <q-banner
          v-show="
            resultados.encabezado.total_Sistema !=
              resultados.encabezado.total_Votos ||
            resultados.encabezado.total_Votos > resultados.boletas
          "
          class="bg-red"
        >
          <template v-slot:avatar>
            <q-icon name="warning" color="white" />
          </template>
          <div class="text-white text-bold">
            {{
              resultados.encabezado.total_Sistema !=
              resultados.encabezado.total_Votos
                ? "El total de votos capturado es mayor al total de votos sistema"
                : "El total de votos es mayor al número de boletas entregadas"
            }}
          </div>
        </q-banner>
      </div>
      <br />
      <div class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6">
        Partidos políticos
      </div>
      <q-card-section>
        <br />
        <div class="row q-gutter-md q-pl-xl" style="margin: 20px">
          <q-card
            v-for="partido in resultados.partidos"
            :key="partido"
            style="border-radius: 8px"
            class="my-card text-center no-box-shadow"
          >
            <q-card-section>
              <q-avatar style="width: auto" square>
                <img :src="partido.logo_Url" :alt="partido.partido" />
              </q-avatar>
              <div class="text-grey-8 text-bold q-ma-sm">
                {{ partido.partido }}
              </div>
              <q-input
                class="text-h6"
                disable
                mask="###"
                dense
                input-class="text-right"
                v-model="partido.votos"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
      <div
        v-if="props.rp == false"
        class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6"
      >
        Coaliciones
      </div>
      <q-card-section v-if="props.rp == false">
        <br />
        <div class="row q-gutter-md q-pl-xl" style="margin: 20px">
          <q-card
            v-for="coalicion in resultados.coaliciones"
            :key="coalicion"
            style="border-radius: 8px"
            class="my-card text-center no-box-shadow"
          >
            <q-card-section>
              <q-avatar square style="width: auto">
                <img :src="coalicion.logo_Url" :alt="coalicion.combinacion" />
              </q-avatar>
              <div class="text-grey-8 text-bold q-pa-sm">
                {{ coalicion.combinacion }}
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                class="text-h6"
                disable
                mask="###"
                dense
                input-class="text-right"
                v-model="coalicion.votos"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
      <div class="bg-white q-pa-sm text-bold text-grey-8 text-center text-h6">
        Totales
      </div>
      <q-card-section class="row">
        <div class="col-lg-4 col-md-6 col-xs-6 q-pa-sm">
          <q-card
            style="border-radius: 8px"
            class="my-card text-center no-box-shadow"
          >
            <q-card-section>
              <div class="text-h6 text-bold text-grey-8">
                Candidatos no registrados
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                class="text-h6"
                disable
                mask="###"
                dense
                input-class="text-right"
                v-model="
                  resultados.encabezado.total_Votos_Candidatos_No_Registrados
                "
              />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-4 col-md-6 col-xs-6 q-pa-sm">
          <q-card
            style="border-radius: 8px"
            class="my-card text-center no-box-shadow"
          >
            <q-card-section>
              <div class="text-h6 text-bold text-grey-8">Votos nulos</div>
            </q-card-section>
            <q-card-section>
              <q-input
                class="text-h6"
                disable
                v-model="resultados.encabezado.total_Votos_Nulos"
                mask="###"
                placeholder="0"
                dense
                input-class="text-right"
              />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-4 col-md-6 col-xs-6 q-pa-sm">
          <q-card
            style="border-radius: 8px"
            class="my-card text-center no-box-shadow"
          >
            <q-card-section>
              <div class="text-h6 text-bold text-grey-8">Total votos</div>
            </q-card-section>
            <q-card-section>
              <q-input
                class="text-h6"
                disable
                v-model="resultados.encabezado.total_Votos"
                mask="###"
                placeholder="0"
                dense
                input-class="text-right"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="col-12 justify-end">
          <div class="text-right q-gutter-xs">
            <q-btn
              icon-right="cancel"
              label="Cancelar"
              color="red"
              @click="actualizarModal(false)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { defineProps } from "vue";
import { useCasillaStore } from "src/stores/casilla-store";
import { useSolicitudesStore } from "src/stores/solicitudes-store";

//----------------------------------------------------------

const $q = useQuasar();
const casillaStore = useCasillaStore();
const solicitudesStore = useSolicitudesStore();
const { resultados, resultado_casilla } = storeToRefs(casillaStore);
const { modal } = storeToRefs(solicitudesStore);
const props = defineProps({
  eleccion: { type: String, required: true },
  rp: { type: Boolean, required: true },
});

//----------------------------------------------------------

const actualizarModal = (valor) => {
  casillaStore.initResultados();
  solicitudesStore.actualizarModal(valor);
};
</script>
<style scoped>
.flotante {
  position: sticky;
  top: 10px;
  z-index: 999;
}
</style>
