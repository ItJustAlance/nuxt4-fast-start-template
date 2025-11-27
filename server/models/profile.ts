
// фейковые данные для фильтров
const profile = {
    "data": {
      "id": 1,
      "firstName": "Администратор",
      "lastName": "ДПО",
      "middleName": "Портала",
      "snils": "111-111-111 11",
      "email": "dpomos@corp-univer.ru",
      "phone": "8(926)91111747",
      "sex": "male",
      "qualificationCategory": "Первая",
      "avatar": "/users/default.png",
      "roles": [
        "superadmin",
        "user",
        "director"
      ],
      "permissions": [
        "user.create",
        "user.update",
        "user.show",
        "user.update.own",
        "course.create",
        "course.update",
        "course.show",
        "course.update.own",
        "course.publish",
        "panel.view",
        "program.create",
        "program.update",
        "program.show",
        "program.update.own",
        "program.publish",
        "organization.update.own",
        "organization.show.own"
      ],
      "orgDirId": 788,
      "orgDirUuid": "dfe9c7f1-b74e-461a-a9493774d3",
      "organization": {
        "id": 216,
        "name": "временно не работаю",
        "headId": null
      },
      "level": {
        "code": "full",
        "name": "Третий уровень"
      },
      "country": {
        "id": 1,
        "name": "Россия"
      },
      "region": {
        "id": 1,
        "name": "Москва"
      },
      "city": {
        "id": 6,
        "name": "Москва"
      },
      "position": {
        "id": 25,
        "name": "Диспетчер образовательного учреждения"
      },
      "secondaryPosition": null,
      "profession": null,
      "academicSubject": {
        "id": 4,
        "name": "Физика"
      },
      "secondaryAcademicSubject": null,
      "birthDate": "1918-01-05",
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.ZVnNt9b5mRFuV7XTOycF7qyuC7Z_wFLT9UkBLSpuaIY",
      "workExperienceYear": 1959,
      "managerWorkExperienceYear": null,
      "emailVerifiedAt": "2025-01-24T07:58:56.000000Z",
      "isRegistrationCompleted": true
    },
    "message": "Вы успешно вошли"
  };

export function getProfile() {
  return profile;
}
