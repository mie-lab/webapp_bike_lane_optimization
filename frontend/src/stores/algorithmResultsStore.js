
import { defineStore } from 'pinia';

export const useResultsStore = defineStore("evaluation",{
  state: () => ({
    paretoBikeTTArray: [],
    paretoCarTTArray: [],
    kmBike: null,
    kmCar: null,
    runName: null,
  }),
  actions: {
    setTraveltimes(bikeTT,carTT) {
      this.paretoBikeTTArray = bikeTT;
      this.paretoCarTTArray = carTT;
    },
    setDistancesKM(kmBike,kmCar){
      this.kmBike = kmBike;
      this.kmCar = kmCar;
    },
    setRunName(runName){
      this.runName = runName;
    },
  },
});