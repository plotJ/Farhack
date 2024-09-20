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
    let queryParams: any = {
      feed_type: "filter",
      filter_type: channel ? "channel_id" : "global_trending", // Changed from 'all' to 'global_trending'
      limit: 100,
    };

    if (channel) {
      queryParams.channel_id = channel;
    }

    queryParams.start_time = getStartDate(timeframe);

    let res = await Lum0x.farcasterFeed.getFeed(queryParams);

    console.log("Lum0x API response:", res);

    if (!res.casts || res.casts.length === 0) {
      return [];
    }

    let fanEngagement: { [key: number]: Fan } = {};

    for (let cast of res.casts) {
      processEngagement(cast, fanEngagement);
    }

    let sortedFans = Object.values(fanEngagement).sort((a, b) => b.score - a.score);
    return sortedFans.slice(0, limit);
  } catch (error) {
    console.error("Error in getTopFans:", error);
    throw error;
  }
}

export async function getDetailedUserData(fid: number, timeframe: string) {
  try {
      const res = await Lum0x.farcasterUser.getUserByFids({ fids: fid.toString() });
      const user = res.users[0];

      const feedRes = await Lum0x.farcasterFeed.getFeed({
          feed_type: "filter",
          filter_type: "fids",
          fids: fid.toString(),
          limit: 100,
          start_time: getStartDate(timeframe)
      });

      let totalLikes = 0;
      let totalRecasts = 0;
      feedRes.casts.forEach(cast => {
          totalLikes += cast.reactions?.likes?.length || 0;
          totalRecasts += cast.reactions?.recasts?.length || 0;
      });

      return {
          fid: user.fid,
          username: user.username,
          display_name: user.display_name,
          casts: feedRes.casts.length,
          likes: totalLikes,
          recasts: totalRecasts,
          score: totalLikes + (totalRecasts * 2)
      };
  } catch (error) {
      console.error("Error fetching detailed user data:", error);
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
