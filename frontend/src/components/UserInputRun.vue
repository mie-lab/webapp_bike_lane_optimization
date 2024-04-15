<template>
  <div>
    <!-- Run list -->
    <div v-if="!statusStore.createNewRunPage">
      <div class="user-input-container">
        <h4 class="h4_override">Project:</h4>
        <h2 class="h2_override">
          {{ inputStore.projectName }} | {{ runName }}
        </h2>

        <p class="info-text">
          This is your project overview. <br />
          Make multiple runs with different paramters for the chosen area.
          <br />
          <br />
          Create a new Run for the project, or click on already existing runs to
          see their results.
        </p>
      </div>
      <br />
      <br />
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

      <div class="list-header">
        <div class="header-item-left"><p class="run_list_name">Name</p></div>
        <div class="header-item"><i class="far fa-clock"></i></div>
        <div class="header-item">
          <i class="fa-solid fa-lines-leaning"></i>
        </div>
      </div>
      <div class="project-list">
        <ul>
          <li
            v-for="run in filteredRuns"
            :key="run.run_name"
            @click="loadRun(run)"
            :class="{ selected: run === selectedRun }"
          >
            <div class="run-details">
              <div class="run_name">{{ run.run_name }}</div>
              <div class="run_tt_weight">{{ run.bike_ratio }}</div>
              <div class="run_alloc">{{ run.optimize_frequency }}%</div>
            </div>
            <hr class="divider" />
          </li>
        </ul>
      </div>

      <!-- User input container -->
      <button class="close-btn" @click="toggleTabsVisibility">
        <i
          class="fa-solid fa-times"
          style="font-size: 20px; color: var(--darkgrey-bg)"
        ></i>
      </button>

      <div class="buttons">
        <button @click="toggleUserInputPreviousSide" class="back-button">
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
import { runOptimization } from "../scripts/api.js";
import { userInputStore } from "../stores/userInputStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { useResultsStore } from "../stores/algorithmResultsStore.js";
import { projectsStore } from "../stores/projectsStore.js";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import { ref } from "vue";
import {
  createView,
  getRunList,
  evalTravelTime,
  getPareto,
} from "../scripts/api.js";
import { loadLayer } from "../scripts/map.js";
import UserInputNewRun from "./UserInputNewRun.vue";
import { storeToRefs } from "pinia";

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

    var filteredRuns = prjStore.runs.runs;
    const runs = ref([]);

    // Update runs whenever the component is mounted
    const updateRuns = () => {
      runs.value = prjStore.runs.runs;
    };

    updateRuns();

    return {
      statusStore,
      resultsStore,
      inputStore,
      projectName: inputStore.projectName,
      runs,
      filteredRuns,
      updateRuns,
    };
  },
  data() {
    const inputStore = userInputStore();
    return {
      timeWeighting: 0.7,
      laneAllocation: 10,
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
      const statusStore = statusVariablesStore();
      statusStore.toggleLoadPage();
    },
    toggleUserInputPreviousSide() {
      const statusStore = statusVariablesStore();
      statusStore.toggleRunPage();
    },
    openCreate() {
      const statusStore = statusVariablesStore();
      statusStore.toggleCreateNewRunPage();
      console.log("Create new Run");
    },
    async loadRun(run) {
      console.log("Loading run: ", run.run_name, run.id_run);
      console.log("Run: ", run);

      this.selectedRun = run;

      const inputStore = userInputStore();

      inputStore.setRunID(run.id_run);
      this.runName = run.run_name;
      inputStore.setRunName(this.runName);

      const response = await createView(
        inputStore.projectID,
        run.id_run,
        "v_optimized"
      );
      console.log("Create View Response: ", response);

      loadLayer("v_optimized", "wms_optimized");
      console.log("Layyer loaded");
      //loadLayer("v_point_direction", "wms_point_direction");

      // create evaluation for the selected run
      const ResultsStore = useResultsStore();
      const responseEvaluation = await evalTravelTime(
        inputStore.projectID,
        run.id_run
      );
      console.log(responseEvaluation.bike_travel_time);
      ResultsStore.setEvaluation(
        responseEvaluation.bike_travel_time,
        responseEvaluation.car_travel_time
      );

      const paretoEvaluation = await getPareto(
        inputStore.projectID,
        run.id_run
      );
      console.log(paretoEvaluation);

      // Extracting data from paretoEvaluation
      const projects = paretoEvaluation.projects;
      const bikeTimes = projects.map((project) => project.bike_time);
      const carTimes = projects.map((project) => project.car_time);

      ResultsStore.setTraveltimes(bikeTimes, carTimes);

      const statusStore = statusVariablesStore();
      statusStore.openDashboard();
    },

    toggleActiveTab(tab) {
      // Toggle the active tab using the Pinia store
      const statusStore = statusVariablesStore();
      const storedTab = this.activeTab;
      if (tab == storedTab) {
        statusStore.setActiveTab("None");
      } else {
        statusStore.setActiveTab(tab);
      }
    },
    toggleUserInputNextSide() {
      const statusStore = statusVariablesStore();
      statusStore.toggleRunPage();
    },

    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility();
    },

    setTimeWeight(value) {
      const inputStore = userInputStore();
      inputStore.setTimeWeighting(value);
    },
    setLaneAllocation(value) {
      const inputStore = userInputStore();
      inputStore.setLaneAllocation(value);
    },

    async reloadRuns() {
      this.isLoading = true;
      const inputStore = userInputStore();
      const prjStore = projectsStore();
      try {
        const response = await getRunList(inputStore.projectID);
        prjStore.setRuns(response);
        this.updateRuns();
        this.filteredRuns = prjStore.runs.runs;
      } catch (error) {
        console.log("error: ", error.message);
      } finally {
        this.isLoading = false;
      }
    },

    async callOptimization() {
      const inputStore = userInputStore();
      const project_id = inputStore.projectID;
      const algorithm = "betweenness_biketime";
      const bikeRatio = inputStore.laneAllocation;
      const carWeight = inputStore.timeWeighting;
      const project_name = inputStore.projectName;
      const bikeSafetyPenatly = 2;
      const optimizeFrequency = 30;

      try {
        const response = await runOptimization(
          project_id,
          algorithm,
          bikeRatio,
          optimizeFrequency,
          carWeight,
          bikeSafetyPenatly,
          this.runName
        );

        const result = {
          bikeEdges: response.bike_edges,
          variables: response.run_name,
        };

        // Load the newly created run
        await this.loadRun(response);
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
  },
};
</script>

<style scoped>
@import "../styles/UserInputStyles.css";
@import "../styles/SideBarStyle.css";
@import "../styles/UserInputRunStyle.css";
.selected {
  background-color: #e0e0e0; /* Set the background color for the selected item */
  font-weight: bold; /* Make the text bold for the selected item */
  /* Add any other styles you want to apply to the selected item */
}

.buttons {
  margin-top: 20px;
}
</style>
