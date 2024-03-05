<template>
    <div>
        <div class="sidebar-container">
            <div class="navigation-bar">
                <button class="nav-button">
                    <img class="arrow-img" src="../assets/parameter-2.png" alt="parameter" @click="activeTab ='UserInput'"/>
                    
                </button>
                <button class="nav-button">
                    <img class="arrow-img" src="../assets/bike-14.png" alt="bike" @click="activeTab ='Bike'"/>
                    
                </button>
                <button class="nav-button">
                    <img class="arrow-img" src="../assets/info-61.png" alt="info" @click="activeTab ='Info'"/>
                    
                </button>

                <button class="nav-button" @click="activeTab='None'">
                    Close
                    
                </button>
            </div>

            <div class="sidebar-content" v-show="activeTab !== 'None'">
                <component :is="currentComponent"></component>
            </div>

        </div>
    </div>
</template>


<script>
import ProjectInfo from './ProjectInfo.vue';
import UserInput from './UserInput.vue';
import BikeInfo from './BikeInfo.vue';

export default {
    
    name: 'SideBar',
    data() {
        return {
            activeTab: "UserInput",
            // Your data properties go here
        };
    },
    computed: {
        currentComponent() {
            switch(this.activeTab) {
                case 'Info': return ProjectInfo;
                case 'UserInput': return UserInput;
                case 'Bike': return BikeInfo; // Map 'Bike' to the BikeInfo component
                default: return null; // No component for 'None' or unmatched value
            }
        }
    },
    methods: {
    },
    mounted() {
    },
};
</script>

<style scoped>
/* Your component-specific styles go here */
.sidebar-container {
    display: flex; /* Enables Flexbox layout */
    height: 100vh;
    position:absolute;
    left: 0;
}

.navigation-bar {
    background-color: #959595;
    height: 100%;
    width: 50px; /* Adjust based on your preference */
    display: flex;
    flex-direction: column; /* Aligns children vertically */
    align-items: center; /* Centers items horizontally */
    justify-content: start; /* Aligns items to the start of the flex-direction */
    padding-top: 10px; /* Adds some space at the top */
}

.nav-button {
    display: flex; /* Enables flexbox layout within the button */
    align-items: center; /* Centers items vertically */
    background-color: transparent;
    border: none;
    color: #333;
    padding: 10px;
    margin: 5px 0;
    width: 100%;
    cursor: pointer;
    
}

.nav-button:hover {
    background-color: #ddd;
}

.nav-button img {
    width: 24px; /* Adjust based on your SVG size preferences */
    height: 24px; /* Adjust based on your SVG size preferences */
    margin-right: 8px; /* Space between the SVG image and button text */
}



.sidebar-content {
    background-color: #cacaca;
    width:300px; /* Adjust width to fill remaining space */
    flex-grow: 1;
    
}

</style>