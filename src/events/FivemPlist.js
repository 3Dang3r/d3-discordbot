const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const fs = require('fs');
const path = require('path');


const messageDataPath = path.join(__dirname, '../messageData.json');


let messageData = {};
try {
  if (fs.existsSync(messageDataPath)) {
    messageData = JSON.parse(fs.readFileSync(messageDataPath));
  } else {
    console.log('messageData.json not found, starting fresh.');
  }
} catch (err) {
  console.error('Failed to load message data:', err);
}

module.exports = {
  name: 'ready',
  once: true,

  /**
   * @param {Client} client
   */
  async execute(client) {
    const staffRoleId = '1276084490032123967'; 
    const { DiscordFivemApi } = require('discord-fivem-api');
const options = {
  address: config.StatusIP,
  port: parseInt(config.port, 10) || 30120,
  interval: 5000,
};

    const api = new DiscordFivemApi(options, true, true);
    const threshold = 32; 

    setInterval(async () => {
      try {
        const data = await api.getServerPlayers();
        const sortedData = data.sort((a, b) => a.id - b.id);
        let playerslist = [];
        let staffonline = 0;


        const guild = client.guilds.cache.get(config.guildid);
        if (!guild) {
          console.error('Guild not found');
          return;
        }

        const staffRoleObj = guild.roles.cache.get(staffRoleId);
        if (!staffRoleObj) {
          console.error('Staff role not found');
          return;
        }

        for (let player of sortedData) {
          const discordId = player.identifiers.filter(id => id.startsWith('discord:')).map(id => id.replace('discord:', ''))[0];
          const discordMention = discordId ? `<@${discordId}>` : '**Not Found!**';
          

          const member = discordId ? await guild.members.fetch(discordId).catch(() => null) : null;
          if (member && member.roles.cache.has(staffRoleId)) {
            staffonline++;
            playerslist.push(`**[ ID: ${player.id} ]** \`${player.name}\` ${discordMention} (staff)`);
          } else {
            playerslist.push(`**[ ID: ${player.id} ]** \`${player.name}\` ${discordMention}`);
          }
        }

        const maxPlayers = await api.getMaxPlayers();
        const space = parseInt((data.length * 100) / maxPlayers);

        const channel = client.channels.cache.get(config.fchannel);
        if (!channel) {
          console.error('Channel not found');
          return;
        }

        channel.messages.fetch({ around: config.fmessage, limit: 1 }).then(messages => {
          let playersToDisplay = playerslist.slice(0, threshold).join('\n') || `**No Players Online in ${config.servername}**`;
          client.user.setActivity(`👨‍👦 [${data.length}/${maxPlayers}] (${guild.memberCount.toLocaleString()})`);
          const embed = new EmbedBuilder()
            .setThumbnail(guild.iconURL())
            .setAuthor({ name: `${config.servername} | Server Is Online!` })
            .setTitle(`**📊 Status: \`Online\`\n👥 Players: \`${data.length}/${maxPlayers}\`\n🌟 Space: \`${space}%\`\n🎓 Staff: \`${staffonline}\`**`)
            .setDescription(playersToDisplay)
            .setTimestamp()
            .setColor('#13c7f0')
            .setFooter({ text: config.ip, iconURL: guild.iconURL() });

          messages.first().edit({ embeds: [embed] });
        }).catch(console.error);

        if (playerslist.length > threshold) {
          let remainingPlayers = playerslist.slice(threshold).join('\n');
          const secondEmbed = new EmbedBuilder()
            .setDescription(remainingPlayers)
            .setColor('#13c7f0')
            .setTimestamp()
            .setFooter({ text: config.ip, iconURL: guild.iconURL() });

          if (!messageData.secondMessageId) {
            const sentMessage = await channel.send({ embeds: [secondEmbed] });
            messageData.secondMessageId = sentMessage.id;

            try {
              fs.writeFileSync(messageDataPath, JSON.stringify(messageData, null, 2));
            } catch (err) {
              console.error('Failed to write message data to JSON file:', err);
            }
          } else {
            channel.messages.fetch(messageData.secondMessageId).then(secondMessage => {
              secondMessage.edit({ embeds: [secondEmbed] }).catch(console.error);
            }).catch(async err => {
              console.error('Failed to fetch or edit the second message, it might have been deleted:', err);

              const sentMessage = await channel.send({ embeds: [secondEmbed] });
              messageData.secondMessageId = sentMessage.id;

              try {
                fs.writeFileSync(messageDataPath, JSON.stringify(messageData, null, 2));
              } catch (err) {
                console.error('Failed to write message data to JSON file:', err);
              }
            });
          }
        } else if (messageData.secondMessageId) {
          channel.messages.fetch(messageData.secondMessageId).then(secondMessage => {
            secondMessage.delete();
            messageData.secondMessageId = null;

            try {
              fs.writeFileSync(messageDataPath, JSON.stringify(messageData, null, 2));
            } catch (err) {
              console.error('Failed to write message data to JSON file:', err);
            }
          }).catch(console.error);
        }
      } catch (err) {
        const cchannel = client.channels.cache.get(config.fchannel);
        const gguild = client.guilds.cache.get(config.guildid);

        cchannel.messages.fetch({ around: config.fmessage, limit: 1 }).then(messages => {
          client.user.setActivity(`👨‍👦 [OFF] (${gguild.memberCount.toLocaleString()})`);
          const embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setAuthor({ name: `${config.servername} | Server Is Offline!` })
            .setTimestamp()
            .setFooter({ text: '🔴Server Offline' });

          messages.first().edit({ embeds: [embed] }).catch(console.error);
        }).catch(console.error);

        if (messageData.secondMessageId) {
          cchannel.messages.fetch(messageData.secondMessageId).then(secondMessage => {
            secondMessage.delete();
            messageData.secondMessageId = null;

            try {
              fs.writeFileSync(messageDataPath, JSON.stringify(messageData, null, 2));
            } catch (err) {
              console.error('Failed to write message data to JSON file:', err);
            }
          }).catch(console.error);
        }
      }
    }, 10000);
  },
};
