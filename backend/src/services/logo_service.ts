
// Simple in-memory cache
const logoCache = new Map<string, string | null>();

const SPORTS_CONTEXTS = [
  "football", "soccer", "basketball", "nba", "nfl", "mlb", "nhl",
  "hockey", "baseball", "mma", "ufc", "premier league"
];

export class LogoService {
  async getLogoUrl(query: string, context?: string): Promise<string | null> {
    const cacheKey = `${query}|${context || ""}`.toLowerCase().trim();
    if (logoCache.has(cacheKey)) {
      return logoCache.get(cacheKey) || null;
    }

    const isSports = context && SPORTS_CONTEXTS.some(s => context.toLowerCase().includes(s));

    let logo: string | null = null;

    if (isSports) {
      logo = await this.fetchFromSportsDB(query);
    }

    // wikipedia fallback
    if (!logo) {
      logo = await this.fetchFromWikipedia(query, context);
    }

    logoCache.set(cacheKey, logo);
    return logo;
  }

  private cleanTeamName(name: string): string {
    return name
      .replace(/^(SL|FC|AS|AC|SS|SC|CF|CD|CA|RC|RCD|SD|UD|US|AJ|OGC|VfB|VfL|TSG|RB|BSC|1\.|Sporting|Athletic|Atlético)\s+/i, "")
      .replace(/\s+(FC|SC|CF|AC|United|City)$/i, "")
      .trim();
  }

  private async fetchFromSportsDB(teamName: string): Promise<string | null> {
    const cleanedName = this.cleanTeamName(teamName);
    const namesToTry = [teamName, cleanedName].filter((n, i, arr) => arr.indexOf(n) === i);

    for (const name of namesToTry) {
      console.log(`   🏆 Searching TheSportsDB: "${name}"`);

      try {
          const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(name)}`;
          const res = await fetch(url);
          const data = await res.json();

          const team = data?.teams?.[0];
          if (team?.strBadge) {
            console.log(`   ✅ Found badge: ${team.strTeam}`);
            return team.strBadge;
          }
        } catch (error) {
          console.error(`TheSportsDB error for "${name}":`, error);
        }
      }

      const expansions: Record<string, string> = {
        "PSG": "Paris Saint-Germain",
        "MAN UTD": "Manchester United",
        "MAN CITY": "Manchester City",
        "REAL": "Real Madrid",
        "BARCA": "Barcelona",
        "BAY": "Bayern Munich",
        "JUV": "Juventus",
        "ARS": "Arsenal",
        "CHE": "Chelsea",
        "LIV": "Liverpool",
        "TOT": "Tottenham",
        "LAL": "Los Angeles Lakers",
        "GSW": "Golden State Warriors",
        "BOS": "Boston Celtics",
        "MIA": "Miami Heat",
        "BENFICA": "Benfica",
        "PORTO": "FC Porto",
        "SPORTING": "Sporting CP",
      };

      const expanded = expansions[teamName.toUpperCase()];
      if (expanded) {
        try {
          const expandedUrl = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(expanded)}`;
          const expandedRes = await fetch(expandedUrl);
          const expandedData = await expandedRes.json();
          const expandedTeam = expandedData?.teams?.[0];
          if (expandedTeam?.strBadge) {
            console.log(`   ✅ Found badge (expanded): ${expandedTeam.strTeam}`);
            return expandedTeam.strBadge;
          }
        } catch (error) {
          console.error(`TheSportsDB expansion error:`, error);
        }
      }

      console.log(`   ⚠️ No TheSportsDB result for "${teamName}"`);
      return null;
  }

  private async fetchFromWikipedia(query: string, context?: string): Promise<string | null> {
    const searchQuery = context ? `${query} ${context}` : query;
    console.log(`   📚 Searching Wikipedia: "${searchQuery}"`);

    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      const firstResult = searchData?.query?.search?.[0];
      if (!firstResult) {
        console.log(`   ⚠️ No Wikipedia result`);
        return null;
      }

      const pageTitle = firstResult.title;

      const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&pithumbsize=200&origin=*`;
      const imageRes = await fetch(imageUrl);
      const imageData = await imageRes.json();

      const pages = imageData?.query?.pages;
      const page = pages ? Object.values(pages)[0] as any : null;
      const thumbnail = page?.thumbnail?.source || null;

      if (thumbnail) {
        console.log(`   ✅ Found Wikipedia image: ${pageTitle}`);
      }
      return thumbnail;
    } catch (error) {
      console.error(`Wikipedia error for "${query}":`, error);
      return null;
    }
  }

  async getLogosForTeams(
    queries: Array<string | { name: string; context?: string }>,
    defaultContext?: string
  ): Promise<Record<string, string | null>> {
    const results: Record<string, string | null> = {};

    for (const item of queries) {
      const name = typeof item === 'string' ? item : item.name;
      const context = typeof item === 'string' ? defaultContext : (item.context || defaultContext);
      results[name] = await this.getLogoUrl(name, context);
    }

    return results;
  }
}

export const logoService = new LogoService();
