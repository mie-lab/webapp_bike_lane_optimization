// Import necessary modules
import { defineStore } from "pinia";

// Define a Pinia store
export const projectsStore = defineStore("projects", {
  state: () => ({
    projects: [],
    runs: [],
    selectedRun: null, // Used for general selection elsewhere
    selectedEvaluationRuns: [],
    tempSelectedEvaluationRuns: []
  }),

  actions: {
    // Existing actions
    setProjects(projects) { 
      this.projects = projects;
    },
    setRuns(runs) {
      this.runs = runs;
    },
    setSelectedRun(run) {
      this.selectedRun = run;
    },

    addEvaluationRun(run) {
      if (!this.selectedEvaluationRuns.some(r => r.id_run === run.id_run)) {
        this.selectedEvaluationRuns.push(run);
      }
    },
    removeEvaluationRun(run) {
      this.selectedEvaluationRuns = this.selectedEvaluationRuns.filter(
        r => r.id_run !== run.id_run
      );
    },
    toggleEvaluationRun(run) {
      const exists = this.selectedEvaluationRuns.some(r => r.id_run === run.id_run);
      if (exists) {
        this.removeEvaluationRun(run);
      } else {
        this.addEvaluationRun(run);
      }
    },
    clearEvaluationRuns() {
      this.selectedEvaluationRuns = [];
    },
    setSelectedEvaluationRuns(runs) {
      this.selectedEvaluationRuns = runs;
    },


    clearTempEvaluationRuns() {
      this.tempSelectedEvaluationRuns = [];
    },

    addTempEvaluationRun(run) {
      if (!run) return; 
      if (!this.tempSelectedEvaluationRuns.some(r => r.id_run === run.id_run)) {
        this.tempSelectedEvaluationRuns.push(run);
      }
    },
    removeTempEvaluationRun(run) {
      this.tempSelectedEvaluationRuns = this.tempSelectedEvaluationRuns.filter(
        r => r.id_run !== run.id_run
      );
    },
    toggleTempEvaluationRun(run) {
      const exists = this.tempSelectedEvaluationRuns.some(r => r.id_run === run.id_run);
      if (exists) {
        this.removeTempEvaluationRun(run);
      } else {
        this.addTempEvaluationRun(run);
      }
    }

  },

  getters: {
    getRuntimeMin: (state) => (projectId) => {
      const project = state.projects.projects.find(
        (project) => project.id === projectId
      );
      return project ? project.runtime_min : null;
    },
    getSelectedRun() {
      return this.selectedRun;
    },
    isEvaluationRunSelected: (state) => (run) => {
      return state.selectedEvaluationRuns.some(r => r.id_run === run.id_run);
    },
    isTempEvaluationRunSelected: (state) => (run) => {
      return state.tempSelectedEvaluationRuns.some(r => r.id_run === run.id_run);
    }
  },
});
