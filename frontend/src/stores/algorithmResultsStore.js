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

    addRunResult(projectName,runResult){
      const index = this.results.findIndex(result => result.project_name === projectName);
      
      if (index !== -1) {
        // Push the new element into the runs array of that object
        this.results[index].runs.push(runResult);
      }
    }
  },


  
});

/* 
Structure of results:

[
  {
  expected_runtime:
  project_name: 
  internal_project_name: bounding box als string
  variable: ??
  runs: []
  }
]

*/