'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    // Fetch event type IDs from the database
    const eventTypes = await queryInterface.sequelize.query(
      'SELECT id, name FROM event_types;',
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    const getEventTypeId = (name) => eventTypes.find((et) => et.name === name)?.id;

    const templates = [
      // ── Wedding templates ─────────────────────────────
      {
        id: uuidv4(),
        event_type_id: getEventTypeId('wedding'),
        name: 'Klassik oq to\'y',
        slug: 'klassik-oq-toy',
        description: 'An\'anaviy oq rangli klassik to\'y taklifi',
        structure: JSON.stringify({
          fields: [
            { key: 'brideName', label: 'Kelin ismi', type: 'text', required: true },
            { key: 'groomName', label: 'Kuyov ismi', type: 'text', required: true },
            { key: 'weddingVenue', label: 'To\'yxona', type: 'text', required: true },
            { key: 'dressCode', label: 'Dress code', type: 'text', required: false },
          ],
        }),
        html_content: '<div class="wedding-classic">{{content}}</div>',
        css_content: '.wedding-classic { font-family: serif; text-align: center; }',
        is_active: true,
        is_premium: false,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        event_type_id: getEventTypeId('wedding'),
        name: 'Zamonaviy nikoh',
        slug: 'zamonaviy-nikoh',
        description: 'Zamonaviy dizayndagi nikoh marosimi taklifi',
        structure: JSON.stringify({
          fields: [
            { key: 'brideName', label: 'Kelin ismi', type: 'text', required: true },
            { key: 'groomName', label: 'Kuyov ismi', type: 'text', required: true },
            { key: 'program', label: 'Dastur', type: 'textarea', required: false },
          ],
        }),
        html_content: '<div class="wedding-modern">{{content}}</div>',
        css_content: '.wedding-modern { font-family: sans-serif; }',
        is_active: true,
        is_premium: true,
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // ── Birthday templates ────────────────────────────
      {
        id: uuidv4(),
        event_type_id: getEventTypeId('birthday'),
        name: 'Quvnoq tug\'ilgan kun',
        slug: 'quvnoq-tugilgan-kun',
        description: 'Rang-barang quvnoq tug\'ilgan kun taklifi',
        structure: JSON.stringify({
          fields: [
            { key: 'age', label: 'Yosh', type: 'number', required: true },
            { key: 'theme', label: 'Mavzu', type: 'text', required: false },
          ],
        }),
        html_content: '<div class="birthday-fun">{{content}}</div>',
        css_content: '.birthday-fun { background: linear-gradient(135deg, #ff9a9e, #fad0c4); }',
        is_active: true,
        is_premium: false,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // ── Jubilee templates ─────────────────────────────
      {
        id: uuidv4(),
        event_type_id: getEventTypeId('jubilee'),
        name: 'Oltin yubiley',
        slug: 'oltin-yubiley',
        description: 'Yillik yubileylarga mos hashamatli taklif',
        structure: JSON.stringify({
          fields: [
            { key: 'years', label: 'Yillar soni', type: 'number', required: true },
            { key: 'achievement', label: 'Yutuq', type: 'text', required: false },
          ],
        }),
        html_content: '<div class="jubilee-gold">{{content}}</div>',
        css_content: '.jubilee-gold { color: #b8860b; }',
        is_active: true,
        is_premium: true,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // ── Graduation templates ──────────────────────────
      {
        id: uuidv4(),
        event_type_id: getEventTypeId('graduation'),
        name: 'Bitiruv akademik',
        slug: 'bitiruv-akademik',
        description: 'Akademik uslubdagi bitiruv kechasi taklifi',
        structure: JSON.stringify({
          fields: [
            { key: 'school', label: 'Muassasa', type: 'text', required: true },
            { key: 'degree', label: 'Daraja', type: 'text', required: false },
          ],
        }),
        html_content: '<div class="grad-academic">{{content}}</div>',
        css_content: '.grad-academic { font-family: "Times New Roman", serif; }',
        is_active: true,
        is_premium: false,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('templates', templates);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('templates', null, {});
  },
};
