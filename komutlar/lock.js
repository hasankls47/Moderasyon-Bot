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

     try {
          if (!channel.permissionsFor(guild.id).has("SendMessages")) {
               return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Kanal zaten kilitli olduğundan geri kilitleyemem.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
          }

          await channel.permissionOverwrites.edit(guild.id, {
               SendMessages: false,
          })
          await message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Kanal Kilitlendi!", `**${channel.name}** adlı kanalı kilitledim.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })

     } catch (err) {
          console.log(err)
          return message.reply({ content: `Bir sorun oluştu!` })
     }
}
exports.conf = {
     aliases: ["kilitle"]
}
exports.help = {
     name: "lock",
     desc: 'Komutu kullandığınız kanalı kilitler.'
}