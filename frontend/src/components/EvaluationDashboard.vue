<template>
  <div :class="['dashboard-container', { hidden: !dashboard }]">
    <div class="legend-container bg-lightgrey" v-if="legendStore.activeLegend.length">
      <h3 class="legend-text">Legend</h3>
      <table class="legend-table">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 80%" />
        </colgroup>
        <tr v-for="(item, index) in legendStore.activeLegend" :key="index">
          <td>
            <div class="legend-rectangle" :style="{ backgroundColor: item.color }"></div>
          </td>
          <td>{{ item.label }}</td>
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
            Metric Averages
          </h2>

        
        </div>


        <div>

          <!-- Metrics Section -->
<!-- Metrics Section -->
<div class="metric-list-wrapper">
<div class="metric-list" >

<div
  v-for="metric in selectedMetrics"
  :key="metric.key"
  class="dropdown-evaluation"
  @click="toggleMetric(metric.key)"
>
  <!-- Metric Header -->
  <div :class="{ 'dropdown-header': true, selected: openMetricDropdowns.includes(metric.key) }">
    <h3>
      {{ metric.label }}
      <i
        class="fa-solid fa-info-circle small-icon"
        @click.stop="showInfo(metric)"
      ></i>
    </h3>
    <i
      :class="[
        'fa-solid',
        openMetricDropdowns.includes(metric.key) ? 'fa-angle-up' : 'fa-angle-down'
      ]"
      style="color: var(--blue-color)"
    ></i>
  </div>

  <!-- Dropdown Content (Chart) -->
  <div
    class="dropdown-eval-content"
    v-if="openMetricDropdowns.includes(metric.key)"
    style="width: 70%; display: flex; justify-content: center; align-items: center; margin: auto;"
  >
    <canvas
      :ref="'metricChart_' + metric.key"
      style="width: 100%; height: 150px;"
    ></canvas>
  </div>

</div>

</div>
</div>






        <!-- Map Section -->
        <div style="height: 50%">
          <h2 class="runs-header">
            <span class="runs-text">Visualization on Map</span>
          </h2>

          <p class="info-text">
          Select a run and a layer to display it on the map.
        </p>

          <h4 class="runs-header" style="margin-bottom: 20px;">
  <span class="text-blue">Run Selection</span>
</h4>

<!-- Run Selector -->
<div class="dropdown" style="margin-bottom: 15px; position: relative; display: flex; justify-content: flex-start;">

  <button 
  class="dropdown-button" 
  :style="{ color: selectedRun_dropdown ? 'black' : 'var(--darkgrey-bg)' }"
  @click="toggleRunDropdown"
>
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


<h4 class="runs-header" style="margin-bottom: 20px;">
  <span class="text-blue">Layer Selection</span>
</h4>
<!-- Visualization Mode Selector -->
<div class="toggle-wrapper" style="margin-bottom: 20px;" >
  <button
    :class="['toggle-half', visualizationMode === 'evaluation' ? 'selected' : '']"
    @click="visualizationMode = 'evaluation'"
  >
    Evaluation
  </button>
  <button
    :class="['toggle-half', visualizationMode === 'network' ? 'selected' : '']"
    @click="visualizationMode = 'network'"
  >
    Optimization
  </button>
</div>






<!-- Conditionally render based on mode -->
<div v-if="visualizationMode === 'evaluation'" style="margin-bottom: 15px;">

  <div class="vis-metric-list-wrapper">
  <div class="vis-metric-list">
  
  <!-- Dropdown Button -->
  <div class="visualization-selection" style="margin-top: 10px;">
  <label
    v-for="metric in selectedMetrics"
    :key="metric.key"
    class="visualization-option"
  >
    <input
      type="checkbox"
      :checked="visualizedMetric?.key === metric.key"
      @change="visualizeMetric(metric)"
    />
    <span class="normal-text">{{ metric.label }}</span>
  </label>
</div>

</div>
</div>


  <!-- Display Button -->
  <div style="margin-top: 30px;">
    <button class="calculate-button" @click="displayEvaluationMap(selectedRun_dropdown)">
      Display
    </button>
  </div>

  
</div>


<div v-if="visualizationMode === 'network'" style="margin-bottom: 15px;">

  <div class="vis-metric-list-wrapper">
  <div class="vis-metric-list">

  <div class="visualization-selection" style="margin-top: 10px;">
    <label
      v-for="type in ['Bike Network', 'Car Network', 'Full Network']"
      :key="type"
      class="visualization-option"
    >
      <input
        type="checkbox"
        :checked="selectedNetworkType === type"
        @change="selectNetworkType(type)"
      />
      <span class="normal-text">{{ type }}</span> <!-- ✨ added class here -->
    </label>
  </div>

  </div>
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
  fetchEvaluationMetricValues
} from "../scripts/api.js";

import Chart from 'chart.js/auto';
import { useLegendStore } from "../stores/legendStore.js";


import {
  createPieChartComplexity,
  createBarChart,
  createDoughnutChart,
  createScatterPlot,
  createSingleMetricBarChart
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
  },
  
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
    const legendStore = useLegendStore();

    




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
      dropdownOpen,
      legendStore
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
      selectedNetworkType: 'Full Network',
      networkDropdownOpen: false,
      metricAverages: {},
      openMetricDropdowns: [],
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
    watch(
      () => [this.selectedMetrics, this.prjStore.selectedEvaluationRuns],
      async () => {
        await this.loadAllAverages();
      },
      { deep: true, immediate: true }
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


      this.legendStore.setLegendKey(metricKey);
    },
    async displayNetworkMap(run) {


      const type = this.selectedNetworkType; // 'Bike', 'Car', 'Full'
      loadWMS("v_optimized", "wms_optimized", this.inputStore.projectID, run.id_run, null, this.selectedNetworkType);
      loadWFS("v_optimized_wfs", "wfs_optimized", this.inputStore.projectID, run.id_run, null, this.selectedNetworkType);

      const key = `network_${type.toLowerCase().split(' ')[0]}`;
      this.legendStore.setLegendKey(key);


    },
    async getAverageMetricValue(metricKey, runId) {
      const cacheKey = `${metricKey}_${runId}`;
      if (!this.metricAverages) this.metricAverages = {};

      if (this.metricAverages[cacheKey] !== undefined) {
        return this.metricAverages[cacheKey];
      }

      const values = await fetchEvaluationMetricValues(
        this.inputStore.projectID,
        runId,
        metricKey
      );

      if (!values.length) {
        this.metricAverages[cacheKey] = "N/A";
        return "N/A";
      }

      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      const rounded = avg.toFixed(2);
      this.metricAverages[cacheKey] = rounded;

      return rounded;
      },
      async loadAllAverages() {
    for (const metric of this.selectedMetrics) {
      for (const run of this.prjStore.selectedEvaluationRuns) {
        await this.getAverageMetricValue(metric.key, run.id_run);
      }
    }
  },
toggleMetric(key) {
  if (this.openMetricDropdowns.includes(key)) {
    this.openMetricDropdowns = this.openMetricDropdowns.filter(k => k !== key);
  } else {
    this.openMetricDropdowns.push(key);
    this.createMetricChart(key);
  }
},
showInfo(metric) {
  alert(this.metricInfoTexts[metric.key] || 'No info available.');
},
async createMetricChart(metricKey) {
  await this.$nextTick();
  const canvases = this.$refs['metricChart_' + metricKey];
  const canvas = Array.isArray(canvases) ? canvases[0] : canvases;
  if (!canvas) return;

  if (canvas.chartInstance) {
    canvas.chartInstance.destroy();
  }

  // All 3 metrics use same gradient and stacked bar chart
  const stackedMetrics = {
    blos_grade: ['A', 'B', 'C', 'D', 'E', 'F'],
    lts: [1, 2, 3, 4],
    bsl: [1, 2, 3, 4, 5]
  };

  if (Object.keys(stackedMetrics).includes(metricKey)) {
    const categories = stackedMetrics[metricKey];
    const gradientColors = ['#da5268', '#e98b98', '#efb8be', '#f4d9db', '#faf0f1', '#ffffff'];
    this.createHorizontalStackedBarChart(canvas, metricKey, categories, gradientColors.slice(0, categories.length));
    return;
  }


  // Default numeric average chart
  const metric = this.selectedMetrics.find(m => m.key === metricKey);
  if (!metric) return;

  const metricLabel = "Average";
  const runNames = this.prjStore.selectedEvaluationRuns.map(run => run.run_name);
  const data = this.prjStore.selectedEvaluationRuns.map(
    run => parseFloat(this.metricAverages[`${metricKey}_${run.id_run}`]) || 0
  );

  const colors = runNames.map(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--pink-color').trim();
  });

  createSingleMetricBarChart(metricLabel, runNames, data, colors, canvas);
  canvas.chartInstance = Chart.getChart(canvas);
},


async createHorizontalStackedBarChart(canvas, metricKey, categories, gradientColors) {
  const runNames = this.prjStore.selectedEvaluationRuns.map(run => run.run_name);

  const categoryCountsPerRun = {};

  for (let run of this.prjStore.selectedEvaluationRuns) {
    const values = await fetchEvaluationMetricValues(this.inputStore.projectID, run.id_run, metricKey);

    const counts = {};
    for (const cat of categories) counts[cat] = 0;

    for (const val of values) {
      const normalized = typeof val === 'string' ? val.toUpperCase() : parseInt(val);
      if (categories.includes(normalized)) {
        counts[normalized]++;
      }
    }

    categoryCountsPerRun[run.run_name] = counts;
  }

  const datasets = categories.map((cat, i) => ({
    label: `${cat}`,
    backgroundColor: gradientColors[i],
    data: runNames.map(runName => categoryCountsPerRun[runName][cat] || 0),
    stack: 'stack1'
  }));

  // 🔧 Adjust bar thickness: previously 90 → now 135px per run
  const barHeightPx = 85;
  const minHeight = 160;
  const canvasHeight = Math.max(runNames.length * barHeightPx, minHeight);
  canvas.style.height = `${canvasHeight}px`;

  if (canvas.chartInstance) {
    canvas.chartInstance.destroy();
  }

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: runNames,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count',
            font: {
              weight: 'bold', 
              size: 14        
            }
            
          }
        },
        y: {
          stacked: true,
          ticks: {
            font: {
              size: 12  // ✅ Smaller labels to match default charts
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 20,
            boxHeight: 12,
            padding: 8,
            font: {
              size: 12
            }
          }
        }

      }
    }
  });

  canvas.chartInstance = chart;
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
@import "../styles/EvaluationDashboardStyle.css";
@import "../styles/EvaluationDashboardStyleMobile.css";



/* Redefine dropdown-button to match dropbtn style */
.dropdown-button {
  background-color: var(--lightgrey-bg);
  color: var(--darkgrey-bg);
  border: 1px solid var(--darkgrey-bg);
  width: 250px;
  margin: 0;
  padding: 0;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: left;
  padding-left: 10px;
  padding-right: 10px;
  display: flex; 
  justify-content: space-between; 
  align-items: center;
}

/* Redefine dropdown-menu to match dropdown-content style */
.dropdown-menu {
  position: absolute;
  width: 250px;
  text-align: left;
  background-color: #f9f9f9;
  border-radius: 5px;
  margin-top: 5px;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}


/* Dropdown list items */
.dropdown-menu li {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

/* Hover effect */
.dropdown-menu li:hover {
  background-color: #f1f1f1;
}


.visualization-mode-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.toggle-wrapper {
  display: flex;
  width: 250px;
  height: 40px;
  background-color: var(--lightgrey-bg);
  border: 1px solid var(--darkgrey-bg);
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 10px;
}

.toggle-half {
  flex: 1;                  /* ensures each half fills 50% */
  height: 100%;
  background: transparent;
  font-size: 16px;
  font-weight: normal;
  color: black;
  border: none;
  padding: 0;
  margin: 0;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 0px;
}

.toggle-half.selected {
  background-color: dimgrey;
  color: white;
}

.toggle-half:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.toggle-half:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}




.visualization-selection {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.visualization-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 500;
}

.visualization-option input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid dimgray;
  border-radius: 50%; /* Makes it a circle */
  background-color: transparent;
  cursor: pointer;
  position: relative;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; /* <--- add this */
  font-size: 14px; /* optional, matches info-text look */
}

.visualization-option input[type="checkbox"]:checked {
  background-color: var(--pink-color);

  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; /* <--- add this */
  font-size: 14px; /* optional, matches info-text look */
  font-weight: normal;
}
.metric-dropdown {
  margin-top: 20px;
  border: 1px solid var(--darkgrey-bg);
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 5px rgba(0,0,0,0.1);
}

.metric-header {
  background-color: var(--lightgrey-bg);
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
}

.metric-header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.metric-content {
  padding: 15px;
}

.info-icon {
  color: var(--pink-color);
  font-size: 16px;
  cursor: pointer;
}

.normal-text {
  padding-bottom: 0px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; /* <--- add this */
  font-size: 14px; /* optional, matches info-text look */
  font-weight: normal;
}

:root {
  --run-color-0: #e6194b;
  --run-color-1: #3cb44b;
  --run-color-2: #ffe119;
  --run-color-3: #4363d8;
}

.metric-list-wrapper {
  height: 400px; /* fixed height to preserve layout */
  overflow-y: scroll; /* scroll when content overflows */
  margin-bottom: 20px; /* spacing before "Add runs" and Metric Selection */
}

.metric-list {
  width: 100%; /* same as dropdown */
  margin-top: 10px;
  padding: 0;
}
.vis-metric-list-wrapper {
  height: 115px; /* fixed height to preserve layout */
  overflow-y: scroll; /* scroll when content overflows */
  margin-bottom: 20px; /* spacing before "Add runs" and Metric Selection */
}

.vis-metric-list {
  width: 100%; /* same as dropdown */
  margin-top: 10px;
  padding: 0;
}

canvas {
  width: 100% !important;
  display: block;
}








</style>