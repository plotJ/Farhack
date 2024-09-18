import { Lum0x } from "lum0x-sdk";
import { Fan } from "./interface";

Lum0x.init(process.env.LUM0X_API_KEY || "");

export async function postLum0xTestFrameValidation(fid: number, path: string) {
  try {
    console.log(`Posting frame validation for fid: ${fid}, path: ${path}`);
    await fetch("https://testnetapi.lum0x.com/frame/validation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        farcasterFid: fid,
        frameUrl: `${process.env.BASE_URL}/api/${path}`,
      }),
    });
    console.log("Frame validation posted successfully");
  } catch (error) {
    console.error("Error in postLum0xTestFrameValidation:", error);
  }
}

export async function getTopFans(channel: string, timeframe: string, limit: number): Promise<Fan[]> {
  try {
    console.log(`Fetching top fans for channel: ${channel}, timeframe: ${timeframe}, limit: ${limit}`);
    let feedType = "filter";
    let filterType = channel ? "channel_id" : "all";
    
    let queryParams: any = {
      feed_type: feedType,
      filter_type: filterType,
      limit: 100,
    };

    if (channel) {
      queryParams.channel_id = channel;
    }

    queryParams.start_time = getStartDate(timeframe);

    let res = await Lum0x.farcasterFeed.getFeed(queryParams);

    console.log("Raw API response:", JSON.stringify(res, null, 2));
    console.log(`Received ${res.casts?.length || 0} casts from API`);

    if (!res.casts || res.casts.length === 0) {
      throw new Error("No casts found for the given criteria");
    }

    let fanEngagement: { [key: number]: Fan } = {};

    for (let cast of res.casts) {
      console.log("Processing cast:", JSON.stringify(cast, null, 2));
      processEngagement(cast, fanEngagement);
    }

    let sortedFans = Object.values(fanEngagement).sort((a, b) => b.score - a.score);
    console.log(`Processed ${sortedFans.length} fans`);
    console.log("Sorted fans:", JSON.stringify(sortedFans, null, 2));
    return sortedFans.slice(0, limit);
  } catch (error) {
    console.error("Error in getTopFans:", error);
    throw error;
  }
}

function processEngagement(cast: any, fanEngagement: { [key: number]: Fan }) {
  let fid = cast.author.fid;
  if (!fanEngagement[fid]) {
    fanEngagement[fid] = {
      fid: fid,
      display_name: cast.author.display_name,
      score: 0,
      recasts: 0,
      reactions: 0,
    };
  }

  fanEngagement[fid].recasts += cast.reactions.recasts_count || 0;
  fanEngagement[fid].reactions += cast.reactions.likes_count || 0;
  fanEngagement[fid].score += calculateScore(cast.reactions.recasts_count || 0, cast.reactions.likes_count || 0);

  console.log(`Processed engagement for fid ${fid}:`, JSON.stringify(fanEngagement[fid], null, 2));
}

function calculateScore(recasts: number, reactions: number): number {
  return (recasts * 2 + reactions) || 0;
}


function getStartDate(timeframe: string): string {
  let date = new Date();
  switch (timeframe) {
    case 'day':
      date.setDate(date.getDate() - 1);
      break;
    case 'week':
      date.setDate(date.getDate() - 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
  }
  return date.toISOString();
}