// resultsStore.js
import { defineStore } from 'pinia';

export const useResultsStore = defineStore("evaluation",{
  state: () => ({
    carTravelTime: null,
    bikeTravelTime: null,
    paretoBikeTTArray: [],
    paretoCarTTArray: [],
    kmBike: null,
    kmCar: null,
  }),
  actions: {
    setEvaluation(bikeTT,carTT) {
      this.carTravelTime = carTT;
      this.bikeTravelTime = bikeTT;
    },
    setTraveltimes(bikeTT,carTT) {
      this.paretoBikeTTArray = bikeTT;
      this.paretoCarTTArray = carTT;
    },
    setDistancesKM(kmBike,kmCar){
      this.kmBike = kmBike;
      this.kmCar = kmCar;
    }
  },
});