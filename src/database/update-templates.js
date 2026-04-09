/**
 * Seed/update all templates — 10 themes × 4 event types = 40 templates.
 * Run: node src/database/update-templates.js
 */
require('dotenv').config();

const { sequelize, Template, EventType } = require('../models');
const tc = require('../utils/templateContent');

// Field structures per event type
const structures = {
  wedding: {
    fields: [
      { key: 'brideName', type: 'text', label: 'Kelin ismi', required: true },
      { key: 'groomName', type: 'text', label: 'Kuyov ismi', required: true },
      { key: 'weddingVenue', type: 'text', label: "To'yxona", required: false },
      { key: 'dressCode', type: 'text', label: 'Dress code', required: false },
    ],
  },
  birthday: {
    fields: [
      { key: 'age', type: 'number', label: 'Yoshi', required: false },
      { key: 'theme', type: 'text', label: 'Bayram mavzusi', required: false },
    ],
  },
  graduation: {
    fields: [
      { key: 'graduationYear', type: 'text', label: 'Bitirish yili', required: false },
      { key: 'school', type: 'text', label: "O'quv yurti", required: false },
    ],
  },
  jubilee: {
    fields: [
      { key: 'years', type: 'number', label: 'Yillik', required: false },
    ],
  },
};

// Map event type name → { html, themes[], structure }
const eventTypeConfig = {
  wedding: {
    html: tc.weddingPremiumHtml,
    themes: tc.weddingThemes,
    structure: structures.wedding,
  },
  birthday: {
    html: tc.birthdayPremiumHtml,
    themes: tc.birthdayThemes,
    structure: structures.birthday,
  },
  graduation: {
    html: tc.graduationPremiumHtml,
    themes: tc.graduationThemes,
    structure: structures.graduation,
  },
  jubilee: {
    html: tc.jubileePremiumHtml,
    themes: tc.jubileeThemes,
    structure: structures.jubilee,
  },
};

// Old slugs to deactivate
const oldSlugs = [
  'klassik-oq-toy', 'zamonaviy-nikoh',
  'quvnoq-tugilgan-kun', 'oltin-yubiley', 'bitiruv-akademik',
  'klassik-dark-gold', 'romantik-pushti', 'minimalist-oq',
  'qirollik-binafsha', 'tabiat-yashil', 'sharqona-zar',
  'zamonaviy-qora', 'vintage-sepia', 'okean-kok', 'quyosh-oltin',
];

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Get all event types
    const eventTypes = await EventType.findAll();
    const etMap = {};
    eventTypes.forEach(et => { etMap[et.name] = et.id; });
    console.log('📋 Event types:', Object.keys(etMap).join(', '));

    let created = 0, updated = 0;

    for (const [etName, config] of Object.entries(eventTypeConfig)) {
      const etId = etMap[etName];
      if (!etId) {
        console.log(`⚠️  Event type "${etName}" not found, skipping`);
        continue;
      }

      console.log(`\n── ${etName.toUpperCase()} (${config.themes.length} themes) ──`);

      for (const theme of config.themes) {
        const existing = await Template.findOne({ where: { slug: theme.slug } });

        if (existing) {
          await existing.update({
            name: theme.name,
            description: theme.description,
            htmlContent: config.html,
            cssContent: theme.css,
            structure: config.structure,
            sortOrder: theme.sortOrder,
            isActive: true,
            eventTypeId: etId,
          });
          console.log(`  ✅ Updated: ${theme.slug}`);
          updated++;
        } else {
          await Template.create({
            eventTypeId: etId,
            name: theme.name,
            slug: theme.slug,
            description: theme.description,
            htmlContent: config.html,
            cssContent: theme.css,
            structure: config.structure,
            sortOrder: theme.sortOrder,
            isActive: true,
            isPremium: false,
          });
          console.log(`  🆕 Created: ${theme.slug}`);
          created++;
        }
      }
    }

    // Deactivate old slugs
    const newSlugs = Object.values(eventTypeConfig)
      .flatMap(c => c.themes.map(t => t.slug));

    for (const slug of oldSlugs) {
      if (!newSlugs.includes(slug)) {
        const old = await Template.findOne({ where: { slug } });
        if (old) {
          await old.update({ isActive: false });
          console.log(`\n🗑️  Deactivated old: ${slug}`);
        }
      }
    }

    console.log(`\n🎉 Done! Created: ${created}, Updated: ${updated}, Total active: ${created + updated}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    throw error;
  }
}

// If run directly: node src/database/update-templates.js
if (require.main === module) {
  run().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = run;
