/**
 * Fix orphaned invitations — assign all invitations with userId=null to the first user.
 * Run: node src/database/fix-orphan-invitations.js
 */
require('dotenv').config();

const { sequelize, Invitation, User } = require('../models');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Find the first user
    const user = await User.findOne({ order: [['created_at', 'ASC']] });
    if (!user) {
      console.log('❌ No users found in the database');
      process.exit(1);
    }
    console.log(`👤 Found user: ${user.name} (ID: ${user.id})`);

    // Find orphaned invitations
    const orphaned = await Invitation.findAll({
      where: { userId: null },
    });

    if (orphaned.length === 0) {
      console.log('✅ No orphaned invitations found — all good!');
      process.exit(0);
    }

    console.log(`📋 Found ${orphaned.length} orphaned invitations:`);
    orphaned.forEach((inv) => {
      console.log(`   - ${inv.slug} (${inv.hostName || 'no host'})`);
    });

    // Update all orphaned invitations
    const [count] = await Invitation.update(
      { userId: user.id },
      { where: { userId: null } },
    );

    console.log(`\n✅ Successfully assigned ${count} invitations to user "${user.name}" (ID: ${user.id})`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

run();
