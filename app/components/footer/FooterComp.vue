<script setup lang="ts">
import { useThemeStore } from '~/stores/theme';
import { storeToRefs } from 'pinia';

const themeStore = useThemeStore();
const { themeDir } = storeToRefs(themeStore);

const footerNavData = reactive([
  {
    title: 'Меню',
    items: [
      { text: 'Курсы', link: '/courses' },
      { text: 'Мероприятия', link: 'https://www.dpomos.ru/calendar/', nofollow: true, target: '_blank' },
      { text: 'Конкурсы', link: 'https://www.dpomos.ru/cabinet/trainee/my-competitions.php', nofollow: true, target: '_blank' },
      { text: 'Новости', link: '/news' },
      { text: 'Поддержка', link: 'https://www.dpomos.ru/support/', nofollow: true, target: '_blank' },
    ],
  },
  {
    title: 'На портале',
    items: [
      { text: 'Реестр программ', link: '/programs' },
      { text: 'Субъекты портала', link: '/subjects' },
      { text: 'Знакомство с порталом', link: '/profilelevel' },
      { text: 'Экспертиза ДПП', link: '/expertise' },
      { text: 'Правовая информация', link: '/legalinfo' },
    ],
  },
  {
    title: 'Внешние ресурсы',
    items: [
      { text: 'Банк резюме', link: 'https://br.corp-univer.ru/', nofollow: true, target: '_blank' },
      {
        text: 'Аттестация - руководящих кадров',
        link: 'https://corp-univer.ru/аттестация-руководящих-кадров/',
        nofollow: true,
        target: '_blank',
      },
      {
        text: 'Аттестация - педагогических работников',
        link: 'https://corp-univer.ru/аттестация-педагогических-работников/',
        nofollow: true,
        target: '_blank',
      },
    ],
  },
]);
</script>
<template>
  <footer class="footer">
    <div class="all">
      <div style="display: none" class="box-info-banner">
        <div class="box-info-banner__header">
          <div class="img"><img :src="`/img/${themeDir}/footer-warning.svg`" alt="" ></div>
          <div class="b-text">Возникли сложности с работой на сайте? Пишите нам</div>
        </div>

        <div class="b-right">
          <NuxtLink to="https://www.dpomos.ru/support/" rel="nofollow" target="_blank" class="btn btn--second">
            <span class="btn-label">Техническая поддержка</span>
            <SvgIcon name="ic-support" class="ic-clr ic24" />
          </NuxtLink>
        </div>
      </div>
      <!--end box-info-banner -->
      <div class="footer-up">
        <div class="footer-cols">
          <div class="footer-col-info">
            <div class="text">Дополнительное профессиональное образование работников образовательных организаций</div>
            <div style="display: none" class="b-btn-support">
              <NuxtLink to="https://www.dpomos.ru/support/" rel="nofollow" target="_blank" class="btn btn--second">
                <span class="btn-label">Техническая поддержка</span>
                <SvgIcon name="ic-support" class="ic-clr ic24"/>
              </NuxtLink>
            </div>
            <!--end b-btn-support -->
          </div>
          <!--end footer-col-info -->
          <div class="footer-nav">
            <div v-for="(item, index) in footerNavData" :key="index" class="footer-nav__col">
              <FooterNav :item="item" />
            </div>
          </div>
          <!--end footer-nav -->
        </div>
        <!--end footer-cols-->
      </div>
      <!--end footer-up -->
      <div role="contentinfo" class="footer-bottom">
        <div class="copy">© 2025 Департамент образования и науки города Москвы</div>
      </div>
    </div>
  </footer>
  <!--  Только для авторизованных пользователей-->
  <!--  <JivoButton v-show="currentUser" />-->
  <!--  Для всех пользователей-->
  <JivoButton />
</template>
