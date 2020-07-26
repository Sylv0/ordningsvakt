# Ordningsvakt

A Discord bot primarily for Squadgängets server.

## Installation

1. Clone or download repository
2. Install packages with <code>npm install</code>
3. Setup <code>.env</code> base on example file
4. Migrate database with <code>npm run migrate</code>
5. Start bot with <code>npm start</code>

## Description

This bot, in its default state, is primarily for the group Squadgänget and function will be tailored for that. The main feature of it is tracking the time people spend in voice, to see which members are most active. The current features will probablly not be useful to anyone, but feel free to download the source and create what you need based on it. It is using an Sqlite3 database which is created with Knex.js migrations for ease of use and minimal configuration. There is also an older, less maintained branch using MongoDB and Mongoose.

For integration and commands it is using Discord.js Commando.
