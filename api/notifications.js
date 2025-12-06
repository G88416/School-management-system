/**
 * Cross-Device Notifications API
 * Uses Vercel KV for real-time notification storage and retrieval
 * 
 * This API endpoint handles:
 * - POST: Store new notifications for cross-device delivery
 * - GET: Retrieve notifications since a given timestamp
 * 
 * Environment Variables Required:
 * - KV_REST_API_URL: Vercel KV REST API URL
 * - KV_REST_API_TOKEN: Vercel KV REST API Token
 */

// Maximum number of notifications to keep in storage
const MAX_NOTIFICATIONS = 100;
// Time-to-live for notifications in seconds (24 hours)
const NOTIFICATION_TTL = 86400;

module.exports = async function handler(req, res) {
    // Set CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Dynamically import @vercel/kv - this allows graceful fallback if not installed
    let kv;
    try {
        const vercelKV = await import('@vercel/kv');
        kv = vercelKV.kv;
    } catch (importError) {
        console.error('Vercel KV not available:', importError.message);
        return res.status(503).json({ 
            error: 'Storage service unavailable',
            message: 'Vercel KV is not installed or configured. Please install @vercel/kv and add KV_REST_API_URL and KV_REST_API_TOKEN environment variables.',
            fallback: true
        });
    }

    try {
        if (req.method === 'POST') {
            // Store a new notification
            const { type, data, sender, senderRole, sessionId } = req.body;

            if (!type || !sessionId) {
                return res.status(400).json({ 
                    error: 'Missing required fields: type and sessionId are required' 
                });
            }

            const notification = {
                id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type,
                data: data || {},
                sender: sender || 'System',
                senderRole: senderRole || 'system',
                sessionId,
                timestamp: Date.now(),
                createdAt: new Date().toISOString()
            };

            // Store notification in a sorted set with timestamp as score
            await kv.zadd('notifications', {
                score: notification.timestamp,
                member: JSON.stringify(notification)
            });

            // Trim old notifications to keep only the latest MAX_NOTIFICATIONS
            const count = await kv.zcard('notifications');
            if (count > MAX_NOTIFICATIONS) {
                await kv.zremrangebyrank('notifications', 0, count - MAX_NOTIFICATIONS - 1);
            }

            // Also set a latest notification key for quick polling
            await kv.set('latest_notification', notification, { ex: NOTIFICATION_TTL });

            return res.status(201).json({ 
                success: true, 
                notification,
                message: 'Notification stored successfully'
            });

        } else if (req.method === 'GET') {
            // Retrieve notifications since a given timestamp
            const { since, sessionId, limit = 50 } = req.query;
            const sinceTimestamp = parseInt(since) || 0;
            const limitNum = Math.min(parseInt(limit) || 50, 100);

            // Get notifications from sorted set with timestamp > since
            const notifications = await kv.zrangebyscore(
                'notifications',
                sinceTimestamp + 1,  // Exclusive of the since timestamp
                '+inf',
                { count: limitNum }
            );

            // Parse notifications and filter out the requester's own messages
            const parsedNotifications = notifications
                .map(notifStr => {
                    try {
                        return typeof notifStr === 'string' ? JSON.parse(notifStr) : notifStr;
                    } catch (e) {
                        return null;
                    }
                })
                .filter(notif => notif && notif.sessionId !== sessionId);

            return res.status(200).json({
                success: true,
                notifications: parsedNotifications,
                count: parsedNotifications.length,
                timestamp: Date.now()
            });

        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        console.error('Notification API error:', error);
        
        // Check if it's a Vercel KV connection error
        if (error.message && (error.message.includes('KV') || error.message.includes('UPSTASH') || error.message.includes('Redis'))) {
            return res.status(503).json({ 
                error: 'Storage service unavailable',
                message: 'Vercel KV is not configured. Please add KV_REST_API_URL and KV_REST_API_TOKEN environment variables.',
                fallback: true
            });
        }

        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
};
