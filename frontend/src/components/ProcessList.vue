<template>
  <div class="running-requests-list">
    <h3>Running Requests</h3>
    <ul>
      <!-- Render the list of running requests here -->
      <li v-for="request in runningRequests" :key="request.id">
        {{ request.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      runningRequests: [], // Array to store the running requests
    };
  },
  // Methods to fetch and update the list of running requests
  // For example, you can use setInterval to periodically fetch the list from the server
  // and update the runningRequests array.
};
</script>

<style scoped>
/* Add styles for the running requests list */
</style>
