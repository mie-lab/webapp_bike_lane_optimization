<template>
  <div>
    <!-- Run list -->
    <div>
      <div class="user-input-container">
        <h4 class="h4_override">Project:</h4>
        <h2 class="h2_override">
          {{ inputStore.projectName }} | {{ runName }}
        </h2>

        <p class="info-text">
          This is the overview of the project <i>{{ inputStore.projectName }}</i>. ......
        </p>

        <!-- Runs Header -->
        <div class="runs-header-container">
          <h3 class="runs-header">
            <span class="runs-text">Runs</span>
            <span class="refresh-container">
              <i
                v-if="!isLoading"
                class="fa-solid fa-rotate-right refresh-button"
                @click="reloadRuns"
              ></i>
            </span>
            <span class="ring-loader-container">
              <div class="ring-loader">
                <RingLoader v-if="isLoading" :size="'80'" :color="'#123abc'" />
              </div>
            </span>
          </h3>
        </div>

  <div class="project-list">
    <ul>
      <li
        v-for="run in prjStore.tempSelectedEvaluationRuns"
        :key="run.run_name"
      >
      <div class="run-summary">
  <div class="run-dropdown-toggle" @click="toggleRun(run.run_name)">
    <span>{{ run.run_name }}</span>
    <i
      :class="[
        'fa-solid',
        expandedRuns[run.run_name] ? 'fa-chevron-up' : 'fa-chevron-down'
      ]"
      style="margin-left: 10px;"
    ></i>
  </div>

  <button class="remove-button" @click.stop="removeRun(run)">Remove</button>
</div>

        <!-- Expanded Run Details -->
        <div
          v-if="expandedRuns[run.run_name]"
          class="run-details2 selected"
          style="margin-top: 10px;"
        >
          <div class="run-details-inner-container">
            <div class="run_name selected">{{ run.run_name }}</div>
            <table>
              <colgroup>
                <col style="width: 30px;" />
                <col style="width: 270px;" />
                <col style="width: 20px;" />
              </colgroup>
              <tr>
                <td><i class="fa-solid fa-gears"></i></td>
                <td>Algorithm</td>
                <td class="bold">{{ convertAlgName(run.algorithm) }}</td>
              </tr>
              <tr>
                <td><i class="fa-solid fa-bicycle"></i></td>
                <td>Bike lane ratio</td>
                <td class="bold">{{ (run.bike_ratio * 100).toFixed() }}%</td>
              </tr>
              <tr>
                <td><i class="fa-solid fa-shield-heart"></i></td>
                <td>Safety penalty</td>
                <td class="bold">{{ run.bike_safety_penalty }}</td>
              </tr>
              <tr v-if="convertAlgName(run.algorithm) === 'O'">
                <td><i class="fa-solid fa-car"></i></td>
                <td>Car weight</td>
                <td class="bold">{{ run.car_weight }}</td>
              </tr>
              <tr v-if="convertAlgName(run.algorithm) === 'O'">
                <td><i class="fa-solid fa-arrow-up-short-wide"></i></td>
                <td>Optimize Frequency</td>
                <td class="bold">{{ run.optimize_frequency }}</td>
              </tr>
            </table>
          </div>
        </div>

        <br />
      </li>
    </ul>
  </div>




        <!-- Add Runs Button -->
        <div class="button-container" style="margin-top: 10px;">
          <button @click="() => {toggleUserInputPreviousSide(); toggleMetricsChangedSinceLastCompute(); }" class="back-button">
            Add runs
          </button>
        </div>

        <!-- Metric Selection -->

        <div style="margin-top: 30px;">
  <h3 class="runs-header">
    <span class="runs-text">Metric selection</span>
  </h3>

  <!-- Dropdown -->
  <div class="dropdown" style="margin-bottom: 15px; position: relative;">
    <button class="dropdown-button" @click="toggleMetricDropdown">
      <div class="dropdown-button-content">
        <span>Choose Metrics</span>
        <i class="fa-solid fa-caret-down"></i>
      </div>
    </button>

    <ul v-show="metricDropdownOpen" class="dropdown-menu" style="max-height: 200px; overflow-y: auto;">
      <li
        v-for="metric in localMetrics"
        :key="metric.key"
        style="padding: 5px 10px;"
      >
        <label style="display: flex; align-items: center;">
          <input
            type="checkbox"
            v-model="metric.selected"
            @change="handleMetricToggle(metric)"
            style="margin-right: 8px;"
          />
          {{ metric.label }}
        </label>
      </li>
    </ul>
  </div>

  <!-- Selected Metrics Display -->
  <div v-if="selectedMetrics.length > 0" class="anp-attributes" style="margin-top: 20px;">

    <h4 class="runs-header">
        <span class="runs-text">Selected Metrics</span>
      </h4>

    <div
      v-for="metric in selectedMetrics"
      :key="metric.key"
      class="bike-ratio"
      style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between;"
    >
      <div style="display: flex; align-items: center;">
        <label class="runs-header">
          <span class="runs-text">{{ metric.label }}</span>
        </label>
      </div>
    </div>
  </div>

  <!-- ANP Section (unchanged) -->
  <div v-if="isANPSelected" class="anp-attributes" style="margin-top: 30px;">
    <div>
      <h4 class="runs-header">
        <span class="runs-text">ANP Configuration</span>
      </h4>
    </div>
    <div
      v-for="attr in anpAttributes"
      :key="attr.key"
      class="bike-ratio"
      style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between;"
    >
      <div style="display: flex; align-items: center; gap: 10px;">
        <input
          type="checkbox"
          v-model="attr.enabled"
          :id="attr.key"
        />
        <label :for="attr.key" class="text-blue" style="margin: 0;">
          {{ attr.label }}
        </label>
      </div>
      <div class="slide-container" style="flex-grow: 1; margin-left: 20px;">
        <input
          class="slider"
          type="range"
          min="0"
          max="100"
          :disabled="!attr.enabled"
          v-model="attr.value"
          @input="updateANP(attr.key, attr.value)"
        />
      </div>
      <p style="margin-left: 10px; width: 60px; text-align: right;">
        {{ attr.value }}%
      </p>
    </div>
  </div>

  <!-- Compute Button -->
  <div style="margin-top: 30px;">
    <button
  class="calculate-button"
  :class="{ 'button-disabled': isComputeButtonInactive }"
  :disabled="isComputeButtonInactive"
  @click="computeMetrics"
>
  Compute
</button>

  </div>
</div>






      </div>

      <!-- Close Button -->
      <button class="close-btn" @click="toggleTabsVisibility">
        <i class="fa-solid fa-times" style="font-size: 20px; color: var(--darkgrey-bg)"></i>
      </button>
    </div>

    <!-- If New Run Page -->
  </div>
</template>






<script>
import { userInputStore } from "../stores/userInputStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { useResultsStore } from "../stores/runResultsStore.js";
import { projectsStore } from "../stores/projectsStore.js";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import { ref, computed} from "vue";
import {
  getBoundingBox,
  getRunList,
  checkIfEvalMetricExists,
  triggerEvalMetricComputation

} from "../scripts/api.js";
import { loadWFS, loadWMS } from "../scripts/map.js";
import UserInputNewRun from "./UserInputNewRun.vue";
import { useCompareRunEvaluation } from "../stores/compareRunResultStore.js";

export default {
  name: "UserInputRun",
  components: {
    RingLoader,
    UserInputNewRun,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const resultsStore = useResultsStore();
    const prjStore = projectsStore();
    const compareRunStore = useCompareRunEvaluation();
    const searchQuery = ref("");
    const dropdownOpen = ref(false);
    const selectedMetric = ref(null);

    // Sort projects by "created" timestamp in descending order
    const filteredRuns = computed(() => {
      const prjArray = prjStore.runs.runs
      if (prjArray) {
        return prjArray
          .slice() 
          .filter((run) =>
            run.run_name
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase())
          );
      }
      return [];
    });

    return {
      statusStore,
      resultsStore,
      prjStore,
      inputStore,
      searchQuery,
      projectName: inputStore.projectName,
      filteredRuns,
      compareRunStore,
      dropdownOpen,
      selectedMetric
    };
  },
  data() {
    const inputStore = userInputStore();
    const statusStore = statusVariablesStore();
    return {
      isButtonDisabled: true,
      projectName: inputStore.projectName,
      setRunName: inputStore.setRunName,
      runName: "",
      color: "#da5268",
      size: "25px",
      isLoading: false,
      selectedRun: null,
      modeDropdownOpen: false,
      selectedRun_dropdown: null,
      runDropdownOpen: false,
      anpAttributes: [
      { key: 'accessibility', label: 'Accessibility', value: 50, enabled: true },
      { key: 'attractiveness', label: 'Attractiveness', value: 50, enabled: true },
      { key: 'safety', label: 'Safety', value: 50, enabled: true },
      ],
      statusStore,
      metricDropdownOpen: false,
      expandedRuns: {},
      metricsChangedSinceLastCompute: true,
      localMetrics: []
    };
  },


    // Clone current selections from global store
    mounted() {
      this.localMetrics = JSON.parse(JSON.stringify(this.inputStore.allMetrics));



  },



  computed: {
  isANPSelected() {
    return this.localMetrics.some(m => m.key === "anp" && m.selected);
  },
  selectedMetrics() {
    return this.localMetrics.filter(m => m.selected);
  },
  isComputeDisabled() {
    const noRuns = this.prjStore.tempSelectedEvaluationRuns.length === 0;
    const noMetrics = this.selectedMetrics.length === 0;
    return noRuns || noMetrics;
  },
  isComputeButtonInactive() {
    return this.isComputeDisabled || !this.metricsChangedSinceLastCompute;
  }
},



  methods: {
    
    toggleUserInputNextSide() {
      this.statusStore.toggleLoadPage();
    },
    toggleUserInputPreviousSide() {
      this.statusStore.toggleEvaluationRunPage();
    },
    openCreate() {
      this.statusStore.toggleCreateNewRunPage();
    },
    async loadRun(run) {
      this.statusStore.openDashboard();
      this.prjStore.setSelectedRun(run);
      this.selectedRun = run;

      this.compareRunStore.reset(); // reset all comparisons
      this.inputStore.setRunID(run.id_run);
      

      // on mobile screen, toggle the page
      if (window.innerWidth <= 600) {
          this.statusStore.toggleTabsVisibility();
          this.statusStore.closeDashboard();
        }

      // create view on the map for the selected run
      await getBoundingBox(this.inputStore.projectID);
      loadWMS("v_eval_pivoted", "wms_eval_pivoted",this.inputStore.projectID, run.id_run);
      loadWFS("v_eval_pivoted_wfs", "wfs_eval_pivoted",this.inputStore.projectID, run.id_run);

      this.runName = run.run_name;
      this.inputStore.setRunName(this.runName);

    },

    toggleUserInputNextSide() {
      this.statusStore.toggleRunPage();
    },

    toggleTabsVisibility() {
      this.statusStore.toggleTabsVisibility();
    },

    async reloadRuns() {
      this.isLoading = true;

      try {
        const response = await getRunList(this.inputStore.projectID);
        this.prjStore.setRuns(response);
        this.filteredRuns = this.prjStore.runs.runs;
      } catch (error) {
        console.log("error: ", error.message);
      } finally {
        this.isLoading = false;
      }
    },

    convertAlgName(algorithm){
      if (algorithm.trim().toLowerCase() === "betweenness_biketime") {
        return "BB";}
      else if (algorithm.trim().toLowerCase() === "betweenness_cartime") {
        return "BC";
      } 
      else if (algorithm.trim().toLowerCase() === "optimize") {
        return "O";
      } 
     else {
        return algorithm;
    }
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectMetric(metric) {
      this.selectedMetric = metric;
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
    toggleMetricDropdown() {
      this.metricDropdownOpen = !this.metricDropdownOpen;
    },
    
      
      
    async computeMetrics() {
  console.log("▶️ computeMetrics started");

  this.prjStore.setSelectedEvaluationRuns(
  JSON.parse(JSON.stringify(this.prjStore.tempSelectedEvaluationRuns))
);


  this.inputStore.allMetrics.forEach(metric => {
  const localMetric = this.localMetrics.find(m => m.key === metric.key);
  metric.selected = localMetric ? localMetric.selected : false;
});


  for (const run of this.prjStore.selectedEvaluationRuns) {
    console.log("▶️ Evaluating run:", run.run_name, "(id:", run.id_run + ")");

    for (const metric of this.inputStore.allMetrics.filter(m => m.selected)) {
      console.log("  ➤ Checking metric:", metric.key);

      let alreadyExists = false;

      try {
        alreadyExists = await checkIfEvalMetricExists(run.id_run, metric.key, this.inputStore.projectID);
        console.log("    ✅ Metric exists?", alreadyExists);
      } catch (checkErr) {
        console.error("    ❌ Error in checkIfEvalMetricExists:", checkErr);
      }

      if (!alreadyExists) {
        console.log("    🚀 Triggering computation for:", metric.key);

        try {
          await triggerEvalMetricComputation(run.id_run, metric.key, this.inputStore.projectID);
          console.log("    ✅ Computation finished for", metric.key);
        } catch (triggerErr) {
          console.error("    ❌ Error in triggerEvalMetricComputation:", triggerErr);
        }
      } else {
        console.log("    ⏩ Skipping", metric.key, "– already in DB");
      }
    }
  }

  console.log("▶️ All metrics processed. Showing table & opening dashboard.");

  try {
    this.showMetricsTable = true;
    this.statusStore.DashboardMode = "Evaluation";
    this.statusStore.openDashboard();
  } catch (finalErr) {
    console.error("❌ Error during final UI update:", finalErr);
  }

  this.metricsChangedSinceLastCompute = false;

  },

  
    toggleRun(runName) {
      this.expandedRuns[runName] = !this.expandedRuns[runName];
    },
    removeRun(run) {
      this.prjStore.removeTempEvaluationRun(run);
      // Optionally also collapse it
      this.$delete(this.expandedRuns, run.run_name);
    },
    handleMetricToggle(metric) {
  this.metricsChangedSinceLastCompute = true;
  },
  toggleMetricsChangedSinceLastCompute(){
    this.metricsChangedSinceLastCompute = true;
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
/* Only apply pink to the run name title */
.run_name.selected {
  color: var(--pink-color);
}

/* Keep attributes black (no override needed unless they're inheriting .selected) */
.run-details-inner-container td,
.run-details-inner-container td.bold {
  color: black;
}


.buttons {
  margin-top: 20px;
}

.run-details2 {
  border: 1px solid var(--darkgrey-bg);
}

.run-details2.selected {
  border-color: var(--pink-color);
}

.metrics-container {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.metrics-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

/* Dropdown styling */
.dropdown {
  position: relative;
  width: 100% !important ;
}

.dropdown-button {
  width: 100%;
  padding: 10px;
  background-color: lightgrey;
  color: black;
  border: 1px solid var(--darkgrey-bg);
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  box-sizing: border-box;
}

.dropdown-button-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
.dropdown-label {
  flex: 1;
}

.remove-button {
  background-color: transparent;
  color: #da5268;
  border: 1px solid #da5268;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.remove-button:hover {
  background-color: #da52681a;
}

.project-list {
  width: 100%; /* same as dropdown */
  margin-top: 10px;
  padding: 0;
  max-height: none; /* remove the vertical scroll constraint */
  overflow: visible; /* prevent scrollbars */
}

.run-summary {
  display: flex;
  align-items: center;
  width: 100%;
}

.run-dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: lightgrey;
  padding: 6px 10px;
  border: 1px solid var(--darkgrey-bg);
  border-radius: 5px;
  cursor: pointer;
  width: 80%;
  height: 36px;
  box-sizing: border-box;
}



.run-dropdown-toggle:hover {
  background-color: #e0e0e0;
}

.button-disabled {
  background-color: #f5c6cf !important; /* light pink */
  color: black !important;
  cursor: not-allowed;
  border: 1px solid red;
}









</style>
