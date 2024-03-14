import { defineStore } from "pinia";

export const userInputStore = defineStore("variableStore", {
  id: "variableStore",
  state: () => ({
    timeWeighting: 0.5,
    laneAllocation: 0.5,
    boundingBox: null,
    projectName: "",
  }),
  actions: {
    setBoundingBox(boundingBox) {
      this.boundingBox = boundingBox;
    },
    setProjectName(projectName) {
      this.projectName = projectName;
    },
  },
});
