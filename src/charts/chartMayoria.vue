<template>
  <div class="flex-center">
    <div id="chart">
      <apexchart
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { watch, ref } from "vue";
import { useMayoriaStore } from "../stores/mayoria-store";

//----------------------------------------------------------

const mayoriaStore = useMayoriaStore();
const { datos_grafica } = storeToRefs(mayoriaStore);
const series = ref([]);
const chartOptions = ref(null);
const colors = ref([]);

//----------------------------------------------------------

watch(datos_grafica.value, (val) => {
  if (val != null) {
    series.value = [];
    rellenarGrafica(val);
  }
});

//----------------------------------------------------------

const rellenarGrafica = () => {
  let categorias = [];
  let serie = [];
  datos_grafica.value.datos_Grafica.forEach((element) => {
    colors.value.push(element.color);
    categorias.push([element.nombre]);
    serie.push(element.votos);
  });
  series.value.push({
    data: serie,
  });

  chartOptions.value = {
    chart: {
      height: 350,
      type: "bar",
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
            filename: "Mayoría",
            columnDelimiter: ",",
            headerCategory: "Actor político",
            headerValue: "Cantidad",
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString();
            },
          },
          svg: {
            filename: "Mayoría",
          },
          png: {
            filename: "Mayoría",
          },
        },
        autoSelected: "zoom",
      },
    },
    colors: colors.value,
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: categorias,
      labels: {
        style: {
          colors: colors,
          fontSize: "12px",
        },
      },
    },
  };
};

rellenarGrafica();
</script>
