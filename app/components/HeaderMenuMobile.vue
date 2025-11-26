<script lang="ts" setup>
const isSubmenuOpen = ref(false);

function onSubmenu() {
  isSubmenuOpen.value = !isSubmenuOpen.value;
}
</script>

<template>
  <div class="mobile-menu">
    <ul class="header__nav-menu">
      <li class="nav-menu-item">
        <NuxtLink to="/" class="nav-menu-item__link"> Курсы </NuxtLink>
      </li>

      <!-- временно: ссылка на дпомос -->
      <li class="nav-menu-item">
        <NuxtLink to="https://www.dpomos.ru/calendar/" rel="nofollow" target="_blank" class="nav-menu-item__link">
          Мероприятия
        </NuxtLink>
      </li>
      <li class="nav-menu-item">
        <NuxtLink
          to="https://www.dpomos.ru/cabinet/trainee/my-competitions.php"
          rel="nofollow"
          target="_blank"
          class="nav-menu-item__link"
        >
          Конкурсы
        </NuxtLink>
      </li>
      <li v-if="false" class="nav-menu-item">
        <NuxtLink to="#" class="nav-menu-item__link"> Мероприятия </NuxtLink>
      </li>
      <li v-if="false" class="nav-menu-item">
        <NuxtLink to="#" class="nav-menu-item__link"> Конкурсы </NuxtLink>
      </li>

      <li class="nav-menu-item">
        <NuxtLink to="#" class="nav-menu-item__link"> Новости </NuxtLink>
      </li>
      <li class="nav-menu-item nav-menu-item__submenu" :class="{ '--open': isSubmenuOpen }">
        <span class="nav-menu-item__link --arr" @click="onSubmenu">
          Дополнительно
          <SvgIcon name="menu-arr" class="ic16"/>
        </span>
        <div :class="{ open: isSubmenuOpen }" class="submenu">
          <div class="all">
            <div class="submenu__wrapper">
              <div class="submenu__box">
                <div class="submenu__title">НА ПОРТАЛЕ</div>
                <div class="submenu__items">
                  <div class="submenu__item">
                    <NuxtLink to="#" class="submenu__item-up">
                      <span class="submenu__icon"><img src="/img/red/menu-books.svg" alt="" ></span>
                      <span class="submenu__item-label">Реестр программ</span>
                    </NuxtLink>
                    <div class="submenu__item-bottom">Все актуальные программы ДПО прошедшие экспертизу</div>
                  </div>
                  <!--end submenu__item -->
                  <div class="submenu__item">
                    <NuxtLink to="#" class="submenu__item-up">
                      <span class="submenu__icon"><img src="/img/red/menu-chalkboardTeacher.svg" alt="" ></span>
                      <span class="submenu__item-label">Организации-субъекты ДПО</span>
                    </NuxtLink>
                    <div class="submenu__item-bottom">Организации ДПО размещающие программы на портале ДПО</div>
                  </div>
                  <!--end submenu__item -->
                  <div class="submenu__item">
                    <div class="submenu__item-up">
                      <div class="submenu__icon"><img src="/img/red/menu-and.svg" alt="" ></div>
                      <NuxtLink to="/" class="submenu__item-label">Знакомство с порталом</NuxtLink>
                    </div>
                    <div class="submenu__item-bottom">
                      <ul class="list-submenu3">
                        <li>Гид по порталу</li>
                        <li>
                          <NuxtLink to="/">
                            Лица портала
                          </NuxtLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!--end submenu__item -->
                  <div class="submenu__item">
                    <NuxtLink to="/" class="submenu__item-up">
                      <div class="submenu__icon"><img src="/img/red/menu-ear.svg" alt="" ></div>
                      <div class="submenu__item-label">Экспертиза ДПП</div>
                    </NuxtLink>
                    <div class="submenu__item-bottom">
                      Нормативно-правовые акты для проведения экспертизы программ ДПП
                    </div>
                  </div>
                  <!--end submenu__item -->
                  <div class="submenu__item">
                    <NuxtLink to="/" class="submenu__item-up">
                      <div class="submenu__icon"><img src="/img/red/menu-briefcase.svg" alt="" ></div>
                      <div class="submenu__item-label">Правовая информация</div>
                    </NuxtLink>
                    <div class="submenu__item-bottom">
                      <ul class="list-submenu3">
                        <li>
                          <NuxtLink to="https://www.dpomos.ru/legal/2272899/" rel="nofollow">Обработка персональных данных </NuxtLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!--end submenu__item -->
                  <div class="submenu__item">
                    <NuxtLink to="https://www.dpomos.ru/support/" rel="nofollow" target="_blank" class="submenu__item-up">
                      <div class="submenu__icon"><img src="/img/red/menu-userList.svg" alt="" ></div>
                      <div class="submenu__item-label">Поддержка</div>
                    </NuxtLink>
                    <div class="submenu__item-bottom">Форма связи с технической поддержкой</div>
                  </div>
                  <!--end submenu__item -->
                </div>
              </div>
              <!--end submenu__box -->
              <div class="submenu__box">
                <div class="submenu__title">ВНЕШНИЕ РЕСУРСЫ</div>
                <div class="submenu__items">
                  <div class="submenu__item">
                    <NuxtLink to="https://br.corp-univer.ru/" target="_blank" class="submenu__item-up">
                      <div class="submenu__icon"><img src="/img/red/menu-books.svg" alt="" ></div>
                      <div class="submenu__item-label">Банк резюме</div>
                    </NuxtLink>
                    <div class="submenu__item-bottom">
                      Сервис поиска сотрудников и вакансий в сфере Московского образования
                    </div>
                  </div>
                  <!--end submenu__item -->
                  <div class="submenu__item">
                    <div class="submenu__item-up">
                      <div class="submenu__icon"><img src="/img/red/menu-ear.svg" alt="" ></div>
                      <div class="submenu__item-label">Аттестация</div>
                    </div>
                    <div class="submenu__item-bottom">
                      <ul class="list-submenu3">
                        <li>
                          <NuxtLink to="https://corp-univer.ru/аттестация-руководящих-кадров/" target="_blank">
                            Руководящих кадров
                          </NuxtLink>
                        </li>
                        <li>
                          <NuxtLink to="https://corp-univer.ru/аттестация-педагогических-работников/" target="_blank">
                            Педагогических работников
                          </NuxtLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!--end submenu__item -->
                </div>
              </div>
              <!--end submenu__box -->
            </div>
          </div>
        </div>
        <!--end submenu -->
      </li>
    </ul>
  </div>
</template>
