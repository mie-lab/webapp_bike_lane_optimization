import { defineStore } from "pinia";

export const statusVariablesStore = defineStore("statusVariables", {
  state: () => ({
    activeTab: "UserInput",
    drawingPolygonEnabled: false,
    drawingRectangleEnabled: false,
  }),
  actions: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    toggleTabsVisibility() {
      this.activeTab = 'None';
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
