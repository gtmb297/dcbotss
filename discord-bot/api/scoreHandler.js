const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const router = express.Router();

// Enable CORS for all routes
router.use(cors());
router.use(express.json());

// Middleware to ensure data directory exists
const ensureDataDir = (req, res, next) => {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    next();
};

router.use(ensureDataDir);

// POST /api/score - Submit a game score
router.post('/score', async (req, res) => {
    try {
        const { userId, username, guildId, time, timestamp } = req.body;
        
        // Validate required fields
        if (!userId || !username || !guildId || !time || !timestamp) {
            return res.status(400).json({ 
                error: 'Missing required fields: userId, username, guildId, time, timestamp' 
            });
        }
        
        // Validate time (should be reasonable - between 10 seconds and 1 hour)
        if (time < 10 || time > 3600) {
            return res.status(400).json({ 
                error: 'Invalid time: must be between 10 seconds and 1 hour' 
            });
        }
        
        // Load existing data
        const dataPath = path.join(__dirname, '..', 'data', 'games.json');
        let data = { games: [] };
        
        if (fs.existsSync(dataPath)) {
            const fileContent = fs.readFileSync(dataPath, 'utf8');
            data = JSON.parse(fileContent);
        }
        
        // Create new game entry
        const newGame = {
            userId,
            username,
            guildId,
            time: Math.round(time),
            timestamp,
            verified: true
        };
        
        // Add to games array
        data.games.push(newGame);
        
        // Save back to file
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        
        console.log(`New score submitted: ${username} - ${time}s in guild ${guildId}`);
        
        res.json({ 
            success: true, 
            message: 'Score submitted successfully',
            rank: data.games.filter(g => g.guildId === guildId).sort((a, b) => a.time - b.time).findIndex(g => g.userId === userId) + 1
        });
        
    } catch (error) {
        console.error('Error submitting score:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/leaderboard/:guildId - Get leaderboard for a specific guild
router.get('/leaderboard/:guildId', (req, res) => {
    try {
        const { guildId } = req.params;
        const { scope = 'server', limit = 10 } = req.query;
        
        const dataPath = path.join(__dirname, '..', 'data', 'games.json');
        let data = { games: [] };
        
        if (fs.existsSync(dataPath)) {
            const fileContent = fs.readFileSync(dataPath, 'utf8');
            data = JSON.parse(fileContent);
        }
        
        // Filter games based on scope
        let filteredGames = data.games;
        if (scope === 'server') {
            filteredGames = data.games.filter(game => game.guildId === guildId);
        }
        
        // Sort by time (ascending - fastest first)
        filteredGames.sort((a, b) => a.time - b.time);
        
        // Get top N
        const topGames = filteredGames.slice(0, parseInt(limit));
        
        res.json({
            success: true,
            leaderboard: topGames.map((game, index) => ({
                rank: index + 1,
                username: game.username,
                time: game.time,
                timestamp: game.timestamp
            }))
        });
        
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/stats/:userId/:guildId - Get user stats
router.get('/stats/:userId/:guildId', (req, res) => {
    try {
        const { userId, guildId } = req.params;
        
        const dataPath = path.join(__dirname, '..', 'data', 'games.json');
        let data = { games: [] };
        
        if (fs.existsSync(dataPath)) {
            const fileContent = fs.readFileSync(dataPath, 'utf8');
            data = JSON.parse(fileContent);
        }
        
        // Filter games for this user in this guild
        const userGames = data.games.filter(game => 
            game.userId === userId && game.guildId === guildId
        );
        
        if (userGames.length === 0) {
            return res.json({
                success: true,
                stats: {
                    totalGames: 0,
                    bestTime: null,
                    averageTime: null,
                    recentGames: []
                }
            });
        }
        
        // Calculate statistics
        const totalGames = userGames.length;
        const bestTime = Math.min(...userGames.map(game => game.time));
        const averageTime = userGames.reduce((sum, game) => sum + game.time, 0) / totalGames;
        const recentGames = userGames.slice(-5).reverse();
        
        res.json({
            success: true,
            stats: {
                totalGames,
                bestTime,
                averageTime: Math.round(averageTime),
                recentGames: recentGames.map(game => ({
                    time: game.time,
                    timestamp: game.timestamp
                }))
            }
        });
        
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
