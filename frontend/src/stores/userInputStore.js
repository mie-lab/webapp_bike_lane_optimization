import { defineStore } from "pinia";

export const userInputStore = defineStore("variableStore", {
  id: "variableStore",
  state: () => ({
    timeWeighting: 0.5,
    laneAllocation: 0.5,
    boundingBox: null,
  }),
  actions: {
    setBoundingBox(boundingBox) {
      this.boundingBox = boundingBox;
    },
  },
});
