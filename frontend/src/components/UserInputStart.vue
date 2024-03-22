<template>
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i
        class="fa-solid fa-times"
        style="font-size: 20px; color: var(--darkgrey-bg)"
      ></i>
    </button>
    <h1 class="text-pink">User Input</h1>
    <div
      v-show="!statusStore.createPage && !statusStore.loadPage"
      class="user-input-container"
    >
      <p class="info-text">
        Create your own project and run the optimization algorithm for an area
        of your choice.
      </p>

      <br />
      <button @click="openLoad">Load</button>
      <button @click="openCreate">Create</button>
    </div>
    <div v-show="statusStore.createPage">
      <UserInputCreate />
    </div>
    <div v-show="statusStore.loadPage">
      <UserInputLoad />
    </div>
  </div>
</template>

<script>
import { userInputStore } from "../stores/userInputStore.js";
import { drawRectangle, drawPolygon } from "../scripts/draw.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { mapStore } from "../stores/mapStore.js";
import { useResultsStore } from "../stores/algorithmResultsStore.js";
import UserInputCreate from "./UserInputCreate.vue";
import UserInputLoad from "./UserInputLoad.vue";
import { getProjectList } from "../scripts/api.js";
import { projectsStore } from "../stores/projectsStore.js";

export default {
  name: "UserInputStart",
  components: {
    UserInputCreate,
    UserInputLoad,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const resultsStore = useResultsStore();

    return {
      statusStore,
      resultsStore,
      projectName: inputStore.projectName,
    };
  },
  data() {
    const inputStore = userInputStore();
    const statusStore = statusVariablesStore();
    return {
      isButtonDisabled: true,
      projectName: inputStore.projectName,
      color: "#da5268",
      size: "25px",
    };
  },

  methods: {
    openCreate() {
      const statusStore = statusVariablesStore();
      statusStore.toggleCreatePage();
    },
    async openLoad() {
      const statusStore = statusVariablesStore();
      const prjStore = projectsStore();
      statusStore.toggleLoadPage();

      try {
        const response = await getProjectList();
        console.log("response: ", response);
        prjStore.setProjects(response);
        console.log("projects: ", prjStore.projects);
      } catch (error) {
        console.log("error: ", error.message);
      }
    },
    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility();
    },
  },
};
</script>

<style scoped>
@import "../styles/UserInputStyles.css";
@import "../styles/SideBarStyle.css";
</style>
