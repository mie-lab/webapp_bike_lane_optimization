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
        { label: '≤ 5', color: '#da5268' },
        { label: 'N/A', color: '#000000', strokeDasharray: '5 5' }
      ],

      bci: [
        { label: '< 1', color: '#0d00a3' },
        { label: '< 2', color: '#6151b0' },
        { label: '< 3', color: '#b3a8d7' },
        { label: '< 4', color: '#e9ccd4' },
        { label: '< 6', color: '#f7a4a8' },
        { label: '≥ 6', color: '#da5268' },
        { label: 'N/A', color: '#000000', strokeDasharray: '5 5' }
      ],

      anp: [
        { label: '≥ 0.25', color: '#0d00a3' },
        { label: '≥ 0.20', color: '#564fb2' },
        { label: '≥ 0.15', color: '#a69ccc' },
        { label: '≥ 0.10', color: '#e2d3dc' },
        { label: '≥ 0.05', color: '#ed9ca4' },
        { label: '< 0.05', color: '#da5268' },
        { label: 'N/A', color: '#000000', strokeDasharray: '5 5' }
      ],
      
      

      blos_grade: [
        { label: 'A', color: '#0d00a3' },
        { label: 'B', color: '#4e44b5' },
        { label: 'C', color: '#9a8ed6' },
        { label: 'D', color: '#e6c3d6' },
        { label: 'E', color: '#f3a2af' },
        { label: 'F', color: '#da5268' },
        { label: 'N/A', color: '#000000', strokeDasharray: '5 5' }
      ],

      weikl: [
        { label: '≥ 1.6', color: '#0d00a3' },
        { label: '≥ 1.4', color: '#413fae' },
        { label: '≥ 1.2', color: '#7874c2' },
        { label: '≥ 1.0', color: '#b3b3d1' },
        { label: '≥ 0.8', color: '#e4c6cd' },
        { label: '≥ 0.6', color: '#ec9aa7' },
        { label: '≥ 0.4', color: '#e56d80' },
        { label: '< 0.4', color: '#da5268' },
        { label: 'N/A', color: '#000000', strokeDasharray: '5 5' }
      ],
      

      porter: [
        { label: '≥ 1', color: '#0d00a3' },
        { label: '0.5 – 1', color: '#413fae' },
        { label: '0.25 – 0.5', color: '#7874c2' },
        { label: '0 – 0.25', color: '#b3b3d1' },
        { label: '-0.25 – 0', color: '#e4c6cd' },
        { label: '-0.5 – -0.25', color: '#ec9aa7' },
        { label: '-1 – -0.5', color: '#e56d80' },
        { label: '< -1', color: '#da5268' },
        { label: 'N/A', color: '#000000', strokeDasharray: '5 5' }
      ],
      

      lts: [
        { label: '1', color: '#0d00a3' },
        { label: '2', color: '#7260bc' },
        { label: '3', color: '#e48ca6' },
        { label: '4', color: '#da5268' },
        { label: 'N/A', color: '#000000', strokeDasharray: '5 5' }
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
