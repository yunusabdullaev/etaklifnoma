'use strict';

const { v4: uuidv4 } = require('uuid');

const eventTypes = [
  {
    id: uuidv4(),
    name: 'wedding',
    label: "To'y taklifi",
    description: 'Nikoh va to\'y marosimlari uchun taklif',
    icon: '💍',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: uuidv4(),
    name: 'birthday',
    label: "Tug'ilgan kun",
    description: "Tug'ilgan kun bayramlari uchun taklif",
    icon: '🎂',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: uuidv4(),
    name: 'jubilee',
    label: 'Yubiley',
    description: 'Yubiley tadbirlari uchun taklif',
    icon: '🎉',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: uuidv4(),
    name: 'graduation',
    label: 'Bitiruv kechasi',
    description: "Bitiruv va ko'rsatuv tadbirlari uchun taklif",
    icon: '🎓',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('event_types', eventTypes);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('event_types', null, {});
  },
};
