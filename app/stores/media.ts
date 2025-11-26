import { defineStore } from 'pinia';

export const useMediaStore = defineStore('media', {
  state: () => ({
    breakpoint: 'full' as string, // Можно оставить 'full' — без лишнего "2"
  }),

  getters: {
    isMobile: (state) => ['xss', 'xs', 'smm', 'sm', 'md'].includes(state.breakpoint),

    isDesktop: (state) => ['lg', 'xl', 'hd', 'full'].includes(state.breakpoint),
  },

  actions: {
    setBreakpoint(bp: string) {
      console.log('Pinia: setBreakpoint', bp);
      this.breakpoint = bp;
    },
  },
});
