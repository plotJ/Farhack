export interface Contributor {
    fid: number;
    username: string;
    // Add any other properties that the API returns
}

export async function fetchTopContributors(channel: string = 'farhack', limit: number = 10): Promise<Contributor[]> {
    try {
        const response = await fetch(
            `https://api.nanograph.xyz/farcaster/channel/${channel}/contributors?limit=${limit}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Contributor[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching top contributors:", error);
        throw error;
    }
}