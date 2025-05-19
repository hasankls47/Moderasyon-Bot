const { PermissionsBitField } = require('discord.js')

const yetkiVarmı = (member, yetkii) => {
     let yetki = member.permissions.has(yetkii) || member.permissions.has(PermissionsBitField.Flags.Administrator)
     return yetki;
}

module.exports = yetkiVarmı