const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, RoleSelectMenuBuilder, ComponentType } = require("discord.js")
const { prefix, color } = require("../ayarlar")
const db = require('croxydb')
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
     const rolerow = new ActionRowBuilder()
          .addComponents(
               new RoleSelectMenuBuilder()
                    .setCustomId(`otorol-ayarla`)
                    .setPlaceholder('Otorol rolünü belirle.')
                    .setMinValues(1)
                    .setMaxValues(1)
          )
     if (db.get(`${message.guild.id}_otorol`)) {
          await rolerow.components[0].addDefaultRoles(db.get(`${message.guild.id}_otorol`))
     }
     const buttonrow = new ActionRowBuilder()
          .addComponents(
               new ButtonBuilder()
                    .setCustomId(`otorol-sıfırla`)
                    .setLabel(`Sistemi Sıfırla`)
                    .setEmoji('⚙')
                    .setStyle(ButtonStyle.Danger)
          )

     let sistem = db.get(`${message.guild.id}_otorol`) ? guild.roles.cache.get(db.get(`${message.guild.id}_otorol`)) : '🔴 **Ayarlanmamış.**'

     let embed = await message.reply({
          embeds: [Embed(message.author.username, message.author.avatarURL(), "Otorol Sistemi", `Aşağıda otorol sistemiyle ilgili bilgiler mevcuttur;`, [
               { name: `Otorol Rolü;`, value: `${sistem}` },
          ], `İsteyen ${message.author.username}`, message.author.avatarURL(), null)], components: [rolerow, buttonrow]
     })

     const collector = embed.createMessageComponentCollector({ time: 30_000 })

     collector.on('collect', async (i) => {
          if (i.user.id !== message.author.id) {
               return i.reply({ content: `Bu menüyü/butonu sadece komutu kullanan kişi kullanabilir.`, ephemeral: true })
          }

          if (i.customId === 'otorol-ayarla') {
               let rol = await i.guild.roles.cache.get(i.values[0])
               if (rol) {
                    if (rol.managed === true) {
                         return i.reply({ content: `Bu rol bir entegrasyon rolü olduğu için işlemi gerçekleştiremedim.`, ephemeral: true })
                    }

                    if (i.user.id !== i.guild.ownerId) {
                         if (rol.position >= i.member.roles.highest.position) {
                              return i.reply({ content: `Bu rol senin en yüksek rolünün üstünde yada eşit olduğu için işlemi gerçekleştiremedim.`, ephemeral: true })
                         }
                    }

                    if (rol.position >= i.guild.members.me.roles.highest.position) {
                         return i.reply({ content: `Bu rol botun en yüksek rolünün üstünde yada eşit olduğu için işlemi gerçekleştiremedim.`, ephemeral: true })
                    }

                    await db.set(`${i.guild.id}_otorol`, rol.id)

                    const rolerow2 = new ActionRowBuilder()
                         .addComponents(
                              new RoleSelectMenuBuilder()
                                   .setCustomId(`otorol-ayarla`)
                                   .setPlaceholder('Otorol rolünü belirle.')
                                   .setMinValues(1)
                                   .setMaxValues(1)
                         )
                    if (db.get(`${message.guild.id}_otorol`)) {
                         await rolerow2.components[0].addDefaultRoles(db.get(`${message.guild.id}_otorol`))
                    }
                    const buttonrow2 = new ActionRowBuilder()
                         .addComponents(
                              new ButtonBuilder()
                                   .setCustomId(`otorol-sıfırla`)
                                   .setLabel(`Sistemi Sıfırla`)
                                   .setEmoji('⚙')
                                   .setStyle(ButtonStyle.Danger)
                         )

                    let sistem2 = db.get(`${message.guild.id}_otorol`) ? guild.roles.cache.get(db.get(`${message.guild.id}_otorol`)) : '🔴 **Ayarlanmamış.**'
                    await i.reply({ content: `✅ | Otorol rolünü başarıyla ayarladım.`, ephemeral: true })
                    await embed.edit({
                         embeds: [Embed(message.author.username, message.author.avatarURL(), "Otorol Sistemi", `Aşağıda otorol sistemiyle ilgili bilgiler mevcuttur;`, [
                              { name: `Otorol Rolü;`, value: `${sistem2}` },
                         ], `İsteyen ${message.author.username}`, message.author.avatarURL(), null)], components: [rolerow2, buttonrow2]
                    })

               }
          }
          if (i.customId === 'otorol-sıfırla') {
               if (!db.get(`${i.guild.id}_otorol`)) {
                    return i.reply({ content: `Otorol rolü zaten ayarlanmamış.`, ephemeral: true })
               }
               await db.delete(`${i.guild.id}_otorol`)
               const rolerow2 = new ActionRowBuilder()
                    .addComponents(
                         new RoleSelectMenuBuilder()
                              .setCustomId(`otorol-ayarla`)
                              .setPlaceholder('Otorol rolünü belirle.')
                              .setMinValues(1)
                              .setMaxValues(1)
                    )
               if (db.get(`${message.guild.id}_otorol`)) {
                    await rolerow2.components[0].addDefaultRoles(db.get(`${message.guild.id}_otorol`))
               }
               const buttonrow2 = new ActionRowBuilder()
                    .addComponents(
                         new ButtonBuilder()
                              .setCustomId(`otorol-sıfırla`)
                              .setLabel(`Sistemi Sıfırla`)
                              .setEmoji('⚙')
                              .setStyle(ButtonStyle.Danger)
                    )

               let sistem2 = db.get(`${message.guild.id}_otorol`) ? guild.roles.cache.get(db.get(`${message.guild.id}_otorol`)) : '🔴 **Ayarlanmamış.**'
               await i.reply({ content: `✅ | Otorol rolünü başarıyla sıfırladım.`, ephemeral: true })
               await embed.edit({
                    embeds: [Embed(message.author.username, message.author.avatarURL(), "Otorol Sistemi", `Aşağıda otorol sistemiyle ilgili bilgiler mevcuttur;`, [
                         { name: `Otorol Rolü;`, value: `${sistem2}` },
                    ], `İsteyen ${message.author.username}`, message.author.avatarURL(), null)], components: [rolerow2, buttonrow2]
               })
          }
     })

     collector.on('end', async (collected) => {
          await rolerow.components[0].setDisabled(true)
          await buttonrow.components[0].setDisabled(true)
          await embed.edit({ components: [rolerow, buttonrow] })
     })
}

exports.conf = {
     aliases: []
}
exports.help = {
     name: "otorol",
     desc: 'Otorol sistemini ayarlarsın.'
}