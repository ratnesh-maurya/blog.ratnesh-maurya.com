'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GitHubStats, LeetCodeStats, CodeforcesStats, fallbackGitHubStats, fallbackLeetCodeStats, fallbackCodeforcesStats } from '@/lib/codingProfiles';

export function AboutPageClient() {
  const [githubStats, setGithubStats] = useState<GitHubStats>(fallbackGitHubStats);
  const [leetcodeStats] = useState<LeetCodeStats>(fallbackLeetCodeStats);
  const [codeforcesStats, setCodeforcesStats] = useState<CodeforcesStats>(fallbackCodeforcesStats);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'github' | 'leetcode' | 'codeforces'>('github');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch GitHub stats
        const githubRes = await fetch('https://api.github.com/users/ratnesh-maurya');
        if (githubRes.ok) {
          const data = await githubRes.json();
          const reposRes = await fetch('https://api.github.com/users/ratnesh-maurya/repos?per_page=100');
          let totalStars = 0;
          if (reposRes.ok) {
            const repos = await reposRes.json();
            totalStars = repos.reduce((sum: number, repo: { stargazers_count?: number }) => sum + (repo.stargazers_count || 0), 0);
          }
          setGithubStats({
            followers: data.followers || 0,
            following: data.following || 0,
            publicRepos: data.public_repos || 0,
            totalStars,
            contributions: 0,
            streak: 0,
          });
        }

        // Fetch Codeforces stats
        const codeforcesRes = await fetch('https://codeforces.com/api/user.info?handles=ratnesh_');
        if (codeforcesRes.ok) {
          const data = await codeforcesRes.json();
          if (data.status === 'OK' && data.result && data.result.length > 0) {
            const user = data.result[0];
            setCodeforcesStats({
              rating: user.rating || 0,
              maxRating: user.maxRating || 0,
              rank: user.rank || 'Unrated',
              maxRank: user.maxRank || 'Unrated',
              contestsParticipated: 0,
            });
          }
        }

        // Note: LeetCode API requires GraphQL and may have CORS issues
        // Using fallback data for now
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse opacity-20"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl ring-4 ring-blue-200">
              <Image
                src="https://avatars.githubusercontent.com/u/85143283?v=4"
                alt="Ratnesh Maurya - Backend Engineer"
                width={160}
                height={160}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text-primary mb-4">
            Ratnesh Maurya
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-2xl">🇮🇳</span>
            <p className="text-xl sm:text-2xl font-semibold text-gray-800">
              Backend Engineer
            </p>
            <span className="text-2xl">💻</span>
          </div>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Building scalable backend systems with <span className="font-semibold text-blue-600">Golang</span> and{' '}
            <span className="font-semibold text-purple-600">Elixir</span>.
            Passionate about system design, databases, and sharing knowledge through code.
          </p>
        </div>

        {/* Coding Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* GitHub Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">GitHub</h3>
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <StatItem label="Repositories" value={githubStats.publicRepos} />
                <StatItem label="Total Stars" value={githubStats.totalStars} icon="⭐" />
                <StatItem label="Followers" value={githubStats.followers} icon="👥" />
              </div>
            )}
            <a
              href="https://github.com/ratnesh-maurya"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Profile →
            </a>
          </div>

          {/* LeetCode Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">LeetCode</h3>
              <span className="text-2xl">🧩</span>
            </div>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <StatItem label="Total Solved" value={leetcodeStats.totalSolved} icon="✅" />
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Easy: {leetcodeStats.easySolved}</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Med: {leetcodeStats.mediumSolved}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded">Hard: {leetcodeStats.hardSolved}</span>
                </div>
                {leetcodeStats.ranking > 0 && (
                  <StatItem label="Ranking" value={`#${leetcodeStats.ranking.toLocaleString()}`} icon="🏆" />
                )}
              </div>
            )}
            <a
              href="https://leetcode.com/u/ratnesh_maurya/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Profile →
            </a>
          </div>

          {/* Codeforces Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Codeforces</h3>
              <span className="text-2xl">⚔️</span>
            </div>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <StatItem label="Rating" value={codeforcesStats.rating} icon="📊" />
                <StatItem label="Max Rating" value={codeforcesStats.maxRating} icon="🎯" />
                <StatItem label="Rank" value={codeforcesStats.rank} />
              </div>
            )}
            <a
              href="https://codeforces.com/profile/ratnesh_"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Profile →
            </a>
          </div>
        </div>

        {/* Let's Connect Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Let&apos;s Connect</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            I&apos;m always open to interesting conversations, collaborations, and opportunities.
            Feel free to reach out through any of these platforms!
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <SocialLink
              href="https://github.com/ratnesh-maurya"
              icon={<GitHubIcon />}
              label="GitHub"
              username="@ratnesh-maurya"
              color="hover:bg-gray-100 hover:border-gray-400"
            />
            <SocialLink
              href="https://linkedin.com/in/ratnesh-maurya"
              icon={<LinkedInIcon />}
              label="LinkedIn"
              username="ratnesh-maurya"
              color="hover:bg-blue-50 hover:border-blue-400"
            />
            <SocialLink
              href="https://twitter.com/ratnesh_maurya_"
              icon={<TwitterIcon />}
              label="Twitter"
              username="@ratnesh_maurya"
              color="hover:bg-sky-50 hover:border-sky-400"
            />
            <SocialLink
              href="mailto:ratneshmaurya2311@gmail.com"
              icon={<EmailIcon />}
              label="Email"
              username="Say Hello"
              color="hover:bg-purple-50 hover:border-purple-400"
            />
          </div>
        </div>

        {/* Combined Activity Graph */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Coding Activity</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Track my coding journey across different platforms
          </p>

          {/* Platform Selector */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <PlatformTab
              icon="🐙"
              label="GitHub"
              active={activeTab === 'github'}
              onClick={() => setActiveTab('github')}
            />
            <PlatformTab
              icon="🧩"
              label="LeetCode"
              active={activeTab === 'leetcode'}
              onClick={() => setActiveTab('leetcode')}
            />
            <PlatformTab
              icon="⚔️"
              label="Codeforces"
              active={activeTab === 'codeforces'}
              onClick={() => setActiveTab('codeforces')}
            />
          </div>

          {/* GitHub Contribution Graph */}
          {activeTab === 'github' && (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">GitHub Contributions</h3>
                <span className="text-sm text-gray-500">Last 12 months</span>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <Image
                  src="https://ghchart.rshah.org/2563eb/ratnesh-maurya"
                  alt="GitHub Contribution Chart"
                  width={800}
                  height={150}
                  className="w-full"
                  unoptimized
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
                  </div>
                  <span className="text-gray-600">More</span>
                </div>
                <a
                  href="https://github.com/ratnesh-maurya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          )}

          {/* LeetCode Activity */}
          {activeTab === 'leetcode' && (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">LeetCode Activity</h3>
                <span className="text-sm text-gray-500">Last 12 months</span>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                <Image
                  src={`https://leetcard.jacoblin.cool/ratnesh_maurya?theme=light&font=Ubuntu&ext=activity`}
                  alt="LeetCode Stats"
                  width={800}
                  height={200}
                  className="w-full"
                  unoptimized
                />
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{leetcodeStats.easySolved}</div>
                    <div className="text-sm text-gray-600 mt-1">Easy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{leetcodeStats.mediumSolved}</div>
                    <div className="text-sm text-gray-600 mt-1">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{leetcodeStats.hardSolved}</div>
                    <div className="text-sm text-gray-600 mt-1">Hard</div>
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        Total Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {leetcodeStats.totalSolved} solved
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${Math.min((leetcodeStats.totalSolved / 500) * 100, 100)}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                    <div className="w-3 h-3 bg-yellow-200 rounded-sm"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                    <div className="w-3 h-3 bg-yellow-600 rounded-sm"></div>
                    <div className="w-3 h-3 bg-yellow-800 rounded-sm"></div>
                  </div>
                  <span className="text-gray-600">More</span>
                </div>
                <a
                  href="https://leetcode.com/u/ratnesh_maurya/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View on LeetCode →
                </a>
              </div>
            </div>
          )}

          {/* Codeforces Activity */}
          {activeTab === 'codeforces' && (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Codeforces Rating History</h3>
                <span className="text-sm text-gray-500">Contest performance</span>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                <Image
                  src="https://codeforces-readme-stats.vercel.app/api/card?username=ratnesh_"
                  alt="Codeforces Stats"
                  width={800}
                  height={300}
                  className="w-full"
                  unoptimized
                />
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">{codeforcesStats.rating}</div>
                    <div className="text-sm text-gray-600 mt-1">Current Rating</div>
                    <div className="text-xs text-gray-500 mt-1">{codeforcesStats.rank}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">{codeforcesStats.maxRating}</div>
                    <div className="text-sm text-gray-600 mt-1">Max Rating</div>
                    <div className="text-xs text-gray-500 mt-1">{codeforcesStats.maxRank}</div>
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-purple-600">
                        Rating Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-purple-600">
                        {Math.round((codeforcesStats.rating / 3000) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${Math.min((codeforcesStats.rating / 3000) * 100, 100)}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Rating Scale</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-sm" title="Newbie"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-sm" title="Pupil"></div>
                    <div className="w-3 h-3 bg-cyan-500 rounded-sm" title="Specialist"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-sm" title="Expert"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-sm" title="Master"></div>
                    <div className="w-3 h-3 bg-orange-500 rounded-sm" title="Grandmaster"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-sm" title="Legendary"></div>
                  </div>
                </div>
                <a
                  href="https://codeforces.com/profile/ratnesh_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View on Codeforces →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface StatItemProps {
  label: string;
  value: string | number;
  icon?: string;
}

function StatItem({ label, value, icon }: StatItemProps) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">
        {icon && <span className="mr-1">{icon}</span>}
        {value}
      </span>
    </div>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  username: string;
  color: string;
}

function SocialLink({ href, icon, label, username, color }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 transition-all duration-200 ${color} group`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
      <p className="text-xs text-gray-500 group-hover:text-gray-700">{username}</p>
    </a>
  );
}

interface PlatformTabProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

function PlatformTab({ icon, label, active, onClick }: PlatformTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${active
        ? 'bg-blue-600 text-white shadow-lg'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Social Icons
function GitHubIcon() {
  return (
    <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-8 h-8 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

