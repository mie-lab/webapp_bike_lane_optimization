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
      <div class="project-list">
        <ul>
          <li
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

      <button @click="openCreate">Create new Project</button>
    </div>
    <div v-show="statusStore.runPage">
      <UserInputRun />
    </div>
  </div>
</template>
<script>
import { userInputStore } from "../stores/userInputStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import UserInputRun from "./UserInputRun.vue";
import { projectsStore } from "../stores/projectsStore.js";
import { computed, ref } from "vue";
import { loadWMS, removeLayer } from "../scripts/map.js";
import { createView, getRunList, getProjectList } from "../scripts/api.js";
import { storeToRefs } from "pinia";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import { remove } from "ol/array";

export default {
  name: "UserInputLoad",
  components: {
    UserInputRun,
    RingLoader,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const prjStore = projectsStore();
    const searchQuery = ref("");

    const activeComponent = computed(() => {
      // Determine which component to show based on status
      return statusStore.runPage ? UserInputRun : null;
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
      return date.toLocaleDateString();
    },

    openCreate() {
      const statusStore = statusVariablesStore();
      statusStore.toggleCreatePage();
      statusStore.toggleLoadPage();
    },
    async openProject(project) {
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

        const responseCreateView = await createView(
          inputStore.projectID,
          1,
          "v_bound"
        );

        loadWMS("v_bound", "wms_bound");
        //statusStore.toggleLoadPage();
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
@import "../styles/SideBarStyle.css";
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
  margin-left: 20px; /* Adjust as needed */
}

.project-list {
  margin-right: 20px;
}
</style>
