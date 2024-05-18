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
  },
});
