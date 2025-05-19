const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { prefix, color } = require("../ayarlar")
const yetkiVarmı = require('../func/YetkiVarmı')
const BotYetkiVarmı = require('../func/BotYetkiVarmı')
const Embed = require("../func/Embed")

exports.run = async (client, message, args) => {
     let guild = message.guild;
     let channel = message.channel;

     if (!yetkiVarmı(message.member, PermissionsBitField.Flags.KickMembers)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Üyeleri At\` yetkin olmadığı için bu komutu kullanamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (!BotYetkiVarmı(guild, PermissionsBitField.Flags.KickMembers)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Üyeleri At\` yetkisi **${client.user.username}** adlı botta(bende) olmadığı için bu işlemi gerçekleştiremem.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     let member = message.mentions.members.first()
     let sebep = args.slice(1).join(' ') || "Belirtilmemiş!"
     if (!member) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Sunucudan atmak istediğin kişiyi etiketlemelisin.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     if (member.user.id === client.user.id) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `**${client.user.username}** botu sunucudan atamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     if (member.user.id === message.author.id) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Kendini sunucudan atamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     if (member.user.id === message.guild.ownerId) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Sunucu sahibini sunucudan atamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     if (member.roles.highest.position >= message.member.roles.highest.position) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Etiketlediğin kullanıcının rolü senin rolünün üstünde yada eşit olduğu için işlemi gerçekleştiremedim.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Belirttiğin kullanıcının rolü botun rolünün üstünde yada eşit olduğu için işlemi gerçekleştiremedim.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     try {
          await member.kick({ reason: sebep })
          await message.channel.send({ embeds: [Embed(message.author.username, message.author.avatarURL(), `Sunucudan At`, `**${member.user.username}** adlı kullanıcı \`${sebep}\` sebebi ile **${message.author.username}** adlı yetkili tarafından sunucudan atıldı.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     } catch (err) {
          console.log(err)
          await message.channel.send({ content: `Bir sorun oluştu.` })
     }

}
exports.conf = {
     aliases: ["sunucudan-at", "sunucudanat", "at", "kickle"],
}
exports.help = {
     name: "kick",
     desc: "Belirttiğin kullanıcıyı sunucudan atar."
}