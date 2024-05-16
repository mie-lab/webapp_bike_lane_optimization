<template>
  <div class="starting-page">
    <div class="inner-container">
      <h1 class="warning">Welcome to E-BIKE CITY</h1>
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
.starting-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.5em;
  z-index: 9999;
}

.h2-warning {
  font-size: 0.9em;
  margin-top: 0;
  text-align: center;
  color: white;
}

.inner-container {
  padding: 20px;
}

.title-image {
  width: 0;
  animation: scaleImage 2s forwards;
}

@keyframes scaleImage {
  0% {
    width: 0;
  }
  100% {
    width: 70%;
  }
}

/* Add keyframes for button */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.startButton {
  opacity: 0;
  animation: fadeIn 1.5s ease-in-out;
  animation-delay: 1.5s;
  animation-fill-mode: forwards;
}
</style>
