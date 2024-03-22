import { defineStore } from "pinia";

export const userInputStore = defineStore("variableStore", {
  id: "variableStore",
  state: () => ({
    timeWeighting: 0.5,
    laneAllocation: 0.5,
    boundingBox: null,
    projectName: "",
    projectID: null,
  }),
  actions: {
    setBoundingBox(boundingBox) {
      this.boundingBox = boundingBox;
    },
    setProjectName(projectName) {
      this.projectName = projectName;
    },
    setLaneAllocation(laneAllocation) {
      this.laneAllocation = laneAllocation;
    },
    setTimeWeighting(timeWeighting) {
      this.timeWeighting = timeWeighting;
    },
    setProjectID(projectID) {
      this.projectID = projectID;
    },
  },
});
