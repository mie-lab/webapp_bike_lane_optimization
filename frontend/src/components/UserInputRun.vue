<template>
  <!-- Components that show all runs within a project -->
  <div>
    <!-- Run list -->
    <div v-if="!statusStore.createNewRunPage">
      <div class="user-input-container">
        <h4 class="h4_override">Project:</h4>
        <h2 class="h2_override">
          {{ inputStore.projectName }} | {{ runName }}
        </h2>

        <p class="info-text">
          This is the overview of the project <i>{{ inputStore.projectName }}</i>. For planning a new bike network in the specified area, create a new run. For viewing a bike network from an existing run, select from the list below.
          
        </p>

        <h3 class="runs-header">
          <span class="runs-text">Runs</span>
          <span class="refresh-container">
            <i
              v-if="!isLoading"
              class="fa-solid fa-rotate-right refresh-button"
              @click="reloadRuns"
            >
            </i>
          </span>
          <span class="ring-loader-container">
            <div class="ring-loader">
              <RingLoader v-if="isLoading" :size="'80'" :color="'#123abc'" />
            </div>
          </span>
        </h3>
    
        <input
        type="text"
        v-model="searchQuery"
        placeholder="Search runs..."
        class="project-name-input"
      />
        <!-- List of all runs -->
        <div class="project-list">
          <ul>
            <li
              v-for="run in filteredRuns"
              :key="run.run_name"
              @click="loadRun(run)"
            >
            <div :class="{ 'run-details2': true, 'selected': run === selectedRun }">
                <div class="run-details-inner-container" style="color: black;">
                  <div class="run_name" 
              :class="{ selected: run === selectedRun }">{{ run.run_name }}</div>
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
                      <td class="bold">{{ (run.bike_ratio*100).toFixed() }}%</td>
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
              <br></br>
              
            </li>
          </ul>
        </div>
      </div>

      <button class="close-btn" @click="toggleTabsVisibility">
        <i
          class="fa-solid fa-times"
          style="font-size: 20px; color: var(--darkgrey-bg)"
        ></i>
      </button>

       <!-- Button for going back and for creating a new run -->
      <div class="buttons">
        <button @click="() => { toggleUserInputPreviousSide(); prjStore.clearTempEvaluationRuns(); toggleEvaluationRunPreviousSide();}" class="back-button">
          Back
        </button>
        <button @click="openCreate">Create new Run</button>
      </div>
    </div>

    <div v-if="statusStore.createNewRunPage">
      <UserInputNewRun />
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
      this.statusStore.openDashboard("userinput");
      this.prjStore.setSelectedRun(run);
      this.selectedRun = run;
      this.statusStore.DashboardMode = "UserInput";

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
    toggleEvaluationRunPreviousSide() {
      this.statusStore.evaluationrunPage=false;
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
.selected {
  color: var(--pink-color);
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
</style>
