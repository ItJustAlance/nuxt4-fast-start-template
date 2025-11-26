import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useLazyComponent(renderOnServer = false) {
  // если true — при SSR будет true и слот попадёт в HTML
  const isServer = typeof window === 'undefined';
  const isVisible = ref(!!(renderOnServer && isServer));

  const target = ref(null);
  let observer: IntersectionObserver | null = null;

  const observe = () => {
    if (isVisible.value) return; // уже видно (например при SSR)
    if (!target.value) return;
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer?.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(target.value);
  };

  onMounted(() => {
    observe();
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });

  return { isVisible, target };
}
