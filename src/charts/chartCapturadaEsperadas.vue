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
const series = [44, 55];
const options = {
  chart: {
    type: "donut",
  },
  colors: ["#76A5CF", "#D0D6D5"],
  labels: ["Capturados", "Pendientes"],
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
    height: 230,
  },
};
</script>
