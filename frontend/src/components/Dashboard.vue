<template>
  <div class="dashboard-container">
    <!-- Dashboard Navigation -->
    <div class="dashboard-navigation bg-darkgrey" @click="toggleDashboard">
      <i
        :class="
          statusStore.dashboard
            ? 'fa-solid fa-angle-right'
            : 'fa-solid fa-angle-left'
        "
      ></i>
    </div>
    <div v-show="dashboard" class="dashboard-content bg-lightgrey">
      <h1 class="text-pink">Dashboard</h1>

       <!-- Title and Compare Button -->
      <div class="titel-inkl-button">
        <h2 class="h2_override">
        {{ inputStore.runName }}
        </h2>
        <span v-if="compareRunStore.compare">&nbsp;<i class="fa-solid fa-arrows-alt-h"></i>&nbsp;</span>

        <!-- Dropdown for Comparison -->
        <div class="dropdown">
          <button class="dropbtn" @mouseover="toggleDropdown" @mouseleave="toggleDropdown">
            {{ compareRunStore && compareRunStore.runName ? compareRunStore.runName : 'Compare' }}
           <!-- <i :class="showDropdown ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'"></i> -->
          </button>

          <div class="dropdown-content" >
            <a
              v-for="run in filteredRuns"
              :key="run.id_run"
              @click="compareRun(run)"
              >{{ run.run_name }}</a
            >
          </div>
        </div>
         <!-- Stop Comparing Button -->
         <button v-if="compareRunStore.compare" class="close-btn" @click="stopComparing">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <!-- Travel times -->
      <div>
        <h3>Travel Times Changes</h3>
        <p>This is the relative change of travel times for the chosen run.</p>

        <canvas class="barChart" ref="barChart" height="125"></canvas>
      </div>

      <!-- Pareto -->
      <div>
        <h3>Pareto
          <i class="fa-solid fa-info-circle small-icon" @mouseover="showInfoBox = true" @mouseleave="showInfoBox = false"></i>
          <div v-show="showInfoBox" class="info-box">
            This plot shows the Pareto frontier from the chosen linear formulation. And other additional Information ...
          </div>
        </h3>
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

        <div
          class="pieChartContainer"
          :style="{ width: compareRunStore.compare ? '50%' : '70%' }"
        >
          <canvas class="pieChart" ref="pieChart" height="50"></canvas>

          <canvas
            v-show="compareRunStore.compare"
            class="pieChart"
            ref="pieChart2"
            height="50"
          ></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import "chartjs-plugin-datalabels";
import { useResultsStore } from "../stores/algorithmResultsStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { userInputStore } from "../stores/userInputStore.js";
import { projectsStore } from "../stores/projectsStore.js";
import { useCompareRunEvaluation } from "../stores/compareRunStore.js";
import { ref, watch } from "vue";
import { getPareto, getKmDistancePerLaneType } from "../scripts/api.js";

export default {
  name: "Dashboard",

  setup() {
    const ResultsStore = useResultsStore();
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const dashboard = ref(statusStore.dashboard);
    const prjStore = projectsStore();
    const filteredRuns = ref(null);
    const compareRunStore = useCompareRunEvaluation();


    watch(
      () => statusStore.dashboard,
      (newValue, oldValue) => {
        dashboard.value = newValue;
      }
    );

 
    watch(
      () => [prjStore.selectedRun, compareRunStore.runName],
      ([selectedRun, compareRunName], [oldSelectedRun, oldCompareRunName]) => {
        // Filter out the selected Run and the compareRunStore.runName from the dropdown options
        if (selectedRun !== null) {
          filteredRuns.value = prjStore.runs.runs.filter(run => run !== selectedRun && run.run_name !== compareRunName);
        } else {
          filteredRuns.value = prjStore.runs.runs.filter(run => run.run_name !== compareRunName);
        }
      }
    );



    return {
      ResultsStore,
      statusStore,
      inputStore,
      filteredRuns,
      prjStore,
      compareRunStore,

      dashboard,
    };
  },
  data() {
    return {
      showDropdown: false,
      showInfoBox: false,
    };
  },

  mounted() {
    //this.createScatterPlot();
    //this.createPieChart();
    //this.createBarChart();

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

    watch(
      () => this.ResultsStore.runName,
      (newRunName, oldRunName) => {
        this.createBarChart(); // TODO also update the Names for the legends
      }
    );


  },

  methods: {
    stopComparing(){
      this.compareRunStore.reset();
      this.createBarChart();
      this.createScatterPlot();
      this.createPieChart();
    },
    
    toggleDashboard() {
      this.statusStore.toggleDashboard();
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    async compareRun(run) {
      this.compareRunStore.setCompareTrue();
      const inputStore = userInputStore();

      // create evaluation for the selected run
      this.compareRunStore.setRunName(run.run_name); 


      const paretoEvaluation = await getPareto(run.id_prj, run.id_run);
      // Extracting data from paretoEvaluation
      const projects = paretoEvaluation.projects;
      const bikeTimes = projects.map((project) => project.bike_time_change);
      const carTimes = projects.map((project) => project.car_time_change);

      this.compareRunStore.setTraveltimes(bikeTimes, carTimes);

      // get km per bike / car lane
      const distanceEvaluation = await getKmDistancePerLaneType(
        inputStore.projectID,
        run.id_run
      );
      this.compareRunStore.setDistancesKM(
        distanceEvaluation.distance_bike[0].total_bike_lane_distance,
        distanceEvaluation.distance_car[0].total_car_lane_distance
      );

      this.createBarChart();
      this.createScatterPlot();
      this.createPieChart();
    },

    createPieChart() {
      let canvas = this.$refs.pieChart;
      let ctx = canvas.getContext("2d");

      let dataset = [this.ResultsStore.kmBike, this.ResultsStore.kmCar];

      if (this.compareRunStore.compare) {
        // create second pie chart when comparing
        canvas = this.$refs.pieChart2;
        ctx = canvas.getContext("2d");

        dataset = [this.compareRunStore.kmBike, this.compareRunStore.kmCar];

      }

      // Check if there's already a Chart instance on this canvas
      if (canvas.chart) {
        canvas.chart.destroy(); // Destroy the previous Chart instance
      }

      const pinkColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--pinkTransparent-color");
      const pinkHoverColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--pink-color");
      const blueColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--blue-color");

      canvas.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Bike", "Car"],
          datasets: [
            {
              label: "Distances in km",
              backgroundColor: [pinkColor, blueColor],
              data: dataset,
            },
          ],
        },
        options: {
          title: {
            display: true,
            rotation: -90,
            circumference: 180,
            cutout: "70%",
          },
        },
      });
    },

    createBarChart() {
      const canvas = this.$refs.barChart;
      const ctx = canvas.getContext("2d");

      // Check if there's already a Chart instance on this canvas
      if (canvas.chart) {
        canvas.chart.destroy(); // Destroy the previous Chart instance
      }
      // get proper colors
      const pinkColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--pinkTransparent-color");
      const blueColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--blue-color");

      const relativeBikeTTChange =
        Math.round(
          this.ResultsStore.paretoBikeTTArray[
            this.ResultsStore.paretoBikeTTArray.length - 1
          ] * 100
        ) / 100;
      const relativeCarTTChange =
        Math.round(
          this.ResultsStore.paretoCarTTArray[
            this.ResultsStore.paretoCarTTArray.length - 1
          ] * 100
        ) / 100;

      let dataValues = [relativeBikeTTChange, relativeCarTTChange];
      let labels = [`Bike_ ${this.ResultsStore.runName}`, `Car ${this.ResultsStore.runName}`];
      let colors = [pinkColor, blueColor];

      // add additional data, when in comparing mode
      if (this.compareRunStore.compare) {
        dataValues.push(
          Math.round(
            this.compareRunStore.paretoBikeTTArray[
              this.compareRunStore.paretoBikeTTArray.length - 1
            ] * 100
          ) / 100
        );
        dataValues.push(
          Math.round(
            this.compareRunStore.paretoCarTTArray[
              this.compareRunStore.paretoCarTTArray.length - 1
            ] * 100
          ) / 100
        );
        labels.push(
          `Bike ${this.compareRunStore.runName}`,
          `Car ${this.compareRunStore.runName}`
        );
        colors.push(pinkColor, blueColor);
      }
      // creating the bar chart
      canvas.chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
              label:"run 1",
                backgroundColor: colors,
                data: dataValues,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
                x: { 
                    display: true, 
                    title: { 
                        display: true,
                        text: "Changes in travel time [%]",
                        font: {
                            size: 12, 
                        },
                    },
                },
            },
            indexAxis: "y",
            plugins: {
                datalabels: {
                    anchor: "center",
                    align: "center",
                },
                legend: { 
                  display: false, 
              },
            },
            
        },
    });

    },

    createScatterPlot() {
      const canvas = this.$refs.scatterPlotCanvas;
      const ctx = canvas.getContext("2d");

      // Check if there's already a Chart instance on this canvas
      if (canvas.chart) {
        canvas.chart.destroy(); // Destroy the previous Chart instance
      }

      const datasets = [
        {
          label: `${this.ResultsStore.runName}`,
          data: this.ResultsStore.paretoBikeTTArray.map((bikeTime, index) => ({
            x: bikeTime,
            y: this.ResultsStore.paretoCarTTArray[index],
          })),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ];

      if (this.compareRunStore.compare) {
        datasets.push({
          label: `${this.compareRunStore.runName}`,
          data: this.compareRunStore.paretoBikeTTArray.map(
            (bikeTime, index) => ({
              x: bikeTime,
              y: this.compareRunStore.paretoCarTTArray[index],
            })
          ),
          backgroundColor: "rgba(0, 255, 0, 0.5)", // Green color
          borderColor: "rgba(0, 255, 0, 1)",
          borderWidth: 1,
        });
      }

      canvas.chart = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: datasets,
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
                text: "Change in car travel time [%]",
              },
            },
          },
        },
      });
    },
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

.scatterPlotCanvas,
.barChart,
.pieChart {
  margin-left: 30px;
  margin-right: 30px;
  align-content: center;
}

.pieChartContainer {
  width: 50%;
  margin: 0 auto;
  align-content: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.titel-inkl-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* Dropdown styles */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #dd667aea;
}
.close-btn {
  position: relative;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  color: #333;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
}

.close-btn:hover {
  color: #da5268;
}
.info-box {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  padding: 5px;
  max-width: 200px;
  z-index: 9999;
  font-size: 11px;

}

.fa-info-circle {
  cursor: help;
}
.small-icon {
  font-size: 11px; 
}

</style>
