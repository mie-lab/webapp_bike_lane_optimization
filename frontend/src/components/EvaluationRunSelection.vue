
<!-- In this file, network runs of a project can be selected for computation. The content appears after a project is selected for evaluation in EvaluationLoad.vue. After selecting the runs, they can be evaluated, opening up the content of the file EvaluationRun.vue. -->

<template>
  <div>
    <!-- Run list. All runs of the selected project are listed and can be selected. -->
    <div v-if="!statusStore.evaluationrunPage">
      <div class="user-input-container">
        <h4 class="h4_override">Project:</h4>
        <h2 class="h2_override">
          {{ inputStore.projectName }} | {{ runName }}
        </h2>

        <p class="info-text">
          This is the overview of the project <i>{{ inputStore.projectName }}</i>. For evaluating one or multiple runs, select them in the list below and press evaluate.
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

        <!-- Search Bar. Specific runs can be searched. -->
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search runs..."
          class="project-name-input"
        />

        <!-- All runs are listed with their input parameters. -->
        <div class="project-list">
          <ul>
            <li
              v-for="run in filteredRuns"
              :key="run.run_name"
              @click="prjStore.toggleTempEvaluationRun(run)"
            >
            <div :class="{ 'run-details2': true, 'selected': prjStore.isTempEvaluationRunSelected(run) }">

                <div class="run-details-inner-container">
                  <div class="run_name" :class="{ selected: prjStore.isTempEvaluationRunSelected(run) }">

                    {{ run.run_name }}
                  </div>
                  <table>
                    <colgroup>
                      <col style="width: 30px;">
                      <col style="width: 270px;">
                      <col style="width: 20px;">
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
                      <td>Car weight:</td>
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
        
        <div class="buttons">

        <!-- Back button. Users can return to EvaluationLoad.vue.-->
        <button @click="() => { toggleUserInputPreviousSide(); prjStore.clearTempEvaluationRuns(); statusStore.createNewRunPage=false;}" class="back-button">
          Back
        </button>

        <!-- Evaluate button. The selected runs can be evaluated, opening up the window EvaluationRun.vue.-->
        <button @click="statusStore.toggleEvaluationRunPage">
          Evaluate
        </button>
      
    </div>
      </div>

      <button class="close-btn" @click="toggleTabsVisibility">
        <i class="fa-solid fa-times" style="font-size: 20px; color: var(--darkgrey-bg)"></i>
      </button>
    </div>

    <div v-if="statusStore.evaluationrunPage">
      <EvaluationRun />
    </div>

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
} from "../scripts/api.js";
import { loadWFS, loadWMS } from "../scripts/map.js";
import UserInputNewRun from "./UserInputNewRun.vue";
import EvaluationRun from "./EvaluationRun.vue";
import { useCompareRunEvaluation } from "../stores/compareRunResultStore.js";

export default {
  name: "UserInputRun",
  components: {
    RingLoader,
    UserInputNewRun,
    EvaluationRun
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
    const metricsOptions = [
      "LTS (Level of Traffic Stress)",
      "BCI (Bicycle Compatibility Index)",
      "BSL (Bicycle Stress Level)",
      "BLOS (Bicycle Level of Service)",
      "Porter Index",
      "Weikl Index"
    ];

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
      metricsOptions,
    };
  },
  data() {
    const inputStore = userInputStore();
    return {
      isButtonDisabled: true,
      projectName: inputStore.projectName,
      setRunName: inputStore.setRunName,
      runName: "",
      color: "#da5268",
      size: "25px",
      isLoading: false,
      selectedRun: null,
    };
  },

  methods: {
    toggleUserInputNextSide() {
      this.statusStore.toggleLoadPage();
    },
    toggleUserInputPreviousSide() {
      this.statusStore.toggleRunPage();
    },
    openCreate() {
      this.statusStore.toggleCreateNewRunPage();
    },
    async loadRun(run) {
      this.statusStore.openDashboard("evaluation");
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
      loadWMS("v_optimized", "wms_optimized",this.inputStore.projectID, run.id_run);
      loadWFS("v_optimized_wfs", "wfs_optimized",this.inputStore.projectID, run.id_run);

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
  width: 250px;
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
</style>
