<template>
  <div>
    <div class="sidebar-container">
      <div class="navigation-bar bg-darkgrey">
        <button
          class="nav-button"
          :style="{ color: getIconColor('UserInput') }"
          @click="toggleActiveTab('UserInput')"
        >
          <i class="fa-solid fa-sliders" style="font-size: 24px"></i>
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

        <div class="lower-buttons">
          <button
            class="nav-button nav-button-process"
            :class="{ 'nav-button-process-active': isContainerVisible }"
            :style="{ color: getIconColor('Process') }"
            @click="toggleContainer"
          >
            <i class="fa-solid fa-list-check" style="font-size: 24px"></i>
          </button>
          <div class="process-container" v-show="isContainerVisible">
            <div class="triangle"></div>
            <div class="rectangle">
              <div class="process-inner-container">
                <ProcessList />
              </div>
            </div>
          </div>

          <button
            class="nav-button nav-button-info"
            :class="{ 'nav-button-info-active': activeTab === 'None' }"
            @click="toggleActiveTab('Info')"
          >
            <i
              class="fa-solid fa-circle-info button-icon"
              style="font-size: 24px"
            ></i>
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
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import ProcessList from "./ProcessList.vue";

export default {
  name: "SideBar",
  components: {
    ProcessList,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const isContainerVisible = ref(false);

    // Use a watcher to keep the list up to date
    watch(
      () => statusStore.processList,
      (newProcesses, oldProcesses) => {
        isContainerVisible.value = true;
      }
    );

    watch(
      () => statusStore.startingPage,
      (newProcesses, oldProcesses) => {
        statusStore.setActiveTab("UserInput");
      }
    );

    return {
      statusStore,
      isContainerVisible,
    };
  },
  data() {
    return {
      iconColors: {
        UserInput: "#000",
        Bike: "#000",
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
      // Toggle the active tab using the Pinia store
      const storedTab = this.activeTab;
      this.statusStore.deactivateHelpDetailsPage();
      if (tab == storedTab) {
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
      return this.activeTab === icon
        ? "var(--pink-color)"
        : this.iconColors[icon];
    },
    toggleContainer() {
      this.isContainerVisible = !this.isContainerVisible;
    },
    toggleDashboard() {
      this.isDashboardActive = !this.isDashboardActive;
      this.statusStore.toggleDashboard();

      if (window.innerWidth <= 768) {
        this.statusStore.setActiveTab("None");
      }
    },
  },
  mounted() {},
};
</script>

<style scoped>
@import "../styles/SideBarStyle.css";
@import "../styles/SideBarStyleMobile.css";

.active {
  color: var(--pink-color);
}
</style>
