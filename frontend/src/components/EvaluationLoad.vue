<template>
  <!-- Components that shows all projects in a list-->
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <div v-show="!statusStore.runPage" class="user-input-container">
      <p class="info-text">
        Evaluate a project of your choice.
      </p>

      <h3 class="text-blue">
        <span class="project_name_text">Project name</span>
        <span class="refresh-container">
          <i
            v-if="!isLoading"
            class="fa-solid fa-rotate-right refresh-button"
            @click="reloadProjects"
          >
          </i>
        </span>
        <span class="ring-loader-container">
          <div class="ring-loader">
            <RingLoader v-if="isLoading" :size="'80'" :color="'#123abc'" />
          </div>
        </span>
      </h3>

      <!-- Search input -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search projects..."
        class="project-name-input"
      />

      <!-- Project list -->
      <div class="list-header">
        <div class="header-item-left"><p class="run_list_name">Name</p></div>
        <div class="header-item-left"><p class="run_list_name">Date</p></div>
      </div>
      <div class="project-list">
        <ul>
          <li
            class="project-list-item"
            v-for="project in filteredProjects"
            :key="project.id"
            @click="openProject(project)"
          >
            <div class="project-info">
              <span>{{ project.prj_name }}</span>
              <span class="created-date">{{
                formatDate(project.created)
              }}</span>
            </div>
            <hr class="divider" />
          </li>
        </ul>
      </div>
      <br />
      <br />
    </div>
    <div v-show="statusStore.runPage">
      <EvaluationRunSelection />
    </div>
  </div>
</template>
<script>
import { userInputStore } from "../stores/userInputStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import EvaluationRunSelection from "./EvaluationRunSelection.vue";
import { projectsStore } from "../stores/projectsStore.js";
import { computed, ref } from "vue";
import { loadWMS, removeLayer } from "../scripts/map.js";
import { getBoundingBox, getRunList, getProjectList } from "../scripts/api.js";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import { useResultsStore } from "../stores/runResultsStore.js";

export default {
  name: "EvaluationLoad",
  components: {
    EvaluationRunSelection,
    RingLoader,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const prjStore = projectsStore();
    const searchQuery = ref("");
    const ResultsStore = useResultsStore();

    const activeComponent = computed(() => {
      // Determine which component to show based on status
      return statusStore.runPage ? EvaluationRunSelection : null;
    });

    const filteredProjects = computed(() => {
      const prjArray = prjStore.projects.projects;
      if (prjArray) {
        // Sort projects by "created" timestamp in descending order
        return prjArray
          .slice() // Create a shallow copy to avoid mutating the original array
          .sort((a, b) => {
            return new Date(b.created) - new Date(a.created);
          })
          .filter((project) =>
            project.prj_name
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase())
          );
      }
      return [];
    });

    return {
      statusStore,
      projectName: inputStore.projectName,
      continue: statusStore.runPage,
      searchQuery,
      filteredProjects,
      activeComponent,
      ResultsStore,
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
      isLoading: false,
    };
  },

  methods: {
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    },

    openCreate() {
      this.statusStore.toggleCreatePage();
      this.statusStore.toggleLoadPage();
      this.ResultsStore.reset();
    },
    async openProject(project) {
      // opens a selected project and shows the bounding box on the map 
      this.resetProject();
      this.isLoading = true;
      const prjStore = projectsStore();
      const inputStore = userInputStore();
      const statusStore = statusVariablesStore();

      try {
        const response = await getRunList(project.id);
        prjStore.setRuns(response);
        inputStore.setProjectName(project.prj_name);
        inputStore.setProjectID(project.id);

        await getBoundingBox(inputStore.projectID);

        loadWMS("v_bound", "wms_bound", inputStore.projectID);
      } catch (error) {
        console.log("error: ", error.message);
      } finally {
        this.isLoading = false;
        statusStore.toggleRunPage();
      }
    },
    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility();
    },
    resetProject() {
      const statusStore = statusVariablesStore();
      const inputStore = userInputStore();
      inputStore.resetRuns();
      statusStore.closeDashboard();
      removeLayer("v_optimized", "wms_optimized");
    },

    async reloadProjects() {
      this.isLoading = true;
      const response = await getProjectList();
      const prjStore = projectsStore();
      prjStore.setProjects(response);
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
@import "../styles/UserInputStyles.css";
@import "../styles/UserInputStylesMobile.css";
@import "../styles/SideBarStyle.css";
@import "../styles/SideBarStyleMobile.css";
@import "../styles/UserInputLoadStyle.css";

.disabled-button {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.project-info {
  display: flex;
  justify-content: space-between;
}

.created-date {
  margin-left: 20px; 
}

.project-list-item:hover {
  color: var(--pink-color);
}
</style>
