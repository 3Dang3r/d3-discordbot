# 🤖 FiveM Discord Server Status Bot

A powerful Discord bot that monitors your FiveM server in real-time 🌐 and displays a live status embed 📊 in a designated channel. Staff members are highlighted 🎓, and the bot automatically updates every 10 seconds 🔁.

---

## 🚀 Features

- 📡 **Live Server Monitoring** – Fetches online player data from your FiveM server.
- 👥 **Staff Detection** – Detects and highlights staff members using a specified role.
- 📊 **Dynamic Embed** – Updates an embed in your server channel with server status, player count, staff count, and usage percentage.
- 🔄 **Auto Updates** – Refreshes player data every 10 seconds.
- 🧾 **Multi-Page Support** – If more than 32 players are online, an additional message is created to show the rest.
- 💾 **Persistent Message Handling** – Saves and reuses message IDs to update existing messages, even after restarts.
- 🔴 **Offline Detection** – Displays a red offline embed when the server goes down.

---

## ⚙️ Setup Instructions

### 1. 🛠 Requirements
- Node.js 16 or higher
- Discord bot token
- Your FiveM server IP and port
- Proper permissions for the bot to send/edit/delete messages

### 2. 📁 File Structure

project-folder/
├── config.json
├── messageData.json
├── events/
│ └── ready.js
├── index.js

### 3. ⚙️ `config.json` Example

`{
  "StatusIP": "your.server.ip",
  "port": "30120",
  "guildid": "YOUR_GUILD_ID",
  "fchannel": "CHANNEL_ID_FOR_STATUS",
  "fmessage": "MESSAGE_ID_OF_FIRST_EMBED",
  "servername": "Your Server Name",
  "ip": "connect.yourserver.com"
}`



## 🧠 How It Works
- On bot startup (ready.js event), it starts checking the server status every 10 seconds.

- Uses the discord-fivem-api package to fetch player data.

- Displays player names, Discord mentions, and highlights those with a specific staff role ID.

- Maintains the primary status message and a secondary message if needed for more players.

- Handles server being offline with a clear red embed and status indicator.


## 📝 Notes
- This bot uses a local messageData.json file to keep track of the secondary message ID for seamless updates.

- The embed updates won't flood your channel – messages are edited, not resent.

- Keep your bot running 24/7 using a hosting service like PM2, Heroku, or a VPS.

## 🧰 Credits
👨‍💻 Bot Developer: Dang3r

🧩 API Used: [discord-fivem-api](https://github.com/xliel/discord-fivem-api)

💬 Discord.js
