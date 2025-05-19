const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { prefix, color } = require("../ayarlar")
const yetkiVarmı = require('../func/YetkiVarmı')
const BotYetkiVarmı = require('../func/BotYetkiVarmı')
const Embed = require("../func/Embed")
const ms = require('ms')
const humanize = require("humanize-duration")


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
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Zamanaşımı atmak istediğin kullanıcıyı etiketlemedin.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (member.user.id === message.author.id) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Kendi kendine zamanaşımı atamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (member.user.id === client.user.id) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `**${client.user.username}** adlı bota mute atamazsın..`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (member.user.id === message.guild.ownerId) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Zamanaşımı uygulamak istediğin sunucunun sahibi olduğu için zamanaşımı uygulayamadım.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     if (message.author.id !== message.guild.ownerId) {
          if (member.roles.highest.position >= message.member.roles.highest.position) {
               return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Bu kullanıcıya zamanaşımı uygulamak için ondan daha üst bir role sahip olmalısın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
          }

          if (member.roles.highest.position >= message.guild.members.me.roles.highest.position) {
               return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Bu kullanıcıya zamanaşımı uygulamak için ondan daha üst bir role sahip olmalısın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
          }
     }

     if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Zamanaşımı uygulamak istediğin kişide \`Yönetici\` yetkisi olduğu için zamanaşımı uygulayamadım.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     let süre = args.slice(1).join(' ')
     let süree = süre.toLowerCase()
     const sürems = await ms(süree
          .replace(/saniye|sn|sc|s/gi, "s")
          .replace(/dakika|dk|m/gi, "m")
          .replace(/saat|sa|h/gi, "h")
          .replace(/gün|gü|g|d/gi, "d")
          .replace(/yıl|yr|y/gi, "y"));
     if (!sürems) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Geçerli bir zamanaşımı süresi belirtmelisin;\n\n**${prefix}zamanaşımı @member 1 dakika**`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (!sürems >= 1000) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `En az 1 dakikalık zamanaşımı atabilirsin.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (sürems > 604800000) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Zamanaşımı süresi en fazla 7 Gün olabilir.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     try {
          await member.timeout(sürems, { reason: null })
          await message.reply({
               embeds: [Embed(message.author.username, message.author.avatarURL(), "Zamanaşımı Uygulandı!", `Zamanaşımı uygulandı!`, [
                    { name: `Member`, value: `${member} - **${member.user.username}** - **${member.user.id}**` },
                    { name: `Yetkili`, value: `${message.author} - ${message.author.username}` },
                    { name: `Süre`, value: `${humanize(sürems, { language: "tr" })}` }
               ], `İsteyen ${message.author.username}`, message.author.avatarURL(), null)]
          })
     } catch (err) {
          await message.reply({ content: `Bir sorun oluştu!` })
     }
}
exports.conf = {
     aliases: ["mute", "sustur"]
}
exports.help = {
     name: "zamanaşımı",
     desc: 'Bir kullanıcıya zamanaşımı atarsın.'
}