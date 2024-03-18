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

        <button
          class="nav-button"
          :style="{ color: getIconColor('Info') }"
          @click="toggleActiveTab('Info')"
        >
          <i class="fa-solid fa-circle-info" style="font-size: 24px"></i>
        </button>
      </div>

      <div class="sidebar-content bg-lightgrey" v-show="activeTab !== 'None'">
        <component :is="currentComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectInfo from "./ProjectInfo.vue";
import UserInput from "./UserInput.vue";
import BikeInfo from "./BikeInfo.vue";
import Help from "./Help.vue";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";

export default {
  name: "SideBar",
  data() {
    return {
      iconColors: {
        UserInput: "#000",
        Bike: "#000",
        Help: "#000",
        Info: "#000",
        None: "#000",
      },
    };
  },
  computed: {
    activeTab() {
      const statusStore = statusVariablesStore();
      return statusStore.activeTab;
    },
    currentComponent() {
      switch (this.activeTab) {
        case "Info":
          return ProjectInfo;
        case "UserInput":
          return UserInput;
        case "Bike":
          return BikeInfo;
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
      const statusStore = statusVariablesStore();
      const storedTab = this.activeTab;
      if (tab == storedTab) {
        statusStore.setActiveTab("None");
      } else {
        statusStore.setActiveTab(tab);
      }
    },
    getIconColor(icon) {
      return this.activeTab === icon
        ? "var(--pink-color)"
        : this.iconColors[icon];
    },
  },
  mounted() {},
};
</script>

<style scoped>
@import "../styles/SideBarStyle.css";
</style>
