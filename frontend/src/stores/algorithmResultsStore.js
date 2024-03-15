// resultsStore.js
import { defineStore } from 'pinia';

export const useResultsStore = defineStore({
  id: 'results',

  // State of the store
  state: () => ({
    results: [], // List to store results
  }),

  // Mutations to modify the state
  actions: {
    // Mutation to add new result
    addResult(result) {
      this.results.push(result);
    },
  },


  
});