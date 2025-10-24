const fs = require('fs');
const path = require('path');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Created data directory');
}

// Create initial games.json if it doesn't exist
const gamesFile = path.join(dataDir, 'games.json');
if (!fs.existsSync(gamesFile)) {
    fs.writeFileSync(gamesFile, JSON.stringify({ games: [] }, null, 2));
    console.log('Created initial games.json file');
}

console.log('Setup completed successfully!');
console.log('Make sure to:');
console.log('1. Set up your .env file with Discord bot credentials');
console.log('2. Run "node deploy-commands.js" to register slash commands');
console.log('3. Run "node index.js" to start the bot and API server');
console.log('4. Deploy your React app to a public HTTPS URL for Discord Activities');
