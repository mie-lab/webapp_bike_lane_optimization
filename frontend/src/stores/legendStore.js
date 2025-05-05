// stores/legendStore.js
import { defineStore } from 'pinia';

export const useLegendStore = defineStore('legendStore', {
  state: () => ({
    currentLegendKey: null,
    legends: {
      lts: [
        { label: '1', color: '#00ff00' },
        { label: '2', color: '#80ff00' },
        { label: '3', color: '#ffff00' },
        { label: '4', color: '#ff0000' }
      ],

      bci: [
        { label: '< 1', color: '#00ff00' },
        { label: '< 2', color: '#80ff00' },
        { label: '< 3', color: '#ffff00' },
        { label: '< 4', color: '#ff8000' },
        { label: '< 6', color: '#ff0000' },
        { label: '≥ 6', color: '#800000' }
      ],

      bsl: [
        { label: '1', color: '#00ff00' },
        { label: '2', color: '#80ff00' },
        { label: '3', color: '#ffff00' },
        { label: '4', color: '#ff8000' },
        { label: '5', color: '#ff0000' }
      ],

      blos_grade: [
        { label: 'A', color: '#00ff00' },
        { label: 'B', color: '#80ff00' },
        { label: 'C', color: '#ffff00' },
        { label: 'D', color: '#ff9900' },
        { label: 'E', color: '#ff3300' },
        { label: 'F', color: '#ff0000' }
      ],
      

      porter: [
        { label: '≥ 0.75', color: '#00ff00' },
        { label: '0.5 – 0.75', color: '#ffff00' },
        { label: '< 0.5', color: '#ff0000' }
      ],

      weikl: [
        { label: '≥ 4', color: '#00cc00' },
        { label: '2.5 – 4', color: '#ffff00' },
        { label: '< 2.5', color: '#ff3300' }
      ],

      anp: [
        { label: '≥ 0.75', color: '#00ff00' },
        { label: '0.5 – 0.75', color: '#ffff00' },
        { label: '< 0.5', color: '#ff0000' }
      ],

      network_bike: [
        { label: 'Bike', color: 'var(--pink-color)' }
      ],

      network_car: [
        { label: 'Car', color: 'var(--blue-color)' }
      ],

      network_full: [
        { label: 'Car', color: 'var(--blue-color)' },
        { label: 'Bike', color: 'var(--pink-color)' }
      ]
    }
  }),
  getters: {
    activeLegend(state) {
      return state.legends[state.currentLegendKey] || [];
    }
  },
  actions: {
    setLegendKey(key) {
      this.currentLegendKey = key;
    }
  }
});
