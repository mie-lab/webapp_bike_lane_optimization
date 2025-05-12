import { defineStore } from 'pinia';

export const useLegendStore = defineStore('legendStore', {
  state: () => ({
    currentLegendKey: null,
    legends: {
      // Updated BSL (5 levels, blue to pink)
      bsl: [
        { label: '≤ 2', color: '#0d00a3' },
        { label: '≤ 3', color: '#7260bc' },
        { label: '≤ 4', color: '#e48ca6' },
        { label: '≤ 5', color: '#da5268' }
      ],
      

      // Updated BCI (6 levels, blue to pink)
      bci: [
        { label: '< 1', color: '#0d00a3' },
        { label: '< 2', color: '#6151b0' },
        { label: '< 3', color: '#b3a8d7' },
        { label: '< 4', color: '#e9ccd4' },
        { label: '< 6', color: '#f7a4a8' },
        { label: '≥ 6', color: '#da5268' }
      ],

      // Updated ANP (3 levels, blue to pink)
      anp: [
        { label: '≥ 0.75', color: '#0d00a3' },
        { label: '0.5 – 0.75', color: '#ffffff' },
        { label: '< 0.5', color: '#da5268' }
      ],


      blos_grade: [
        { label: 'A', color: '#0d00a3' },
        { label: 'B', color: '#4e44b5' },
        { label: 'C', color: '#9a8ed6' },
        { label: 'D', color: '#e6c3d6' },
        { label: 'E', color: '#f3a2af' },
        { label: 'F', color: '#da5268' }
      ],
      

      // New WEIKL (3 levels, blue to pink)
      weikl: [
        { label: '≥ 4', color: '#0d00a3' },
        { label: '2.5 – 4', color: '#ffffff' },
        { label: '< 2.5', color: '#da5268' }
      ],

      // New PORTER (3 levels, blue to pink)
      porter: [
        { label: '≥ 0.75', color: '#0d00a3' },
        { label: '0.5 – 0.75', color: '#ffffff' },
        { label: '< 0.5', color: '#da5268' }
      ],

      // New LTS (4 levels, blue to pink)
      lts: [
        { label: '1', color: '#0d00a3' },
        { label: '2', color: '#7260bc' },
        { label: '3', color: '#e48ca6' },
        { label: '4', color: '#da5268' }
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
