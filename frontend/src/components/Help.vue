<template>
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i
        class="fa-solid fa-times"
        style="font-size: 20px;"
      ></i>
    </button>
    <h1 class="text-pink">Help</h1>

    <div class="sidebar-content-container">

      <p>{{introductionContent}}</p>

      <h2 class="legend-text">How to use</h2>
      <div class="numbered-circles">
        <table>
          <tr>
            <td><div class="numbered-circle"><p>1</p></div></td>
            <td><p class="bold">Create a project</p></td>
          </tr>
          <tr>
            <td></td>
            <td><p style="margin-bottom: 20px;">{{howToContent1}}</p></td>
          </tr>
          <tr>
            <td><div class="numbered-circle"><p>2</p></div></td>
            <td><p class="bold">Create multiple runs</p></td>
          </tr>
          <tr>
            <td></td>
            <td><p style="margin-bottom: 20px;">{{howToContent2}}</p></td>
          </tr>
          <tr>
            <td><div class="numbered-circle"><p>3</p></div></td>
            <td><p class="bold">Compare the results</p></td>
          </tr>
          <tr>
            <td></td>
            <td><p style="margin-bottom: 20px;">{{howToContent3}}</p></td>
          </tr>
        </table>
        <p class="link-style-p">
        <a class="link-style" href="#" @click="openHelpDetails()"
          >more details</a
        >
      </p>
      </div>
      

      <h2 class="legend-text">Legend</h2>

      <table class="legend-table">
        <colgroup>
          <col style="width: 20%" />
          <col style="width: 80%" />
        </colgroup>
        <tr>
          <td>
            <div
              class="legend-rectangle"
              style="background-color: var(--blue-color)"
            ></div>
          </td>
          <td>Car</td>
        </tr>
        <tr>
          <td>
            <div
              class="legend-rectangle"
              style="background-color: var(--pink-color)"
            ></div>
          </td>
          <td>Bike</td>
        </tr>
      </table>
      <br></br>
      
  </div>
</div>
</template>

<script>
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { helpText } from "../scripts/helpText.js";

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

.content {
  margin-left: 30px;
}

.legend-text {
  margin-left: 0;
}

.legend-table {
  text-align: left;
  width: 100%;
  border-collapse: collapse;
  margin-top: 0;
}

.legend-table td {
  padding: 5px;
}

.legend-rectangle {
  margin-top: 4px;
  width: 50px;
  height: 5px;
}

.numbered-circles {
  display: flex;
  flex-direction: column;
}

.numbered-circle {
  width: 25px;
  height: 25px;
  border: 2.2px solid black;
  border-radius: 50%;
  color: white;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 7px;
}

.numbered-circle:nth-child(even) {
  background-color: var(--pink-color);
}


.numbered-circles p {
  margin: 0;
}




.numbered-circle p {
  color: black;
  font-weight: bold;
}

</style>
