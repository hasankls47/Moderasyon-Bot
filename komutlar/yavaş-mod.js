const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { prefix, color } = require("../ayarlar")
const humanize = require('humanize-duration')
const yetkiVarmı = require('../func/YetkiVarmı')
const BotYetkiVarmı = require('../func/BotYetkiVarmı')
const Embed = require("../func/Embed")

exports.run = async (client, message, args) => {
     let guild = message.guild;
     let channel = message.channel;

     if (!yetkiVarmı(message.member, PermissionsBitField.Flags.ManageChannels)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Kanalları Yönet\` yetkin olmadığı için bu komutu kullanamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (!BotYetkiVarmı(guild, PermissionsBitField.Flags.ManageChannels)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Kanalları Yönet\` yetkisi **${client.user.username}** adlı botta(bende) olmadığı için bu işlemi gerçekleştiremem.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     let süre = args[0]

     if (parseInt(süre) !== 0) {
          if (!parseInt(süre)) {
               return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem başarısız!", `Yavaş mod saniyesini belirtmelisin;\n\n**${prefix}yavaş-mod 1**`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
          }
     }

     if (parseInt(süre) === channel.rateLimitPerUser) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem başarısız!", `Yavaş mod süresi zaten ${humanize(parseInt(süre) * 1000, { language: "tr", round: true })} olduğu için işlemi gerçekleştiremedim.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }


     await channel.setRateLimitPerUser(süre, `Yavaş-Mod (${message.author.username} tarafından ayarlandı.)`);

     if (süre === 0) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yavaş Mod Sıfırlandı!", `Yavaş mod süresi başarıyla sıfırlandı.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     } else {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yavaş Mod Ayarlandı!", `Yavaş mod süresi başarıyla **${humanize(parseInt(süre) * 1000, { language: "tr", round: true })}** olarak ayarlandı.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

}
exports.conf = {
     aliases: ["yavaşmod", "yavasmod", "yavas-mod"]
}
exports.help = {
     name: "yavaş-mod",
     desc: 'Kanalın yavaş mod süresini ayarlarsın.'
}