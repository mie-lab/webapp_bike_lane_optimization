import { defineStore } from "pinia";

export const useInputStore = defineStore("variableStore", {
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