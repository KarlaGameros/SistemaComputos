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
import { ref, defineProps } from "vue";

//----------------------------------------------------------

const props = defineProps({
  municipio: { type: String, required: true },
});
const items = ref(["DIP MR", "DIP RP", "PYS", "REG MR", "REG RP"]);
const series = [
  {
    name: "Esperadas",
    data: [44, 55, 57, 56, 61],
  },
  {
    name: "Capturadas",
    data: [76, 85, 101, 98, 87],
  },
];

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
