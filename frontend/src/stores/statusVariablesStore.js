/**
 * Store for managing the status active/inactive status of single components of the application. It used to manage the visibility of the different pages and tabs.
 */

import { defineStore } from "pinia";

export const statusVariablesStore = defineStore("statusVariables", {
  state: () => ({
    activeTab: "None",
    drawingPolygonEnabled: false,
    drawingRectangleEnabled: false,
    createPage: false,
    loadPage: true,
    runPage: false,
    dashboard: false,
    createNewRunPage: false,
    processList: false,
    helpDetailsPage: false,
    startingPage: false,
    evaluationrunPage: false,
    evaluationDashboard: false,
    DashboardMode: "UserInput"
 
  }),
  actions: {
    toggleCreateNewRunPage() {
      this.createNewRunPage = !this.createNewRunPage;
    },
    toggleDashboard() {
      this.dashboard = !this.dashboard;
    },
    closeDashboard() {
      this.dashboard = false;
    },
    openDashboard() {
      this.dashboard = true;
    },
    toggleCreatePage() {
      this.createPage = !this.createPage;
    },
    toggleLoadPage() {
      this.loadPage = !this.loadPage;
    },

    toggleProcessList() {
      this.processList = !this.processList;
    },

    activateLoadPage() {
      this.loadPage = true;
    },

    toggleHelpDetailsPage() {
      this.helpDetailsPage = !this.helpDetailsPage;
    },

    deactivateHelpDetailsPage() {
      this.helpDetailsPage = false;
    },

    toggleRunPage() {
      this.runPage = !this.runPage;
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    toggleTabsVisibility() {
      this.activeTab = "None";
    },
    toggleDrawingPolygonEnabled() {
      this.drawingPolygonEnabled = !this.drawingPolygonEnabled;
    },
    toggleDrawingRectangleEnabled() {
      this.drawingRectangleEnabled = !this.drawingRectangleEnabled;
    },
    setDrawingPolygon(enabled) {
      this.drawingPolygonEnabled = enabled;
    },
    setDrawingRectangle(enabled) {
      this.drawingRectangleEnabled = enabled;
    },
    toggleStartingPage() {
      this.startingPage = !this.startingPage;
    },
    toggleEvaluationRunPage() {
      this.evaluationrunPage = !this.evaluationrunPage;
    },
    toggleEvaluationDashboard() {
      this.evaluationDashboard = !this.dashboard;
    },
    closeEvaluationDashboard() {
      this.evaluationDashboard = false;
    },
    openEvaluationDashboard() {
      this.evaluationDashboard = true;
    },
    toggleMetric(key, selected) {
      const metric = this.allMetrics.find(m => m.key === key);
      if (metric) metric.selected = selected;
    }

  },
});
