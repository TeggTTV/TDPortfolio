import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

import { PrismaClient } from '@prisma/client';
// import { CookieValueTypes, getCookie } from 'cookies-next';
const prisma = new PrismaClient();

export function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const isLocal = process.env.NEXT_PUBLIC_VERCEL_ENV === 'local';
export const domain = isLocal ? 'localhost:3000' : 'td-blog-five.vercel.app';
export const protocol = isLocal ? 'http://' : 'https://';

export type UiRoutes = '/admin' | '/dashboard' | '/login' | '/register';
export type ApiRoute = '/api/register';

export const getFullUrl = (
	route: UiRoutes | ApiRoute,
	query?: string
): string => `${protocol}${domain}${route}${query ? `?${query}` : ''}`;

export function convertToSlug(text: string) {
	return text
		.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^a-zA-Z0-9-]/g, '');
}

export function getIcon(injury: any) {
	switch (injury) {
		case 'Out':
			return '🔴';
		case 'Questionable':
			return '🟡';
		case 'Probable':
			return '🟢';
		default:
			return '🔵';
	}
}

export async function getTeamInfo(teamId: string) {
	// http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/{teamId}
	const res = await fetch(
		`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}`
	);
	const data = await res.json();
	return data;
}

export function getGame(gameId: string) {
	// http://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=:gameId
	const res = fetch(
		`https://cdn.espn.com/core/nfl/game?xhr=1&gameId=${gameId}`
	).then((res) => res.json());

	return res;
}

interface TeamDataItem {
	name: string;
	value: number;
}

export function calculatePointSpread(
	teamAData: TeamDataItem[],
	teamBData: TeamDataItem[],
	homeFieldAdvantage: number = 3
): number {
	// Helper function to find a specific stat by name
	const getStatValue = (data: TeamDataItem[], statName: string): number => {
		const stat = data.find((item) => item.name === statName);
		return stat ? stat.value : 0;
	};

	// Extract necessary stats for Team A
	const teamA_avgPointsFor = getStatValue(teamAData, 'avgPointsFor');
	const teamA_avgPointsAgainst = getStatValue(teamAData, 'avgPointsAgainst');

	// Extract necessary stats for Team B
	const teamB_avgPointsFor = getStatValue(teamBData, 'avgPointsFor');
	const teamB_avgPointsAgainst = getStatValue(teamBData, 'avgPointsAgainst');

	// Calculate baseline scores for both teams
	const teamABaseline =
		teamA_avgPointsFor - teamB_avgPointsAgainst + homeFieldAdvantage;
	const teamBBaseline = teamB_avgPointsFor - teamA_avgPointsAgainst;

	// Calculate the point spread
	const pointSpread = teamABaseline - teamBBaseline;

	return Math.round(pointSpread * 2) / 2;
}

export async function getGamesThisYear(
	maxGames: number = 1000,
	year: number = new Date().getFullYear()
) {
	const matchesThisYear =
		'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=' +
		maxGames +
		'&dates=' +
		year;

	const res = await fetch(matchesThisYear)
		.then((res) => res.json())
		.then((data) => {
			data.events.forEach((event: any) => {
				event.competitions[0].venue = null;
				event.competitions[0].type = null;
				event.competitions[0].status = null;
				event.competitions[0].broadcasts = null;
				event.competitions[0].format = null;
				event.competitions[0].leaders = null;
				event.competitions[0].geoBroadcasts = null;
				event.competitions[0].highlights = null;
				event.competitions[0].headlines = null;

				event.links = null;
				event.weather = null;
				event.week = null;
				event.season = null;
			});

			return data;
		});
	return res;
}

export async function getInjuries(teamId: string, getAll: boolean = false) {
	// sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams/{teamId}/injuries
	const injuries: any = [];

	async function getPage(page: number) {
		const itemsPerPage = 25;

		const res = await fetch(
			`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams/${teamId}/injuries?page=${page}`
		);
		const data = await res.json();
		return data;
	}

	if (!getAll) {
		const pageData = await getPage(1);
		return pageData;
	}

	const res = await fetch(
		`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams/${teamId}/injuries`
	);
	const data = await res.json();
	let count = data.pageCount;

	for (let i = 0; i < count; i++) {
		const pageData = await getPage(i);

		injuries.push(...pageData.items);
	}

	return injuries;
}

export async function loadInjuryData(arr: { $ref: string }[], max: number = 5) {
	let dataList: any = [];

	for (let i = 0; i < max; i++) {
		if (arr[i] === undefined) continue;
		await fetch(arr[i].$ref)
			.then((res) => res.json())
			.then(async (data) => {
				const athlete = await fetch(data.athlete.$ref).then((res) =>
					res.json()
				);
				data.player = athlete.displayName;
				if (data.details) {
					data.injury = data.details.detail;
					if (data.injury.status === 'active') {
						data.injury = null;
					}
				}

				if (data.injury) {
					dataList.push(data);
				}
			});
	}

	return dataList;
}

export async function calculatePlayerScore(stats: any): Promise<number> {
	// Calculate weighted sum
	let totalScore = 0;
	Object.entries(stats).forEach(([key, value]) => {
		if (key === 'GP') {
			totalScore = value as number;
		}
	});
	return Math.max(0, totalScore);
}

export async function getRoster(teamId: string) {
	const res = await fetch(
		`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}/roster`
	);
	const data = await res.json();
	return data;
}

export async function getTeam(teamId: string) {
	// sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/{YEAR}/teams/{TEAM_ID}/athletes?limit=200
	const res = await fetch(
		`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2024/teams/${teamId}/athletes?limit=200`
	);
	const data = await res.json().then(async (res) => {
		const athletes: any = [];
		const injuries: any = [];
		await Promise.all(
			res.items.map(async (item: any) => {
				const athleteData = await getURL(item.$ref);
				// athleteData.links = null;
				athleteData.college = null;
				athleteData.draft = null;

				if (athleteData.injuries.length > 0) {
					injuries.push({
						athlete: athleteData,
						injuries: athleteData.injuries,
					});
				}

				athletes.push(athleteData);
			})
		);

		return {
			athletes,
			injuries,
		};
	});

	return data;
}

export async function getURL(url: string) {
	return await fetch(url).then((res) => res.json());
}

export async function getPlacements(
	athletes: {}[]
): Promise<{ athlete: any; placement: number }[]> {
	const placements: { athlete: any; placement: number }[] = [];
	const athleteStats: any = [];

	await Promise.all(
		athletes.map(async (athlete: any) => {
			const info = await getAthleteInfo(athlete.id);
			if (info.statistics) {
				const stat = await getURL(info.statistics.$ref);
				athleteStats.push(stat.splits.categories);
			}
		})
	);

	if (athleteStats.length === 0) return [];
	const general = athleteStats[0][0];

	// get important data from the general stats

	const data: { [key: string]: any } = {};

	general.stats.forEach((stat: any) => {
		data[stat.abbreviation] = stat.value;
	});

	athletes.forEach(async (athlete, index) => {
		const score = await calculatePlayerScore(data);
		placements.push({ athlete, placement: score });
	});

	return placements;
}

export async function getAthleteInfo(athleteId: string) {
	const res = await fetch(
		// sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2024/athletes/4046707/eventlogsports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2024/athletes/4046707/eventlog
		`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2024/athletes/${athleteId}`
	);
	const data = await res.json();
	return data;
}

export async function getAthleteStats(athleteId: string) {
	// https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/14876/stats
	const res = await fetch(
		`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${athleteId}/stats`
	);
	const data = await res.json();

	return data;
}

export async function translate(text: string, lang: string) {
	const res = await fetch(
		`https://api.mymemory.translated.net/get?q=${text}&langpair=en|${lang}`
	);
	const data = await res.json();
	return data;
}

export async function getStats(athletes: any) {
	const stats: { [key: string]: any } = {};

	await Promise.all(
		athletes.map(async (athlete: any) => {
			// const info = await getAthleteStats(athlete.id);
			if (athlete.statistics) {
				const statRef = await getURL(athlete.statistics.$ref).then(
					(res) => {
						res.athlete = null;
						res.season = null;
						res.seasonType = null;
						res.id = athlete.id;

						let first = res.splits.categories[0];
						res.splits.categories = [first];

						res.$ref = null;
						return res;
					}
				);
				stats[athlete.displayName] = statRef;
			}
		})
	);

	return stats;
}

export type Game = {
	date: string;
	game: string;
	shortName: string;
	competitions: {
		date: string;
		competitors: {
			homeAway: string;
			id: string;
			winner: boolean;
			score: number
		};
	}[];
	score: {
		home: { name: string; score: number };
		away: { name: string; score: number };
	};
};

export async function getTeamGames(teamId: string, year: number = 2024) {
	const res = await fetch(
		`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/teams/${teamId}/events`
	);
	const data = await res.json();

	// const games = await data.items.map(async (item: any) => {
	// 	return await getURL(item.$ref);
	// });

	const games: Game[] = [];

	for (let i = 0; i < data.items.length; i++) {
		const game = await getURL(data.items[i].$ref);

		const team1Name = await getURL(
			game.competitions[0].competitors[0].team.$ref
		).then((data) => data.displayName);

		const team2Name = await getURL(
			game.competitions[0].competitors[1].team.$ref
		).then((data) => data.displayName);

		const team1Score = await getURL(
			game.competitions[0].competitors[0].score.$ref
		);

		const team2Score = await getURL(
			game.competitions[0].competitors[1].score.$ref
		);

		if (game.competitions[0].competitors[0].homeAway === 'home') {
			// team1 is home

			games.push({
				date: game.date,
				game: game.id,
				shortName: `${team1Name} at ${team2Name}`,
				competitions: game.competitions,
				score: {
					home: {
						name: team1Name,
						score: team1Score,
					},
					away: {
						name: team2Name,
						score: team2Score,
					},
				},
			});
		} else {
			// team2 is home
			games.push({
				date: game.date,
				game: game.id,
				shortName: `${team2Name} at ${team1Name}`,
				competitions: game.competitions,
				score: {
					home: {
						name: team2Name,
						score: team2Score,
					},
					away: {
						name: team1Name,
						score: team1Score,
					},
				},
			});
		}
	}

	return games;
}
export async function getHeadToHead(
	team1: string,
	team2: string,
	gamesThisYear: any[] = [],
	years: number[] = []
) {
	const allGames = [];
	if (gamesThisYear.length === 0) {
		if (years.length === 0) {
			years = [2024, 2023];
		}
		for (let i = 0; i < years.length; i++) {
			const games = await getTeamGames(team1, years[i]);
			allGames.push(...games);
		}
	}

	const team1Games = allGames.filter(
		(game: any) =>
			game.competitions[0].competitors[0].id === team1 ||
			game.competitions[0].competitors[1].id === team1
	);

	const team2Games = team1Games.filter(
		(game: any) =>
			game.competitions[0].competitors[0].team.id === team2 ||
			game.competitions[0].competitors[1].team.id === team2
	);

	return team2Games;
}
