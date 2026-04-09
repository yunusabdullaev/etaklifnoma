'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invitations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      event_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'event_types',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      template_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'templates',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      slug: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      host_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      guest_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      event_title: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      event_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      event_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      location_url: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      custom_fields: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: '{}',
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('invitations', ['slug'], { unique: true });
    await queryInterface.addIndex('invitations', ['event_type_id']);
    await queryInterface.addIndex('invitations', ['template_id']);
    await queryInterface.addIndex('invitations', ['event_date']);
    await queryInterface.addIndex('invitations', ['is_published']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('invitations');
  },
};
