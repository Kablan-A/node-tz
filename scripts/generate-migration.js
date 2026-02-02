import { execSync } from "child_process";

const name = process.env.npm_config_name || process.argv[2];

if (!name) {
	console.error(
		"Error: Please provide a migration name using --name=MyName or as an argument.",
	);
	process.exit(1);
}

const migrationPath = `./src/migrations/${name}`;
const command = `npx typeorm-ts-node-commonjs migration:generate -d ./src/data-source.ts ${migrationPath}`;

try {
	console.log(`Generating migration: ${migrationPath}...`);
	execSync(command, { stdio: "inherit" });
} catch (err) {
	process.exit(1);
}
