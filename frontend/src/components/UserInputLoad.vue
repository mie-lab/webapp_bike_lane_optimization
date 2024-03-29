<template>
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i
        class="fa-solid fa-times"
        style="font-size: 20px; color: var(--darkgrey-bg)"
      ></i>
    </button>
    <div v-show="!statusStore.runPage" class="user-input-container">
      <p class="info-text">
        Create your own project and run the optimization algorithm for an area
        of your choice.
      </p>

      <h2 class="text-blue">Project name</h2>

      <!-- Search input -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search projects..."
        class="project-name-input"
      />

      <!-- Project list -->
      <div class="project-list">
        <ul>
          <li
            v-for="project in filteredProjects"
            :key="project.id"
            @click="openProject(project)"
          >
            {{ project.prj_name }}
            <hr class="divider" />
          </li>
        </ul>
      </div>

      <br />

      <br />
      <button @click="toggleUserInputNextSide" class="back-button">Back</button>
      <button
        :class="{ 'disabled-button': isButtonDisabled || !projectName }"
        @click="toggleUserInputPreviousSide"
      >
        Continue
      </button>
    </div>
    <div v-show="statusStore.runPage">
      <UserInputRun />
    </div>
  </div>
</template>
<script>
import { userInputStore } from "../stores/userInputStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { useResultsStore } from "../stores/algorithmResultsStore.js";
import UserInputRun from "./UserInputRun.vue";
import { projectsStore } from "../stores/projectsStore.js";
import { computed, ref } from "vue";
import { loadLayer } from "../scripts/map.js";
import { createView, getRunList } from "../scripts/api.js";

export default {
  name: "UserInputLoad",
  components: {
    UserInputRun,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const resultsStore = useResultsStore();
    const prjStore = projectsStore();
    const searchQuery = ref("");

    const filteredProjects = computed(() => {
      const prjArray = prjStore.projects.projects;
      if (prjArray) {
        return prjArray.filter((project) =>
          project.prj_name
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())
        );
      }
      return [];
    });

    return {
      statusStore,
      resultsStore,
      projectName: inputStore.projectName,
      continue: statusStore.runPage,
      searchQuery,
      filteredProjects,
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
      continue: statusStore.runPage,
    };
  },

  methods: {
    async openProject(project) {
      const prjStore = projectsStore();
      const inputStore = userInputStore();
      const statusStore = statusVariablesStore();

      try {
        const response = await getRunList(project.id);
        prjStore.setRuns(response);
      } catch (error) {
        console.log("error: ", error.message);
      }

      inputStore.setProjectName(project.prj_name);
      inputStore.setProjectID(project.id);

      const response = await createView(inputStore.projectID, 1, "v_bound");

      loadLayer("v_bound", "wms_bound");

      statusStore.toggleRunPage();
    },
    toggleUserInputNextSide() {
      const statusStore = statusVariablesStore();
      statusStore.toggleLoadPage();
    },
    toggleUserInputPreviousSide() {
      const statusStore = statusVariablesStore();
      statusStore.toggleRunPage();
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

.disabled-button {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
</style>
