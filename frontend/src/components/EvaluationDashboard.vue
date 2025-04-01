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
      <div class="text-align" v-if="showEmptyMessage">
  <p>{{ emptyMessage }}</p>
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

          <h3 class="runs-header">
            <span class="runs-text">Average Metrics</span>
</h3>


<div style="margin-top: 10px;">



<!-- Metrics Results Table -->
<div style="margin-top: 50px;"></div>

<table
  v-if="showMetricsTable"
  style="margin-top: 10px; width: auto; margin-left: 0; margin-right: auto;"
>
  <thead>
    <tr>
      <th>Metric</th>
      <th v-for="run in prjStore.selectedEvaluationRuns" :key="run.run_name">
        {{ run.run_name }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="metric in selectedMetrics" :key="metric.key">
      <td>{{ metric.label }}</td>
      <td v-for="run in prjStore.selectedEvaluationRuns" :key="run.run_name + '-' + metric.key">
        ...
      </td>
    </tr>
  </tbody>
</table>


</div>




        <!-- Visualization Section -->
        <div class="metrics-container" style="margin-top: 30px;">
          <h3 class="runs-header">
            <span class="runs-text">Visualization</span>
          </h3>

<!-- Run Selector -->
<div class="dropdown" style="margin-bottom: 15px;">
  <button class="dropdown-button" @click="toggleRunDropdown">
    {{ selectedRun_dropdown?.run_name || 'Select a Run' }}
    <i class="fa-solid fa-caret-down"></i>
  </button>
  <ul v-show="runDropdownOpen" class="dropdown-menu">
    <li
      v-for="run in prjStore.selectedEvaluationRuns"
      :key="run.run_name"
      @click="selectRun(run)"
    >
      {{ run.run_name }}
    </li>
  </ul>
</div>

<!-- Visualization Mode Selector -->
<div class="visualization-mode-toggle">
  <button
    :class="['toggle-option', visualizationMode === 'evaluation' ? 'active' : '']"
    @click="visualizationMode = 'evaluation'"
  >
    Evaluation
  </button>
  <button
    :class="['toggle-option', visualizationMode === 'network' ? 'active' : '']"
    @click="visualizationMode = 'network'"
  >
    Network
  </button>
</div>



<!-- Conditionally render based on mode -->
<div v-if="visualizationMode === 'evaluation'" style="margin-bottom: 15px;">
  <!-- Dropdown Button -->
  <div class="dropdown">
    <button class="dropdown-button" @click="dropdownOpen = !dropdownOpen">
      {{ visualizedMetric?.label || 'Select a Metric to Visualize' }}
      <i class="fa-solid fa-caret-down"></i>
    </button>

    <!-- Dropdown Menu -->
    <ul v-show="dropdownOpen" class="dropdown-menu">
      <li
        v-for="metric in selectedMetrics"
        :key="metric.key"
        @click="visualizeMetric(metric)"
      >
        {{ metric.label }}
      </li>
    </ul>
  </div>

  <!-- Display Button -->
  <div style="margin-top: 30px;">
    <button class="calculate-button" @click="displayEvaluationMap(selectedRun_dropdown)">
      Display
    </button>
  </div>

  
</div>


<div v-if="visualizationMode === 'network'"  style="margin-bottom: 15px;">
    <div class="dropdown">
      <button class="dropdown-button" @click="networkDropdownOpen = !networkDropdownOpen">
        {{ selectedNetworkType || 'Select Network Type' }}
        <i class="fa-solid fa-caret-down"></i>
      </button>

      <ul v-show="networkDropdownOpen" class="dropdown-menu">
        <li @click="selectNetworkType('Bike Network')">Bike Network </li>
        <li @click="selectNetworkType('Car Network')">Car Network</li>
        <li @click="selectNetworkType('Full Network')">Full Network</li>
      </ul>
    </div>

    <!-- Display Button -->
    <div style="margin-top: 30px;">
      <button class="calculate-button" @click="displayNetworkMap(selectedRun_dropdown)">
        Display
      </button>
    </div>
</div>






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
import { ref, watch, computed } from "vue";
import { loadWFS, loadWMS } from "../scripts/map.js";
import {
  getBoundingBox,
  getRunList,
} from "../scripts/api.js";

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
  

  computed: {
    selectedMetricLabels() {
      return this.allMetrics.filter(m => m.selected).map(m => m.label);
    },
    selectedMetrics() {
      return this.allMetrics.filter(m => m.selected);
    },
    selectedMetrics() {
    return this.inputStore.allMetrics.filter(m => m.selected);
  },
  showEmptyMessage() {
    return this.prjStore.selectedEvaluationRuns.length === 0 || this.selectedMetrics.length === 0;
  },
  emptyMessage() {
    const noRuns = this.prjStore.selectedEvaluationRuns.length === 0;
    const noMetrics = this.selectedMetrics.length === 0;

    if (noRuns && noMetrics) return "Please select runs and metrics to display the results.";
    if (noRuns) return "Please select a run to display the results.";
    if (noMetrics) return "Please select metrics to display the results.";
    return "";
  }
  },
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
    const visualizedMetric = ref(null);
    const dropdownOpen = ref(false);
    const metricsOptions = [
      "LTS (Level of Traffic Stress)",
      "zed (Bicycle Compatibility Index)",
      "BSL (Bicycle Stress Level)",
      "BLOS (Bicycle Level of Service)",
      "Porter Index",
      "Weikl Index"
    ];



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
      visualizedMetric,
      metricsOptions,
      dropdownOpen
    };
  },
  data() {
    return {
      allMetrics: [
        { key: 'travel_time', label: 'Travel Time Changes', selected: false },
        { key: 'lane_type_distance', label: 'Distance per lane type', selected: false },
        { key: 'network_bearing', label: 'Network Bearing', selected: false },
        { key: 'complexity', label: 'Complexity Measure', selected: false }
      ],
      metricDropdownOpen: false,
      showMetricsTable: true,

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
      selectedRun_dropdown: null,
      runDropdownOpen: false,
      visualizationMode: 'evaluation', // default
      selectedNetworkType: null,
      networkDropdownOpen: false,
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

    toggleMetricDropdown() {
      this.metricDropdownOpen = !this.metricDropdownOpen;
    },
    calculateMetrics() {
      this.showMetricsTable = true;
    },

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
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    visualizeMetric(metric) {
      this.visualizedMetric = metric;
      this.dropdownOpen = false;
    },
    toggleModeDropdown() {
    this.modeDropdownOpen = !this.modeDropdownOpen;
    },
    setEvaluationMode(mode) {
      this.statusStore.evaluationMode = mode;
      this.modeDropdownOpen = false;
    },

    toggleRunDropdown() {
      this.runDropdownOpen = !this.runDropdownOpen;
    },
    selectRun(run) {
      this.selectedRun_dropdown = run;
      this.runDropdownOpen = false;
    },
    updateANP(key, value) {
    // Example handler — customize as needed
    console.log(`Updated ${key} to ${value}`);
    },
    selectNetworkType(type) {
      this.selectedNetworkType = type;
      this.networkDropdownOpen = false;
    },
    async displayEvaluationMap(run) {

      const metricKey = this.visualizedMetric?.key;
      if (!metricKey) {
        alert("Please select a metric to visualize.");
        return;
      }

      await getBoundingBox(this.inputStore.projectID);

      loadWMS("v_eval_pivoted", "wms_eval_pivoted",this.inputStore.projectID, run.id_run, metricKey);
      loadWFS("v_eval_pivoted_wfs", "wfs_eval_pivoted",this.inputStore.projectID, run.id_run, metricKey);
    },
    async displayNetworkMap(run) {


      const type = this.selectedNetworkType; // 'Bike', 'Car', 'Full'
      loadWMS("v_optimized", "wms_optimized", this.inputStore.projectID, run.id_run, null, this.selectedNetworkType);
      loadWFS("v_optimized_wfs", "wfs_optimized", this.inputStore.projectID, run.id_run, null, this.selectedNetworkType);
    }

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

/* Dropdown styling */
.dropdown {
  position: relative;
  width: 100%;
}

.dropdown-button {
  width: 100%;
  padding: 10px;
  background-color: lightgrey;
  color: black;
  border: 1px solid var(--darkgrey-bg);
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
}

.dropdown-button i {
  margin-left: 10px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: lightgrey;
  border: 1px solid var(--darkgrey-bg);
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 10;
}

.dropdown-menu li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-menu li:hover {
  background-color: var(--lightgrey-bg);
}
.visualization-mode-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.toggle-option {
  padding: 8px 16px;
  border: 1px solid var(--darkgrey-bg);
  background-color: white;
  color: var(--darkgrey-bg);
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.toggle-option.active {
  background-color: var(--pink-color);
  color: white;
  border-color: var(--pink-color);
}

</style>