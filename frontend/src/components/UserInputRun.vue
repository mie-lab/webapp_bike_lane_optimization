<template>
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i
        class="fa-solid fa-times"
        style="font-size: 20px; color: var(--darkgrey-bg)"
      ></i>
    </button>

    <div class="user-input-container">
      <h4 class="h4_override">Project:</h4>
      <h2 class="h2_override">{{ inputStore.projectName }}</h2>
      <p class="info-text">
        You can manually change the values for car travel time weighting or lane
        allocation. <br /><br />
        Click <a href="#" @click="toggleActiveTab('Help')"> here</a> for more
        information on the impact of these parameters.
      </p>
      <h4 class="text-blue">Run name</h4>
      <input
        class="project-name-input"
        type="text"
        v-model="runName"
        @input="setRunName($event.target.value)"
      />
      <br />
      <h4 class="text-blue">Car travel time weighting</h4>
      <div class="slide-container">
        <input
          class="slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="timeWeighting"
          @click="setTimeWeight(timeWeighting)"
        />
      </div>
      <p>Chosen weighting: {{ timeWeighting }}</p>
      <br />
      <h4 class="text-blue">Allocation of lanes</h4>
      <div class="slide-container">
        <input
          class="slider"
          type="range"
          min="0"
          max="100"
          v-model="laneAllocation"
          @click="setLaneAllocation(laneAllocation)"
        />
      </div>
      <p>Chosen Value in percent: {{ laneAllocation }} %</p>
      <br />

      <br />
      <button @click="toggleUserInputNextSide" class="back-button">Back</button>

      <button @click="callOptimization">Run</button>

      <!-- Run list -->
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
    </div>
  </div>
</template>

<script>
import { runConstructGraph, runOptimization } from "../scripts/api.js";
import { userInputStore } from "../stores/userInputStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { useResultsStore } from "../stores/algorithmResultsStore.js";
import { projectsStore } from "../stores/projectsStore.js";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import { ref } from "vue";
import { createView, getRunList } from "../scripts/api.js";
import { loadLayer } from "../scripts/map.js";

export default {
  name: "UserInputRun",
  components: {
    RingLoader,
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
    };
  },
  components: {
    RingLoader,
  },
  methods: {
    async loadRun(run) {
      console.log("Loading run: ", run.run_name, run.id);
      console.log("Run: ", run);
      const inputStore = userInputStore();

      inputStore.setRunID(run.id);
      this.runName = run.run_name;
      inputStore.setRunName(this.runName);

      const response = await createView(
        inputStore.projectID,
        run.id,
        "v_optimized"
      );

      loadLayer("v_optimized", "wms_optimized");
      //loadLayer("v_point_direction", "wms_point_direction");
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
      const resultsStore = useResultsStore();
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
        resultsStore.addRunResult(response.project_name, result);

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
</style>
