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
