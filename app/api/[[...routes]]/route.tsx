/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { Fan } from "../../utils/interface";
import { Buffer } from 'buffer';
import { getTopFans, postLum0xTestFrameValidation } from "../../utils/helpers";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY ?? "" }),
  title: "Farcaster Engagement Leaderboard",
  imageAspectRatio: "1:1",
  imageOptions: {
    height: 800,
    width: 800,
  },
  initialState: {
    channel: "",
    timeframe: "week",
  },
});

app.frame("/", (c) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
      <rect width="800" height="800" fill="#f0f0f0"/>
      <text x="400" y="400" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" dominant-baseline="middle" fill="#000000">
        Farcaster Engagement Leaderboard
      </text>
    </svg>
  `;
  
  return c.res({
    image: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
    intents: [<Button action="/channel">Start</Button>],
  });
});



app.frame("/channel", async (c) => {
  const fid = c.frameData?.fid;
  await postLum0xTestFrameValidation(Number(fid), "channel");

  return c.res({
    image: "/step1.png",
    intents: [
      <TextInput placeholder="Enter channel (optional)" />,
      <Button action="/">Back</Button>,
      <Button action="/timeframe">Next</Button>,
    ],
  });
});

app.frame("/timeframe", async (c) => {
  const fid = c.frameData?.fid;
  await postLum0xTestFrameValidation(Number(fid), "timeframe");

  const channel = c.inputText || "";

  return c.res({
    image: "/step2.png",
    intents: [
      <Button action="/result" value={`day|${channel}`}>Day</Button>,
      <Button action="/result" value={`week|${channel}`}>Week</Button>,
      <Button action="/result" value={`month|${channel}`}>Month</Button>,
      <Button action="/channel">Back</Button>,
    ],
  });
});

app.frame("/result", async (c) => {
  try {
    const fid = c.frameData?.fid;
    console.log("Frame Data:", c.frameData);
    await postLum0xTestFrameValidation(Number(fid), "result");

    console.log("Button value:", c.buttonValue);
    const [timeframe, channel] = (c.buttonValue as string).split('|');
    console.log("Timeframe:", timeframe, "Channel:", channel);

    const limit = 10;

    console.log("Fetching top fans...");
    const topFans: Fan[] = await getTopFans(channel, timeframe, limit);
    console.log("Top fans fetched:", topFans);

    if (topFans.length === 0) {
      const noDataSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
          <rect width="800" height="800" fill="#f0f0f0"/>
          <text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle">No Data Available</text>
          <text x="400" y="350" font-family="Arial" font-size="18" text-anchor="middle">No engagement data found for the selected criteria.</text>
          <text x="400" y="400" font-family="Arial" font-size="18" text-anchor="middle">Channel: ${channel || 'All'} | Timeframe: ${timeframe}</text>
        </svg>
      `;

      return c.res({
        image: `data:image/svg+xml;base64,${Buffer.from(noDataSvg).toString('base64')}`,
        intents: [<Button action="/">Try Again</Button>],
      });
    }

    const resultSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
        <rect width="800" height="800" fill="#f0f0f0"/>
        <text x="400" y="50" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle">Farcaster Engagement Leaderboard</text>
        <text x="400" y="80" font-family="Arial" font-size="18" text-anchor="middle">Channel: ${channel || 'All'} | Timeframe: ${timeframe}</text>
        <line x1="10" y1="100" x2="790" y2="100" stroke="black" />
        <text x="10" y="95" font-family="Arial" font-size="14" font-weight="bold">Rank</text>
        <text x="60" y="95" font-family="Arial" font-size="14" font-weight="bold">User</text>
        <text x="500" y="95" font-family="Arial" font-size="14" font-weight="bold" text-anchor="end">Score</text>
        <text x="600" y="95" font-family="Arial" font-size="14" font-weight="bold" text-anchor="end">Recasts</text>
        <text x="700" y="95" font-family="Arial" font-size="14" font-weight="bold" text-anchor="end">Reactions</text>
        ${topFans.map((fan, index) => `
          <text x="10" y="${130 + index * 30}" font-family="Arial" font-size="14">${index + 1}</text>
          <text x="60" y="${130 + index * 30}" font-family="Arial" font-size="14">${fan.display_name}</text>
          <text x="500" y="${130 + index * 30}" font-family="Arial" font-size="14" text-anchor="end">${fan.score}</text>
          <text x="600" y="${130 + index * 30}" font-family="Arial" font-size="14" text-anchor="end">${fan.recasts}</text>
          <text x="700" y="${130 + index * 30}" font-family="Arial" font-size="14" text-anchor="end">${fan.reactions}</text>
        `).join('')}
      </svg>
    `;

    return c.res({
      image: `data:image/svg+xml;base64,${Buffer.from(resultSvg).toString('base64')}`,
      intents: [<Button action="/">Home</Button>],
    });
  } catch (error) {
    console.error("Error in result frame:", error);
    const errorSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
        <rect width="800" height="800" fill="#f0f0f0"/>
        <text x="400" y="300" font-family="Arial" font-size="24" fill="red" text-anchor="middle">Error</text>
        <text x="400" y="350" font-family="Arial" font-size="18" text-anchor="middle">Unable to fetch leaderboard data. Please try again.</text>
        <text x="400" y="400" font-family="Arial" font-size="14" text-anchor="middle">${error instanceof Error ? error.message : String(error)}</text>
      </svg>
    `;

    return c.res({
      image: `data:image/svg+xml;base64,${Buffer.from(errorSvg).toString('base64')}`,
      intents: [<Button action="/">Try Again</Button>],
    });
  }
});



function generateLeaderboardText(fans: Fan[], channel: string, timeframe: string): string {
  let text = `Ch: ${channel || 'All'} | Time: ${timeframe}\n`;
  text += 'Rank|User         |Score|RC |RX\n';
  text += '----+-------------+-----+---+---\n';
  
  fans.forEach((fan, index) => {
    text += `${(index + 1).toString().padStart(3)}|`;
    text += `${fan.display_name.slice(0, 12).padEnd(13)}|`;
    text += `${fan.score.toString().padStart(5)}|`;
    text += `${fan.recasts.toString().padStart(3)}|`;
    text += `${fan.reactions.toString().padStart(3)}\n`;
  });

  return text;
}


devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);