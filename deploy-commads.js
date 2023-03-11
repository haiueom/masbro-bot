const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
dotenv.config();
const tkn = process.env.TOKEN;
const cid = process.env.CLIENT_ID;
const gid = process.env.GUILD_ID;

const commands = [];

const getAllFiles = function(dirPath, arrayOfFiles) {
	const files = fs.readdirSync(dirPath);

	arrayOfFiles = arrayOfFiles || [];

	files.forEach(function(file) {
		if (fs.statSync(dirPath + '/' + file).isDirectory()) {
			arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
		}
		else {
			arrayOfFiles.push(path.join(__dirname, dirPath, '/', file));
		}
	});

	return arrayOfFiles;
};

const files = getAllFiles('./commands');
for (const file of files) {
	const command = require(file);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(tkn);

// and deploy your commands!
(async () => {
	try {
		console.log(
			`[✓] Started refreshing ${commands.length} application (/) commands.`,
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationGuildCommands(cid, gid), {
			body: commands,
		});

		console.log(
			`[✓] Successfully reloaded ${data.length} application (/) commands.`,
		);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
