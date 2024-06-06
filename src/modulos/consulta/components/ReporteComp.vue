<template>
  <div class="q-pt-md">
    <div v-if="consulta == true">
      <div
        :class="
          $q.dark.isActive
            ? 'col-12  text-h6 text-center text-bold'
            : 'col-12 bg-white text-h6 text-center text-bold'
        "
      >
        Resultados de la elección de
        {{
          encabezado.eleccion == "DIP"
            ? "Diputaciones"
            : encabezado.eleccion == "PYS"
            ? "Presidencias y Sindicaturas"
            : "Regidurías"
        }}
        {{ encabezado.eleccion != "PYS" ? encabezado.tipo_Candidatura : "" }}
        {{
          encabezado.eleccion == "DIP" && resultados.rp == false
            ? `-Distrito ${encabezado.distrito}`
            : encabezado.eleccion == "PYS"
            ? encabezado.municipio
            : encabezado.eleccion == "REG" && resultados.rp == false
            ? `-${encabezado.municipio} - ${encabezado.demarcacion}`
            : encabezado.municipio
        }}
      </div>
      <div class="row q-gutter-md q-pt-md" style="margin: 25px">
        <q-card
          style="width: 200px"
          v-for="partido in resultados.partidos"
          :key="partido"
          class="my-card text-center"
        >
          <q-card-section>
            <q-avatar style="width: auto" square>
              <img :src="partido.logo_Url" :alt="partido.partido" />
            </q-avatar>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle2 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              {{ partido.siglas }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              filled
              dense
              input-class="text-right text-bold text-subtitle1 "
              v-model="partido.votos"
            />
          </q-card-section>
        </q-card>
        <q-card
          style="width: 200px"
          v-for="partido in resultados.coaliciones"
          :key="partido"
          class="my-card text-center"
        >
          <q-card-section>
            <q-avatar style="width: 134px; height: 32px" square>
              <img :src="partido.logo_Url" :alt="partido.partido" />
            </q-avatar>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle2 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              {{ partido.siglas }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              filled
              dense
              input-class="text-right text-bold text-subtitle1"
              v-model="partido.votos"
            />
          </q-card-section>
        </q-card>
        <q-card style="width: 200px" class="my-card text-center">
          <q-card-section>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle1 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              Total no registradas
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="resultados.total_No_Registrados"
            />
          </q-card-section>
        </q-card>
        <q-card style="width: 200px" class="my-card text-center">
          <q-card-section>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle1 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              Total votos nulos
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="resultados.nulos"
            />
          </q-card-section>
        </q-card>
        <q-card style="width: 200px" class="my-card text-center">
          <q-card-section>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle1 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              Total votos
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="resultados.total_Votos"
            />
          </q-card-section>
        </q-card>
      </div>

      <!------------------------------------------------------------->
      <div
        v-if="resultados.partidos_Dist.length != 0"
        class="col-12 bg-white text-h6 text-center text-bold"
      >
        Distribución por partido político
      </div>
      <div
        v-if="resultados.partidos_Dist.length != 0"
        class="row q-gutter-md q-pt-md"
        style="margin: 25px"
      >
        <q-card
          style="width: 200px"
          v-for="partido in resultados.partidos_Dist"
          :key="partido"
          class="my-card text-center"
        >
          <q-card-section>
            <q-avatar style="width: auto" square>
              <img :src="partido.logo_Url" :alt="partido.partido" />
            </q-avatar>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle2 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              {{ partido.siglas }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="partido.votos"
            />
          </q-card-section>
        </q-card>
        <q-card style="width: 200px" class="my-card text-center">
          <q-card-section>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle1 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              Total no registradas
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="resultados.total_No_Registrados"
            />
          </q-card-section>
        </q-card>
        <q-card style="width: 200px" class="my-card text-center">
          <q-card-section>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle1 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              Total votos nulos
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="resultados.nulos"
            />
          </q-card-section>
        </q-card>
        <q-card style="width: 200px" class="my-card text-center">
          <q-card-section>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle1 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              Total votos
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="resultados.total_Votos"
            />
          </q-card-section>
        </q-card>
      </div>
      <!------------------------------------------------------------->
      <div
        v-if="
          resultados.coaliciones_Actor.length != 0 ||
          resultados.partidos_Actor.length != 0
        "
        class="col-12 bg-white text-h6 text-center text-bold"
      >
        Distribución por actor político
      </div>
      <div class="row q-gutter-md q-pt-md" style="margin: 25px">
        <q-card
          style="width: 200px"
          v-for="partido in resultados.coaliciones_Actor"
          :key="partido"
          class="my-card text-center"
        >
          <q-card-section>
            <q-avatar style="width: 134px; height: 32px" square>
              <img :src="partido.logo_Url" :alt="partido.partido" />
            </q-avatar>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle2 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              {{ partido.siglas }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="partido.votos"
            />
          </q-card-section>
        </q-card>
        <q-card
          style="width: 200px"
          v-for="partido in resultados.partidos_Actor"
          :key="partido"
          class="my-card text-center"
        >
          <q-card-section>
            <q-avatar style="width: auto" square>
              <img :src="partido.logo_Url" :alt="partido.partido" />
            </q-avatar>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle2 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              {{ partido.siglas }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="partido.votos"
            />
          </q-card-section>
        </q-card>
        <q-card
          v-if="!resultados.rp"
          style="width: 200px"
          class="my-card text-center"
        >
          <q-card-section>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle1 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              Total no registradas
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="resultados.total_No_Registrados"
            />
          </q-card-section>
        </q-card>
        <q-card
          v-if="!resultados.rp"
          style="width: 200px"
          class="my-card text-center"
        >
          <q-card-section>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle1 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              Total votos nulos
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="resultados.nulos"
            />
          </q-card-section>
        </q-card>
        <q-card
          v-if="!resultados.rp"
          style="width: 200px"
          class="my-card text-center"
        >
          <q-card-section>
            <div
              :class="
                $q.dark.isActive
                  ? 'text-subtitle1 text-bold'
                  : 'text-grey-8 text-subtitle2 text-bold'
              "
            >
              Total votos
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              disable
              input-class="text-right text-bold text-subtitle1"
              filled
              dense
              v-model="resultados.total_Votos"
            />
          </q-card-section>
        </q-card>
        <div class="col-12 justify-end q-pr-lg">
          <div class="text-right q-gutter-xs">
            <q-btn
              @click="descargarPdf(true)"
              label="Descargar PDF"
              outline
              class="q-ml-sm"
              icon="picture_as_pdf"
            />
          </div>
        </div>
      </div>
      <!------------------------------------------------------------->
    </div>
  </div>
</template>

<script setup>
import { useConsultaStore } from "src/stores/consulta-store";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

const consultaStore = useConsultaStore();
const { resultados, consulta, encabezado } = storeToRefs(consultaStore);

onMounted(() => {
  consulta.value = false;
});

const descargarPdf = async (valor) => {
  await consultaStore.loadIntegracionPartidosPoliticos();
  await consultaStore.loadIntegracionConsejerias();
  consultaStore.actualizarModalIntegracion(valor);
};
</script>
