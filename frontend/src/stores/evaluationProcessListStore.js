import { defineStore } from "pinia";
import { ref } from "vue";

export const evaluationProcessListStore = defineStore("evaluationProcessListStore", () => {
  const evaluationProcesses = ref([]);

  function addEvaluationProcess(process) {
    evaluationProcesses.value.push(process);
  }

  function markEvaluationAsDone(id) {
    const process = evaluationProcesses.value.find(p => p.id === id);
    if (process) {
      console.log("✅ Marking process as done:", id);
      process.status = "done";
    } else {
      console.warn("❌ No matching process found for ID:", id);
      console.table(evaluationProcesses.value.map(p => p.id)); // Print all current IDs
    }
  }
  

  return {
    evaluationProcesses,
    addEvaluationProcess,
    markEvaluationAsDone,
  };
});
