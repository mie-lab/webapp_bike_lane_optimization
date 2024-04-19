import { defineStore } from "pinia";

export const userInputStore = defineStore("variableStore", {
  id: "variableStore",
  state: () => ({
    timeWeighting: 0.7,
    laneAllocation: 0.1,
    boundingBox: null,
    projectName: "",
    projectID: null,
    runID: null,
    runName: "",
  }),
  actions: {
    setBoundingBox(boundingBox) {
      this.boundingBox = boundingBox;
    },
    setProjectName(projectName) {
      this.projectName = projectName;
    },
    setLaneAllocation(laneAllocation) {
      this.laneAllocation = laneAllocation / 100;
    },
    setTimeWeighting(timeWeighting) {
      this.timeWeighting = timeWeighting;
    },
    setProjectID(projectID) {
      this.projectID = projectID;
    },
    setRunID(runID) {
      this.runID = runID;
    },
    setRunName(runName) {
      this.runName = runName;
    },
    resetRuns() {
      this.runID = null;
      this.runName = "";
    },
  },
});
