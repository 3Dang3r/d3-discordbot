const { SlashCommandBuilder, PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('players-setup')
        .setDescription('Prepares Message')
        .addChannelOption(option => option.setName("channel").setDescription("The channel you want to set the system up in").addChannelTypes(ChannelType.GuildText).setRequired(true)),

	async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
              content: '[Insufficient Permission] Invalid',
              ephemeral: true,
            });
          }

    const channel = interaction.options.getChannel("channel");




        const Embed = new EmbedBuilder()
        .setTitle(`Players List Setup`)
        .setDescription('Our List is being created')
        .setThumbnail(interaction.guild.iconURL())
        .setColor("#13c7f0")
            channel.send({ embeds: [Embed]});



            interaction.reply({content: `message has been sent to ${channel}`, ephemeral: true});
    }
};