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
      <div>
        <h3>Travel Times</h3>
        <p>
          This are the average travel times for all trips within the target
          area. Intersections and traffic is not considered here.
        </p>
        <p>
          Bike Travel Time:
          {{ Math.round(ResultsStore.bikeTravelTime * 100) / 100 }} min
        </p>
        <p>
          Car Travel Time:
          {{ Math.round(ResultsStore.carTravelTime * 100) / 100 }} min
        </p>
      </div>

      <!-- Scatter plot canvas -->
      <div>
        <h3>Pareto</h3>
        <canvas
          class="scatterPlotCanvas"
          ref="scatterPlotCanvas"
          height="350"
        ></canvas>
        <p>
          This plot shows the pareto frontier from the chosen linear
          formulation.
        </p>
      </div>

      <div>
        <h3>Distances per lane type</h3>
        <p>Km Bike lanes: 
          {{ Math.round(ResultsStore.kmBike * 100) / 100 }} km</p>
          <p>Km Car lanes: 
          {{ Math.round(ResultsStore.kmCar * 100) / 100 }} km </p>
      </div>

    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import { useResultsStore } from "../stores/algorithmResultsStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { userInputStore } from "../stores/userInputStore.js";
import { watch } from "vue";

export default {
  name: "Dashboard",

  setup() {
    const ResultsStore = useResultsStore();
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();

    watch(
      [() => ResultsStore.bikeTravelTime, () => ResultsStore.carTravelTime],
      ([newBikeTime, newCarTime], [oldBikeTime, oldCarTime]) => {
        //console.log("Bike travel time updated:", newBikeTime);
        //console.log("Car travel time updated:", newCarTime);
      }
    );

    watch(
      [() => ResultsStore.kmBike, () => ResultsStore.kmCar],
      ([newBikeTime, newCarTime], [oldBikeTime, oldCarTime]) => {
        //console.log("Bike travel time updated:", newBikeTime);
        //console.log("Car travel time updated:", newCarTime);
      }
    );

    return {
      ResultsStore,
      statusStore,
      inputStore,
    };
  },
  mounted() {
    this.createScatterPlot();
    watch(
      () => this.ResultsStore.paretoBikeTTArray,
      (newTime, oldTime) => {
        console.log("pareto bike time updated:");
        this.createScatterPlot();
      }
    );

    watch(
      () => this.ResultsStore.paretoCarTTArray,
      (newTime, oldTime) => {
        console.log("pareto car time updated:");
      }
    );
  },

  methods: {
    toggleDashboard() {
      this.statusStore.toggleDashboard();
    },

    createScatterPlot() {
      const canvas = this.$refs.scatterPlotCanvas;
      const ctx = canvas.getContext("2d");

      // Check if there's already a Chart instance on this canvas
      if (canvas.chart) {
        canvas.chart.destroy(); // Destroy the previous Chart instance
      }

      canvas.chart = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "integer Pareto",
              data: this.ResultsStore.paretoBikeTTArray.map(
                (bikeTime, index) => ({
                  x: bikeTime,
                  y: this.ResultsStore.paretoCarTTArray[index],
                })
              ),
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
                text: "Change in bike travel time [%]",
              },
            },
            y: {
              type: "linear",
              title: {
                display: true,
                text: "Increase in car travel time [%]",
              },
            },
          },
        },
      });
    },
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
  width: 400px;
}
.close-open {
  background-color: #e16ece;
}

.angle-div {
  z-index: 10;
  background-color: red;
}

.scatterPlotCanvas {
  margin-left: 30px;
  margin-right: 20px;
}
</style>
