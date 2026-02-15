
import OpenAI from "openai";

// Simple in-memory cache
const logoCache = new Map<string, string | null>();

const SPORTS_CONTEXTS = [
  "football", "soccer", "basketball", "nba", "nfl", "mlb", "nhl",
  "hockey", "baseball", "mma", "ufc", "premier league"
];

const SOCCER_COMPETITIONS = [
  "champions league",
  "premier league",
  "uefa",
  "la liga",
  "serie a",
  "bundesliga",
  "ligue 1",
  "world cup",
];

const MAJOR_LEAGUES = ["nba", "nfl", "mlb", "nhl"];

export class LogoService {
  async getLogoUrl(query: string, context?: string): Promise<string | null> {
    const cacheKey = `${query}|${context || ""}`.toLowerCase().trim();
    if (logoCache.has(cacheKey)) {
      return logoCache.get(cacheKey) || null;
    }

    const isSports = context && SPORTS_CONTEXTS.some(s => context.toLowerCase().includes(s));
    const preferWikipedia = this.shouldPreferWikipedia(context);
    const isMajorLeague = this.isMajorLeagueContext(context);
    const desiredLeague = this.resolveDesiredLeague(context);

    let logo: string | null = null;

    const shouldResolve =
      !logo &&
      (!!context ||
        query.length <= 4 ||
        query.toUpperCase() === query ||
        /vs|v\.?/i.test(query));

    if (shouldResolve && isMajorLeague) {
      const resolved = await this.resolveEntityName(query, context);
      if (resolved?.name) {
        if (!preferWikipedia) {
          logo = await this.fetchFromSportsDB(resolved.name, resolved.context || context);
        }
        if (!logo) {
          logo = await this.fetchFromWikipedia(resolved.name, resolved.context || context);
        }
      }
    }

    if (!logo && isSports && !preferWikipedia) {
      logo = await this.fetchFromSportsDB(query, context);
    }

    if (shouldResolve && !logo) {
      const resolved = await this.resolveEntityName(query, context);
      if (resolved?.name) {
        if (isSports && preferWikipedia && !logo) {
          logo = await this.fetchFromWikipedia(resolved.name, resolved.context || context);
        }
        if (isSports && !preferWikipedia && !logo) {
          logo = await this.fetchFromSportsDB(resolved.name, resolved.context || context);
        }
        if (!logo) {
          logo = await this.fetchFromWikipedia(resolved.name, resolved.context || context);
        }
      }
    }

    if (!logo && isSports && preferWikipedia) {
      logo = await this.fetchFromWikipedia(query, context);
    }

    if (!logo && isSports && !preferWikipedia) {
      logo = await this.fetchFromSportsDB(query, context);
    }

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

  private async fetchFromSportsDB(teamName: string, context?: string): Promise<string | null> {
    const cleanedName = this.cleanTeamName(teamName);
    const namesToTry = [teamName, cleanedName].filter((n, i, arr) => arr.indexOf(n) === i);
    const desiredSport = this.resolveDesiredSport(context);
    const desiredLeague = this.resolveDesiredLeague(context);

    for (const name of namesToTry) {
      console.log(`   Searching TheSportsDB: "${name}"`);

      try {
          const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(name)}`;
          const res = await fetch(url);
          const data = await res.json();

          const team = this.pickBestTeam(data?.teams, desiredSport, desiredLeague);
          if (team?.strBadge) {
            console.log(`   Found badge: ${team.strTeam}`);
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
          const expandedTeam = this.pickBestTeam(expandedData?.teams, desiredSport, desiredLeague);
          if (expandedTeam?.strBadge) {
            console.log(`   Found badge (expanded): ${expandedTeam.strTeam}`);
            return expandedTeam.strBadge;
          }
        } catch (error) {
          console.error(`TheSportsDB expansion error:`, error);
        }
      }

      console.log(`   No TheSportsDB result for "${teamName}"`);
      return null;
  }

  private resolveDesiredSport(context?: string): string | null {
    if (!context) return null;
    const ctx = context.toLowerCase();
    if (ctx.includes("nba") || ctx.includes("basketball")) return "Basketball";
    if (ctx.includes("nfl") || ctx.includes("american football")) return "American Football";
    if (ctx.includes("mlb") || ctx.includes("baseball")) return "Baseball";
    if (ctx.includes("nhl") || ctx.includes("hockey") || ctx.includes("ice hockey")) return "Ice Hockey";
    if (ctx.includes("soccer") || ctx.includes("football club") || ctx.includes("premier league") || ctx.includes("champions league")) {
      return "Soccer";
    }
    return null;
  }

  private resolveDesiredLeague(context?: string): string | null {
    if (!context) return null;
    const ctx = context.toLowerCase();
    if (ctx.includes("nba")) return "NBA";
    if (ctx.includes("nfl")) return "NFL";
    if (ctx.includes("mlb")) return "MLB";
    if (ctx.includes("nhl")) return "NHL";
    if (ctx.includes("premier league")) return "English Premier League";
    if (ctx.includes("champions league")) return "UEFA Champions League";
    return null;
  }

  private isMajorLeagueContext(context?: string): boolean {
    if (!context) return false;
    const ctx = context.toLowerCase();
    return MAJOR_LEAGUES.some((league) => ctx.includes(league));
  }

  private pickBestTeam(
    teams: any[] | undefined,
    desiredSport: string | null,
    desiredLeague: string | null
  ): any | null {
    if (!teams || teams.length === 0) return null;
    const leagueMatch = desiredLeague
      ? teams.find((team) => {
          const league = (team?.strLeague || team?.strLeague2 || "").toLowerCase();
          return league.includes(desiredLeague.toLowerCase());
        })
      : null;
    if (leagueMatch) return leagueMatch;

    if (!desiredSport) return teams[0];
    const sportMatch = teams.find((team) => team?.strSport === desiredSport);
    return sportMatch || teams[0];
  }

  private async fetchFromWikipedia(query: string, context?: string): Promise<string | null> {
    const searchQuery = context ? `${query} ${context}` : query;
    console.log(`   Searching Wikipedia: "${searchQuery}"`);

    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      const firstResult = searchData?.query?.search?.[0];
      if (!firstResult) {
        console.log(`   No Wikipedia result`);
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
        console.log(`   Found Wikipedia image: ${pageTitle}`);
      }
      return thumbnail;
    } catch (error) {
      console.error(`Wikipedia error for "${query}":`, error);
      return null;
    }
  }

  private async resolveEntityName(
    query: string,
    context?: string
  ): Promise<{ name: string; context?: string } | null> {
    if (!process.env.OPENAI_API_KEY) return null;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = [
      `Resolve this label to the most likely official entity name for logo lookup.`,
      `Label: "${query}"`,
      context ? `Context: "${context}"` : "",
      `If this is a sports team, return the official club/franchise name (city + nickname, e.g. "Dallas Mavericks", "Newcastle United F.C.", "Inter Milan").`,
      `If a competition is mentioned in context, prefer the team from that competition.`,
      `Do not return abbreviations or partial city names.`,
      `Return JSON: {"name": "...", "context": "..."}.`,
      `If unsure, return {"name": null}.`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You resolve sports and entertainment entity names for logo lookup." },
          { role: "user", content: prompt },
        ],
        temperature: 0,
        max_tokens: 120,
        response_format: { type: "json_object" },
      });

      const raw = response.choices[0]?.message?.content || "";
      const parsed = JSON.parse(raw) as { name?: string | null; context?: string | null };
      if (!parsed?.name) return null;

      const resolvedName = parsed.name.trim();
      const resolvedContext = parsed.context?.trim() || undefined;
      if (!resolvedName) return null;

      return { name: resolvedName, context: resolvedContext };
    } catch (error) {
      console.error("OpenAI resolve error:", error);
      return null;
    }
  }

  private shouldPreferWikipedia(context?: string): boolean {
    if (!context) return false;
    const ctx = context.toLowerCase();
    return SOCCER_COMPETITIONS.some((comp) => ctx.includes(comp));
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
