const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { prefix, color } = require("../ayarlar")
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

     let member = args[0]
     if (!Number(member)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Bir kullanıcı ID'si girmen gerekli.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     const userBan = await guild.bans.fetch(member).catch(() => { });

     if (!userBan) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Belirttiğin idli kullanıcı sunucudan banlanmamış.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     try {
          await guild.members.unban(member, { reason: 'Unban işlemi.' })
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yasak Kaldırıldı!", `Belirttiğin **${member}** idli kullanıcının yasağı kaldırıldı.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     } catch (err) {
          console.log(err)
          return message.reply({ content: `Bir sorun oluştu!` })
     }
}
exports.conf = {
     aliases: ["yasak-kaldır", "yasakkaldır", "un-ban"]
}
exports.help = {
     name: "unban",
     desc: "ID'sini girdiğin kişinin yasağını kaldırır."
}