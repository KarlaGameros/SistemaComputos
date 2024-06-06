<template>
  <div class="flex-center">
    <apexchart
      height="230px"
      type="donut"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDasboardStore } from "src/stores/dasboard-store";
import { onBeforeMount, defineProps, ref } from "vue";

//----------------------------------------------------------

const dashboardStore = useDasboardStore();
const { avanceEstatal } = storeToRefs(dashboardStore);
const props = defineProps({
  tipo: { type: String, required: true },
});
const series = ref([]);

//----------------------------------------------------------

onBeforeMount(() => {
  cargarGrafica();
});

//----------------------------------------------------------

const cargarGrafica = () => {
  series.value = [];
  if (props.tipo == "DIP MR") {
    series.value = [
      avanceEstatal.value.esperadas_Dip_MR,
      avanceEstatal.value.capturadas_Dip_MR,
    ];
  } else if (props.tipo == "DIP RP") {
    series.value = [
      avanceEstatal.value.esperadas_Dip_RP,
      avanceEstatal.value.capturadas_Dip_Rp,
    ];
  } else if (props.tipo == "PYS") {
    series.value = [
      avanceEstatal.value.esperadas_PyS,
      avanceEstatal.value.capturadas_PyS,
    ];
  } else if (props.tipo == "REG MR") {
    series.value = [
      avanceEstatal.value.esperadas_Reg_MR,
      avanceEstatal.value.capturadas_Reg_MR,
    ];
  } else if (props.tipo == "REG RP") {
    series.value = [
      avanceEstatal.value.esperadas_Reg_RP,
      avanceEstatal.value.capturadas_Reg_RP,
    ];
  } else if (props.tipo == "VA") {
    series.value = [
      avanceEstatal.value.esperadas_VA,
      avanceEstatal.value.capturadas_VA,
    ];
  }
};

cargarGrafica();
const options = {
  chart: {
    type: "donut",
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true | '<img src="/static/icons/reset.png" width="20">',
        customIcons: [],
      },
      export: {
        csv: {
          filename: "Actas esperadas vs Actas capturadas",
          columnDelimiter: ",",
          headerCategory: "Municipio",
          headerValue: "Cantidad",
          dateFormatter(timestamp) {
            return new Date(timestamp).toDateString();
          },
        },
        svg: {
          filename: "Actas esperadas vs Actas capturadas",
        },
        png: {
          filename: "Actas esperadas vs Actas capturadas",
        },
      },
      autoSelected: "zoom",
    },
  },
  colors: ["#D0D6D5", "#76A5CF"],
  labels: ["Esperadas", "Capturados"],
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },

        legend: {
          position: "bottom",
        },
      },
    },
  ],
  legend: {
    position: "left",
    offsetY: 0,
  },
};
</script>
