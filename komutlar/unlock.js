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
          if (channel.permissionsFor(guild.id).has("SendMessages")) {
               return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Kanalın kilidi zaten kaldırılmış.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
          }

          await channel.permissionOverwrites.edit(guild.id, {
               SendMessages: true,
          })
          await message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Kanal Kilidi Kaldırıldı!", `**${channel.name}** adlı kanalın kilidini kaldırdım.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })

     } catch (err) {
          return message.reply({ content: `Bir sorun oluştu!` })
     }
}
exports.conf = {
     aliases: ["kilitkaldır", "kilit-kaldır"]
}
exports.help = {
     name: "unlock",
     desc: 'Komutu kullandığınız kanalın kilidini kaldırır.'
}