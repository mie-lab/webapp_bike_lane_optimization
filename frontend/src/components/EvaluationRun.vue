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
          This is the overview of the project <i>{{ inputStore.projectName }}</i>. For evaluating an optimized bike network in the specified area, select a one or multiple optimization runs from the list below. ‘
        </p>

        <!-- Runs Header -->
        <div class="runs-header-container">
          <h3 class="runs-header">
            <span class="runs-text">Selected Runs</span>
            <span class="ring-loader-container">
              <div class="ring-loader">
                <RingLoader v-if="isLoading" :size="'80'" :color="'#123abc'" />
              </div>
            </span>
          </h3>
        </div>
  
  <div class="project-list-wrapper">
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
</div>




        <!-- Add Runs Button -->
        <div class="button-container" style="margin-top: 10px; display: flex; justify-content: center;">
          <button @click="() => { toggleUserInputPreviousSide(); prjStore.clearTempEvaluationRuns(); statusStore.toggleRunPage(); statusStore.createNewRunPage=false;}" class="back-button">
          Switch Project
        </button>

  <button @click="() => {toggleUserInputPreviousSide(); toggleMetricsChangedSinceLastCompute(); }">
    Add runs
  </button>
</div>




        <!-- Metric Selection -->

        <div style="margin-top: 30px;">
  <h2 class="runs-header">
    <span class="runs-text">Metric selection</span>
  </h2>

  <p class="info-text">
    Select one or multiple evaluation metrics from the dropdown below to evaluate chosen runs.
  </p>

  <!-- Dropdown -->
  <div class="dropdown" ref="metricDropdownRef" style="margin-bottom: 15px; position: relative;">
    <button class="dropdown-button" @click="toggleMetricDropdown" >
      <div class="dropdown-button-content">
        <span>Select Metrics</span>
        <i class="fa-solid fa-caret-down"></i>
      </div>
    </button>

    <ul v-show="metricDropdownOpen" class="dropdown-menu" style="max-height: 200px; overflow-y: auto;">
      <li
        v-for="metric in inputStore.tempMetrics"
        :key="metric.key"
        style="padding: 5px 10px;"
      >
        <label style="display: flex; align-items: center;">
          <input
            type="checkbox"
            class="custom-checkbox"
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
<!-- Selected Metrics Display -->
<div v-if="selectedMetrics.length > 0" class="anp-attributes" style="margin-top: 20px; display: flex; flex-direction: column; gap: 2px;">

<h3 class="runs-header" style="margin-bottom: 20px;">
  <span class="text-blue">Selected Metrics</span>
</h3>

<div
  v-for="metric in selectedMetrics"
  :key="metric.key"
  style="display: flex; align-items: center;"
>
  <p class="normal-text" style="margin: 0;">{{ metric.label }}</p>
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
import { evaluationProcessListStore } from "../stores/evaluationProcessListStore.js";


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
    const evalStore = evaluationProcessListStore();


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
      selectedMetric,
      evalStore
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
      showInfoBoxANP: false,
    };
  },


    // Clone current selections from global store
    mounted() {
      document.addEventListener("click", this.handleClickOutsideMetricDropdown);



  },

  beforeUnmount() {
  document.removeEventListener("click", this.handleClickOutsideMetricDropdown);
},






  computed: {
  isANPSelected() {
    return this.inputStore.tempMetrics.some(m => m.key === "anp" && m.selected);
  },
  selectedMetrics() {
    return this.inputStore.tempMetrics.filter(m => m.selected);
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

  // Show sidebar immediately
  this.statusStore.processList = false;
  this.statusStore.evalProcessList = true;

  // Prepare selected runs
  this.prjStore.setSelectedEvaluationRuns(
    JSON.parse(JSON.stringify(this.prjStore.tempSelectedEvaluationRuns))
  );

  // Sync selected metrics from temp store
  this.inputStore.allMetrics.forEach(metric => {
    const tempMetric = this.inputStore.tempMetrics.find(m => m.key === metric.key);
    metric.selected = tempMetric ? tempMetric.selected : false;
  });

  // For each selected run and metric
  for (const run of this.prjStore.selectedEvaluationRuns) {
    console.log("▶️ Evaluating run:", run.run_name, "(id:", run.id_run + ")");

    for (const metric of this.inputStore.allMetrics.filter(m => m.selected)) {
      const projectId = this.inputStore.projectID;
      const evalId = `${projectId}-${run.id_run}-${metric.key}`;
      const metricObj = this.inputStore.tempMetrics.find(m => m.key === metric.key);

      // ✅ Check if this evalId is already in the process list
      const alreadyTracked = this.evalStore.evaluationProcesses.some(
        (p) => p.id === evalId
      );

      if (!alreadyTracked) {
        // ➕ Add new process if not already tracked
        this.evalStore.addEvaluationProcess({
          id: evalId,
          projectName: this.inputStore.projectName,
          runName: run.run_name,
          metricLabel: metricObj ? metricObj.label : metric.key,
          status: "pending",
        });

        console.log("🟢 Added eval process:", evalId);
      } else {
        console.log("⏭️ Skipping duplicate process:", evalId);
      }

      // 🔍 Check if metric result already exists
      let alreadyExists = false;
      try {
        alreadyExists = await checkIfEvalMetricExists(
          run.id_run,
          metric.key,
          projectId
        );
      } catch (err) {
        console.error("❌ Error checking metric existence:", err);
      }

      // 🚀 Trigger computation if necessary
      if (!alreadyExists) {
        try {
          await triggerEvalMetricComputation(
            run.id_run,
            metric.key,
            projectId
          );
          console.log("🚀 Computation triggered:", evalId);
        } catch (err) {
          console.error("❌ Error triggering computation:", err);
        }
      } else {
        console.log("⏩ Metric already exists, skipping computation:", evalId);
      }

      // ✅ Mark the process as done (always)
      this.evalStore.markEvaluationAsDone(evalId);
      console.log("✅ Marked as done:", evalId);
    }
  }

  // UI updates
  this.showMetricsTable = true;
  this.statusStore.DashboardMode = "Evaluation";
  this.statusStore.openDashboard();
  this.metricsChangedSinceLastCompute = false;
  this.statusStore.evalProcessList = false;

}

,

  
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
  },
  handleClickOutsideMetricDropdown(event) {
  const dropdown = this.$refs.metricDropdownRef;
  if (dropdown && !dropdown.contains(event.target)) {
    this.metricDropdownOpen = false;
  }


  },


}

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
  background-color: var(--lightgrey-bg);
  color: black;
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

.dropdown-button-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}


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

.project-list-wrapper {
  height: 250px; /* fixed height to preserve layout */
  overflow-y: scroll; /* scroll when content overflows */
  margin-bottom: 20px; /* spacing before "Add runs" and Metric Selection */
}

.project-list-wrapper::-webkit-scrollbar {
  width: 8px;
  background-color: transparent;
}

.project-list-wrapper::-webkit-scrollbar-thumb {
  background-color: var(--darkgrey-bg);
  border-radius: 5px;
}

.project-list-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: var(--pink-color);
}

.project-list-wrapper {
  scrollbar-color: var(--darkgrey-bg) transparent;
  scrollbar-width: thin;
}


.project-list {
  width: 100%; /* same as dropdown */
  margin-top: 10px;
  padding: 0;
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
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px; /* or match your info-text size */
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

.text-blue {
  margin-top: 2px;
}

.normal-text {
  padding-bottom: 0px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; /* <--- add this */
  font-size: 14px; /* optional, matches info-text look */
}


.custom-checkbox {
  width: 16px;
  height: 16px;
  appearance: none;
  -webkit-appearance: none;
  background-color: transparent;
  border: 2px solid dimgray;
  border-radius: 3px;
  cursor: pointer;
  display: inline-block;
  position: relative;
}

.custom-checkbox:checked {
  background-color: var(--pink-color);
}












</style>
