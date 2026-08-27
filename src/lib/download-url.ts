const DOWNLOAD_HOSTS = new Set([
  "drive.google.com",
  "docs.google.com",
  "discord.com",
  "www.discord.com",
  "canary.discord.com",
  "ptb.discord.com",
  "discord.gg",
  "cdn.discordapp.com",
  "media.discordapp.net",
]);

export function isSupportedDownloadUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && DOWNLOAD_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}
