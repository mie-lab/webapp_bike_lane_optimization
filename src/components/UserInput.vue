<template>
    <div>
        <h1>User Input</h1>
        <div class="user-input-container">
            <h2> Car travel time weighting</h2>
            <div class = "slide-container">
                <input class ="slider" type="range" min="0" max="1" step="0.01" v-model="timeWeighting" />
            </div>
            
            <p>Chosen weighting: {{ timeWeighting }}</p>
            <br>
            <h2> Allocation of lanes </h2>
            <div class = "slide-container">
                <input class ="slider" type="range" min="0" max="100" v-model="laneAllocation" />
            </div>
            
            <p>Chosen Value in percent: {{ laneAllocation }} %</p>
            <br>
            <button>Run</button>
        </div>
    </div>
</template>
            

<script>
export default {
    name: 'UserInput',
    data() {
        return {
            timeWeighting: 0.7,
            laneAllocation: 10
            // Your data properties go here
        };
    },
    methods: {
        // Your methods go here
    },
    mounted() {
        // Code to run when the component is mounted goes here
    },
};
</script>

<style scoped>


.slider {
    width: 80%;
    
}
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
  cursor: pointer;
}



</style>