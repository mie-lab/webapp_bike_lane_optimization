<template>
    <div>
        <button class="close-btn" @click="toggleTabsVisibility">
             <i class="fa-solid fa-times" style="font-size: 24px"></i>
        </button>
        <h1 class="text-pink">Help</h1>
        <p class="text-blue">IExplaines how to use the website</p>
    </div>
</template>

<script>
import { statusVariablesStore } from '../stores/statusVariablesStore.js';
export default {
    name: 'Help',
    
    methods: {
        toggleTabsVisibility() {
            const statusStore = statusVariablesStore();
            statusStore.toggleTabsVisibility(); // Toggle the visibility of the tabs using the Pinia store
        }
    },
    
};
</script>

<style scoped>
@import "../styles/SideBarStyle.css";
</style>