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
          <td>Test Bike</td>
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
      <h1 class="text-pink">Dashboard</h1>
      <div class="text-align" v-if="inputStore.runName === ''">
        <p>Please select a run to display the results.</p>
      </div>
      <div class="text-align" v-else>
        <!-- Title and Compare Button -->
        <div class="titel-inkl-button">
          <h2 class="h2_override">
            {{ inputStore.runName }}
          </h2>
          <span v-if="compareRunStore.compare" style="color: var(--blue-color)"
            >&nbsp;<i class="fa-solid fa-arrows-alt-h"></i>&nbsp;</span
          >

          <!-- Dropdown for Comparison -->
          <!-- <div class="dropdown">
            <button
              class="dropbtn-compare"
              @mouseover="toggleDropdown"
              @mouseleave="toggleDropdown"
              :style="{
                paddingRight: compareRunStore.compare ? '27px' : '10px',
              }"
            >
              {{
                compareRunStore && compareRunStore.runName
                  ? compareRunStore.runName
                  : "Compare"
              }} 

              Stop Comparing Button 
              <button
                v-if="compareRunStore.compare"
                style="color: var(--blue-color)"
                class="close-btn"
                @click="stopComparing"
              >
                <i class="fa-solid fa-times"></i>
              </button>
            </button>

            <div class="dropdown-content">
              <a
                v-for="run in filteredRuns"
                :key="run.id_run"
                @click="compareRun(run)"
                >{{ run.run_name }}</a
              >
            </div> 
          </div> -->
        </div>
        <div class="dashboard-content-evaluation">
          <!-- Pareto -->
          <div class="dropdown-evaluation" @click="toggleParetoDropdown">
            <div :class="{ 'dropdown-header': true, selected: isOpenPareto }">
              <h3>
                Pareto
                <i
                  class="fa-solid fa-info-circle small-icon"
                  @mouseover="showInfoBox = true"
                  @mouseleave="showInfoBox = false"
                  v-if="!paretoIsLoading"
                ></i>
                <span class="ring-loader-container">
                  <div class="ring-loader">
                    <RingLoader
                      v-if="paretoIsLoading"
                      :size="'60'"
                      :color="'#123abc'"
                    />
                  </div>
                </span>
                <div v-show="showInfoBox" class="info-box">
                  {{infoBoxTexts.evaluation_pareto}}
                </div>
              </h3>
              <i
                :class="
                  isOpenPareto
                    ? 'fa-solid fa-angle-up'
                    : 'fa-solid fa-angle-down'
                "
                style="color: var(--blue-color)"
              ></i>
            </div>
            <div
              class="dropdown-eval-content"
              v-if="isOpenPareto"
              style="
                width: 70%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: auto;
              "
            >
              <canvas
                class="scatterPlotCanvas"
                ref="scatterPlotCanvas"
                height="260"
              ></canvas>
            </div>
          </div>

          <!-- Travel times -->
          <div class="dropdown-evaluation" @click="toggleTTDropdown">
            <div :class="{ 'dropdown-header': true, selected: isOpenTT }">
              <h3>
                Travel Times Changes
                <i
                  class="fa-solid fa-info-circle small-icon"
                  @mouseover="showInfoBoxTravelTimes = true"
                  @mouseleave="showInfoBoxTravelTimes = false"
                  v-if="!distancesIsLoading"
                ></i>
                <span class="ring-loader-container">
                  <div class="ring-loader">
                    <RingLoader
                      v-if="distancesIsLoading"
                      :size="'60'"
                      :color="'#123abc'"
                    />
                  </div>
                </span>
                <div v-show="showInfoBoxTravelTimes" class="info-box">
                  {{infoBoxTexts.evaluation_travel_time_changes}}
                </div>
              </h3>
              <i
                :class="
                  isOpenTT ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'
                "
                style="color: var(--blue-color)"
              ></i>
            </div>

            <div class="dropdown-eval-content" v-if="isOpenTT">
              <canvas class="barChart" ref="barChart" height="105"></canvas>
            </div>
          </div>

          <!-- Distances -->
          <div class="dropdown-evaluation" @click="toggleDistancesDropdown">
            <div
              :class="{ 'dropdown-header': true, selected: isOpenDistances }"
            >
              <h3>
                Distances per lane type
                <i
                  class="fa-solid fa-info-circle small-icon"
                  @mouseover="showInfoBoxDistances = true"
                  @mouseleave="showInfoBoxDistances = false"
                  v-if="!distancesIsLoading"
                ></i>
                <span class="ring-loader-container">
                  <div class="ring-loader">
                    <RingLoader
                      v-if="distancesIsLoading"
                      :size="'60'"
                      :color="'#123abc'"
                    />
                  </div>
                </span>
                <div v-show="showInfoBoxDistances" class="info-box">
                  {{ infoBoxTexts.evaluation_distances_per_type }}
                </div>
              </h3>
              <i
                :class="
                  isOpenDistances
                    ? 'fa-solid fa-angle-up'
                    : 'fa-solid fa-angle-down'
                "
                style="color: var(--blue-color)"
              ></i>
            </div>

            <div class="dropdown-eval-content" v-if="isOpenDistances">
              <div class="pieChartContainer">
                <div
                  class="column"
                  :class="{
                    single: !compareRunStore.compare,
                    compare: compareRunStore.compare,
                  }"
                  style="margin: auto"
                >
                  <canvas
                    class="pieChart"
                    ref="pieChart"
                    style="padding-right: 0px"
                  ></canvas>
                </div>

                <div
                  class="column"
                  v-show="compareRunStore.compare"
                  :class="{
                    single: !compareRunStore.compare,
                    compare: compareRunStore.compare,
                  }"
                  style="padding-left: 0px"
                >
                  <canvas
                    class="pieChart"
                    ref="pieChart2"
                    style="padding-left: 0px"
                  ></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- Complexity -->
          <div class="dropdown-evaluation" @click="toggleComplexityDropdown">
            <div
              :class="{ 'dropdown-header': true, selected: isOpenComplexity }"
            >
              <h3>
                Network Complexity
                <i
                  class="fa-solid fa-info-circle small-icon"
                  @mouseover="showInfoBoxComplexity = true"
                  @mouseleave="showInfoBoxComplexity = false"
                  v-if="!complexityIsLoading"
                ></i>
                <span class="ring-loader-container">
                  <div class="ring-loader">
                    <RingLoader
                      v-if="complexityIsLoading"
                      :size="'60'"
                      :color="'#123abc'"
                    />
                  </div>
                </span>
                <div v-show="showInfoBoxComplexity" class="info-box">
                  {{infoBoxTexts.evaluation_network_complexity}}
                </div>
              </h3>
              <i
                :class="
                  isOpenComplexity
                    ? 'fa-solid fa-angle-up'
                    : 'fa-solid fa-angle-down'
                "
                style="color: var(--blue-color)"
              ></i>
            </div>

            <div class="dropdown-eval-content" v-if="isOpenComplexity">
              <div class="pieChartContainer-complexity">
                <p
                  v-show="compareRunStore.compare"
                  style="
                    text-align: center;
                    font-family: &quot;Helvetica Neue&quot;,
                      &quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;
                    font-size: 14px;
                    font-weight: bold;
                    color: #666;
                    padding: 0px;
                  "
                >
                  {{ ResultsStore.runName }}
                </p>
                <div class="column-complexity">
                  <canvas
                    class="pieChart-complexity"
                    ref="pieChartComplexityBike"
                    style="width: 50%; height: 100%"
                  ></canvas>
                  <canvas
                    class="pieChart-complexity"
                    ref="pieChartComplexityCar"
                    style="width: 50%; height: 100%"
                  ></canvas>
                </div>
                <p
                  v-show="compareRunStore.compare"
                  style="
                    text-align: center;
                    font-family: &quot;Helvetica Neue&quot;,
                      &quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;
                    font-size: 14px;
                    font-weight: bold;
                    color: #666;
                    padding-top: 17px;
                  "
                >
                  {{ compareRunStore.runName }}
                </p>
                <div class="column-complexity" v-show="compareRunStore.compare">
                  <canvas
                    class="pieChart"
                    ref="pieCharCompareComplexityBike"
                    style="width: 50%; height: 100%"
                  ></canvas>
                  <canvas
                    class="pieChart"
                    ref="pieChartCompareComplexityCar"
                    style="width: 50%; height: 100%"
                  ></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- Network Bearing -->
          <div class="dropdown-evaluation" @click="toggleBearingDropdown">
            <div :class="{ 'dropdown-header': true, selected: isOpenBearing }">
              <h3>
                Network Bearing
                <i
                  class="fa-solid fa-info-circle small-icon"
                  @mouseover="showInfoBoxBearing = true"
                  @mouseleave="showInfoBoxBearing = false"
                  v-if="!bearingIsLoading"
                ></i>
                <span class="ring-loader-container">
                  <div class="ring-loader">
                    <RingLoader
                      v-if="bearingIsLoading"
                      :size="'60'"
                      :color="'#123abc'"
                    />
                  </div>
                </span>
                <div v-show="showInfoBoxBearing" class="info-box">
                  {{infoBoxTexts.evaluation_network_bearing}}
                </div>
              </h3>
              <i
                :class="
                  isOpenBearing
                    ? 'fa-solid fa-angle-up'
                    : 'fa-solid fa-angle-down'
                "
                style="color: var(--blue-color)"
              ></i>
            </div>
            <div class="dropdown-eval-content" v-if="isOpenBearing">
              <div class="pieChartContainer" style="height: 80px">
                <div class="column" style="height: 100%;">
                  <table>
                    <tr v-show="compareRunStore.compare">
                      <td
                        colspan="2"
                        style="
                          text-align: center;
                          font-family: &quot;Helvetica Neue&quot;,
                            &quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;
                          font-size: 14px;
                          font-weight: bold;
                          color: #666;
                          padding-bottom: 10px;
                        "
                      >
                        {{ ResultsStore.runName }}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-right: 20px">
                        <i class="fa-solid fa-bicycle"></i>
                      </td>
                      <td style="padding-left: 20px">
                        <i class="fa-solid fa-car"></i>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-right: 20px">
                        {{
                          ResultsStore.networkBearing.bike !== null
                            ? ResultsStore.networkBearing.bike.toFixed(2)
                            : ""
                        }}
                      </td>
                      <td style="padding-left: 20px">
                        {{
                          ResultsStore.networkBearing.car !== null
                            ? ResultsStore.networkBearing.car.toFixed(2)
                            : ""
                        }}
                      </td>
                    </tr>
                  </table>
                </div>

                <div class="column" style="height: 100%;" v-show="compareRunStore.compare">
                  <table>
                    <tr>
                      <td
                        colspan="2"
                        style="
                          text-align: center;
                          font-family: &quot;Helvetica Neue&quot;,
                            &quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;
                          font-size: 14px;
                          font-weight: bold;
                          color: #666;
                          padding-bottom: 10px;
                        "
                      >
                        {{ compareRunStore.runName }}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-right: 20px">
                        <i class="fa-solid fa-bicycle"></i>
                      </td>
                      <td style="padding-left: 20px">
                        <i class="fa-solid fa-car"></i>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-right: 20px">
                        {{
                          compareRunStore.networkBearing.bike !== null
                            ? compareRunStore.networkBearing.bike.toFixed(2)
                            : ""
                        }}
                      </td>
                      <td style="padding-left: 20px">
                        {{
                          compareRunStore.networkBearing.car !== null
                            ? compareRunStore.networkBearing.car.toFixed(2)
                            : ""
                        }}
                      </td>
                    </tr>
                  </table>

                </div>
                      <!-- Button for switching to evaluation -->

              </div>
            </div>
          </div>
          <div class="buttons">
            <button 
  @click="() => { 
    prjStore.addEvaluationRun(prjStore.selectedRun); 
    statusStore.DashboardMode = 'Evaluation'; 
    toggleActiveTab('Evaluation');
    statusStore.closeDashboard();

  }"
>
  Detailed Evaluation
</button>
                  </div>
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
    toggleActiveTab(tab) {
      // Toggle the active tab using the Pinia store
      const storedTab = this.activeTab;
      this.statusStore.deactivateHelpDetailsPage();
      if (tab == storedTab) {
        this.statusStore.setActiveTab("None");
      } else {
        this.statusStore.setActiveTab(tab);
      }

      if (window.innerWidth <= 768) {
        this.statusStore.closeDashboard();
        this.isDashboardActive = false;
      }
    },
  },
};
</script>

<style scoped>
@import "../styles/dashboardStyle.css";
@import "../styles/dashboardStyleMobile.css";
</style>