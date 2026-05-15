/**
 * Seed/update all templates — 10 themes × 4 event types = 40 templates.
 * Run: node src/database/update-templates.js
 */
require('dotenv').config();

const { connectDB } = require('../config/database');
const { Template, EventType } = require('../models');
const tc = require('../utils/templateContent');

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

const eventTypeConfig = {
  wedding:    { html: tc.weddingPremiumHtml,    themes: tc.weddingThemes,    structure: structures.wedding },
  birthday:   { html: tc.birthdayPremiumHtml,   themes: tc.birthdayThemes,   structure: structures.birthday },
  graduation: { html: tc.graduationPremiumHtml, themes: tc.graduationThemes, structure: structures.graduation },
  jubilee:    { html: tc.jubileePremiumHtml,     themes: tc.jubileeThemes,    structure: structures.jubilee },
};

const oldSlugs = [
  'klassik-oq-toy', 'zamonaviy-nikoh',
  'quvnoq-tugilgan-kun', 'oltin-yubiley', 'bitiruv-akademik',
  'klassik-dark-gold', 'romantik-pushti', 'minimalist-oq',
  'qirollik-binafsha', 'tabiat-yashil', 'sharqona-zar',
  'zamonaviy-qora', 'vintage-sepia', 'okean-kok', 'quyosh-oltin',
];

async function run() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const eventTypeMeta = {
      wedding:    { label: "To'y taklifi",   description: "Nikoh va to'y marosimi uchun premium taklifnomalar", icon: '💍' },
      birthday:   { label: "Tug'ilgan kun",  description: "Tug'ilgan kun bayramlari uchun quvnoq taklifnomalar", icon: '🎂' },
      graduation: { label: 'Bitiruvchilar',  description: 'Bitiruvchilar kechasi va tantanalar uchun', icon: '🎓' },
      jubilee:    { label: 'Yubiley',        description: 'Yubiley va bayramlar uchun taklifnomalar', icon: '🎉' },
      custom:     { label: 'Boshqa tadbir',  description: 'Sunnat, Novruz yoki boshqa har qanday tadbir uchun', icon: '✨' },
    };

    // Ensure event types exist
    const etMap = {};
    for (const [name, meta] of Object.entries(eventTypeMeta)) {
      let et = await EventType.findOne({ name });
      if (!et) {
        et = await EventType.create({ name, label: meta.label, description: meta.description, icon: meta.icon, isActive: true });
      }
      etMap[name] = et._id;
    }
    console.log('📋 Event types:', Object.keys(etMap).join(', '));

    let created = 0, updated = 0;

    for (const [etName, config] of Object.entries(eventTypeConfig)) {
      const etId = etMap[etName];
      console.log(`\n── ${etName.toUpperCase()} (${config.themes.length} themes) ──`);

      for (const theme of config.themes) {
        const existing = await Template.findOne({ slug: theme.slug });

        if (existing) {
          await Template.findByIdAndUpdate(existing._id, {
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
    const newSlugs = Object.values(eventTypeConfig).flatMap(c => c.themes.map(t => t.slug));
    for (const slug of oldSlugs) {
      if (!newSlugs.includes(slug)) {
        const old = await Template.findOne({ slug });
        if (old) {
          old.isActive = false;
          await old.save();
          console.log(`\n🗑️  Deactivated old: ${slug}`);
        }
      }
    }

    // New unique designs
    const { newDesigns } = require('../utils/templateDesigns');
    const prefixMap = { wedding: 'toy', birthday: 'tgk', graduation: 'grad', jubilee: 'jub' };

    console.log(`\n── NEW UNIQUE DESIGNS ──`);
    for (const [etName, etId] of Object.entries(etMap)) {
      if (etName === 'custom') continue; // custom type uses all templates, no separate prefix
      const prefix = prefixMap[etName];
      const config = eventTypeConfig[etName];

      for (const design of newDesigns) {
        const slug = `${prefix}-${design.slug}`;
        const htmlContent = typeof design.html === 'string' ? design.html : (design.html[etName] || design.html.wedding);
        const existing = await Template.findOne({ slug });

        if (existing) {
          await Template.findByIdAndUpdate(existing._id, {
            name: design.name,
            description: design.desc,
            htmlContent,
            cssContent: design.css,
            structure: config.structure,
            sortOrder: 10 + parseInt(design.key),
            isActive: true,
            eventTypeId: etId,
          });
          console.log(`  ✅ Updated: ${slug}`);
          updated++;
        } else {
          await Template.create({
            eventTypeId: etId,
            name: design.name,
            slug,
            description: design.desc,
            htmlContent,
            cssContent: design.css,
            structure: config.structure,
            sortOrder: 10 + parseInt(design.key),
            isActive: true,
            isPremium: false,
          });
          console.log(`  🆕 Created: ${slug}`);
          created++;
        }
      }
    }

    console.log(`\n🎉 Done! Created: ${created}, Updated: ${updated}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    throw error;
  }
}

if (require.main === module) {
  run().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = run;
