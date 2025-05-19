const { EmbedBuilder } = require('discord.js');
const ayarlar = require('../ayarlar');

const Embed = (aname, aicon, title, desc, fields, ftext, ficon, thumbnail) => {

     const embed = new EmbedBuilder()
          .setColor(ayarlar.color)
          .setTimestamp()

     if (aname || aicon) {
          embed.setAuthor({ name: aname || "Moderasyon Botu", iconURL: aicon || null })
     }

     if (title) {
          embed.setTitle(title)
     }

     if (desc) {
          embed.setDescription(desc)
     }

     if (fields) {
          embed.addFields(fields)
     }

     if (ftext || ficon) {
          embed.setFooter({ text: ftext || "Moderasyon Botu", iconURL: ficon || null })
     }

     if (thumbnail) {
          embed.setThumbnail(thumbnail)
     }

     return embed
}

module.exports = Embed;