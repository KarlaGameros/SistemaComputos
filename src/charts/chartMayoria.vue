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
const series = [
  {
    data: [44, 55, 41, 40],
  },
];
var options = {
  title: {
    text: "Resultados",
    align: "center",
    style: {
      fontSize: "24px",
      color: "#838888",
    },
  },
  annotations: {
    points: [
      {
        x: "MC",
        seriesIndex: 0,
        label: {
          borderColor: "#775DD0",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#775DD0",
          },
          text: "1000",
        },
      },
    ],
  },
  chart: {
    height: 350,
    type: "bar",
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 2,
  },
  xaxis: {
    labels: {
      rotate: -45,
    },
    categories: ["JHHN", "MC", "MLN", "PRI"],
    tickPlacement: "on",
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "horizontal",
      shadeIntensity: 0.25,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 0.85,
      opacityTo: 0.85,
      stops: [50, 0, 100],
    },
  },
};
</script>

<style></style>
