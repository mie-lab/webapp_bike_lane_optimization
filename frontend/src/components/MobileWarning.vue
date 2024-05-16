<template>
  <div class="mobile-warning">
    <div class="inner-container">
      <h1 class="warning">Welcome!</h1>
      <h2 class="h2-warning">
        This page is not developed for vertical mobile screens. Please visit on
        a computer screen or rotate your phone.
      </h2>
      <img :src="warningImage" alt="Warning" class="warning-image" />
    </div>
  </div>
</template>

<script setup>
import warningImage from "../assets/ebikecity_logo.png";
</script>

<style scoped>
.mobile-warning {
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

.warning-image {
  width: 0;
  animation: scaleImage 2s forwards;
}

@keyframes scaleImage {
  0% {
    width: 0;
  }
  100% {
    width: 40%;
  }
}
</style>
