<template>
  <div class="help-details-container-inner">
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <h2 class="legend-text">Algorithms</h2>
    <h3>Optimize (O)</h3>
    <p>{{ optimizeContent }}</p>
    <h3>Betweeness Biketime (BB)</h3>
    <p>{{ betweenessBiketimeContent }}</p>
    <h3>Betweeness Cartime (BC)</h3>
    <p>{{ betweenessCartimeContent }}</p>
  </div>
</template>

<script>
import { watch } from "vue";
import { helpText } from "../scripts/helpText.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
export default {
  name: "HelpDetails",
  data() {
    return {
      optimizeContent: helpText.optimize,
      betweenessBiketimeContent: helpText.betweenessBiketime,
      betweenessCartimeContent: helpText.betweenessCartime,
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
.help-details-container-inner {
  margin: 30px;
  box-shadow: none;
}
</style>
