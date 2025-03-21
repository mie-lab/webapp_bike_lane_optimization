<template>
  <div class="parent-container">
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <h1 class="text-pink">Network evaluation</h1>
    <div
      v-show="!this.statusStore.createPage && !this.statusStore.loadPage"
      class="user-input-container"
    ></div>
    <div v-show="this.statusStore.createPage">
      <UserInputCreate />
    </div>
    <div v-show="this.statusStore.loadPage">
      <EvaluationLoad />
    </div>
  </div>
</template>

<script>
import { userInputStore } from "../stores/userInputStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import UserInputCreate from "./UserInputCreate.vue";
import EvaluationLoad from "./EvaluationLoad.vue";
import { getProjectList } from "../scripts/api.js";
import { projectsStore } from "../stores/projectsStore.js";

export default {
  name: "UserInputStart",
  components: {
    UserInputCreate,
    EvaluationLoad,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const prjStore = projectsStore();

    return {
      statusStore,
      projectName: inputStore.projectName,
      prjStore,
    };
  },
  data() {
    const inputStore = userInputStore();

    return {
      isButtonDisabled: true,
      projectName: inputStore.projectName,
      color: "#da5268",
      size: "25px",
    };
  },
  mounted() {
    this.openLoad();
  },

  methods: {
    async openLoad() {
      try {
        const response = await getProjectList();
        this.prjStore.setProjects(response);
      } catch (error) {
        console.log("error: ", error.message);
      }
    },
    toggleTabsVisibility() {
      this.statusStore.toggleTabsVisibility();
    },
  },
};
</script>

<style scoped>
@import "../styles/UserInputStyles.css";
@import "../styles/UserInputStylesMobile.css";
@import "../styles/SideBarStyle.css";
@import "../styles/SideBarStyleMobile.css";
</style>
