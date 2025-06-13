
<!-- In this file, the evaluation process list is defined. In automatically opens and closes when evaluation metrics are computed. It can also be opened by clicking the second last icon in the sidebar. -->
 
<template>
  <div class="running-requests-list">
    <h3>Evaluation Requests</h3>
    <!-- Definition of different table columns -->
    <div class="list-header eval-grid">
      <div class="header-cell">Project</div>
      <div class="header-cell">Run</div>
      <div class="header-cell">Metric</div>
      <div class="header-cell">Time</div>
      <div class="header-cell"><i class="fa-solid fa-spinner"></i></div>
    </div>
    <!-- Table Entries are loaded -->
    <ul class="listContent">
      <li v-for="process in [...evaluationProcesses].reverse()" :key="process.id">
        <div class="process-details eval-grid">
          <div class="cell">{{ process.projectName }}</div>
          <div class="cell">{{ process.runName }}</div>
          <div class="cell metric-text">{{ process.metricLabel }}</div>
          <div class="cell time-cell">
            {{ formatTime(process.createdAt) }}
          </div>
          <div class="cell status-cell">
            <template v-if="process.status === 'pending'">
              <BeatLoader :color="'#123abc'" :size="6" />
            </template>
            <template v-else-if="process.status === 'done'">
              <i class="fa-solid fa-check"></i>
            </template>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { evaluationProcessListStore } from "../stores/evaluationProcessListStore.js";
import BeatLoader from "vue-spinner/src/BeatLoader.vue";

export default {
  name: "EvaluationProcessList",
  components: {
    BeatLoader,
  },
  setup() {
    const store = evaluationProcessListStore();
    return {
      evaluationProcesses: store.evaluationProcesses,
    };
  },
  methods: {
    formatTime(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
};
</script>

<style scoped>
@import "../styles/processList.css";

.running-requests-list {
  margin-left: 20px;
  margin-right: 10px;
  max-height: 80%;
}

.eval-grid {
  display: grid;
  grid-template-columns: 25% 20% 25% 20% 10%;
  align-items: center;
  padding: 4px 0;
  box-sizing: border-box;
}

.list-header {
  font-weight: bold;
  border-bottom: 1px solid var(--black);
  margin-bottom: 5px;
  font-size: 0.85em;
  color: var(--black);
  text-align: left;
}

.header-cell {
  padding: 6px 8px;
  box-sizing: border-box;
}

.cell {
  padding: 6px 8px;
  font-size: 0.85em;
  word-break: break-word;
  line-height: 1.2;
  box-sizing: border-box;
}

.metric-text {
  white-space: pre-line;
}

.time-cell {
  font-size: 0.75em;
  color: black;
}

.status-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
