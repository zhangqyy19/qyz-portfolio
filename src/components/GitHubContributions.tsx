import React, { useEffect, useState } from 'react';
import '../styles/GitHubContributions.scss';

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

const GitHubContributions: React.FC<{ username: string }> = ({ username }) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate simulated contribution data for the past 365 days
    // In production, you'd use the GitHub GraphQL API
    const generateContributions = () => {
      const days: ContributionDay[] = [];
      const now = new Date();
      let total = 0;

      for (let i = 364; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Simulate realistic contribution patterns
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const baseChance = isWeekend ? 0.3 : 0.7;
        const hasContribution = Math.random() < baseChance;

        let count = 0;
        if (hasContribution) {
          count = Math.floor(Math.random() * 8) + 1;
        }

        const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;
        total += count;

        days.push({
          date: date.toISOString().split('T')[0],
          count,
          level
        });
      }

      setContributions(days);
      setTotalContributions(total);
      setLoading(false);
    };

    generateContributions();
  }, [username]);

  if (loading) {
    return <div className="github-contributions loading">Loading contributions...</div>;
  }

  // Group by weeks (columns)
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  return (
    <div className="github-contributions">
      <div className="contributions-header">
        <h3>
          <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
            @{username}
          </a>
          {' '}on GitHub
        </h3>
        <span className="total">{totalContributions} contributions in the last year</span>
      </div>
      <div className="contributions-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="week">
            {week.map((day, di) => (
              <div
                key={di}
                className={`day level-${day.level}`}
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="contributions-legend">
        <span>Less</span>
        <div className="day level-0" />
        <div className="day level-1" />
        <div className="day level-2" />
        <div className="day level-3" />
        <div className="day level-4" />
        <span>More</span>
      </div>
    </div>
  );
};

export default GitHubContributions;