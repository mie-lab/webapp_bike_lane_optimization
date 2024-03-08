<template>
  <div>
    <div class="sidebar-container">
      <div class="navigation-bar bg-darkgrey">
        <button class="nav-button" @click="activeTab = 'UserInput'">
          <i class="fa-regular fa-sliders" style="font-size: 24px"></i>
        </button>

        <button class="nav-button" @click="activeTab = 'Bike'">
          <i class="fa-regular fa-bicycle" style="font-size: 24px"></i>
        </button>

        <button class="nav-button" @click="activeTab = 'Info'">
          <i class="fa-solid fa-circle-info" style="font-size: 24px"></i>
        </button>

        <button class="nav-button" @click="activeTab = 'None'">Close</button>
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
        UserInput: "#da5268",
        Bike: "#da5268",
        Info: "#da5268",
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
          return BikeInfo; // Map 'Bike' to the BikeInfo component
        default:
          return null; // No component for 'None' or unmatched value
      }
    },
    changeColor(iconName) {
      // Reset colors if needed or implement logic to keep the color changed
      Object.keys(this.iconColors).forEach((key) => {
        this.iconColors[key] = "#da5268"; // Reset to default
      });
      this.iconColors[iconName] = "#0d00a3"; // Change the clicked icon's color
      this.activeTab = this.activeTab === iconName ? "None" : iconName; // Update activeTab as before
    },
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.sidebar-container {
  display: flex;
  height: 100vh;
  position: absolute;
  left: 0;
}

.navigation-bar {
  height: 100%;
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding-top: 10px;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center; /* Add this line to horizontally center the content */
  background-color: transparent;
  border: none;
  color: #333;
  padding: 10px;
  margin: 5px 0;
  width: 100%;
  cursor: pointer;
}

.nav-button:hover {
  background-color: #ddd;
}

.nav-button img {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  filter: invert(55%) sepia(95%) saturate(650%) hue-rotate(300deg)
    brightness(100%) contrast(101%);
}

.sidebar-content {
  width: 300px;
  flex-grow: 1;
}
</style>
