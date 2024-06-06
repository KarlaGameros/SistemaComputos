<template>
  <div class="flex-center">
    <apexchart
      height="500px"
      type="bar"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useDasboardStore } from "src/stores/dasboard-store";

//----------------------------------------------------------

const dasboardStore = useDasboardStore();
const { avance } = storeToRefs(dasboardStore);
const category = ref([]);
const series = ref([]);

//----------------------------------------------------------

onMounted(() => {
  rellenarGrafica();
});

//----------------------------------------------------------

const rellenarGrafica = () => {
  series.value = [];
  category.value = [];
  series.value = [
    {
      name: "DIP MR",
      data: Object.values(avance.value.general_Diputaciones),
    },
    {
      name: "DIP RP",
      data: Object.values(avance.value.general_Diputaciones_RP),
    },
    {
      name: "PYS",
      data: Object.values(avance.value.general_PyS),
    },
    {
      name: "REG MR",
      data: Object.values(avance.value.general_Regidurias),
    },
    {
      name: "REG RP",
      data: Object.values(avance.value.general_Regidurias_RP),
    },
  ];
};
rellenarGrafica();
const options = {
  title: {
    text: "Estadístico estatal",
    align: "left",
    style: {
      fontSize: "20px",
      color: "#838888",
    },
  },
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
          filename: "EstadisticaEstatal",
          columnDelimiter: ",",
          headerCategory: "Municipio",
          headerValue: "Cantidad",
          dateFormatter(timestamp) {
            return new Date(timestamp).toDateString();
          },
        },
        svg: {
          filename: "EstadisticaEstatal",
        },
        png: {
          filename: "EstadisticaEstatal",
        },
      },
      autoSelected: "zoom",
    },
  },
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
    categories: Object.values(avance.value.municipios.map((x) => x.nombre)),
  },
  yaxis: {
    max: 100,
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
