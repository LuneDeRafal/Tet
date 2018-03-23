const Discord = require("discord.js")
const fs = require("fs");
const client = new Discord.Client()

const prefix = "/"
const level = JSON.parse(fs.readFileSync("./level.json", "utf8"))

var donner = new Array()
donner.push([1, 1, "Imanity", "426338371325919242"])
donner.push([2, 500, "Seiren", "426338336458670081"])
donner.push([3, 1000, "Dhampir", "426336001464467457"])
donner.push([4, 1500, "Werebeast", "426338261192015883"])
donner.push([5, 2000, "Lunamana", "426338191763832833"])
donner.push([6, 2500, "Ex-Macina", "426336001271660544"])
donner.push([7, 3500, "Demonia", "426336001271529473"])
donner.push([8, 4500, "Fée", "426335996888612864"])
donner.push([9, 5500, "Dwarf", "426335996867510274"])
donner.push([10, 6500, "Elfe", "426335992996167681"])
donner.push([11, 7500, "Flugel", "426335992081809408"])
donner.push([12, 9000, "Gigant", "426335991796727819"])
donner.push([13, 10500, "Dragonia", "426335987267010561"])
donner.push([14, 12000, "Elemental", "426335985702535170"])
donner.push([15, 14000, "Phantasma", "426335983160655874"])
donner.push([16, 20000, "Old Deus", "426335970405646338"])


client.on("ready", () => {
    console.log("Tet se prépare!")

    client.user.setActivity("Jouer aux echecs!")

    console.log("Tet est Prêt!")
})

client.on("message", (message) => {
    // Securiter
    if (message.author.bot) { return }
    

    if (!message.content.startsWith(prefix)) {
        // Si c'est un nouveau
        if (!level[message.author.id]) {
            level[message.author.id] = {
                pseudo : message.author.username,
                points : 0,
                level : 0
            }
        }

        let userData = level[message.author.id]

        // Ajout des point
        let points = Math.floor(Math.random() * (5 - 1) + 1)
        userData.points += points

        // Mise a niveau
        for (let n = 0; n < donner.length; n++) {
            if (userData.level < donner[n][0] && userData.points >= donner[n][1]) {
                userData.level = donner[n][0]
                userData.points = 0
                
                // Donner les role convenue
                for (let i = 0; i < donner.length; i++) {
                    message.member.removeRole(donner[i][3])
                }
                message.member.addRole(donner[n][3])
                    .catch(console.error)

                // prevenir
                message.reply("Bravo, vous êtes montez de niveau ! \nVous êtes maintenant niveau " + userData.level + " !" +
                    "\n" + "Vous faites maintenant parti de " + donner[n][2])
                
            }
        }

        // Ecrire les donner
        fs.writeFile("./level.json", JSON.stringify(level, 4, 4))
    } else {
        if (message.content.startsWith(prefix + "rank")) {
            if (!level[message.author.id]) {
                let userData = level[message.author.id]
                const embed = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setColor(0x0000ff)
                    .addField("Niveau : ", " 0 ", true)
                    .addField("Expérience : ", " 0", true)

                message.channel.send({embed})
            } else {
                let userData = level[message.author.id]
                const embed = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setColor(0x0000ff)
                    .addField("Niveau : ", userData.level, true)
                    .addField("Expérience : ", userData.points + " / " + donner[userData.level][1], true)

                message.channel.send({embed})
            }
        }

        if (message.content.startsWith(prefix + "infolvl")) {
            const embed = new Discord.RichEmbed()
                .setColor(0x00ff00)
                .setTitle("Les Niveau !")
            for (let a = 0; a < donner.length; a++) {
                embed.addField("Niveau " + donner[a][0], "Sur " + donner[a][1] + ", le rank de " + donner[a][2])
            }

            message.channel.send({embed})
        }

        if (message.content.startsWith(prefix + "help")) {
            const embed = new Discord.RichEmbed()
                .setColor(0xff0000)
                .addField("Commands : ", "/rank : Pour savoir son niveau et son experience" + "\n" + 
                "/infolvl : Pour avoir des info sur les niveau a passer", false)
                .addField("Info : ", "Tu gagne environs 1-5 exp par message", false)

            message.channel.send({embed})
        }
    }
})

client.login(process.env.TOKEN)
