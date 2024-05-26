<template>
  <div class="parent-container">
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <h1 class="text-pink">Help</h1>

    <div class="sidebar-content-container">
      <p>{{ introductionContent }}</p>

      <h2 class="legend-text">How to use</h2>
      <div class="numbered-circles">
        <table>
          <tr>
            <td>
              <div class="numbered-circle"><p>1</p></div>
            </td>
            <td><p class="bold">Create a project</p></td>
          </tr>
          <tr>
            <td></td>
            <td>
              <p style="margin-bottom: 20px">{{ howToContent1 }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <div class="numbered-circle"><p>2</p></div>
            </td>
            <td><p class="bold">Create multiple runs</p></td>
          </tr>
          <tr>
            <td></td>
            <td>
              <p style="margin-bottom: 20px">{{ howToContent2 }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <div class="numbered-circle"><p>3</p></div>
            </td>
            <td><p class="bold">Compare the results</p></td>
          </tr>
          <tr>
            <td></td>
            <td>
              <p style="margin-bottom: 20px">{{ howToContent3 }}</p>
            </td>
          </tr>
        </table>
        <p class="link-style-p">
          <a class="link-style" href="#" @click="openHelpDetails()"
            >more Information about the algorithms, the possible input parameters, and their evaluations</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { helpText } from "../strings/helpText.js";

export default {
  name: "Help",

  data() {
    return {
      introductionContent: helpText.introduction,
      howToContent1: helpText.howTo1,
      howToContent2: helpText.howTo2,
      howToContent3: helpText.howTo3,
    };
  },
  methods: {
    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility();
    },

    openHelpDetails() {
      const statusStore = statusVariablesStore();
      statusStore.toggleHelpDetailsPage();
    },
  },
};
</script>

<style scoped>
@import "../styles/SideBarStyle.css";
@import "../styles/SideBarStyleMobile.css";
@import "../styles/help.css";
</style>
