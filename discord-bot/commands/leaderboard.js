const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the Minesweeper leaderboard')
        .addStringOption(option =>
            option.setName('scope')
                .setDescription('Leaderboard scope')
                .setRequired(false)
                .addChoices(
                    { name: 'Server', value: 'server' },
                    { name: 'Global', value: 'global' }
                )),
    
    async execute(interaction) {
        try {
            const scope = interaction.options.getString('scope') || 'server';
            const guildId = interaction.guildId;
            
            // Load game data
            const dataPath = path.join(__dirname, '..', 'data', 'games.json');
            let games = [];
            
            if (fs.existsSync(dataPath)) {
                const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                games = data.games || [];
            }
            
            // Filter games based on scope
            let filteredGames = games;
            if (scope === 'server' && guildId) {
                filteredGames = games.filter(game => game.guildId === guildId);
            }
            
            // Sort by time (ascending - fastest first)
            filteredGames.sort((a, b) => a.time - b.time);
            
            // Get top 10
            const topGames = filteredGames.slice(0, 10);
            
            if (topGames.length === 0) {
                const embed = new EmbedBuilder()
                    .setTitle('🏆 Minesweeper Leaderboard')
                    .setDescription(`No games found for ${scope} leaderboard.`)
                    .setColor(0xffa500)
                    .setFooter({ text: `Use /minesweeper to start playing!` });
                
                await interaction.reply({ embeds: [embed] });
                return;
            }
            
            // Format leaderboard
            const leaderboardText = topGames.map((game, index) => {
                const rank = index + 1;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
                const time = formatTime(game.time);
                const date = new Date(game.timestamp).toLocaleDateString();
                return `${medal} **${game.username}** - ${time} (${date})`;
            }).join('\n');
            
            const embed = new EmbedBuilder()
                .setTitle(`🏆 Minesweeper Leaderboard (${scope.charAt(0).toUpperCase() + scope.slice(1)})`)
                .setDescription(leaderboardText)
                .setColor(0x00ff00)
                .setFooter({ text: `Showing top ${topGames.length} players` })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error in leaderboard command:', error);
            await interaction.reply({ 
                content: 'There was an error fetching the leaderboard!', 
                ephemeral: true 
            });
        }
    },
};

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
