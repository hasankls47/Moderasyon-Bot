const { Client, GatewayIntentBits, Partials, ButtonBuilder, ButtonComponent, ButtonStyle, ActionRowBuilder, PermissionsFlags, ModalBuilder, TextInputBuilder, TextInputStyle, Collection, AttachmentBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const fs = require("fs")
const ayarlar = require("./ayarlar.js");
const { prefix, color, botdurum } = require("./ayarlar.js")
const db = require("croxydb")
const Discord = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
});

module.exports = client;

const { error } = require("console");
const BotYetkiVarmı = require("./func/BotYetkiVarmı.js");
const RolBotPosition = require("./func/RolBotPosition.js");

client.login(ayarlar.token)


client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    let command = message.content.toLocaleLowerCase().split(" ")[0].slice(prefix.length);
    let params = message.content.split(" ").slice(1);
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        cmd.run(client, message, params)
    }
});

client.commands = new Collection();
client.aliases = new Collection();

client.on('ready', () => {

    client.user.setPresence({
        activities: [{
            name: `${botdurum || "Code World"}`
        }]
    });


    console.log('_________________________________________');
    console.log(`Bot Adı     : ${client.user.username}`);
    console.log(`Prefix      : ${ayarlar.prefix}`);
    console.log(`Durum       : Bot Çevrimiçi!`);
    console.log('_________________________________________');
});

fs.readdir("./komutlar", (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });

})



client.on('messageCreate', async (message) => {
    if (db.get(`${message.guild.id}_linkengel`)) {
        if (message.author.id === message.guild.ownerId) return;
        if (message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;
        const reklam = ["discord.gg", "http://", "https://", "www.", ".com", ".net", ".xyz", ".gg"];
        const messageContent = message.content.toLowerCase()
            .replace(' ', "")
            .replace('https://tenor.com', "")
            .replace('https://c.tenor.com', "")
            .replace('https://giphy.com', "")
            .replace('https://media.giphy.com', "")
            .replace('https://gibir.net.tr', "");

        if (reklam.some(word => messageContent.includes(word))) {
            await message.delete().catch(() => { });
            await message.channel.send({ content: `${message.author} bu sunucuda reklam yapamazsın.` }).then(msg => setTimeout(() => msg.delete().catch(e => { }), 5000));
        }
    }
    if (db.get(`${message.guild.id}_küfürengel`)) {
        if (message.author.id === message.guild.ownerId) return;
        if (message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;
        const küfür = ["amk", "awq", "ananı", "anan", "baban", "babanı", "ölü", "deri", "allahını", "sik", "sg", "piç", "puşt", "amcık", "amına", "amcük", "yarrak", "pipi", "çük", "meme", "sick", "ass", "atanı", "bacını", "popo", "göt", "göü", "it", "orul", "orospu", "oe", "evladı", "oç", "o.ç", "o.e", "s.g", "oc"];

        const messageContent = message.content.toLowerCase()

        if (küfür.some(word => messageContent.includes(word))) {
            await message.delete().catch(() => { });
            await message.channel.send({ content: `${message.author} bu sunucuda küfür edemezsin.` }).then(msg => setTimeout(() => msg.delete().catch(e => { }), 5000));
        }
    }
    if (db.get(`${message.guild.id}_capsengel`)) {
        if (message.author.id === message.guild.ownerId) return;
        if (message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;
        let text = message.content.replace(/\s/g, '');
        if (text.length < 3) return;

        let upperCase = 0;
        var i = text.length;
        while (i--) {
            if (/[ABCÇDEFGHİIJKLMNOÖPRSŞTUÜVYZQWX]+/.test(text.charAt(i))) upperCase++;
        }
        if ((upperCase / text.length * 100) < (70)) return;
        await message.delete().catch(() => { });
        return message.channel.send({ content: `${message.author} mesajın çok fazla BÜYÜK HARF içeriyor.` }).then(msg => setTimeout(() => msg.delete().catch(e => { }), 5000));
    }
})


client.on('messageUpdate', async (oldMessage, newMessage) => {
    let message = newMessage;

    if (message.author.id === message.guild.ownerId) return;
    if (message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;

    if (db.get(`${message.guild.id}_küfürengel`)) {
        if (message.author.id === message.guild.ownerId) return;
        if (message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;
        const küfür = ["amk", "awq", "ananı", "anan", "baban", "babanı", "ölü", "deri", "allahını", "sik", "sg", "piç", "puşt", "amcık", "amına", "amcük", "yarrak", "pipi", "çük", "meme", "sick", "ass", "atanı", "bacını", "popo", "göt", "göü", "it", "orul", "orospu", "oe", "evladı", "oç", "o.ç", "o.e", "s.g", "oc"];

        const messageContent = message.content.toLowerCase()

        if (küfür.some(word => messageContent.includes(word))) {
            await message.delete().catch(() => { });
            await message.channel.send({ content: `${message.author} bu sunucuda küfür edemezsin.` }).then(msg => setTimeout(() => msg.delete().catch(e => { }), 5000));
        }
    }

    if (db.get(`${message.guild.id}_linkengel`)) {
        const reklam = ["discord.gg", "http://", "https://", "www.", ".com", ".net", ".xyz"];
        const messageContent = message.content.toLowerCase()
            .replace(' ', "")
            .replace('https://tenor.com', "")
            .replace('https://c.tenor.com', "")
            .replace('https://giphy.com', "")
            .replace('https://media.giphy.com', "")
            .replace('https://gibir.net.tr', "");

        if (reklam.some(word => messageContent.includes(word))) {
            await message.delete().catch(() => { });
            return message.channel.send({ content: `${message.author} bu sunucuda reklam yapamazsın.` }).then(msg => setTimeout(() => msg.delete().catch(e => { }), 5000));
        }
    }

    if (db.get(`${message.guild.id}_capsengel`)) {
        let text = message.content.replace(/\s/g, '');
        if (text.length < 3) return;

        let upperCase = 0;
        var i = text.length;
        while (i--) {
            if (/[ABCÇDEFGHİIJKLMNOÖPRSŞTUÜVYZQWX]+/.test(text.charAt(i))) upperCase++;
        }
        if ((upperCase / text.length * 100) < (70)) return;
        await message.delete().catch(() => { });
        return message.channel.send({ content: `${message.author} mesajın çok fazla BÜYÜK HARF içeriyor.` }).then(msg => setTimeout(() => msg.delete().catch(e => { }), 5000));
    }
})

client.on('guildMemberAdd', async (member) => {
    if (db.get(`${member.guild.id}_otorol`)) {
        let rol = member.guild.roles.cache.get(db.get(`${member.guild.id}_otorol`))
        if (rol) {
            if (member.user.bot) return;
            if (!BotYetkiVarmı(member.guild, Discord.PermissionsBitField.Flags.ManageRoles)) return;
            if (RolBotPosition(member.guild.members.me, rol)) return;
            try {
                await member.roles.add(rol.id)
            } catch (err) {
                console.log(err)
            }
        }
    }
})


