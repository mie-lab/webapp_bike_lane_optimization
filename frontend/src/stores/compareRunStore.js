import { set } from 'ol/transform';
import { defineStore } from 'pinia';

export const useCompareRunEvaluation = defineStore("compareRun",{
  state: () => ({
    paretoBikeTTArray: [],
    paretoCarTTArray: [],
    kmBike: null,
    kmCar: null,
    runName: null,
    compare:false,
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
    reset(){
      this.paretoBikeTTArray = [];
      this.paretoCarTTArray = [];
      this.kmBike = null;
      this.kmCar = null;
      this.runName = null;
      this.compare = false;
      this.complexity.bike = null;
      this.complexity.car = null;
    },
    setCompareTrue(){
      this.compare = true;
    },
    setComplexity(complexityBike, complexityCar) {
      this.complexity.bike = complexityBike;
      this.complexity.car = complexityCar;
    },
  },
});