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
          This is your project overview. Make multiple runs with different
          paramters for the chosen area.
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
              <div class="run_tt_weight">{{ run.car_weight }}</div>
              <div class="run_alloc">{{ run.bike_ratio * 100 }}%</div>
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
import { userInputStore } from "../stores/userInputStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { useResultsStore } from "../stores/algorithmResultsStore.js";
import { projectsStore } from "../stores/projectsStore.js";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import { ref, watch } from "vue";
import {
  createView,
  getRunList,
  getPareto,
  getKmDistancePerLaneType,
} from "../scripts/api.js";
import { loadWFS, loadWMS } from "../scripts/map.js";
import UserInputNewRun from "./UserInputNewRun.vue";

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
    const filteredRuns = ref(null);

    watch(
      () => prjStore.runs.runs,
      (newValue, oldValue) => {
        //console.log("Filtered runs updated:", newValue);
        filteredRuns.value = newValue;
      }
    );

    return {
      statusStore,
      resultsStore,
      inputStore,
      projectName: inputStore.projectName,
      filteredRuns,
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
    },
    async loadRun(run) {
      const prjStore = projectsStore();
      prjStore.setSelectedRun(run);
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

      loadWMS("v_optimized", "wms_optimized");
      loadWFS("v_optimized_wfs", "wfs_optimized");

      // create evaluation for the selected run
      const ResultsStore = useResultsStore();

      const paretoEvaluation = await getPareto(
        inputStore.projectID,
        run.id_run
      );
      // Extracting data from paretoEvaluation
      const projects = paretoEvaluation.projects;
      const bikeTimes = projects.map((project) => project.bike_time_change);
      const carTimes = projects.map((project) => project.car_time_change);

      ResultsStore.setTraveltimes(bikeTimes, carTimes);

      // get km per bike / car lane
      const distanceEvaluation = await getKmDistancePerLaneType(
        inputStore.projectID,
        run.id_run
      );
      ResultsStore.setDistancesKM(
        distanceEvaluation.distance_bike[0].total_bike_lane_distance,
        distanceEvaluation.distance_car[0].total_car_lane_distance
      );
      ResultsStore.setRunName(run.run_name);
      const statusStore = statusVariablesStore();
      statusStore.openDashboard();
    },

    toggleUserInputNextSide() {
      const statusStore = statusVariablesStore();
      statusStore.toggleRunPage();
    },

    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility();
    },

    async reloadRuns() {
      this.isLoading = true;
      const inputStore = userInputStore();
      const prjStore = projectsStore();
      try {
        const response = await getRunList(inputStore.projectID);
        prjStore.setRuns(response);
        this.filteredRuns = prjStore.runs.runs;
      } catch (error) {
        console.log("error: ", error.message);
      } finally {
        this.isLoading = false;
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
  background-color: #e0e0e0;
  font-weight: bold;
}

.buttons {
  margin-top: 20px;
}
</style>
