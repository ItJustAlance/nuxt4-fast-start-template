// /* обходим массив обьектов с неизвесным числом вложенности */
// function objectMaxNum(obj2, key = 'id', childArray) {
//   const obj = obj2;
//   // console.log('obj', obj)
//   let max = 0;
//   (function objectTraversal(obj) {
//     let string = obj[key];
//     max < string ? (max = string) : '';
//     // console.log("max", max);
//     if (!obj[childArray]?.length) {
//       return;
//     }
//     obj[childArray].forEach((elem) => objectTraversal(elem, string));
//   })(obj, max);
//   return max;
// }
//
// function searchArray(obj2, value, key) {
//   const obj = obj2;
//
//   (function objectTraversal(obj) {
//     let string = obj[key];
//     if (value == obj[key]) {
//       return;
//     }
//     if (!obj.content.length) {
//       return;
//     }
//     obj.content.forEach((elem) => objectTraversal(elem, string));
//   })(obj, value);
//   return value;
// }
//
// function priceConverted(num = 0) {
//   let result = 0;
//   result = num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
//   return result;
// }
//
// /**
// 	функция склонения
//  **/
// function getNoun(number, one, two, five) {
//   let n = Math.abs(number);
//   n %= 100;
//   if (n >= 5 && n <= 20) {
//     return five;
//   }
//   n %= 10;
//   if (n === 1) {
//     return one;
//   }
//   if (n >= 2 && n <= 4) {
//     return two;
//   }
//   return five;
// }
//
// export {
//   priceConverted, // конвертация числа в число с пробелами
//   objectMaxNum,
//   searchArray, // поиск по массиву
//   getNoun, // функция склонения
// };
