import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useMediaStore } from '~/stores/media';

const breakpoints = {
  xss: 400,
  xs: 480,
  smm: 560,
  sm: 700,
  md: 768,
  lg: 1023,
  xl: 1100,
  hd: 1460,
};

type Breakpoint = keyof typeof breakpoints | 'full';

export const useBreakpoint = () => {
  console.log('useBreakpoint');
  const media = useMediaStore();
  const current = ref<Breakpoint>('full');

  const updateBreakpoint = () => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    let bp: Breakpoint = 'full';

    if (width <= breakpoints.xss) bp = 'xss';
    else if (width <= breakpoints.xs) bp = 'xs';
    else if (width <= breakpoints.smm) bp = 'smm';
    else if (width <= breakpoints.sm) bp = 'sm';
    else if (width <= breakpoints.md) bp = 'md';
    else if (width <= breakpoints.lg) bp = 'lg';
    else if (width <= breakpoints.xl) bp = 'xl';
    else if (width <= breakpoints.hd) bp = 'hd';

    current.value = bp;
    media.setBreakpoint(bp);
  };

  onMounted(() => {
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateBreakpoint);
  });

  const isMobile = computed(() => ['xss', 'xs', 'smm', 'sm', 'md'].includes(current.value));
  const isDesktop = computed(() => ['lg', 'xl', 'hd', 'full'].includes(current.value));

  return { current, isMobile, isDesktop };
};
