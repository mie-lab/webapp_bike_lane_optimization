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

        <!---

        <div class="list-header">
          <div class="header-item-left"><p class="run_list_name">Name</p></div>
          <i class="fa-solid fa-gears"></i>
          <div class="header-item"><i class="far fa-clock"></i></div>
          <div class="header-item"><i class="far fa-clock"></i></div>
          <div class="header-item">
            <i class="fa-solid fa-lines-leaning"></i>
          </div>
        </div>

        -->

        <input
        type="text"
        v-model="searchQuery"
        placeholder="Search runs..."
        class="project-name-input"
      />

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
                      <td class="bold">BC</td> <!--{{ convertAlgName(run.algorithm) }}-->
                    </tr>
                    
                    <tr>
                      <td><i class="fa-solid fa-bicycle"></i></td>
                      <td>Bike ratio</td>
                      <td class="bold">{{ run.bike_ratio }}</td>
                    </tr>
                    <tr>
                      <td><i class="fa-solid fa-shield-heart"></i></td>
                      <td>Safety penalty</td>
                      <td class="bold">{{ run.bike_safety_penalty }}</td>
                    </tr>
                    <tr v-if="convertAlgName(run.algorithm) === 'BC'">
                      <td><i class="fa-solid fa-car"></i></td>
                      <td>Car weight:</td>
                      <td class="bold">{{ run.car_weight }}</td>
                    </tr>
                    <tr v-if="convertAlgName(run.algorithm) === 'BC'">
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
import { ref, watch , computed} from "vue";
import {
  createView,
  getRunList,
  getPareto,
  getKmDistancePerLaneType,
  getComplexity,
  getNetworkBearing,
} from "../scripts/api.js";
import { loadWFS, loadWMS } from "../scripts/map.js";
import UserInputNewRun from "./UserInputNewRun.vue";
import { useCompareRunEvaluation } from "../stores/compareRunStore.js";

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
    //const filteredRuns = ref(null);
    const compareRunStore = useCompareRunEvaluation();
    const searchQuery = ref("");

    /*
    watch(
      () => prjStore.runs.runs,
      (newValue, oldValue) => {
        //console.log("Filtered runs updated:", newValue);
        filteredRuns.value = newValue;
      }
    );
    */

    const filteredRuns = computed(() => {
      const prjArray = prjStore.runs.runs
      if (prjArray) {
        // Sort projects by "created" timestamp in descending order
        return prjArray
          .slice() // Create a shallow copy to avoid mutating the original array
          
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
      this.statusStore.openDashboard();
      this.prjStore.setSelectedRun(run);
      this.selectedRun = run;

      this.compareRunStore.reset(); // reset all comparisons

      this.inputStore.setRunID(run.id_run);
      this.runName = run.run_name;
      this.inputStore.setRunName(this.runName);

      
      // create evaluation for the selected run
      const paretoEvaluation = await getPareto(
        this.inputStore.projectID,
        run.id_run
      );
      // Extracting data from paretoEvaluation
      const projects = paretoEvaluation.projects;
      const bikeTimes = projects.map((project) => project.bike_time_change);
      const carTimes = projects.map((project) => project.car_time_change);

      this.resultsStore.setTraveltimes(bikeTimes, carTimes);
      

      // get km per bike / car lane
      const distanceEvaluation = await getKmDistancePerLaneType(
        this.inputStore.projectID,
        run.id_run
      );
      this.resultsStore.setDistancesKM(
        distanceEvaluation.distance_bike[0].total_bike_lane_distance,
        distanceEvaluation.distance_car[0].total_car_lane_distance
      );
      this.resultsStore.setRunName(run.run_name);

      // get complexity
      const complexityEvaluation = await getComplexity(
        this.inputStore.projectID,
        run.id_run
      );
      this.resultsStore.setComplexity(
        complexityEvaluation.bike_degree_ratio,
        complexityEvaluation.car_degree_ratio
      );

      // get network bearing
      const bearingEvaluation = await getNetworkBearing(
        this.inputStore.projectID,
        run.id_run
      );
      this.resultsStore.setNetworkBearing(bearingEvaluation.bike_network_bearings,bearingEvaluation.car_network_bearings);
      
      // create view on the map for the selected run
      const response = await createView(
        this.inputStore.projectID,
        run.id_run,
        "v_optimized"
      );

      loadWMS("v_optimized", "wms_optimized");
      loadWMS("v_optimized_arrows", "wms_optimized_arrows");
      loadWFS("v_optimized_wfs", "wfs_optimized");
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
    }
  },
};
</script>

<style scoped>
@import "../styles/UserInputStyles.css";
@import "../styles/SideBarStyle.css";
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
