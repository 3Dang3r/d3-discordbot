const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const fivem = require('discord-fivem-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('Shows Server IP'),

    async execute(interaction) {
        const embedd = new EmbedBuilder()
            .setDescription(`Checking Server Status...`)
            .setColor("#bd9a05");
        await interaction.reply({ embeds: [embedd]});

        const { DiscordFivemApi } = require('discord-fivem-api');
        const options = {
          address: config.StatusIP,
          port: 30120,
          interval: 5000,
        };
        
        const api = new DiscordFivemApi(options, true, true);

        try {
            const data = await api.getServerPlayers();
            const maxPlayers = await api.getMaxPlayers();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('dev')
                        .setLabel('Server Online')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true),
                );

            const embed = new EmbedBuilder()
                .setColor("#0bc02b")
                .setAuthor({ name: `${config.servername} | Server Is Online!` })
                .setDescription(`Online Players: \`${data.length}/${maxPlayers}\`\nConnection IP: [Connect Here](https://cfx.re/join/${config.ip})`)
                .setTimestamp()
                .setFooter({ text: '🟢 Server Online' });

            await interaction.editReply({ embeds: [embed], components: [row] });
        } catch (err) {
            console.error(err);

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('dev')
                    .setLabel('Server Ofline')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
                );

            const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setAuthor({ name: `${config.servername} | Server Is Offline!` })
                .setTimestamp()
                .setFooter({ text: '🔴 Server Offline' });

            await interaction.editReply({ embeds: [embed], components: [row] });
        }
    }
};
