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
import { ref } from "vue";

const items = ref(["DIP MR", "DIP RP", "PYS", "REG MR", "REG MR"]);
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

<style></style>
