<template>
  <div>
    <div class="sidebar-container">
      <div class="navigation-bar bg-darkgrey">
        <button
          class="nav-button"
          :style="{ color: getIconColor('UserInput') }"
          @click="toggleActiveTab('UserInput')"
        >
          <i class="fa-regular fa-sliders" style="font-size: 24px"></i>
        </button>

        <button
          class="nav-button"
          :style="{ color: getIconColor('Bike') }"
          @click="toggleActiveTab('Bike')"
        >
          <i class="fa-regular fa-bicycle" style="font-size: 24px"></i>
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

export default {
  name: "SideBar",
  data() {
    return {
      activeTab: "UserInput",
      iconColors: {
        UserInput: "#000", // Default color for UserInput
        Bike: "#000", // Default color for Bike
        Info: "#000", // Default color for Info
        None: "#000", // Default color for Close button
      },
    };
  },
  computed: {
    currentComponent() {
      switch (this.activeTab) {
        case "Info":
          return ProjectInfo;
        case "UserInput":
          return UserInput;
        case "Bike":
          return BikeInfo;
        default:
          return null;
      }
    },
  },
  methods: {
    toggleActiveTab(tab) {
      this.activeTab = this.activeTab === tab ? "None" : tab;
    },
    getIconColor(icon) {
      return this.activeTab === icon ? "#da5268" : this.iconColors[icon];
    },
  },
  mounted() {},
};
</script>

<style scoped>
@import "../styles/SideBarStyle.css";
</style>
