import { defineStore } from "pinia";

export const useStateStore = defineStore("statusVariables", {
    state: () => ({
        activeTab: "UserInput",
        openTabs: true,
    }),
    actions: {
        toggleTabsVisibility() {
            this.openTabs = !this.openTabs;
        }
    }
});
