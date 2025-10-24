const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View Minesweeper statistics')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to view stats for (leave empty for your own stats)')
                .setRequired(false)),
    
    async execute(interaction) {
        try {
            const targetUser = interaction.options.getUser('user') || interaction.user;
            const guildId = interaction.guildId;
            
            // Load game data
            const dataPath = path.join(__dirname, '..', 'data', 'games.json');
            let games = [];
            
            if (fs.existsSync(dataPath)) {
                const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                games = data.games || [];
            }
            
            // Filter games for this user in this server
            const userGames = games.filter(game => 
                game.userId === targetUser.id && 
                game.guildId === guildId
            );
            
            if (userGames.length === 0) {
                const embed = new EmbedBuilder()
                    .setTitle('📊 Minesweeper Statistics')
                    .setDescription(`No games found for ${targetUser.username}.`)
                    .setColor(0xffa500)
                    .setFooter({ text: `Use /minesweeper to start playing!` });
                
                await interaction.reply({ embeds: [embed] });
                return;
            }
            
            // Calculate statistics
            const totalGames = userGames.length;
            const bestTime = Math.min(...userGames.map(game => game.time));
            const averageTime = userGames.reduce((sum, game) => sum + game.time, 0) / totalGames;
            const recentGames = userGames.slice(-5).reverse();
            
            // Format recent games
            const recentGamesText = recentGames.map(game => {
                const time = formatTime(game.time);
                const date = new Date(game.timestamp).toLocaleDateString();
                return `• ${time} (${date})`;
            }).join('\n');
            
            const embed = new EmbedBuilder()
                .setTitle(`📊 ${targetUser.username}'s Minesweeper Stats`)
                .setThumbnail(targetUser.displayAvatarURL())
                .setColor(0x00ff00)
                .addFields(
                    { name: '🎮 Total Games', value: totalGames.toString(), inline: true },
                    { name: '🏆 Best Time', value: formatTime(bestTime), inline: true },
                    { name: '📈 Average Time', value: formatTime(Math.round(averageTime)), inline: true },
                    { name: '🕒 Recent Games', value: recentGamesText || 'No recent games', inline: false }
                )
                .setFooter({ text: `Server: ${interaction.guild?.name || 'Unknown'}` })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error in stats command:', error);
            await interaction.reply({ 
                content: 'There was an error fetching the statistics!', 
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
