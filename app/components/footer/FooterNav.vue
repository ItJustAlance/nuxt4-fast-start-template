<template>
  <div class="footer-nav__item">
    <div class="footer-nav__title" @click="toggleMenu">
      {{ item.title }}
      <div class="footer-nav__arr">
        <SvgIcon name="caret-down" class="fnone ic16" :class="{ 'caret-up': isOpen }"/>
      </div>
    </div>
    <ul class="foot-menu" :class="{ open: isOpen }">
      <li v-for="(subItem, subIndex) in item.items" :key="subIndex">
        <NuxtLink :to="subItem.link" :rel="subItem?.nofollow ? 'nofollow noopener noreferrer' : null" :target="subItem.target">{{ subItem.text }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    item: {
      type: Object as PropType<{
        title: string;
        items: {
          text: string;
          link: string;
          target?: string;
          nofollow?: boolean;
        }[];
      }>,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

