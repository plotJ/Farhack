import { createCanvas, loadImage, registerFont } from 'canvas';

interface Lum0xFan {
  display_name: string;
  score: number;
}

interface NanographContributor {
  username: string;
  casts: number;
}

export function generateCombinedLeaderboardImage(
  lum0xTopFans: Lum0xFan[],
  nanographTopContributors: NanographContributor[],
  channel: string,
  timeframe: string
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="#f0f0f0"/>
      <text x="400" y="50" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" font-weight="bold">Combined Leaderboard - ${channel}</text>
      <text x="400" y="80" font-family="Arial, sans-serif" font-size="24" text-anchor="middle">Timeframe: ${timeframe}</text>
      
      <text x="200" y="120" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" font-weight="bold">Lum0x Top Fans</text>
      ${lum0xTopFans.map((fan, index) => `
        <text x="50" y="${160 + index * 30}" font-family="Arial, sans-serif" font-size="18">
          ${index + 1}. ${fan.display_name} - Score: ${fan.score}
        </text>
      `).join('')}
      
      <text x="600" y="120" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" font-weight="bold">Nanograph Top Contributors</text>
      ${nanographTopContributors.map((contributor, index) => `
        <text x="450" y="${160 + index * 30}" font-family="Arial, sans-serif" font-size="18">
          ${index + 1}. ${contributor.username} - Casts: ${contributor.casts}
        </text>
      `).join('')}
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
