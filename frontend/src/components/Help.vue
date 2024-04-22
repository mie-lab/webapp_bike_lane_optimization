<template>
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i
        class="fa-solid fa-times"
        style="font-size: 20px; color: var(--darkgrey-bg)"
      ></i>
    </button>
    <h1 class="text-pink">Help</h1>

    <div class="content">
      <p style="margin-left: 0px">More information here</p>

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
    </div>
  </div>
</template>

<script>
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
export default {
  name: "Help",

  methods: {
    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility(); // Toggle the visibility of the tabs using the Pinia store
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
