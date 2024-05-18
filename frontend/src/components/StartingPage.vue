<template>
  <div class="starting-page">
    <div class="inner-container">
      <h1 class="warning">
        Welcome to the design and evaluation tool for bike networks
      </h1>
      <h2 class="h2-warning"></h2>
      <div>
        <img
          class="title-image"
          src="../assets/ebikecity_logo.png"
          alt="Your Image Alt Text"
        />
      </div>

      <!-- Button initially hidden -->
      <button class="startButton" @click="closeStartingPage">Start</button>
    </div>
  </div>
</template>

<script>
import { statusVariablesStore } from "../stores/statusVariablesStore";
export default {
  name: "MobileWarning",
  setup() {
    const statusStore = statusVariablesStore();
    return {
      statusStore,
    };
  },
  methods: {
    // Function to hide the mobile warning
    closeStartingPage() {
      this.statusStore.toggleStartingPage();
    },
  },
};
</script>
<style scoped>
@import "../styles/startingPage.css";
</style>
