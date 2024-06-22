import { GuildSchema } from "#database";
import { HydratedDocument } from "mongoose";

declare module "discord.js" {
	interface Client {
		// Add your properties
		readonly mainGuildData: HydratedDocument<GuildSchema>
	}
}