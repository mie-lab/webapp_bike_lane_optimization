/**
 * Store for managing and storing data related to comparing run results.
 * This store contains state and actions for managing travel times, distances, run name, complexity, and network bearing.
 */
import { set } from "ol/transform";
import { defineStore } from "pinia";

export const useCompareRunEvaluation = defineStore("compareRun", {
  state: () => ({
    paretoBikeTTArray: [],
    paretoCarTTArray: [],
    kmBike: null,
    kmCar: null,
    runName: null,
    compare: false,
    complexity: {
      bike: null,
      car: null,
    },
    networkBearing: {
      bike: null,
      car: null,
    },
  }),
  actions: {
    /**
     * Sets the network bearing for bike and car.
     * @param {number} bike - The network bearing for bike.
     * @param {number} car - The network bearing for car.
     */
    setNetworkBearing(bike, car) {
      this.networkBearing.bike = bike;
      this.networkBearing.car = car;
    },
    /**
     * Sets the travel times for bike and car.
     * @param {Array<number>} bikeTT - The travel times for bike.
     * @param {Array<number>} carTT - The travel times for car.
     */
    setTraveltimes(bikeTT, carTT) {
      this.paretoBikeTTArray = bikeTT;
      this.paretoCarTTArray = carTT;
    },
    /**
     * Sets the distances in kilometers for bike and car.
     * @param {number} kmBike - The distance in kilometers for bike.
     * @param {number} kmCar - The distance in kilometers for car.
     */
    setDistancesKM(kmBike, kmCar) {
      this.kmBike = kmBike;
      this.kmCar = kmCar;
    },
    /**
     * Sets the run name.
     * @param {string} runName - The name of the run.
     */
    setRunName(runName) {
      this.runName = runName;
    },
    /**
     * Resets all the state properties to their initial values.
     */
    reset() {
      this.paretoBikeTTArray = [];
      this.paretoCarTTArray = [];
      this.kmBike = null;
      this.kmCar = null;
      this.runName = null;
      this.compare = false;
      this.complexity.bike = null;
      this.complexity.car = null;
      this.networkBearing.bike = null;
      this.networkBearing.car = null;
    },
    /**
     * Sets the compare flag to true.
     */
    setCompareTrue() {
      this.compare = true;
    },
    /**
     * Sets the complexity for bike and car.
     * @param {number} complexityBike - The complexity for bike.
     * @param {number} complexityCar - The complexity for car.
     */
    setComplexity(complexityBike, complexityCar) {
      this.complexity.bike = complexityBike;
      this.complexity.car = complexityCar;
    },
  },
});
