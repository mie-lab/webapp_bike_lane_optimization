import { defineStore } from "pinia";

export const statusVariablesStore = defineStore("statusVariables", {
  state: () => ({
    activeTab: "UserInput",
    drawingPolygonEnabled: false,
    drawingRectangleEnabled: false,
    createPage: false,
    loadPage: false,
    runPage: false,
  }),
  actions: {
    toggleCreatePage() {
      this.createPage = !this.createPage;
    },
    toggleLoadPage() {
      this.loadPage = !this.loadPage;
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
