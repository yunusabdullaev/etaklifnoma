const { renderTemplate } = require('./src/utils/templateEngine');
const template = {
  htmlContent: '<div id="program-data"></div>',
  cssContent: 'body{}'
};
const data = {
  eventTitle: "Nikoh to'yi",
  message: "Sizni kutamiz",
  langOrder: "uz,ru",
  customFields: {}
};
const res = renderTemplate(template, data);
console.log(res);
