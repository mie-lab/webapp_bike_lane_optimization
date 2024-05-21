<template>
  <div class="help-details-container-inner">
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <div class="content">
      <h2 class="legend-text">Algorithms</h2>
      <h3>Optimize (O)</h3>
      <p>{{ optimizeContent }}</p>
      <h3>Betweeness Biketime (BB)</h3>
      <p>{{ betweenessBiketimeContent }}</p>
      <h3>Betweeness Cartime (BC)</h3>
      <p>{{ betweenessCartimeContent }}</p>

      <h2 class="legend-text" style="margin-top: 40px;">Input Paramters</h2>
      <h3 >Bike lane ratio</h3>
      <p>{{ bikeLaneRatio }}</p>
      <h3>Safety Penalty</h3>
      <p>{{ safetyPenalty }}</p>
      <h3>Car Weight</h3>
      <p>{{ carWeight }}</p>
      <h3>Optimize Frequency</h3>
      <p>{{ optimizeFrequency }}</p>

      <h2 class="legend-text" style="margin-top: 40px;">Evaluation</h2>
      <h3>Pareto</h3>
      <p>{{ pareto }}</p>
      <h3>Travel Times Changes</h3>
      <p>{{ travelTimeChanges }}</p>
      <h3>Distances per lane type</h3>
      <p>{{ distancesPerLaneType }}</p>
      <h3>Network Complexity</h3>
      <p>{{ complexityContent }}</p>
      <h3>Network Bearing</h3>
      <p>{{ bearingContent }}</p>

    </div>
    

    <div class="button-div">
      <button @click="toggleTabsVisibility" class="back-button">Back</button>
    </div>
  </div>
</template>

<script>
import { watch } from "vue";
import { helpText } from "../strings/helpText.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
export default {
  name: "HelpDetails",
  data() {
    return {
      optimizeContent: helpText.optimize,
      betweenessBiketimeContent: helpText.betweenessBiketime,
      betweenessCartimeContent: helpText.betweenessCartime,
      complexityContent: helpText.networkComplexity,
      bearingContent: helpText.networkBearing,
      pareto: helpText.pareto,
      travelTimeChanges: helpText.travelTimeChanges,
      distancesPerLaneType: helpText.distancesPerLaneType,
      bikeLaneRatio: helpText.bikeLaneRatio,
      safetyPenalty: helpText.safetyPenalty,
      carWeight: helpText.carWeight,
      optimizeFrequency: helpText.optimizeFrequency,

    };
  },

  mounted() {},
  methods: {
    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleHelpDetailsPage();
    },
  },
  computed: {},
};
</script>

<style scoped>
@import "../styles/UserInputRunStyle.css";

.button-div {
  display: flex;
  justify-content: left;
  margin-top: 20px;
}
.back-button {
  margin: 0;
  padding: 5px;
  font-size: small;
}
.help-details-container-inner {
  margin: 30px;
  box-shadow: none;
}
.content {
  max-height: 90vh; /* Adjust this value as needed */
  overflow-y: auto;
}

h3{
  margin-bottom: 0px;
  padding-bottom: 0pxs;
}
</style>
