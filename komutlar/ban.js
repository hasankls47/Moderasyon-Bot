const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { prefix, color } = require("../ayarlar")
const yetkiVarmı = require('../func/YetkiVarmı')
const BotYetkiVarmı = require('../func/BotYetkiVarmı')
const Embed = require("../func/Embed")
exports.run = async (client, message, args) => {
     let guild = message.guild;
     let channel = message.channel;

     if (!yetkiVarmı(message.member, PermissionsBitField.Flags.BanMembers)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Üyeleri Banla\` yetkin olmadığı için bu komutu kullanamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (!BotYetkiVarmı(guild, PermissionsBitField.Flags.BanMembers)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Üyeleri Banla\` yetkisi **${client.user.username}** adlı botta(bende) olmadığı için bu işlemi gerçekleştiremem.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     let member = message.mentions.members.first()
     let sebep = args.slice(1).join(' ') || "Belirtilmemiş!"
     if (!member) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Sunucuda yasaklamak istediğin kişiyi etiketlemelisin.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     if (member.user.id === client.user.id) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `**${client.user.username}** botu sunucudan yasaklayamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     if (member.user.id === message.author.id) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Kendini sunucudan yasaklayamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     if (member.user.id === message.guild.ownerId) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Sunucu sahibini sunucudan yasaklayamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     if (member.roles.highest.position >= message.member.roles.highest.position) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Etiketlediğin kullanıcının rolü senin rolünün üstünde yada eşit olduğu için işlemi gerçekleştiremedim.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Belirttiğin kullanıcının rolü botun rolünün üstünde yada eşit olduğu için işlemi gerçekleştiremedim.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     try {
          await member.ban({ reason: sebep })
          await message.channel.send({ embeds: [Embed(message.author.username, message.author.avatarURL(), `Sunucudan Yasakla`, `**${member.user.username}** adlı kullanıcı \`${sebep}\` sebebi ile **${message.author.username}** adlı yetkili tarafından sunucudan yasaklandı.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     } catch (err) {
          console.log(err)
          await message.channel.send({ content: `Bir sorun oluştu.` })
     }
}
exports.conf = {
     aliases: ["sunucudan-engelle", "sunucudanengelle", "banned", "yasakla"]
}
exports.help = {
     name: "ban",
     desc: "Belirttiğin kullanıcıyı sunucudan yasaklar."
}