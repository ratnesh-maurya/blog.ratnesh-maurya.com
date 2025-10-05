// Utility functions to fetch coding profile data

export interface GitHubStats {
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  contributions: number;
  streak: number;
}

export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  acceptanceRate: number;
}

export interface CodeforcesStats {
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contestsParticipated: number;
}

// GitHub API
export async function fetchGitHubStats(username: string): Promise<GitHubStats | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    // Fetch repositories to calculate total stars
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      next: { revalidate: 3600 }
    });
    
    let totalStars = 0;
    if (reposResponse.ok) {
      const repos = await reposResponse.json();
      totalStars = repos.reduce((sum: number, repo: { stargazers_count?: number }) => sum + (repo.stargazers_count || 0), 0);
    }
    
    return {
      followers: data.followers || 0,
      following: data.following || 0,
      publicRepos: data.public_repos || 0,
      totalStars,
      contributions: 0, // This requires GitHub GraphQL API or scraping
      streak: 0, // This requires additional API or scraping
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return null;
  }
}

// LeetCode API (using public GraphQL endpoint)
export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  try {
    // LeetCode's public API endpoint
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              profile {
                ranking
              }
            }
          }
        `,
        variables: { username }
      }),
      next: { revalidate: 3600 }
    });

    if (!response.ok) return null;

    const data = await response.json();
    const stats = data?.data?.matchedUser;
    
    if (!stats) return null;

    interface Submission {
      difficulty: string;
      count: number;
    }

    const submissions: Submission[] = stats.submitStats.acSubmissionNum;
    const easy = submissions.find((s) => s.difficulty === 'Easy')?.count || 0;
    const medium = submissions.find((s) => s.difficulty === 'Medium')?.count || 0;
    const hard = submissions.find((s) => s.difficulty === 'Hard')?.count || 0;
    const total = submissions.find((s) => s.difficulty === 'All')?.count || 0;

    return {
      totalSolved: total,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      ranking: stats.profile?.ranking || 0,
      acceptanceRate: 0, // Requires additional calculation
    };
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return null;
  }
}

// Codeforces API
export async function fetchCodeforcesStats(handle: string): Promise<CodeforcesStats | null> {
  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) return null;

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.result || data.result.length === 0) {
      return null;
    }

    const user = data.result[0];

    return {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || 'Unrated',
      maxRank: user.maxRank || 'Unrated',
      contestsParticipated: 0, // Requires additional API call
    };
  } catch (error) {
    console.error('Error fetching Codeforces stats:', error);
    return null;
  }
}

// Fallback data in case APIs fail
export const fallbackGitHubStats: GitHubStats = {
  followers: 65,
  following: 50,
  publicRepos: 32,
  totalStars: 31,
  contributions: 500,
  streak: 30,
};

export const fallbackLeetCodeStats: LeetCodeStats = {
  totalSolved: 150,
  easySolved: 80,
  mediumSolved: 60,
  hardSolved: 10,
  ranking: 50000,
  acceptanceRate: 75,
};

export const fallbackCodeforcesStats: CodeforcesStats = {
  rating: 1200,
  maxRating: 1350,
  rank: 'Pupil',
  maxRank: 'Specialist',
  contestsParticipated: 25,
};

