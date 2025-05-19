const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js")
const { prefix, color } = require("../ayarlar")
const db = require('croxydb')
const yetkiVarmı = require('../func/YetkiVarmı')
const BotYetkiVarmı = require('../func/BotYetkiVarmı')
const Embed = require("../func/Embed")

exports.run = async (client, message, args) => {
     let guild = message.guild;
     let channel = message.channel;

     if (!yetkiVarmı(message.member, PermissionsBitField.Flags.Administrator)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Yönetici\` yetkin olmadığı için bu komutu kullanamazsın.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }

     if (!BotYetkiVarmı(guild, PermissionsBitField.Flags.Administrator)) {
          return message.reply({ embeds: [Embed(message.author.username, message.author.avatarURL(), "Yetki Yetersiz!", `\`Yönetici\` yetkisi **${client.user.username}** adlı botta(bende) olmadığı için bu işlemi gerçekleştiremem.`, null, `İsteyen ${message.author.username}`, message.author.avatarURL(), null)] })
     }
     let row;

     let aktifrow = new ActionRowBuilder()
          .addComponents(
               new ButtonBuilder()
                    .setCustomId(`link-engel-kapat`)
                    .setLabel("Sistemi Kapat")
                    .setEmoji("🔗")
                    .setStyle(ButtonStyle.Danger)
          )
     let kapalırow = new ActionRowBuilder()
          .addComponents(
               new ButtonBuilder()
                    .setCustomId(`link-engel-aktif`)
                    .setLabel("Sistemi Aktif Et")
                    .setEmoji("🔗")
                    .setStyle(ButtonStyle.Success)
          )
     if (db.get(`${message.guild.id}_linkengel`) === true) {
          row = aktifrow;
     } else {
          row = kapalırow;
     }

     let sistem = db.get(`${message.guild.id}_linkengel`) ? "🟢 **Aktif**" : "🔴 **Kapalı**"

     let embed = await message.reply({
          embeds: [Embed(message.author.username, message.author.avatarURL(), "Link Engel Sistemi", `Aşağıda link engel sistemiyle ilgili bilgiler mevcuttur;`, [
               { name: `Sistem`, value: `${sistem}` },
          ], `İsteyen ${message.author.username}`, message.author.avatarURL(), null)], components: [row]
     })

     const collector = embed.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30_000 })

     collector.on('collect', async (i) => {
          if (i.user.id !== message.author.id) {
               return i.reply({ content: `Bu butonu sadece komutu kullanan kişi kullanabilir.`, ephemeral: true })
          }
          if (i.customId === "link-engel-kapat") {
               await db.delete(`${i.guild.id}_linkengel`)
               if (db.get(`${i.guild.id}_linkengel`) === true) {
                    row = aktifrow;
               } else {
                    row = kapalırow;
               }
               let sistem2 = await db.get(`${message.guild.id}_linkengel`) ? "🟢 **Aktif**" : "🔴 **Kapalı**"
               await i.reply({ content: `✅ | Başarıyla link engel sistemini kapattım.`, ephemeral: true })
               await embed.edit({
                    embeds: [Embed(message.author.username, message.author.avatarURL(), "Link Engel Sistemi", `Aşağıda link engel sistemiyle ilgili bilgiler mevcuttur;`, [
                         { name: `Sistem`, value: `${sistem2}` },
                    ], `İsteyen ${message.author.username}`, message.author.avatarURL(), null)], components: [row]
               })
          }
          if (i.customId === "link-engel-aktif") {
               await db.set(`${i.guild.id}_linkengel`, true)
               if (db.get(`${i.guild.id}_linkengel`) === true) {
                    row = aktifrow;
               } else {
                    row = kapalırow;
               }
               let sistem2 = await db.get(`${message.guild.id}_linkengel`) ? "🟢 **Aktif**" : "🔴 **Kapalı**"
               await i.reply({ content: `✅ | Başarıyla link engel sistemini aktif ettim.`, ephemeral: true })
               await embed.edit({
                    embeds: [Embed(message.author.username, message.author.avatarURL(), "Link Engel Sistemi", `Aşağıda link engel sistemiyle ilgili bilgiler mevcuttur;`, [
                         { name: `Sistem`, value: `${sistem2}` },
                    ], `İsteyen ${message.author.username}`, message.author.avatarURL(), null)], components: [row]
               })
          }
     })

     collector.on('end', async (collected) => {
          await row.components[0].setDisabled(true)
          await embed.edit({ components: [row] }).catch(() => { })
     })
}

exports.conf = {
     aliases: ["linkengel", "reklam-engel", "reklamengel"]
}
exports.help = {
     name: "link-engel",
     desc: 'Link engelleme sistemini açar/kapatırsınız.'
}