
import { defineStore } from 'pinia';

export const useResultsStore = defineStore("evaluation",{
  state: () => ({
    paretoBikeTTArray: [],
    paretoCarTTArray: [],
    kmBike: null,
    kmCar: null,
    runName: null,
    complexity: {
      bike: null,
      car: null
    }
   
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
    setComplexity(complexityBike, complexityCar) {
      this.complexity.bike = complexityBike;
      this.complexity.car = complexityCar;
    },
    reset(){
      this.paretoBikeTTArray = [];
      this.paretoCarTTArray = [];
      this.kmBike = null;
      this.kmCar = null;
      this.runName = null;
      this.complexity.bike = null;
      this.complexity.car = null;
    }
  },
});