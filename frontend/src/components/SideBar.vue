<template>
  <div>
    <div class="sidebar-container">
      <div class="navigation-bar bg-darkgrey">
        <!-- Scrollable buttons on mobile -->
        <div class="nav-scroll-container">
          <button
            class="nav-button"
            :style="{ color: getIconColor('UserInput') }"
            @click="() => { 
              toggleActiveTab('UserInput'); 
              prjStore.clearEvaluationRuns(); 
              statusStore.DashboardMode = 'UserInput'; 
              statusStore.closeDashboard();
            }"
          >
            <i class="fa-solid fa-sliders" style="font-size: 24px"></i>
          </button>

          <button
            class="nav-button"
            :style="{ color: getIconColor('Evaluation') }"
            @click="() => { 
              prjStore.addTempEvaluationRun(prjStore.selectedRun); 
              statusStore.DashboardMode = 'Evaluation'; 
              toggleActiveTab('Evaluation'); 
              statusStore.closeDashboard();
            }"
          >
            <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 24px"></i>
          </button>

          <button
            class="nav-button"
            :style="{ color: getIconColor('Bike') }"
            @click="toggleActiveTab('Bike')"
          >
            <i class="fa-solid fa-bicycle" style="font-size: 24px"></i>
          </button>

          <button
            class="nav-button"
            :style="{ color: getIconColor('Help') }"
            @click="toggleActiveTab('Help')"
          >
            <i class="fa-solid fa-circle-question" style="font-size: 24px"></i>
          </button>
        </div>

        <!-- Lower buttons (bottom-pinned on desktop, inline on mobile) -->
        <div class="lower-buttons">
          <button
            class="nav-button nav-button-process"
            :class="{ 'nav-button-process-active': isContainerVisible }"
            :style="{ color: getIconColor('Process') }"
            @click="() => { 
              toggleContainer(); 
              statusStore.evalProcessList = false;
            }"
          >
            <i class="fa-solid fa-list-check" style="font-size: 24px"></i>
          </button>

          <button
            class="nav-button nav-button-process"
            :class="{ 'nav-button-process-active': isEvalContainerVisible }"
            :style="{ color: getIconColor('EvalProcess') }"
            @click="() => { 
              toggleEvalContainer(); 
              statusStore.processList = false;
            }"
          >
            <i class="fa-solid fa-clipboard-list" style="font-size: 24px"></i>
          </button>

          <button
            class="nav-button nav-button-info"
            :class="{ 'nav-button-info-active': activeTab === 'None' }"
            @click="toggleActiveTab('Info')"
          >
            <i class="fa-solid fa-circle-info button-icon" style="font-size: 24px"></i>
          </button>

          <button
            class="nav-button mobile-only"
            :class="{ active: isDashboardActive }"
            @click="toggleDashboard()"
          >
            <i class="fa-solid fa-chart-line" style="font-size: 24px"></i>
          </button>
        </div>
      </div>

      <!-- Process List (floating) -->
      <div class="process-container" v-show="isContainerVisible">
        <div class="triangle"></div>
        <div class="rectangle">
          <div class="process-inner-container">
            <ProcessList />
          </div>
        </div>
      </div>

      <!-- Eval Process List (floating) -->
      <div class="evalprocess-container" v-show="isEvalContainerVisible">
        <div class="triangle"></div>
        <div class="rectangle">
          <div class="process-inner-container">
            <EvalProcessList />
          </div>
        </div>
      </div>

      <!-- Main Sidebar Content -->
      <div class="sidebar-content bg-lightgrey" v-show="activeTab !== 'None'">
        <component :is="currentComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import ProjectInfo from "./ProjectInfo.vue";
import UserInput from "./UserInputCreate.vue";
import UserInputStart from "./UserInputStart.vue";
import EBikeCityInfo from "./EBikeCityInfo.vue";
import Help from "./Help.vue";
import EvaluationStart from "./EvaluationStart.vue";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import ProcessList from "./ProcessList.vue";
import EvalProcessList from "./EvaluationProcessList.vue";
import { projectsStore } from "../stores/projectsStore.js";

export default {
  name: "SideBar",
  components: {
    ProcessList,
    EvalProcessList,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const isContainerVisible = ref(false);
    const isEvalContainerVisible = ref(false);
    const prjStore = projectsStore();

    watch(() => statusStore.processList, (newVal) => {
      isContainerVisible.value = newVal;
    });

    watch(() => statusStore.evalProcessList, (newVal) => {
      isEvalContainerVisible.value = newVal;
    });

    watch(() => statusStore.startingPage, () => {
      statusStore.setActiveTab("UserInput");
    });

    return {
      statusStore,
      isContainerVisible,
      isEvalContainerVisible,
      prjStore,
    };
  },
  data() {
    return {
      iconColors: {
        UserInput: "#000",
        Bike: "#000",
        Evaluation: "#000",
        Help: "#000",
        Info: "#000",
        None: "#000",
      },
      isDashboardActive: false,
    };
  },
  computed: {
    activeTab() {
      return this.statusStore.activeTab;
    },
    currentComponent() {
      switch (this.activeTab) {
        case "Info":
          return ProjectInfo;
        case "Evaluation":
          return EvaluationStart;
        case "UserInput":
          return UserInputStart;
        case "Bike":
          return EBikeCityInfo;
        case "Help":
          return Help;
        default:
          return null;
      }
    },
  },
  methods: {
    toggleActiveTab(tab) {
      const storedTab = this.activeTab;
      this.statusStore.deactivateHelpDetailsPage();
      if (tab === storedTab) {
        this.statusStore.setActiveTab("None");
      } else {
        this.statusStore.setActiveTab(tab);
      }

      if (window.innerWidth <= 768) {
        this.statusStore.closeDashboard();
        this.isDashboardActive = false;
      }
    },
    getIconColor(icon) {
      return this.activeTab === icon ? "var(--pink-color)" : this.iconColors[icon];
    },
    toggleContainer() {
      this.isContainerVisible = !this.isContainerVisible;
      this.statusStore.processList = this.isContainerVisible;

      if (this.isContainerVisible) {
        this.isEvalContainerVisible = false;
        this.statusStore.evalProcessList = false;
      }
    },
    toggleEvalContainer() {
      this.isEvalContainerVisible = !this.isEvalContainerVisible;
      this.statusStore.evalProcessList = this.isEvalContainerVisible;

      if (this.isEvalContainerVisible) {
        this.isContainerVisible = false;
        this.statusStore.processList = false;
      }
    },
    toggleDashboard() {
      this.isDashboardActive = !this.isDashboardActive;
      this.statusStore.toggleDashboard();

      if (window.innerWidth <= 768) {
        this.statusStore.setActiveTab("None");
      }
    },
  },
};
</script>

<style scoped>
@import "../styles/SideBarStyle.css";
@import "../styles/SideBarStyleMobile.css";

.active {
  color: var(--pink-color);
}
</style>
