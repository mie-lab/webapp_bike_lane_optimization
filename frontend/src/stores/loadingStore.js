/**
 * @fileoverview This file contains the definition of the loadingStore, which is a Pinia store for managing loading states.
 * The loadingStore contains state and actions for managing loading states for the Pareto chart, distances, complexity, and bearing.
 */

import { defineStore } from "pinia";

export const loadingStore = defineStore("loadingStore", {
  id: "loadingStore",
  state: () => ({
    paretoIsLoading: false,
    distancesIsLoading: false,
    complexityIsLoading: false,
    bearingIsLoading: false,
  }),
  actions: {
    setParetoIsLoading(isLoading) {
      this.paretoIsLoading = isLoading;
    },
    setDistancesIsLoading(isLoading) {
      this.distancesIsLoading = isLoading;
    },
    setComplexityIsLoading(isLoading) {
      this.complexityIsLoading = isLoading;
    },
    setBearingIsLoading(isLoading) {
      this.bearingIsLoading = isLoading;
    },
  },
});
