import { settings } from "#settings"
import { formatEmoji as discordformatEmoji } from "discord.js";

type EmojiList = typeof settings.emojis;
type EmojiKey = keyof EmojiList["static"] | `:a:${keyof EmojiList["animated"]}`;

export function icon(name: EmojiKey) {
  const animated = name.startsWith(":a:");
  const id = animated ?
    settings.emojis.animated[name.slice(3, name.length) as keyof EmojiList["animated"]] :
    settings.emojis.static[name as keyof EmojiList["static"]];

  const toString = () => discordformatEmoji(id, animated);

  return { id, animated, toString };
}