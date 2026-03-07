import { NextResponse } from 'next/server';

export async function GET() {
  const tryFetch = async (url: string, timeout: number) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const resp = await fetch(url, { signal: controller.signal, next: { revalidate: 3600 } });
      clearTimeout(id);
      return resp;
    } catch (e) {
      clearTimeout(id);
      throw e;
    }
  };

  try {
    let response;
    try {
      // Try main API
      response = await tryFetch('https://kontests.net/api/v1/all', 12000);
    } catch (err) {
      console.warn("[KONTESTS] Main API failed, trying www mirror...");
      // Try www version as fallback mirror if main is slow/down
      response = await tryFetch('https://www.kontests.net/api/v1/all', 10000);
    }

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format from Kontests");
    }

    // Map and sanitize data
    const filtered = data
      .filter((c: any) => c.status === 'BEFORE' || c.status === 'CODING')
      .map((c: any) => ({
        name: c.name,
        url: c.url,
        site: c.site || 'Other',
        start_time: c.start_time,
        end_time: c.end_time,
        status: c.status
      }))
      .slice(0, 15);

    console.log(`[KONTESTS] ✅ Successfully fetched ${filtered.length} contests`);
    return NextResponse.json(filtered);
  } catch (error: any) {
    console.warn("[KONTESTS FALLBACK]: API failed, using mock data.", error.message);
    
    // Static fallback data so the UI isn't empty if the API is flaky
    const fallback = [
      { name: "LeetCode Weekly Contest 439", site: "LeetCode", start_time: new Date(Date.now() + 86400000).toISOString(), url: "https://leetcode.com/contest" },
      { name: "Codeforces Round 1002 (Div. 2)", site: "Codeforces", start_time: new Date(Date.now() + 172800000).toISOString(), url: "https://codeforces.com/contests" },
      { name: "CodeChef Starters 175", site: "CodeChef", start_time: new Date(Date.now() + 259200000).toISOString(), url: "https://www.codechef.com/contests" },
      { name: "Global Round 30", site: "Codeforces", start_time: new Date(Date.now() + 345600000).toISOString(), url: "https://codeforces.com/contests" },
      { name: "HackerRank Month-End Challenge", site: "HackerRank", start_time: new Date(Date.now() + 432000000).toISOString(), url: "https://hackerrank.com/contests" }
    ];
    
    return NextResponse.json(fallback);
  }
}
