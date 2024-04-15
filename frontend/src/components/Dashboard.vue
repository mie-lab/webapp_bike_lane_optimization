<template>
  <div class="dashboard-container">
    <div class="dashboard-navigation bg-darkgrey" @click="toggleDashboard">
      <i
        :class="
          statusStore.dashboard
            ? 'fa-solid fa-angle-right'
            : 'fa-solid fa-angle-left'
        "
      ></i>
    </div>
    <div v-show="statusStore.dashboard" class="dashboard-content bg-lightgrey">
      <h1 class="text-pink">Dashboard</h1>

      <h2 class="h2_override">
        {{ inputStore.projectName }} | {{ inputStore.runName }}
      </h2>
      <p>
        Bike Travel Time:
        {{ Math.round((ResultsStore.bikeTravelTime * 100) / 100) }} min
      </p>
      <p>
        Car Travel Time:
        {{ Math.round(ResultsStore.carTravelTime * 100) / 100 }} min
      </p>

      <!-- Scatter plot canvas -->
      <canvas ref="scatterPlotCanvas" width="400" height="400"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import { useResultsStore } from "../stores/algorithmResultsStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { userInputStore } from "../stores/userInputStore.js";
import { getPareto } from "../scripts/api.js";

export default {
  name: "Dashboard",

  setup() {
    const ResultsStore = useResultsStore();
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    return { ResultsStore, statusStore, inputStore };
  },
  methods: {
    toggleDashboard() {
      this.statusStore.toggleDashboard();
    },

    createScatterPlot() {
      const ResultsStore = useResultsStore();
      const ctx = this.$refs.scatterPlotCanvas.getContext("2d");

      // TODO, always update the plot when the data in the pinia store changes
      const bikeTimes = ResultsStore.paretoBikeTTArray;
      const carTimes = ResultsStore.paretoCarTTArray;

      new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "integer Pareto",
              data: bikeTimes.map((bikeTime, index) => ({
                x: bikeTime,
                y: carTimes[index],
              })),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "linear",
              position: "bottom",
              title: {
                display: true,
                text: "Bike Time",
              },
            },
            y: {
              type: "linear",
              title: {
                display: true,
                text: "Car Time",
              },
            },
          },
        },
      });
    },
  },
  mounted() {
    this.createScatterPlot();
  },

  data() {
    const statusStore = statusVariablesStore();
    return {
      dashboard: this.statusStore.dashboard,
    };
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  position: absolute;
  right: 0;
}

.dashboard-navigation {
  background-color: rgba(149, 149, 149, 0.5);
  height: 100%;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}

.dashboard-content {
  flex-grow: 1;
  width: 300px;
}
.close-open {
  background-color: #e16ece;
}

.angle-div {
  z-index: 10;
  background-color: red;
}
</style>
