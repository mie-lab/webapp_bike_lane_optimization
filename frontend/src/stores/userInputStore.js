/**
 * Store for user input data.
 */

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
    allMetrics: [
      { key: 'lts', label: 'Level of Traffic Stress (LTS)', selected: false },
      { key: 'bci', label: 'Bicycle Compatibility Index (BCI)', selected: false },
      { key: 'bsl', label: 'Bicyle Stress Level (BSL)', selected: false },
      { key: 'blos_grade', label: 'Bicyle Level of Service(BLOS)', selected: false },
      { key: 'porter', label: 'Porter Index', selected: false },
      { key: 'weikl', label: 'Weikl Index', selected: false },
      { key: 'anp', label: 'ANP', selected: false }

    ],
    tempMetrics: [
      { key: 'lts', label: 'Level of Traffic Stress (LTS)', selected: false },
      { key: 'bci', label: 'Bicycle Compatibility Index (BCI)', selected: false },
      { key: 'bsl', label: 'Bicyle Stress Level (BSL)', selected: false },
      { key: 'blos_grade', label: 'Bicyle Level of Service(BLOS)', selected: false },
      { key: 'porter', label: 'Porter Index', selected: false },
      { key: 'weikl', label: 'Weikl Index', selected: false },
      { key: 'anp', label: 'ANP', selected: false }

    ],
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
    toggleMetric(key, selected) {
      const metric = this.allMetrics.find(m => m.key === key);
      if (metric) metric.selected = selected;
    }
  },
});
