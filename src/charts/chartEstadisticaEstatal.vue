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
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { storeToRefs } from "pinia";
import { onMounted, watch, ref } from "vue";

//----------------------------------------------------------

const configuracionStore = useConfiguracionStore();
const { list_Municipios } = storeToRefs(configuracionStore);
const category = ref([]);
const series = ref([]);

//----------------------------------------------------------

onMounted(() => {
  rellenarGrafica();
});

//----------------------------------------------------------

watch(list_Municipios, (val) => {
  series.value = [];
  if (val.length > 0) {
    rellenarGrafica();
  }
});

//----------------------------------------------------------

const rellenarGrafica = () => {
  if (category.value.length == 0) {
    list_Municipios.value.forEach((x) => category.value.push(x.label));
  }
  series.value.push(
    {
      name: "DIP MR",
      data: [44, 55],
    },
    {
      name: "DIP RP",
      data: [],
    },
    {
      name: "PYS",
      data: [35],
    },
    {
      name: "REG MR",
      data: [],
    },
    {
      name: "REG RP",
      data: [35, 41],
    }
  );
};

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
    categories: category.value,
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
