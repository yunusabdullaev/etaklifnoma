const { renderInvitation } = require('./src/utils/templateEngine.js');
const inv = { slug: 'test', customFields: { langOrder: 'ru,uz,qq', showShareWa: true, langRu: true } };
try {
    const res = renderInvitation(inv, '1', {});
    if (!res) { print("Error generating"); }
    else { console.log('Successfully generated HTML length:', res.length); }
} catch (e) {
    console.error(e);
}
