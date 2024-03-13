import { defineStore } from "pinia";

export const statusVariablesStore = defineStore("statusVariables", {
  state: () => ({
    activeTab: "UserInput",
    openTabs: true,
    drawingPolygonEnabled: false,
    drawingRectangleEnabled: false,
  }),
  actions: {
    toggleTabsVisibility() {
      this.openTabs = !this.openTabs;
    },
    toggleDrawingPolygonEnabled() {
      this.drawingPolygonEnabled = !this.drawingPolygonEnabled;
    },
    toggleDrawingRectangleEnabled() {
      this.drawingRectangleEnabled = !this.drawingRectangleEnabled;
    },
  },
});
