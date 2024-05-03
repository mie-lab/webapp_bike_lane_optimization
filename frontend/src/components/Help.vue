<template>
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i
        class="fa-solid fa-times"
        style="font-size: 20px; color: var(--darkgrey-bg)"
      ></i>
    </button>
    <h1 class="text-pink">Help</h1>

    <div class="sidebar-content-container">
      

      <h2 class="legend-text">Legend</h2>

      <table class="legend-table">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 80%" />
        </colgroup>
        <tr>
          <td>
            <div
              class="legend-rectangle"
              style="background-color: var(--blue-color)"
            ></div>
          </td>
          <td>Car</td>
        </tr>
        <tr>
          <td>
            <div
              class="legend-rectangle"
              style="background-color: var(--pink-color)"
            ></div>
          </td>
          <td>Bike</td>
        </tr>
      </table>
      <br></br>
      <h2 class="legend-text">Algorithms</h2>
    <h3>Optimize (O)</h3>
    <p>{{ optimizeContent }}</p>
    <h3>Betweeness Biketime (BB)</h3>
    <p>{{ betweenessBiketimeContent }}</p>
    <h3>Betweeness Cartime (BC)</h3>
    <p>{{ betweenessCartimeContent }}</p>
  </div>
</div>
</template>

<script>
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { helpText } from "../scripts/helpText.js";

export default {
  name: "Help",

  data() {
    return {
      optimizeContent: helpText.optimize, 
      betweenessBiketimeContent: helpText.betweenessBiketime,
      betweenessCartimeContent: helpText.betweenessCartime,
    };
  },
  methods: {
    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility();
    },
  },
};
</script>

<style scoped>
@import "../styles/SideBarStyle.css";

.content {
  margin-left: 30px;
}

.legend-text {
  margin-left: 0;
}

.legend-table {
  text-align: left;
  width: 100%;
  border-collapse: collapse;
  margin-top: 0;
}

.legend-table td {
  padding: 5px;
}

.legend-rectangle {
  margin-top: 4px;
  width: 50px;
  height: 5px;
}
</style>
