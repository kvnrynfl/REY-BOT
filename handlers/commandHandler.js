require('dotenv').config()
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');    
const AsciiTable = require("ascii-table");

function loadCommands(client) {
    const table = new AsciiTable().setHeading("Status", "Path", "File", "Commands").setAlignCenter(0).setAlignCenter(1);

    const commandsArray = [];
    // Grab all the command files from the commands directory you created earlier
    const commandsFolder = fs.readdirSync("./commands");
    
    for (const folder of commandsFolder){
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const commandFile = require(`../commands/${folder}/${file}`);
            
            const properties = { folder, ...commandFile };

            if ('data' in properties && 'execute' in properties) {
                client.commands.set(commandFile.data.name, properties);
            } else {
                console.log(`[WARNING] The command at ${properties} is missing a required "data" or "execute" property.`);
            }

            commandsArray.push(commandFile.data.toJSON());
            table.addRow('✔', folder, file, `/${properties.data.name}`);
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

    (async () => {
        try {
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commandsArray },
            );
            table.setTitle(`Reloaded ${data.length}/${commandsArray.length} commands`);
            console.log(table.toString());
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}

module.exports = { loadCommands };