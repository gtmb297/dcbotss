# Setup Guide: Discord Minesweeper Bot

This document provides instructions on how to set up, launch, and connect your Discord Minesweeper Bot.

## Prerequisites

*   [Node.js](https://nodejs.org/) installed on your system.
*   A Discord account and a server where you have administrative privileges.

## Step 1: Create a Discord Bot Application

1.  Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2.  Click "New Application".
3.  Give your application a name (e.g., "Minesweeper Bot").
4.  Go to the "Bot" tab in the left-hand menu.
5.  Click "Add Bot".
6.  Click "Reset Token" to generate your bot's token. **Important: Keep this token secret!**
7.  Enable the "Presence Intent" and "Server Members Intent" under "Privileged Gateway Intents". (You might not need these for a simple Minesweeper bot, but it's good practice to enable them in case you want to add more features later).
8.  Go to the "OAuth2" -> "URL Generator" tab.
9.  Select the "bot" scope.
10. Select the "applications.commands" permission.
11. Copy the generated URL and paste it into your browser.
12. Select the server you want to add the bot to.

After completing these steps, you will have the following:

*   **Bot Token:** The token you generated in the "Bot" tab.
*   **Client ID:** The "Application ID" on the "General Information" tab.
*   **Guild ID:** The ID of the server you added the bot to. You can get this by right-clicking on your server's icon in Discord and selecting "Copy ID" (you may need to enable Developer Mode in Discord's settings).

## Step 2: Configure Environment Variables (Recommended)

It is highly recommended to use environment variables to store your bot's token, client ID, and guild ID. This is a more secure way to handle sensitive information.

1.  **Set Environment Variables:** The method for setting environment variables depends on your operating system and hosting environment.

    *   **Local Development (Example using `.env` file):**
        1.  Create a file named `.env` in the root directory of your project.
        2.  Add the following lines to the `.env` file, replacing the placeholders with your actual values:

            ```
            DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN
            DISCORD_CLIENT_ID=YOUR_CLIENT_ID
            DISCORD_GUILD_ID=YOUR_GUILD_ID
            ```

        3.  You will need to install the `dotenv` package to load these variables.  Add `dotenv` to `package.json` and run `npm install`.  Then, add `require('dotenv').config();` to the top of `index.js` and `deploy-commands.js`.

    *   **Hosting Environment:** Consult your hosting provider's documentation for instructions on how to set environment variables.

2.  **Modify Code to Use Environment Variables:** The provided code is already set up to read these values from `process.env`.

## Step 3: (Alternative) Temporarily Configure `config.json` (Less Secure)

**WARNING: This method is less secure and should only be used for temporary testing purposes.  Make sure to remove your bot's token, client ID, and guild ID from `config.json` before sharing your code or deploying your bot to a public environment.**

1.  Open the `config.json` file.
2.  Replace the `process.env...` values with your actual token, client ID, and guild ID.  For example:

    ```json
    {
      "token": "YOUR_BOT_TOKEN",
      "clientId": "YOUR_CLIENT_ID",
      "guildId": "YOUR_GUILD_ID"
    }
    ```

## Step 4: Install Dependencies

1.  Open your terminal and navigate to the project directory.
2.  Run the following command to install the necessary dependencies:

    ```bash
    npm install
    ```

## Step 5: Deploy Commands

1.  Run the following command to deploy your bot's commands to your Discord server:

    ```bash
    node deploy-commands.js
    ```

## Step 6: Launch the Bot

1.  Run the following command to start your bot:

    ```bash
    node index.js
    ```

## Step 7: Verify the Bot is Online

1.  Check your Discord server. Your bot should now be online and visible in the member list.
2.  Type the bot's command (we haven't created the Minesweeper command yet, but you can test with a simple command later). The bot should respond accordingly.

## Troubleshooting

*   **Bot is not online:**
    *   Double-check that you have entered the correct token in your environment variables or `config.json`.
    *   Make sure your bot has the necessary permissions in your Discord server.
    *   Check the console for any error messages.
*   **Commands are not working:**
    *   Make sure you have deployed the commands using `node deploy-commands.js`.
    *   Check the console for any error messages.
    *   Ensure your bot has the "applications.commands" permission.

## Next Steps

*   Implement the Minesweeper game logic.
*   Create the Discord bot commands for playing the game.
*   Design a user interface for displaying the game.
