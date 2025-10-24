const fs = require('fs');
const path = require('path');

/**
 * Load game data from JSON file
 */
function loadGameData() {
    const dataPath = path.join(__dirname, '..', 'data', 'games.json');
    
    if (!fs.existsSync(dataPath)) {
        return { games: [] };
    }
    
    try {
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error loading game data:', error);
        return { games: [] };
    }
}

/**
 * Save game data to JSON file
 */
function saveGameData(data) {
    const dataPath = path.join(__dirname, '..', 'data', 'games.json');
    const dataDir = path.dirname(dataPath);
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving game data:', error);
        return false;
    }
}

/**
 * Get leaderboard for a specific guild or globally
 */
function getLeaderboard(guildId = null, limit = 10) {
    const data = loadGameData();
    let games = data.games;
    
    // Filter by guild if specified
    if (guildId) {
        games = games.filter(game => game.guildId === guildId);
    }
    
    // Sort by time (ascending - fastest first)
    games.sort((a, b) => a.time - b.time);
    
    // Return top N games
    return games.slice(0, limit);
}

/**
 * Get user statistics for a specific guild
 */
function getUserStats(userId, guildId) {
    const data = loadGameData();
    const userGames = data.games.filter(game => 
        game.userId === userId && game.guildId === guildId
    );
    
    if (userGames.length === 0) {
        return {
            totalGames: 0,
            bestTime: null,
            averageTime: null,
            recentGames: []
        };
    }
    
    const bestTime = Math.min(...userGames.map(game => game.time));
    const averageTime = userGames.reduce((sum, game) => sum + game.time, 0) / userGames.length;
    const recentGames = userGames.slice(-5).reverse();
    
    return {
        totalGames: userGames.length,
        bestTime,
        averageTime: Math.round(averageTime),
        recentGames: recentGames.map(game => ({
            time: game.time,
            timestamp: game.timestamp
        }))
    };
}

/**
 * Add a new game result
 */
function addGameResult(gameData) {
    const data = loadGameData();
    
    // Validate game data
    if (!gameData.userId || !gameData.username || !gameData.guildId || !gameData.time || !gameData.timestamp) {
        throw new Error('Invalid game data: missing required fields');
    }
    
    // Validate time (reasonable range)
    if (gameData.time < 10 || gameData.time > 3600) {
        throw new Error('Invalid time: must be between 10 seconds and 1 hour');
    }
    
    const newGame = {
        userId: gameData.userId,
        username: gameData.username,
        guildId: gameData.guildId,
        time: Math.round(gameData.time),
        timestamp: gameData.timestamp,
        verified: true
    };
    
    data.games.push(newGame);
    
    if (saveGameData(data)) {
        return newGame;
    } else {
        throw new Error('Failed to save game data');
    }
}

/**
 * Format time in MM:SS format
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get rank of a user in a specific guild
 */
function getUserRank(userId, guildId) {
    const leaderboard = getLeaderboard(guildId, 1000); // Get all games for ranking
    const userIndex = leaderboard.findIndex(game => game.userId === userId);
    return userIndex >= 0 ? userIndex + 1 : null;
}

module.exports = {
    loadGameData,
    saveGameData,
    getLeaderboard,
    getUserStats,
    addGameResult,
    formatTime,
    getUserRank
};
