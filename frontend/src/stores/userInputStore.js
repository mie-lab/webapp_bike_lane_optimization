import { set } from "ol/transform";
import { defineStore } from "pinia";

export const userInputStore = defineStore("variableStore", {
  id: "variableStore",
  state: () => ({
    algorithm: "",
    timeWeighting: 0.7,
    laneAllocation: 0.1,
    bikeSafetyPenalty: 2.0,
    optimizeFrequency: 30,
    boundingBox: null,
    projectName: "",
    projectID: null,
    runID: null,
    runName: "",
  }),
  actions: {
    setAlgorithm(algorithm) {
      this.algorithm = algorithm;
    },
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
    setBikeSafetyPenalty(bikeSafetyPenalty) {
      this.bikeSafetyPenalty = bikeSafetyPenalty;
    },
    setOptimizeFrequency(optimizeFrequency) {
      this.optimizeFrequency = optimizeFrequency;
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
