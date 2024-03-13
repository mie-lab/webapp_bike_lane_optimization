import { defineStore } from "pinia";

export const statusVariableStore = defineStore("statusVariables", {
  state: () => ({
    activeTab: "UserInput",
    openTabs: true,
    drawingEnabled: false,
  }),
  actions: {
    toggleTabsVisibility() {
      this.openTabs = !this.openTabs;
    },
    setDraw(drawObject) {
      this.draw = drawObject;
    },
    toggleDrawingEnabled() {
      this.drawingEnabled = !this.drawingEnabled;
    },
  },
});
