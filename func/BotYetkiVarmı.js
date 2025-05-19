const { PermissionsBitField } = require('discord.js')

const BotYetkiVarmı = (guild, yetkii) => {
     let yetki = guild.members.me.permissions.has(yetkii) || guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)
     return yetki;
}

module.exports = BotYetkiVarmı