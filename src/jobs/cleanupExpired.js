/**
 * Cleanup job — automatically deletes invitations 4 hours after the event has passed.
 * 
 * Logic: 
 *   - Combines eventDate + eventTime (defaults to 23:59 if no time set)
 *   - If (eventDateTime + 4 hours) < now → delete the invitation
 *   - Runs every 30 minutes
 */
const { Op } = require('sequelize');
const { Invitation, EventType, Template } = require('../models');

const HOURS_AFTER_EVENT = 4;
const CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

async function cleanupExpiredInvitations() {
  try {
    const now = new Date();
    
    // Find all invitations where eventDate is in the past (at least today or earlier)
    const candidates = await Invitation.findAll({
      where: {
        eventDate: {
          [Op.lte]: now.toISOString().split('T')[0], // today or earlier
        },
      },
      attributes: ['id', 'eventDate', 'eventTime', 'hostName', 'eventTitle', 'slug'],
    });

    if (candidates.length === 0) return;

    let deletedCount = 0;

    for (const inv of candidates) {
      // Build full datetime: eventDate + eventTime (or 23:59 if no time)
      const timePart = inv.eventTime || '23:59:00';
      const eventDateTime = new Date(`${inv.eventDate}T${timePart}`);
      
      // Add 4 hours grace period
      const expiresAt = new Date(eventDateTime.getTime() + HOURS_AFTER_EVENT * 60 * 60 * 1000);

      if (now > expiresAt) {
        await inv.destroy();
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
  
  // Run immediately on startup
  cleanupExpiredInvitations();
  
  // Then run periodically
  setInterval(cleanupExpiredInvitations, CHECK_INTERVAL_MS);
}

module.exports = { startCleanupScheduler, cleanupExpiredInvitations };
