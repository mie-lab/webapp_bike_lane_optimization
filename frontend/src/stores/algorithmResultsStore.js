// resultsStore.js
import { defineStore } from 'pinia';

export const useResultsStore = defineStore("evaluation",{
  state: () => ({
    carTravelTime: null,
    bikeTravelTime: null,
  }),
  actions: {
    setEvaluation(bikeTT,carTT) {
      this.carTravelTime = carTT;
      this.bikeTravelTime = bikeTT;
    },
  },
});