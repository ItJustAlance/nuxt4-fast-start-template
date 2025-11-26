import { acceptHMRUpdate, defineStore } from 'pinia';



export const useThemeStore = defineStore('theme', {
  // a function that returns a fresh state
  state: () => ({
    themeName: 'theme-red',
    themeColor: 'red',
    themeDirection: 'red',

  }),
  // optional getters
  getters: {
    theme: (state) => {
      return `${state.themeName}`;
    },
    themeDir: (state) => {
      return `${state.themeDirection}`;
    },
    // isDarkMode: (state) => state.themeName === 'lara-dark',
  },
  // optional actions
  actions: {
    setTheme(themeName: string) {
      this.themeName = themeName;
      this.link = updateTheme(this.themeName, this.themeColor);
    },
    setColor(colorName: string) {
      this.themeColor = colorName;
      this.link = updateTheme(this.themeName, this.themeColor);
    },
  },
});
//
// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot));
// }
