const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minesweeper')
        .setDescription('Launch the Minesweeper activity in Discord'),
    
    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('🎮 Minesweeper Activity')
                .setDescription('Click the button below to launch the Minesweeper game!')
                .setColor(0x00ff00)
                .setThumbnail('https://cdn.discordapp.com/emojis/💣')
                .addFields(
                    { name: '🎯 Difficulty', value: 'Intermediate (16×16, 40 mines)', inline: true },
                    { name: '⏱️ Features', value: 'Timer, Leaderboards, Stats', inline: true },
                    { name: '🎮 Controls', value: 'Left click: Reveal\nRight click: Flag', inline: false }
                )
                .setFooter({ text: 'Good luck!' })
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        style: 1,
                        label: 'Launch Minesweeper',
                        custom_id: 'launch_minesweeper',
                        emoji: { name: '💣' }
                    }]
                }]
            });
        } catch (error) {
            console.error('Error in minesweeper command:', error);
            await interaction.reply({ 
                content: 'There was an error launching the Minesweeper activity!', 
                ephemeral: true 
            });
        }
    },
};
