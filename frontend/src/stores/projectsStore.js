// Import necessary modules
import { defineStore } from "pinia";

// Define a Pinia store
export const projectsStore = defineStore("projects", {
  state: () => ({
    projects: [],
    runs: [],
    selectedRun:null,
  }),
  actions: {
    setProjects(projects) {
      this.projects = projects;
    },
    setRuns(runs) {
      this.runs = runs;
    },
    setSelectedRun(run) {
      this.selectedRun = run;
    },
  },
});
