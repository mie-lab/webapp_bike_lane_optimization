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
      <h2 class="h2_override">{{ inputStore.projectName }} | {{ runName }}</h2>

      <p class="info-text">
        Change your network according to your preferences.
      </p>
      <p class="link-style-p">
        <a class="link-style" href="#" @click="toggleActiveTab('Help')"
          >more inforamtion</a
        >
      </p>
      <br></br>

      <h4 class="text-blue">
        Run name
        <i
          class="fa-regular fa-circle-question"
          @mouseover="showInfoBox = true"
          @mouseleave="showInfoBox = false"
        ></i>
        <div v-show="showInfoBox" class="info-box">
          {{ infoBoxTexts.run_name }}
        </div>
      </h4>
      <input
        class="project-name-input"
        type="text"
        v-model="runName"
        @input="setRunName($event.target.value)"
      />
      <br />
      <div class="scrollable-input-container">
      <h4 class="text-blue">Algorithm</h4>
      <div class="dropdown" ref="dropdown" @click="toggleDropdown">
        <button
          class="dropbtn"
          :style="{ color: selectedOption ? 'black' : 'var(--darkgrey-bg)' }"
        >
          {{ selectedOption ? selectedOption.displayName : "Algorithm" }}
          <i
            :class="isOpen ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'"
          ></i>
        </button>
        <div class="dropdown-content" v-if="isOpen">
          <a
            href="#"
            v-for="algorithm in algorithms"
            :key="algorithm.algorithm"
            @click="setAlgorithm(algorithm)"
            >{{ algorithm.displayName }}</a
          >
        </div>
      </div>

      <div class="bike-ratio" style="margin-top: 35px">
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
      </div>

      <div class="bike-safety-penalty" style="margin-top: 35px">
        <h4 class="text-blue">
          Factor by how much the perceived bike travel time increases if cycling
          on car lane
        </h4>
        <div class="slide-container">
          <input
            class="slider"
            type="range"
            min="0"
            max="10"
            step="0.1"
            v-model="bikeSafetyPenalty"
            @click="setBikeSafetyPenalty(bikeSafetyPenalty)"
          />
        </div>
        <p>{{ bikeSafetyPenalty }} times</p>
      </div>

      <div
        class="car-weight"
        v-if="selectedOption && selectedOption.algorithm === 'optimize'"
        style="margin-top: 35px"
      >
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
      </div>

      <div
        class="optimize-frequency"
        v-if="selectedOption && selectedOption.algorithm === 'optimize'"
        style="margin-top: 35px"
      >
        <h4 class="text-blue">How often to re-run the optimization</h4>
        <div class="slide-container">
          <input
            class="slider"
            type="range"
            min="0"
            max="100"
            v-model="optimizeFrequency"
            @click="setOptimizeFrequency(optimizeFrequency)"
          />
        </div>
        <p>Re-run algorithm {{ optimizeFrequency }} times</p>
      </div>

      <br />
    </div>

      
      
      
    </div>
    <br />
    <button @click="toggleUserInputPreviousSide" class="back-button">
        Back
      </button>

      <button @click="callOptimization">Run</button>
    <!--
    <div class="process_list">
      <ProcessList />
    </div>
  -->
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
import { createView, getRunList, getNewRunID } from "../scripts/api.js";
import { loadWMS } from "../scripts/map.js";
import ProcessList from "./ProcessList.vue";
import { infoBoxTexts } from "../scripts/infoBoxText.js";

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
    const statusStore = statusVariablesStore();
    return {
      timeWeighting: 0.7,
      laneAllocation: 10,
      bikeSafetyPenalty: 2.0,
      optimizeFrequency: 30,
      isButtonDisabled: true,
      projectName: inputStore.projectName,
      setRunName: inputStore.setRunName,
      runName: "",
      color: "#da5268",
      size: "25px",
      isLoading: false,
      isOpen: false,
      selectedOption: null,
      showInfoBox: false,
      infoBoxTexts: infoBoxTexts,
      statusStore,
      inputStore,
      algorithms: [
        {
          algorithm: "optimize",
          displayName: "Optimize",
        },
        {
          algorithm: "betweenness_biketime",
          displayName: "Betweenness Biketime",
        },
        {
          algorithm: "betweenness_cartime",
          displayName: "Betweenness Cartime",
        },
      ],
    };
  },
  mounted() {
    document.addEventListener("click", this.closeDropdownOnClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdownOnClickOutside);
  },
  methods: {
    async loadRun(run) {
      this.isLoading = true;

      this.inputStore.setRunID(run.run_id);
      this.runName = run.run_name;
      this.inputStore.setRunName(this.runName);

      loadWMS("v_optimized", "wms_optimized");

      this.statusStore.openDashboard();
      this.isLoading = false;
    },

    toggleActiveTab(tab) {
      const storedTab = this.activeTab;
      if (tab == storedTab) {
        this.statusStore.setActiveTab("None");
      } else {
        this.statusStore.setActiveTab(tab);
      }
    },
    toggleUserInputNextSide() {
      
      this.statusStore.toggleRunPage();
    },
    toggleUserInputPreviousSide() {
      this.statusStore.toggleCreateNewRunPage();

    },

    toggleTabsVisibility() {
      this.statusStore.toggleTabsVisibility();
    },

    setTimeWeight(value) {
      this.inputStore.setTimeWeighting(value);
    },
    setLaneAllocation(value) {
      this.inputStore.setLaneAllocation(value);
    },
    setBikeSafetyPenalty(value) {
      this.inputStore.setBikeSafetyPenalty(value);
    },
    setOptimizeFrequency(value) {
      this.inputStore.setOptimizeFrequency(value);
    },



    async callOptimization() {
      const project_id = this.inputStore.projectID;
      const algorithm = this.inputStore.algorithm;
      const bikeRatio = this.inputStore.laneAllocation;
      const carWeight = this.inputStore.timeWeighting;
      const bikeSafetyPenatly = this.inputStore.bikeSafetyPenalty;
      const optimizeFrequency = this.inputStore.optimizeFrequency;

      const responseRunID = await getNewRunID(project_id);

      this.processStore.addProcess({
        id: responseRunID.run_id,
        name: this.runName,
        bike_ratio: bikeRatio,
        car_weight: carWeight,
        status: "pending",
      });

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
        console.log("Response: ", response);
        // Load the newly created run
        await this.loadRun(response);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        this.processStore.markProcessAsDone(responseRunID.run_id);
      }
    },

    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },

    setAlgorithm(option) {
      this.selectedOption = option;
      this.isOpen = false;
      this.inputStore.setAlgorithm(option.algorithm);
    },
    closeDropdownOnClickOutside(event) {
      const dropdown = this.$refs.dropdown;
      if (dropdown && !dropdown.contains(event.target)) {
        this.isOpen = false;
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

.dropdown {
  position: relative;
}

.dropbtn {
  background-color: var(--lightgrey-bg);
  color: var(--darkgrey-bg);
  border: 1px solid var(--darkgrey-bg);
  width: 250px;
  margin: 0;
  padding: 0;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: left;
  padding-left: 10px;
  padding-right: 10px;
  display: flex; /* Use flexbox */
  justify-content: space-between; /* Align items with space between */
  align-items: center;
}

.dropdown-content {
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
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
.dropdown-content a:hover {
  background-color: #f1f1f1;
}
.dropdown.show .dropdown-content {
  display: block;
}

.link-style-p {
  margin: 0;
}

.info-text {
  padding-bottom: 2px;
  margin: 0;
}

.link-style {
  color: var(--darkgrey-3-bg);
  font-style: italic;
  text-decoration: none;
}

.user-input-container {
  padding-right: 10px;
  padding-top: 10px;
  margin-left: 30px;
  margin-right: 20px;
}

.scrollable-input-container {
  max-height: 55vh;
  overflow-y: scroll;
}

.scrollable-input-container::-webkit-scrollbar {
  width: 8px;
}

.scrollable-input-container::-webkit-scrollbar-thumb {
  background: var(--lightgrey-2-bg); /* Color of the scroll thumb */
  border-radius: 5px; /* Radius of the scroll thumb */
}

.scrollable-input-container::-webkit-scrollbar-thumb:hover {
  background:var(--pink-color); /* Color of the scroll thumb when hovered */
}



</style>
