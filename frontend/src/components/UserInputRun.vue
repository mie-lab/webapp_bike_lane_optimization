<template>
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i
        class="fa-solid fa-times"
        style="font-size: 20px; color: var(--darkgrey-bg)"
      ></i>
    </button>

    <div class="user-input-container">
      <p class="info-text">
        You can manually change the values for car travel time weighting or lane
        allocation. <br /><br />
        Click <a href="#" @click="toggleActiveTab('Help')"> here</a> for more
        information on the impact of these parameters.
      </p>
      <h2 class="text-blue">Car travel time weighting</h2>
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
      <h2 class="text-blue">Allocation of lanes</h2>
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

      <button @click="runConstructGraph">Run</button>

      <!-- Run list -->
      <br />
      <br />
      <h2 class="text-blue">Runs</h2>
      <div class="project-list">
        <ul>
          <li v-for="run in filteredRuns" :key="run.id" @click="loadRun(run)">
            {{ run.id }}
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
import { createView } from "../scripts/api.js";
import { loadLayer } from "../scripts/map.js";

export default {
  name: "UserInputRun",
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const resultsStore = useResultsStore();
    const prjStore = projectsStore();

    const filteredRuns = prjStore.runs.runs;
    console.log("Runs array:", filteredRuns);

    const runs = ref([]);

    // Update runs whenever the component is mounted
    const updateRuns = () => {
      runs.value = prjStore.runs.runs;
    };

    // Call updateRuns when the component is mounted
    updateRuns();

    return {
      statusStore,
      resultsStore,
      projectName: inputStore.projectName,
      setProjectName: inputStore.setProjectName,
      filteredRuns,
      runs,
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
      color: "#da5268",
      size: "25px",
    };
  },
  components: {
    RingLoader,
  },
  methods: {
    async loadRun(run) {
      const prjStore = projectsStore();
      const inputStore = userInputStore();

      inputStore.setRunID(run.run_id);

      const response = await createView(
        inputStore.projectID,
        run.run_id,
        "v_optimized"
      );

      loadLayer("v_optimized", "wms_optimized");
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

    async runConstructGraph() {
      const inputStore = userInputStore();
      const resultsStore = useResultsStore();

      try {
        const response = await runConstructGraph(
          inputStore.boundingBox,
          inputStore.projectName
        );

        inputStore.setProjectID(response.project_id);

        const result = {
          expected_runtime: response.expected_runtime,
          project_id: inputStore.projectID,
          variables: response.variables,
          runs: [],
        };
        resultsStore.addResult(result);
        console.log("Response:", result);

        // Display a confirmation dialog
        const continueOperation = window.confirm(
          `Running the algorithm will take ${result.expected_runtime.toFixed(2)} seconds. Do you want to continue?`
        );

        // Check user's response
        if (continueOperation) {
          // User clicked OK, continue with the operation
          console.log("Operation continued!");
          this.callOptimization();
        } else {
          // User clicked Cancel or closed the dialog, abort the operation
          console.log("Operation aborted!");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    },

    async callOptimization() {
      const inputStore = userInputStore();
      const resultsStore = useResultsStore();
      const project_id = inputStore.projectID;
      const algorithm = "betweenness_biketime";
      const bikeRatio = inputStore.laneAllocation;
      const carWeight = inputStore.timeWeighting;
      const bikeSafetyPenatly = 2;
      const optimizeFrequency = 30;
      try {
        const response = await runOptimization(
          project_id,
          algorithm,
          bikeRatio,
          optimizeFrequency,
          carWeight,
          bikeSafetyPenatly
        );

        const result = {
          bikeEdges: response.bike_edges,
          variables: response.run_name,
        };
        resultsStore.addRunResult(response.project_name, result);
        console.log("Response:", result);
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

.back-button {
  background-color: #ccc;
  color: #666;
}

.fa-solid fa-times {
  color: lightgrey;
}
</style>
