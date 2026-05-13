/**
 * Cleanup job — automatically deletes invitations 4 hours after the event.
 */
const { Invitation } = require('../models');

const HOURS_AFTER_EVENT = 4;
const CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

async function cleanupExpiredInvitations() {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const candidates = await Invitation.find({
      eventDate: { $lte: todayStr },
    }).select('_id eventDate eventTime hostName eventTitle slug');

    if (candidates.length === 0) return;

    let deletedCount = 0;

    for (const inv of candidates) {
      const timePart = inv.eventTime || '23:59:00';
      const eventDateTime = new Date(`${inv.eventDate}T${timePart}`);
      const expiresAt = new Date(eventDateTime.getTime() + HOURS_AFTER_EVENT * 60 * 60 * 1000);

      if (now > expiresAt) {
        await inv.deleteOne();
        deletedCount++;
        console.log(`🗑️  Expired: "${inv.eventTitle || inv.hostName}" (${inv.slug}) — event was ${inv.eventDate} ${timePart}`);
      }
    }

    if (deletedCount > 0) {
      console.log(`🧹 Cleanup: deleted ${deletedCount} expired invitation(s)`);
    }
  } catch (error) {
    console.error('❌ Cleanup error:', error.message);
  }
}

function startCleanupScheduler() {
  console.log(`⏰ Cleanup scheduler started — checking every ${CHECK_INTERVAL_MS / 60000} min, deleting ${HOURS_AFTER_EVENT}h after event`);
  cleanupExpiredInvitations();
  setInterval(cleanupExpiredInvitations, CHECK_INTERVAL_MS);
}

module.exports = { startCleanupScheduler, cleanupExpiredInvitations };
