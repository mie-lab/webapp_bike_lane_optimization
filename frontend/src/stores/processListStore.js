// Import necessary modules
import { defineStore } from "pinia";

// Define a Pinia store
export const runningProcessStore = defineStore({
  id: "runningProcesses",
  state: () => ({
    runningProcesses: [],
  }),
  actions: {
    addProcess(process) {
      this.runningProcesses.push(process);
    },
    removeProcess(processId) {
      this.runningProcesses = this.runningProcesses.filter(
        (process) => process.id !== processId
      );
    },
    markProcessAsDone(processId) {
      const index = this.runningProcesses.findIndex(
        (process) => process.id === processId
      );
      if (index !== -1) {
        // Update the status of the process to "done"
        this.runningProcesses[index].status = "done";
      }
    },
  },
});
