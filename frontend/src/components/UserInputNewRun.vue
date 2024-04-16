<template>
  <div>
    <!-- User input container -->
    <button class="close-btn" @click="toggleTabsVisibility">
      <i
        class="fa-solid fa-times"
        style="font-size: 20px; color: var(--darkgrey-bg)"
      ></i>
    </button>

    <div class="user-input-container">
      <h4 class="h4_override">Project:</h4>
      <h2 class="h2_override">{{ inputStore.projectName }} | {{ runName }}</h2>

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
      <h4 class="text-blue">
        What should be the importance of the car travel time
      </h4>
      <div class="slide-container">
        <input
          class="slider"
          type="range"
          min="0"
          max="10"
          step="0.1"
          v-model="timeWeighting"
          @click="setTimeWeight(timeWeighting)"
        />
      </div>
      <p>Chosen weighting: {{ timeWeighting }}</p>
      <br />
      <h4 class="text-blue">How many lanes should become bike lanes?</h4>
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
      <p>{{ laneAllocation }} % of the lanes</p>
      <br />

      <br />
      <button @click="toggleUserInputPreviousSide" class="back-button">
        Back
      </button>

      <button @click="callOptimization">Run</button>
    </div>
    <div class="process_list">
      <ProcessList />
    </div>
  </div>
</template>

<script>
import { runOptimization } from "../scripts/api.js";
import { userInputStore } from "../stores/userInputStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { useResultsStore } from "../stores/algorithmResultsStore.js";
import { projectsStore } from "../stores/projectsStore.js";
import { runningProcessStore } from "../stores/processListStore.js";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import { ref } from "vue";
import {
  createView,
  getRunList,
  evalTravelTime,
  getNewRunID,
} from "../scripts/api.js";
import { loadLayer } from "../scripts/map.js";
import ProcessList from "./ProcessList.vue";

export default {
  name: "UserInputNewRun",
  components: {
    RingLoader,
    ProcessList,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const resultsStore = useResultsStore();
    const prjStore = projectsStore();
    const processStore = runningProcessStore();

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
      processStore,
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
  methods: {
    async loadRun(run) {
      const inputStore = userInputStore();
      this.isLoading = true;

      inputStore.setRunID(run.run_id);
      this.runName = run.run_name;
      inputStore.setRunName(this.runName);

      /*
      const response = await createView(
        inputStore.projectID,
        run.id_run,
        "v_optimized"
      );*/
      //console.log("Create View Response: ", response);

      loadLayer("v_optimized", "wms_optimized");

      const ResultsStore = useResultsStore();
 
      const responseEvaluation = await evalTravelTime(
        run.project_id,
        run.run_id
      );
      console.log(responseEvaluation);
      ResultsStore.setEvaluation(
        responseEvaluation.bike_travel_time,
        responseEvaluation.car_travel_time
      );

      const statusStore = statusVariablesStore();
      statusStore.openDashboard();
      this.isLoading = false;
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
    toggleUserInputPreviousSide() {
      const statusStore = statusVariablesStore();
      statusStore.toggleCreateNewRunPage();
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

    async reloadRuns() { // not used
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

      const responseRunID = await getNewRunID(project_id); // not really needed --> also get run ID in respone from runOptimization

      this.processStore.addProcess({
        id: responseRunID.run_id,
        name: this.runName,
        bike_ratio: bikeRatio,
        car_weight: carWeight,
        status: "pending",
      });
      //this.toggleUserInputPreviousSide();

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

        // Load the newly created run
        await this.loadRun(response);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        this.processStore.markProcessAsDone(responseRunID.run_id);
      }
    },
  },
};
</script>

<style scoped>
@import "../styles/UserInputStyles.css";
@import "../styles/SideBarStyle.css";
@import "../styles/UserInputRunStyle.css";

.process_list {
  margin-top: 40px;
}
</style>
