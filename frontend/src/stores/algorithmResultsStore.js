// resultsStore.js
import { defineStore } from 'pinia';

export const useResultsStore = defineStore("evaluation",{
  state: () => ({
    carTravelTime: null,
    bikeTravelTime: null,
    paretoBikeTTArray: [],
    paretoCarTTArray: [],
  }),
  actions: {
    setEvaluation(bikeTT,carTT) {
      this.carTravelTime = carTT;
      this.bikeTravelTime = bikeTT;
    },
    setTraveltimes(bikeTT,carTT) {
      this.paretoBikeTTArray = bikeTT;
      this.paretoCarTTArray = carTT;
    }
  },
});