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

      <!-- Travel times -->
      <div>
        <h3>Travel Times Changes</h3>
        <p>
          This is the relative change of travel times for the chosen run.
        </p>
        <p>
          Bike Travel Time:
          {{ Math.round(ResultsStore.paretoBikeTTArray[ResultsStore.paretoBikeTTArray.length - 1] *100) /100}} %
        </p>
        <p>
          Car Travel Time:
          {{ Math.round(ResultsStore.paretoCarTTArray[ResultsStore.paretoCarTTArray.length - 1]*100) /100 }} %
        </p>
        <canvas
          class="barChart"
          ref="barChart"
          height="150"
        ></canvas>
      </div>

      <!-- Pareto -->
      <div>
        <h3>Pareto</h3>
        <p>
          This plot shows the pareto frontier from the chosen linear
          formulation.
        </p>
        <canvas
          class="scatterPlotCanvas"
          ref="scatterPlotCanvas"
          height="200"
        ></canvas>
      </div>

      <div>
        <h3>Distances per lane type</h3>
        <p>Km Bike lanes: 
          {{ Math.round(ResultsStore.kmBike * 100) / 100 }} km</p>
          <p>Km Car lanes: 
          {{ Math.round(ResultsStore.kmCar * 100) / 100 }} km </p>
          <div class="pieChartContainer">
            <canvas
            class="pieChart"
            ref="pieChart"
            height="50"
          ></canvas>
          </div>
          

      </div>

    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import 'chartjs-plugin-datalabels';
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

    return {
      ResultsStore,
      statusStore,
      inputStore,
    };
  },

  mounted() {
    this.createScatterPlot();
    this.createPieChart();
    this.createBarChart();



    watch(
      () => this.ResultsStore.paretoBikeTTArray,
      (newTime, oldTime) => {
        this.createScatterPlot();
        this.createBarChart();
      }
    );

    watch(
      () => this.ResultsStore.paretoCarTTArray,
      (newTime, oldTime) => {
      }
    );
    watch(
      [() => this.ResultsStore.kmBike, () => this.ResultsStore.kmCar],
      ([newBikeTime, newCarTime], [oldBikeTime, oldCarTime]) => {
        this.createPieChart();

      }
    );
  },

  methods: {
    toggleDashboard() {
      this.statusStore.toggleDashboard();
    },

    createPieChart(){

      const canvas = this.$refs.pieChart;
      const ctx = canvas.getContext("2d");

      // Check if there's already a Chart instance on this canvas
      if (canvas.chart) {
        canvas.chart.destroy(); // Destroy the previous Chart instance
      }

      const pinkColor = getComputedStyle(document.documentElement).getPropertyValue('--pinkTransparent-color');
      const pinkHoverColor = getComputedStyle(document.documentElement).getPropertyValue('--pink-color');
      const blueColor = getComputedStyle(document.documentElement).getPropertyValue('--blue-color');

      canvas.chart =new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Bike", "Car"],
          datasets: [{
            label: "Distances per lane type [km]",
            backgroundColor: [pinkColor, blueColor],
            data: [this.ResultsStore.kmBike,this.ResultsStore.kmCar]
          }]
        },
        options: {
          title: {
            display: true,
            rotation: -90,
            circumference: 180,
            cutout:'70%',
          }
        }
      });
    },


    createBarChart(){

      const canvas = this.$refs.barChart;
      const ctx = canvas.getContext("2d");

      // Check if there's already a Chart instance on this canvas
      if (canvas.chart) {
        canvas.chart.destroy(); // Destroy the previous Chart instance
      }
      // get proper colors
      const pinkColor = getComputedStyle(document.documentElement).getPropertyValue('--pinkTransparent-color');
      const blueColor = getComputedStyle(document.documentElement).getPropertyValue('--blue-color');


      const relativeBikeTTChange = Math.round(this.ResultsStore.paretoBikeTTArray[this.ResultsStore.paretoBikeTTArray.length - 1] *100) /100;
      const relativeCarTTChange = Math.round(this.ResultsStore.paretoCarTTArray[this.ResultsStore.paretoCarTTArray.length - 1] *100) /100;


      canvas.chart =new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["Bike", "Car"],
          datasets: [{
            label: "Change in travel time per type [%]",
            backgroundColor: [pinkColor, blueColor],
            data: [Math.abs(relativeBikeTTChange),Math.abs(relativeCarTTChange)]
          }]
        },
        options: {
          scales: {
            x: {
              beginAtZero: true 
            }
          },
          indexAxis: 'x', 
          
        },
        plugins: {
        datalabels: {
          anchor: 'center',
          align: 'center'
        }
      }
      });
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

.scatterPlotCanvas, .barChart, .pieChart {
  margin-left: 30px;
  margin-right: 30px;
  align-content: center;
}

.pieChartContainer{
  width: 70%;
  margin: 0 auto; 
  align-content: center;
  display: flex;
  justify-content: center;
  align-items: center;
  
}



</style>
