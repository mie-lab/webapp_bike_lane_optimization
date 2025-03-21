<template>
  <div :class="['dashboard-container', { hidden: !dashboard }]">
    <div class="legend-container bg-lightgrey" v-show="dashboard">
      <h3 class="legend-text">Legend</h3>

      <table class="legend-table">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 80%" />
        </colgroup>
        <tr>
          <td>
            <div
              class="legend-rectangle"
              style="background-color: var(--blue-color)"
            ></div>
          </td>
          <td>Car</td>
        </tr>
        <tr>
          <td>
            <div
              class="legend-rectangle"
              style="background-color: var(--pink-color)"
            ></div>
          </td>
          <td>Bike</td>
        </tr>
      </table>
    </div>

    <!-- Dashboard Navigation -->
    <div
      class="dashboard-navigation"
      :class="{ hidden: !dashboard }"
      @click="toggleDashboard"
    >
      <i
        :class="
          statusStore.dashboard
            ? 'fa-solid fa-angle-right dashboard-angle-icon'
            : 'fa-solid fa-angle-left dashboard-angle-icon'
        "
      ></i>
    </div>
    <div v-show="dashboard" class="dashboard-content bg-lightgrey">
      <h1 class="text-pink">Detailed Evaluation</h1>
      <div class="text-align" v-if="inputStore.runName === ''">
        <p>Please select a run to display the results.</p>
      </div>
      <div class="text-align" v-else>
        <!-- Title Button -->
        <div class="titel-inkl-button">
          <h2 class="h2_override">
            {{ inputStore.runName }}
          </h2>
          <span v-if="compareRunStore.compare" style="color: var(--blue-color)"
            >&nbsp;<i class="fa-solid fa-arrows-alt-h"></i>&nbsp;</span
          >
        
        </div>
        <div>
        <h3 class="metrics-header">
                <span class="metrics-text">Basic Metrics</span>
                </h3>
              </div>


        <div>
        <table>
                    <colgroup>
                      <col style="width: 30px;">
                      <col style="width: 270px;">
                      <col style="width: 20px;">
                    </colgroup>


                    <tr>
                      <td>Travel Time Changes</td>
                      <td class="bold">...</td>
                    </tr>
                    <tr>
                      <td>Distance per lane type</td>
                      <td class="bold">...</td>
                    </tr>
                    <tr>
                      <td>Average LTS</td>
                      <td class="bold">...</td>
                    </tr>
                    <tr>
                      <td>Average LTS</td>
                      <td class="bold">...</td>
                    </tr>
                    <tr>
                      <td>Average BCI</td>
                      <td class="bold">...</td>
                    </tr>
                    <tr>
                      <td>Average BSL</td>
                      <td class="bold">...</td>
                    </tr>
                    <tr>
                      <td>Average BLOS</td>
                      <td class="bold">...</td>
                    </tr>
                    <tr>
                      <td>Average Porter Index</td>
                      <td class="bold">...</td>
                    </tr>
                    <tr>
                      <td>Average Weikl Index</td>
                      <td class="bold">...</td>
                    </tr>
                  </table>
        </div>
        <div>
        <h3 class="metrics-header">
                <span class="metrics-text">Advanced Metrics</span>
        </h3>
        
        <div class="bike-ratio" style="margin-top: 35px; position: relative;">
        <h4 class="text-blue"> Accessibility  
        </h4>
        <div class="slide-container">
          <input
            class="slider"
            type="range"
            min="0"
            max="100"
            v-model="accessibility"
            @click="setAcessibility(accessibility)"
          />
        </div>
        <p>{{ laneAllocation }} % priority weight</p>
      </div>
      <div class="bike-ratio" style="margin-top: 35px; position: relative;">
        <h4 class="text-blue"> Attractiveness  
        </h4>
        <div class="slide-container">
          <input
            class="slider"
            type="range"
            min="0"
            max="100"
            v-model="accessibility"
            @click="setAcessibility(accessibility)"
          />
        </div>
        <p>{{ laneAllocation }} % priority weight</p>
      </div>
      <div class="bike-ratio" style="margin-top: 35px; position: relative;">
        <h4 class="text-blue"> Safety 
        </h4>
        <div class="slide-container">
          <input
            class="slider"
            type="range"
            min="0"
            max="100"
            v-model="accessibility"
            @click="setAcessibility(accessibility)"
          />
        </div>
        <p>{{ laneAllocation }} % priority weight</p>
      </div>

      <table>
                    <colgroup>
                      <col style="width: 30px;">
                      <col style="width: 270px;">
                      <col style="width: 20px;">
                    </colgroup>


                    <tr>
                      <td>Evaluation</td>
                      <td class="bold">...</td>
                    </tr>

                  </table>

      </div>

      </div>
    </div>
  </div>
</template>

<script>
import "chartjs-plugin-datalabels";
import { useResultsStore } from "../stores/runResultsStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { loadingStore } from "../stores/loadingStore.js";
import { userInputStore } from "../stores/userInputStore.js";
import { projectsStore } from "../stores/projectsStore.js";
import { useCompareRunEvaluation } from "../stores/compareRunResultStore.js";
import { ref, watch } from "vue";
import {
  createPieChartComplexity,
  createBarChart,
  createDoughnutChart,
  createScatterPlot,
} from "../scripts/dashboardCharts.js";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import { infoBoxTexts } from "../strings/infoBoxText.js";
import {extractParetoEvaluation,extractDistancesPerLane, extractComplexity, extractBearing} from "../scripts/dashboard.js";

export default {
  name: "Dashboard",
  components: {
    RingLoader,
  },

  setup() {
    // setup all pinia stores
    const ResultsStore = useResultsStore();
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const dashboard = ref(statusStore.dashboard);
    const prjStore = projectsStore();
    const filteredRuns = ref(null);
    const compareRunStore = useCompareRunEvaluation();
    const loadingStoreInstance = loadingStore();

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
          filteredRuns.value = prjStore.runs.runs.filter(
            (run) => run !== selectedRun && run.run_name !== compareRunName
          );
        } else {
          filteredRuns.value = prjStore.runs.runs.filter(
            (run) => run.run_name !== compareRunName
          );
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
      loadingStoreInstance,
    };
  },
  data() {
    return {
      showDropdown: false,
      showInfoBox: false,
      showInfoBoxTravelTimes: false,
      showInfoBoxDistances: false,
      isOpenTT: false,
      isOpenPareto: false,
      isOpenDistances: false,
      isOpenComplexity: false,
      showInfoBoxComplexity: false,
      isOpenBearing: false,
      showInfoBoxBearing: false,
      distancesIsLoading: false,
      travelTimesIsLoading: false,
      complexityIsLoading: false,
      bearingIsLoading: false,
      infoBoxTexts: infoBoxTexts,
      paretoIsLoading:false,
    };
  },

  mounted() {
    // reload data behind evaluation when run name changes
    watch(
      () => this.inputStore.runName,
      async (newRunName, oldRunName) => {
        const run = this.prjStore.getSelectedRun;

        // get the evaluation data for the selected run
        extractParetoEvaluation(run);
        extractDistancesPerLane(run);
        extractComplexity(run);
        extractBearing(run);
      }
    );
  
    watch(
      () => this.ResultsStore.paretoBikeTTArray,
      (newValue, oldValue) => {
        this.createScatterPlotPareto();
        this.createBarChartTT();
      }
    );
    watch(
      () => this.ResultsStore.kmBike,
      (newValue, oldValue) => {
        this.createDoughnutChartDistances();
      }
    );
    watch(
      () => this.ResultsStore.complexity.bike,
      (newValue, oldValue) => {
        this.createPieChartComplexityAll();
      }
    );

    ///// compare run ////////////
    
    watch(
      () => this.compareRunStore.paretoBikeTTArray,
      (newValue, oldValue) => {
        if (this.compareRunStore.compare){
          this.createScatterPlotPareto();
          this.createBarChartTT();
        }
        
      }
    );
    watch(
      () => this.compareRunStore.kmBike,
      (newValue, oldValue) => {
        if (this.compareRunStore.compare){
          this.createDoughnutChartDistances();
        }
  
      }
    );
    watch(
      () => this.compareRunStore.complexity.bike,
      (newValue, oldValue) => {
        if (this.compareRunStore.compare){
          this.createPieChartComplexityAll();
        }
        
      }
    );
    


    watch(
      () => [
        this.loadingStoreInstance.paretoIsLoading,
        this.loadingStoreInstance.distancesIsLoading,
        this.loadingStoreInstance.complexityIsLoading,
        this.loadingStoreInstance.bearingIsLoading,
      ],
      (
        [newPareto, newDistances, newComplexity, newBearing],
        [oldPareto, oldDistances, oldComplexity, oldBearing]
      ) => {
        this.distancesIsLoading = newDistances;
        this.travelTimesIsLoading = newPareto;
        this.paretoIsLoading = newPareto;
        this.complexityIsLoading = newComplexity;
        this.bearingIsLoading = newBearing;
      }
    );
  },

  methods: {
    toggleBearingDropdown() {
      this.isOpenBearing = !this.isOpenBearing;
    },
    toggleComplexityDropdown() {
      this.isOpenComplexity = !this.isOpenComplexity;
      this.createPieChartComplexityAll();
    },

    toggleTTDropdown() {
      this.isOpenTT = !this.isOpenTT;
      this.createBarChartTT();
    },
    toggleParetoDropdown() {
      this.isOpenPareto = !this.isOpenPareto;
      this.createScatterPlotPareto();
    },
    toggleDistancesDropdown() {
      this.isOpenDistances = !this.isOpenDistances;
      this.createDoughnutChartDistances();
    },

    stopComparing() {
      this.compareRunStore.reset();
      this.createBarChartTT();
      this.createScatterPlotPareto();
      this.createDoughnutChartDistances();
      this.createPieChartComplexityAll();
    },

    toggleDashboard() {
      this.statusStore.toggleDashboard();
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    async compareRun(run) {
      this.compareRunStore.setCompareTrue();

      // create evaluation for the selected run
      this.compareRunStore.setRunName(run.run_name);

      // get the evaluation data for the selected run
      extractParetoEvaluation(run,true);
      extractDistancesPerLane(run,true);
      extractComplexity(run,true);
      extractBearing(run,true);
    },

    createPieChartComplexityAll() {
      this.$nextTick(() => {
        createPieChartComplexity(
          this.ResultsStore,
          this.compareRunStore,
          this.isOpenComplexity,
          this.$refs.pieChartComplexityBike,
          this.$refs.pieChartComplexityCar,
          this.$refs.pieCharCompareComplexityBike,
          this.$refs.pieChartCompareComplexityCar
        );
      });
    },

    createDoughnutChartDistances() {
      this.$nextTick(() => {
        if (this.isOpenDistances) {
          let canvas = this.$refs.pieChart;

          const colorsDefined = this.getColors(); // get the standart colors

          let dataset = [this.ResultsStore.kmBike, this.ResultsStore.kmCar];
          let colors = [colorsDefined[0], colorsDefined[1]];
          let labels = [`Bike`, `Car`];
          // create the doughnut chart
          createDoughnutChart(
            labels,
            dataset,
            colors,
            canvas,
            this.ResultsStore.runName
          );

          // create the second pie chart when comparing
          if (this.compareRunStore.compare) {
            let canvas2 = this.$refs.pieChart2;

            let dataset2 = [
              this.compareRunStore.kmBike,
              this.compareRunStore.kmCar,
            ];
            let labels2 = [`Bike`, `Car`];
            let colors2 = [colorsDefined[2], colorsDefined[3]];

            createDoughnutChart(
              labels2,
              dataset2,
              colors2,
              canvas2,
              this.compareRunStore.runName
            );
          }
        }
      });
    },

    getColors() {
      // function to get the colors saved in colors.css
      const pinkColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--pinkTransparent-color");
      const pinkCompareColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--pink-compare");
      const blueColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--blue-color");
      const blueCompareColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--blue-compare");
      return [pinkColor, blueColor, pinkCompareColor, blueCompareColor];
    },

    createBarChartTT() {
      this.$nextTick(() => {
        if (this.isOpenTT) {
          const canvas = this.$refs.barChart;

          // get proper colors
          const colorsDefined = this.getColors();

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
          let labels = [`Bike`, `Car`];
          let colors = [colorsDefined[0], colorsDefined[1]];

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
            labels.push(`Bike`, `Car`);
            colors.push(colorsDefined[2], colorsDefined[3]);
          }

          // creating the bar chart
          createBarChart(labels, dataValues, colors, canvas);
        }
      });
    },

    createScatterPlotPareto() {
      this.$nextTick(() => {
        if (this.isOpenPareto) {
          const canvas = this.$refs.scatterPlotCanvas;

          const datasets = [
            {
              label: `${this.ResultsStore.runName}`,
              data: this.ResultsStore.paretoBikeTTArray.map(
                (bikeTime, index) => ({
                  x: bikeTime,
                  y: this.ResultsStore.paretoCarTTArray[index],
                })
              ),
              backgroundColor: "rgba(116, 41, 134,0.4)",
              borderColor: "rgba(116, 41, 134,0.8)",
              borderWidth: 1,
            },
          ];

          // add additional data, when in comparing mode
          if (this.compareRunStore.compare) {
            datasets.push({
              label: `${this.compareRunStore.runName}`,
              data: this.compareRunStore.paretoBikeTTArray.map(
                (bikeTime, index) => ({
                  x: bikeTime,
                  y: this.compareRunStore.paretoCarTTArray[index],
                })
              ),
              backgroundColor: "rgba(114, 166, 97,0.4)",
              borderColor: "rgba(114, 166, 97,0.8)",
              borderWidth: 1,
            });
          }
          // create scatter Plot
          createScatterPlot(datasets, canvas);
        }
      });
    },
  },
};
</script>

<style scoped>
@import "../styles/UserInputStyles.css";
@import "../styles/UserInputStylesMobile.css";
@import "../styles/SideBarStyle.css";
@import "../styles/SideBarStyleMobile.css";
@import "../styles/UserInputRunStyle.css";
@import "../styles/dashboardStyle.css";
@import "../styles/dashboardStyleMobile.css";
</style>