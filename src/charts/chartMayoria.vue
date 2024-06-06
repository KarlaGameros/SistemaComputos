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
    colors.value = [];
    series.value = [];
    rellenarGrafica(val);
  }
});

//----------------------------------------------------------

const rellenarGrafica = () => {
  let categorias = [];
  let serie = [];
  datos_grafica.value.datos_Grafica.forEach((element) => {
    colors.value.push(element.color == "#FFFFFF" ? "#BEBCBC" : element.color);
    categorias.push(element.nombre);
    serie.push(element.votos);
  });
  series.value.push({
    data: serie,
  });
  let serieMayoria = datos_grafica.value.datos_Grafica.map(
    (element) => element.votos
  );
  let maxNumero = serieMayoria[0];
  let posicionMax = 0;
  for (let i = 1; i < serieMayoria.length; i++) {
    if (serie[i] > maxNumero) {
      maxNumero = serieMayoria[i];
      posicionMax = i;
    }
  }
  let categoriaDelMaximo = categorias[posicionMax];
  chartOptions.value = {
    grid: {
      row: {
        colors: ["#fff", "#f2f2f2"],
      },
    },
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
    annotations: {
      points: [
        {
          x: maxNumero != 0 ? categoriaDelMaximo : "-",
          seriesIndex: 0,
          label: {
            borderColor: "#775DD0",
            offsetY: 0,
            style: {
              color: "#fff",
              background: "#775DD0",
            },
            text: "Mayoría",
          },
        },
      ],
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
      tickPlacement: "on",
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
