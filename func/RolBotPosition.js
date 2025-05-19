const { } = require('discord.js')

const RolBotPosition = (bot, rol) => {
     let botpos = bot.roles.highest.position;
     let rolpos = rol.position;
     return rolpos >= botpos;
}

module.exports = RolBotPosition;