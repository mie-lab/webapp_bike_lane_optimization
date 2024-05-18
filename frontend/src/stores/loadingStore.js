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
