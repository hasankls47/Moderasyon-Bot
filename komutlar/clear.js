const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { prefix, color } = require("../ayarlar")
const yetkiVarmı = require('../func/YetkiVarmı')
const BotYetkiVarmı = require('../func/BotYetkiVarmı')
const Embed = require("../func/Embed")

exports.run = async (client, message, args) => {

     let guild = message.guild;
     let channel = message.channel;

     if (!yetkiVarmı(message.member, PermissionsBitField.Flags.ManageMessages)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Mesajları Yönet\` yetkin olmadığı için bu komutu kullanamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (!BotYetkiVarmı(guild, PermissionsBitField.Flags.ManageMessages)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Mesajları Yönet\` yetkisi **${client.user.username}** adlı botta(bende) olmadığı için bu işlemi gerçekleştiremem.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     let sayı = Number(args[0])

     if (!sayı) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Geçersiz Bir sayı girdin.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] }).then(msg => message.type !== 2 && setTimeout(() => msg.delete().catch(e => { }), 4000));
     }

     if (1 >= sayı) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `En az 2 mesaj silebilirsin.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] }).then(msg => message.type !== 2 && setTimeout(() => msg.delete().catch(e => { }), 4000));
     }

     if (sayı > 100) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `En fazla 100 mesaj silebilirsiniz.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] }).then(msg => message.type !== 2 && setTimeout(() => msg.delete().catch(e => { }), 4000));
     }

     try {
          await channel.bulkDelete(Number(sayı), true).then((bulk) => {
               return message.channel.send({ embeds: [Embed(message.author.username, message.author.avatarURL(), "İşlem Başarısız!", `Başarıyla ${bulk.size} kadar mesaj sildim.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] }).then(msg => message.type !== 2 && setTimeout(() => msg.delete().catch(e => { }), 4000));
          })
     } catch (err) {
          console.log(err)
          await message.channel.send({ content: `Bir sorun oluştu!` })
     }
}
exports.conf = {
     aliases: ["clear", "sil"]
}
exports.help = {
     name: "temizle",
     desc: 'Belirttiğin sayıda mesaj siler.'
}