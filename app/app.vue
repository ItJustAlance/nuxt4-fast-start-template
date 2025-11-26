<script lang="ts" setup>
import { useEntrySeo } from '~/composables/seo/useEntrySeo';

useEntrySeo({
  siteLinks: [
    { name: 'Курсы', url: '/courses' },
    { name: 'Программы', url: '/programs' },
    { name: 'Лица портала', url: '/faces' },
    { name: 'Новости', url: '/news' },
  ],
});
</script>

<template>
  <Html lang="ru">
    <Head>
      <Title>ДПО педагогов Москвы — Дополнительное профессиональное образование для учителей</Title>
      <Meta name="description" content="Дополнительное профессиональное образование педагогических работников города Москвы" />
    </Head>

    <Body>
      <NuxtLayout>
        <NuxtPage />
        <Toast />
      </NuxtLayout>
    </Body>
  </Html>
</template>
