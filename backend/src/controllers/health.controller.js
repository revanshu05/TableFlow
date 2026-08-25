import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, "..", "..", "package.json"), "utf-8"));

const getHealth = (req, res) => {
	const dbState = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
	const uptime = process.uptime();
	const response = {
		status: "healthy",
		uptime,
		timestamp: new Date().toISOString(),
		version: pkg.version,
		database: { status: dbState },
	};
	const statusCode = dbState === "connected" ? 200 : 503;

	res.status(statusCode).json(response);
};

export { getHealth };