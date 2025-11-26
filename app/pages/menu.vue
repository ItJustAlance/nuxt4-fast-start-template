<script lang="ts" setup>
  import ButtonModal from '~/components/modal/ButtonModal.vue';
  
  // ДЛЯ ОТЛАДКИ без доступа открывать http://localhost:3000/menu?auth=false

</script>

<template>
  <div class="content">
    <div class="list-pages">
      <ul class="main-list">
        <li><a href="/">главная</a></li>
        <li><a href="/">авторизация</a></li>
        <li><a href="/">субьекты</a></li>
        <li><a href="/">субьекты подробно</a></li>
        <li><a id="onBoard-programm" href="/">программы</a></li>
        <li><a href="/">программа</a></li>
        <li><a id="onBoard-news" href="/">новости</a></li>
        <li><a href="/">новость подробно</a></li>
        <li><a href="/">правовая информация</a></li>
        <li><a href="/">экспертиза ДПП</a></li>
        <li><a href="/">мероприятия</a></li>
        <li><a href="/">мероприятия подробно</a></li>
        <li><a id="onBoard-curse" href="/">курсы</a></li>
        <li><a href="/">курс подробнее</a></li>
        <li><a href="/">компетенции</a></li>
        <li><a href="/">компетенции подробнее</a></li>
        <li><h3>Личный кабинет</h3></li>
        <li><a href="/personal/profile?auth=false">Профиль</a></li>
        <li><a href="/personal/notification?auth=false">Уведомления</a></li>
        <li><a href="/personal/courses?auth=false">ЛК курсы</a></li>
        <li><a href="/personal/events?auth=false">ЛК мероприятия</a></li>
        <li><a href="/personal/favorites?auth=false">ЛК избранное</a></li>
        <li><a href="/personal/levelsProfile?auth=false">Уровни профиля</a></li>
        <li><h3>ЛК поставщика</h3></li>
        <li><a href="provide?auth=false">Профиль организации</a></li>
        <li><a href="provide/courses?auth=false">Профиль поставщика курсы</a></li>
        <li><a href="provide/courseCreate?auth=false">Создание курса</a></li>
        <li>
          <a href="provide/courseEdit?auth=false"
            >Профиль поставщика услуг: Просмотр/редактирование опубликованного курса</a
          >
        </li>
        <li><a href="provide/programm?auth=false">Профиль поставщика услуг: Программы</a></li>
        <li><a href="provide/groups?auth=false">4 -Группы</a></li>
        <li>
          <a href="provide/groupMore?auth=false">4.1 -Курс подробнее/Обучающиеся, 4.2 -Курс подробнее/Список групп</a>
        </li>
        <li><a href="provide/groupDetails?auth=false">4.3 -Группа подробнее</a></li>
        <li><h3>ЛК Директора</h3></li>
        <li><a href="director/employees?auth=false">сотрудники</a></li>
        <li><a href="director/educations?auth=false">обучение</a></li>
        <li><a href="director/appointments?auth=false">направления</a></li>
        <!-- li><a href=""></a></li -->
        <!-- li><a href=""></a></li -->
        <!-- li><a href=""></a></li -->
        <!-- li><a href=""></a></li -->
        <!-- li><a href=""></a></li -->
        <!-- li><a href=""></a></li -->
        <!-- li><a href=""></a></li -->
      </ul>

      <h3>Модальные окна</h3>
      <!-- modal-local-component тут указываем название компонента который лежит components/modal/dialog/название файла.vue -->
      <ButtonModal
        class="control-item"
        modal-local-component="addTeacher"
        :comp-params="{ modalClass: '', modalBodyClass: 'just-modal--right', modalComponentClass: '' }"
        :modal-local-component-params="{}"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">Добавить преподавателя</span>
        </button>
      </ButtonModal>
      <ButtonModal
        class="control-item"
        modal-local-component="addResponsible"
        :comp-params="{ modalClass: '', modalBodyClass: 'just-modal--right', modalComponentClass: '' }"
        :modal-local-component-params="{}"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">Добавить ответственного</span>
        </button>
      </ButtonModal>

      <ButtonModal
        class="control-item"
        modal-local-component="profileView"
        :comp-params="{ modalClass: '', modalBodyClass: 'just-modal--right', modalComponentClass: '' }"
        :modal-local-component-params="{}"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">Просмотр профиля</span>
        </button>
      </ButtonModal>
      <ButtonModal
        class="control-item"
        modal-local-component="expelledInfo"
        :comp-params="{ modalClass: '', modalBodyClass: 'just-modal--right', modalComponentClass: '' }"
        :modal-local-component-params="{}"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">Причина отчисления</span>
        </button>
      </ButtonModal>
      <ButtonModal
        class="control-item"
        modal-local-component="selectFilter"
        :comp-params="{ modalClass: '', modalBodyClass: 'just-modal--right', modalComponentClass: '' }"
        :modal-local-component-params="{}"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">Выбрать фильтры</span>
        </button>
      </ButtonModal>

      <ButtonModal
        class="control-item"
        modal-local-component="deleteProfile"
        :comp-params="{ modalClass: '', modalBodyClass: 'just-modal--right', modalComponentClass: '' }"
        :modal-local-component-params="{}"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">Заявка на удаление профиля</span>
        </button>
      </ButtonModal>

      <ButtonModal
        class="control-item"
        modal-local-component="newReview"
        :comp-params="{ modalClass: '', modalBodyClass: 'just-modal--right', modalComponentClass: '' }"
        :modal-local-component-params="{}"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">Оставить отзыв о курсе</span>
        </button>
      </ButtonModal>

      <ButtonModal
        class="control-item"
        modal-local-component="employeeRecord"
        :comp-params="{ modalClass: '', modalBodyClass: 'just-modal--right', modalComponentClass: '' }"
        :modal-local-component-params="{}"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">Запись сотрудников</span>
        </button>
      </ButtonModal>

      <ButtonModal
        class="control-item"
        modal-local-component="addProgram"
        :comp-params="{ modalClass: '', modalBodyClass: 'just-modal--right', modalComponentClass: '' }"
        :modal-local-component-params="{}"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">Добавить программу</span>
        </button>
      </ButtonModal>

      <ButtonModal
        class="control-item"
        modal-local-component="rejectApplication"
        :comp-params="{ modalClass: '', modalBodyClass: 'just-modal--right', modalComponentClass: '' }"
        :modal-local-component-params="{}"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">Отклонение заявки</span>
        </button>
      </ButtonModal>

      <ButtonModal
        class="control-item"
        modal-local-component="welcomeModal"
        :comp-params="{
          modalClass: '--welcome',
          modalBodyClass: 'just-modal--default',
          modalComponentClass: 'modal-welcome-wrapper',
        }"
        :modal-local-component-params="{
          subTitleText: 'Рады сообщить, что скоро нас ждут большие и приятные перемены!',
          mainText:
            'Наша команда разработчиков уже усердно трудится над тем, чтобы портал стал максимально удобным и полезным.',
          showAdditionalText: true,
          additionalText: 'Дата старта новой версии портала',
          AdditionalTextBold: false,
          dateValue: '01.01.2025',
          showDateValue: true,
          showSignature: true,
          readMoreBtn: 'Прочитать анонс обновлений',
          closeBtn: 'Подожду, чтобы был сюрприз',
        }"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">попап с логотипом</span>
        </button>
      </ButtonModal>

      <ButtonModal
        class="control-item"
        modal-local-component="ConfirmModal"
        :comp-params="{
          modalClass: '--confirmModal',
          modalBodyClass: 'just-modal--default',
          modalComponentClass: 'modal-confirm-wrapper',
        }"
        :modal-local-component-params="{
          text: 'Вы собираетесь открепить преподавателя от школы. Это действие невозможно отменить',
          courseId: '',
          nameButtonAccept: 'Да, убрать из сотрудников',
          nameButtonDecline: 'Отмена',
        }"
      >
        <button class="btn btn--inline">
          <SvgIcon name="plus-circle" class="fnone ic16"/>
          <span class="btn-label">Удаление сотрудника</span>
        </button>
      </ButtonModal>

      <h3>UI кит</h3>
      <h4>Buttons</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 10px">
        <button to="#" class="btn">Button</button>
        <button to="#" class="btn btn--second">Button</button>
        <button to="#" class="btn btn--gray">Button</button>
        <button to="#" class="btn btn--red-second">Button</button>
        <button to="#" class="btn btn--border">Button</button>
        <button to="#" class="btn btn--disabled">Button</button>
        <button to="#" class="btn btn--form">Button</button>
        <button to="#" class="btn btn--link">Button</button>
        <button to="#" class="btn btn--link--disabled">Button</button>
        <button to="#" class="btn btn--warning">Button</button>
        <button to="#" class="btn btn--warning-second">Button</button>
        <button to="#" class="btn btn--white">Button</button>
        <button to="#" class="btn btn--white2">Button</button>
      </div>
      <h4>inputs</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 10px">
        <InputText class="input" type="text" placeholder="" />
      </div>
    </div>
  </div>
</template>
<style>
.main-list {
  padding: 20px;
}
.main-list li {
  display: block;
  padding: 10px 0;
}
</style>
