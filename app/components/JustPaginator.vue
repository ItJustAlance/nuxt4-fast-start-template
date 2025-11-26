<template>
  <div class="just-pagination-wrapper">
    <div v-if="totalPages > 1" class="just-pagination">
      <button class="just-pagination__btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        <SvgIcon name="arr-left" class="arr-l ic16"/>
      </button>

      <div class="just-pagination__numbers">
        <button
          v-if="currentPage > 3"
          :class="{ active: 1 === currentPage }"
          class="just-pagination__number"
          @click="changePage(1)"
        >
          1
        </button>
        <span v-if="currentPage > 4" class="just-pagination__ellipsis">...</span>
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="{ active: page === currentPage }"
          class="just-pagination__number"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <span v-if="showEllipsis" class="just-pagination__ellipsis">...</span>

        <button
          v-if="totalPages > 5 && visiblePages[visiblePages.length - 1] < totalPages"
          :class="{ active: totalPages === currentPage }"
          class="just-pagination__number"
          @click="changePage(totalPages)"
        >
          {{ totalPages }}
        </button>
      </div>

      <button class="just-pagination__btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        <SvgIcon name="arr-left" class="arr-r ic16"/>
      </button>
    </div>
    <div v-if="isShowPerview" class="just-pagination__perview">
      <div class="just-pagination__perview-list">
        <div v-for="option in perPageOptions" :key="option" class="just-pagination__perview-item">
          <button class="just-pagination__perview-item-link" @click="changeItemsPerPage(option)">{{ option }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  currentPage: number;
  totalPages: number;
  perPage: number;
  perPageOptions?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  perPageOptions: () => [5, 10, 15],
});

interface Emits {
  (e: 'update:page', page: number): void;
  (e: 'update:perPage', perPage: number): void;
}

const emit = defineEmits<Emits>();

// const perPageOptions = [5, 10, 15];
const selectedPerPage = ref(props.perPage);

/** @TODO доделать, если есть возможность отображать количество на странице **/

const isShowPerview = computed(() => props.perPage >= 5 && props.totalPages > 1);
const range = (from: number, to: number) => {
  const r: number[] = [];
  for (let i = from; i <= to; i++) r.push(i);
  return r;
};

const visiblePages = computed(() => {
  const total = props.totalPages;
  const cur = props.currentPage;
  const maxVisible = 5;

  if (total <= maxVisible) return range(1, total);

  let start = Math.max(1, cur - 2);
  let end = Math.min(total, cur + 2);

  if (cur <= 3) {
    end = maxVisible;
  } else if (cur >= total - 2) {
    start = total - maxVisible + 1;
  }

  return range(start, end);
});

// показывать эллипсис или нет
const showEllipsis = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1;
});

const changePage = (page: number) => {
  if (page < 1) page = 1;
  if (page > props.totalPages) page = props.totalPages;
  emit('update:page', page);
};

const changeItemsPerPage = (perPage: number) => {
  selectedPerPage.value = perPage;
  emit('update:perPage', selectedPerPage.value);
};
</script>

<style scoped></style>
