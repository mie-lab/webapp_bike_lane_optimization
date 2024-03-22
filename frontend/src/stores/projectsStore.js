// Import necessary modules
import { defineStore } from "pinia";

// Define a Pinia store
export const projectsStore = defineStore("projects", {
  state: () => ({
    projects: [],
  }),
  actions: {
    setProjects(projects) {
      this.projects = projects;
    },
  },
});
