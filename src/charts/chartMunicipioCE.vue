<template>
  <div class="flex-center">
    <apexchart
      height="300px"
      type="bar"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDasboardStore } from "src/stores/dasboard-store";
import { ref, defineProps, watch } from "vue";

//----------------------------------------------------------

const dasboardStore = useDasboardStore();
const { avanceCME } = storeToRefs(dasboardStore);
const props = defineProps({
  id: { type: Number, required: true },
  municipio: { type: String, required: true },
});
const items = ref(["DIP MR", "DIP RP", "PYS", "REG MR", "REG RP"]);
const series = ref([]);

const cargarCME = async () => {
  await dasboardStore.loadAvanceMunicipioCME(props.id);
  series.value = [
    {
      name: "Esperadas",
      data: [
        avanceCME.value.esperadas_Dip_MR,
        avanceCME.value.esperadas_Dip_RP,
        avanceCME.value.esperadas_PyS,
        avanceCME.value.esperadas_Reg_MR,
        avanceCME.value.esperadas_Reg_RP,
      ],
    },
    {
      name: "Capturadas",
      data: [
        avanceCME.value.capturadas_Dip_MR,
        avanceCME.value.capturadas_Dip_Rp,
        avanceCME.value.capturadas_PyS,
        avanceCME.value.capturadas_Reg_MR,
        avanceCME.value.capturadas_Reg_RP,
      ],
    },
  ];
};
cargarCME();

const options = {
  chart: {
    type: "bar",
    height: 350,
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
          filename: props.municipio,
          columnDelimiter: ",",
          dateFormatter(timestamp) {
            return new Date(timestamp).toDateString();
          },
        },
        svg: {
          filename: props.municipio,
        },
        png: {
          filename: props.municipio,
        },
      },
      autoSelected: "zoom",
    },
  },
  colors: ["#D0D6D5", "#76A5CF"],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: items.value,
  },
  yAxis: {
    min: 0,
    max: 100,
    title: "",
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "top",
    horizontalAlign: "center",
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val;
      },
    },
  },
};
</script>
