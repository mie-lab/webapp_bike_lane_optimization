<template>
    <div class="dashboard-container">
        <div class="dashboard-navigation bg-darkgrey">
            <button class="close-open" @click ="toggleDashboard">close</button>
        </div>
        <div v-show ="dashboardStatus" class="dashboard-content bg-lightgrey">
            <h1 class="text-pink">Dashboard</h1>
            <p class="text-blue">Dashboard content goes here</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Dashboard',
    data() {
        return {
            dashboardStatus: true,
        };
    },
    methods: {
        toggleDashboard() {
            this.dashboardStatus = !this.dashboardStatus;
        }
        // Your methods go here
    },
    mounted() {
        // Code to run when the component is mounted goes here
    },
};
</script>

<style scoped>
.dashboard-container {
    display: flex; /* Enables Flexbox layout */
    height: 100vh; /* Full viewport height */
    position: absolute;
    right:0;
    
  

}

.dashboard-navigation {
    height: 100%; /* Take full height of the parent */
    width: 20px; /* Adjusted for visibility */
    display: flex; /* Enables Flexbox layout */
    justify-content: center; /* Centers items horizontally */
    align-items: center; /* Centers items vertically */
    flex-direction: column; /* Stacks items vertically */
    
}

.dashboard-content {
    flex-grow: 1; 
    width: 300px;
}
.close-open {
    background-color: #e16ece;
    
}

</style>