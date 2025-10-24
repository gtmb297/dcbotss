# Discord Minesweeper Activity Bot

A Discord bot that provides a Minesweeper game as a Discord Activity (embedded web app), similar to how the Wordle bot works. Players can compete on leaderboards and track their statistics.

## Features

- 🎮 **Interactive Minesweeper Game**: 16×16 grid with 40 mines (Intermediate difficulty)
- ⏱️ **Timer**: Tracks completion time with precision
- 🏆 **Leaderboards**: Server-specific and global leaderboards
- 📊 **Statistics**: Personal stats including best time, average time, and game history
- 🎯 **Discord Integration**: Seamless integration with Discord's Activity system
- 🚩 **Classic Gameplay**: Left-click to reveal, right-click to flag

## Architecture

### React Web App (Discord Activity)
- **Frontend**: React + TypeScript + Tailwind CSS
- **Game Logic**: Custom Minesweeper implementation with proper mine placement
- **Discord Integration**: Reads user context from URL parameters
- **API Communication**: Submits scores to Discord bot API

### Discord Bot
- **Commands**: `/minesweeper`, `/leaderboard`, `/stats`
- **API Server**: Express.js server for score submission and data retrieval
- **Data Storage**: JSON file-based storage (easily upgradeable to database)
- **Score Verification**: Server-side validation to prevent cheating

## Setup Instructions

### Prerequisites
- Node.js installed on your system
- A Discord application with bot permissions
- A hosting service for the React app (Netlify, Vercel, etc.)

### 1. Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" tab and create a bot
4. Copy the bot token
5. Go to "OAuth2" → "URL Generator"
6. Select "bot" and "applications.commands" scopes
7. Copy the generated URL and add the bot to your server

### 2. Environment Configuration

Create a `.env` file in the `discord-bot` directory:

```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_application_id_here
DISCORD_GUILD_ID=your_server_id_here
PORT=3000
```

### 3. Install Dependencies

```bash
# Install bot dependencies
cd discord-bot
npm install

# Install React app dependencies (from project root)
npm install
```

### 4. Deploy Commands

```bash
cd discord-bot
node deploy-commands.js
```

### 5. Start the Bot

```bash
cd discord-bot
node index.js
```

### 6. Deploy React App

The React app needs to be deployed to a public HTTPS URL for Discord Activities to work.

**Option A: Netlify**
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure the Discord app's Activity URL in the Developer Portal

**Option B: Vercel**
1. Connect your GitHub repository to Vercel
2. Deploy automatically
3. Configure the Discord app's Activity URL

### 7. Configure Discord Activity

1. In the Discord Developer Portal, go to your application
2. Go to "Rich Presence" → "Art Assets"
3. Add your deployed React app URL as an Activity
4. Configure the iframe settings

## Usage

### Discord Commands

- `/minesweeper` - Launch the Minesweeper activity
- `/leaderboard [scope]` - View leaderboard (server/global)
- `/stats [@user]` - View user statistics

### Game Controls

- **Left Click**: Reveal a cell
- **Right Click**: Flag/unflag a cell
- **Timer**: Starts on first click, stops on win/lose

### Scoring System

- Times are recorded in seconds
- Only completed games (wins) are saved
- Server-specific and global leaderboards
- Personal statistics tracking

## File Structure

```
├── src/                          # React app source
│   ├── components/              # React components
│   │   ├── MinesweeperGame.tsx  # Main game component
│   │   ├── MinesweeperBoard.tsx # Game board
│   │   ├── Cell.tsx            # Individual cell
│   │   ├── Timer.tsx           # Game timer
│   │   ├── GameStats.tsx       # Game statistics
│   │   └── GameOverModal.tsx   # End game modal
│   ├── hooks/
│   │   └── useMinesweeper.ts   # Game logic hook
│   ├── utils/
│   │   └── gameLogic.ts        # Core game algorithms
│   └── types/
│       └── game.ts             # TypeScript types
├── discord-bot/                 # Discord bot
│   ├── commands/               # Slash commands
│   │   ├── minesweeper.js      # Launch activity
│   │   ├── leaderboard.js      # View leaderboard
│   │   └── stats.js            # View statistics
│   ├── api/
│   │   └── scoreHandler.js     # API endpoints
│   ├── data/
│   │   └── games.json          # Game data storage
│   ├── utils/
│   │   └── leaderboard.js      # Leaderboard utilities
│   ├── index.js                # Bot main file
│   ├── deploy-commands.js      # Command deployment
│   └── setup.js               # Setup script
└── package.json               # Dependencies
```

## API Endpoints

- `POST /api/score` - Submit a game score
- `GET /api/leaderboard/:guildId` - Get leaderboard data
- `GET /api/stats/:userId/:guildId` - Get user statistics
- `GET /health` - Health check

## Development

### Running Locally

1. Start the Discord bot: `cd discord-bot && node index.js`
2. Start the React dev server: `npm run dev`
3. Use ngrok or similar to expose the React app for testing

### Testing

- Test the game mechanics in the React app
- Test Discord commands in your server
- Verify score submission and leaderboard functionality

## Deployment Considerations

- The React app must be served over HTTPS
- Consider using a database instead of JSON files for production
- Implement rate limiting for API endpoints
- Add proper error handling and logging
- Consider implementing user authentication for score verification

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see LICENSE file for details.
