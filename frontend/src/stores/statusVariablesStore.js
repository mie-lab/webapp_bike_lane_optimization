import { defineStore } from "pinia";

export const statusVariablesStore = defineStore("statusVariables", {
  state: () => ({
    activeTab: "UserInput",
    drawingPolygonEnabled: false,
    drawingRectangleEnabled: false,
    createPage: false,
    loadPage: true,
    runPage: false,
    dashboard: false,
    createNewRunPage: false,
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

    activateLoadPage() {
      this.loadPage = true;
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
  },
});
