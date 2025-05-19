const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { prefix, color } = require("../ayarlar")
const yetkiVarmı = require('../func/YetkiVarmı')
const BotYetkiVarmı = require('../func/BotYetkiVarmı')
const Embed = require("../func/Embed")

exports.run = async (client, message, args) => {

     let guild = message.guild;
     let channel = message.channel;
     if (!yetkiVarmı(message.member, PermissionsBitField.Flags.ModerateMembers)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Üyeleri Yönet\` yetkin olmadığı için bu komutu kullanamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (!BotYetkiVarmı(guild, PermissionsBitField.Flags.ModerateMembers)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Üyeleri Yönet\` yetkisi **${client.user.username}** adlı botta(bende) olmadığı için bu işlemi gerçekleştiremem.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     let member = message.mentions.members.first()

     if (!member) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Susturmasını kaldırmak istediğin kullanıcıyı etiketle.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (!member || !member.communicationDisabledUntil) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `**${member.user.username}** adlı kullanıcı şuanda susturulmamış.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     try {
          await member.timeout(null);
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Zamanaşımı Kaldırıldı!", `**${member.user.username}** adlı kişinin susturmasını kaldırdım!`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     } catch (err) {
          console.log(err)
          return message.reply({ content: `Bir sorun oluştu!` })
     }

}
exports.conf = {
     aliases: ["untimeout", "zamanaşımı-kaldır", "zamanaşımıkaldır"]
}
exports.help = {
     name: "unmute",
     desc: 'Kullanıcının susturmasını kaldırır.'
}