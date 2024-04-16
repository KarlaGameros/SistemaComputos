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

const mayoriaStore = useMayoriaStore();
const { datos_grafica } = storeToRefs(mayoriaStore);

const series = ref([]);
const chartOptions = ref(null);
const colors = ref([]);

watch(datos_grafica.value, (val) => {
  if (val != null) {
    series.value = [];
    rellenarGrafica(val);
  }
});

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
      events: {
        click: function (chart, w, e) {
          // console.log(chart, w, e)
        },
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

<style></style>
