import { useEffect, useState } from "react";

interface DayData {
  date: string;
  count: number;
  level: number;
}

const COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ContributionGraph({ username = "zxvchaos", year = 2025 }) {
  const [data, setData] = useState<DayData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.contributions || []);
        setTotal(json.total?.[String(year)] || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username, year]);

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-gray-500">
        Loading contributions...
      </div>
    );
  }

  // Group by weeks
  const weeks: DayData[][] = [];
  let currentWeek: DayData[] = [];

  // Pad start to align with day of week
  if (data.length > 0) {
    const firstDay = new Date(data[0].date).getDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: "", count: 0, level: -1 });
    }
  }

  for (const day of data) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  // Calculate month label positions
  const monthPositions: { month: string; col: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    for (const day of weeks[w]) {
      if (day.date) {
        const m = new Date(day.date).getMonth();
        if (m !== lastMonth) {
          monthPositions.push({ month: MONTHS[m], col: w });
          lastMonth = m;
        }
        break;
      }
    }
  }

  const cellSize = 11;
  const cellGap = 3;
  const step = cellSize + cellGap;
  const svgWidth = weeks.length * step + 30;
  const svgHeight = 7 * step + 30;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs text-gray-400">
          <strong className="text-white">{total.toLocaleString()}</strong> contributions in {year}
        </span>
        <span className="text-xs text-gray-500">github.com/{username}</span>
      </div>
      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="mx-auto">
          {/* Month labels */}
          {monthPositions.map(({ month, col }) => (
            <text
              key={month}
              x={col * step + 30}
              y={10}
              fill="#8b949e"
              fontSize={10}
              fontFamily="Inter, sans-serif"
            >
              {month}
            </text>
          ))}

          {/* Day labels */}
          {["Mon", "", "Wed", "", "Fri", "", ""].map((label, i) => (
            label && (
              <text
                key={i}
                x={0}
                y={20 + i * step + cellSize - 1}
                fill="#8b949e"
                fontSize={9}
                fontFamily="Inter, sans-serif"
              >
                {label}
              </text>
            )
          ))}

          {/* Cells */}
          {weeks.map((week, w) =>
            week.map((day, d) => {
              if (day.level === -1) return null;
              return (
                <rect
                  key={`${w}-${d}`}
                  x={w * step + 30}
                  y={d * step + 16}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  fill={COLORS[day.level] || COLORS[0]}
                >
                  <title>{day.date}: {day.count} contributions</title>
                </rect>
              );
            })
          )}

          {/* Legend */}
          <text x={svgWidth - 120} y={svgHeight - 4} fill="#8b949e" fontSize={9} fontFamily="Inter, sans-serif">
            Less
          </text>
          {COLORS.map((c, i) => (
            <rect
              key={i}
              x={svgWidth - 85 + i * (cellSize + 2)}
              y={svgHeight - 14}
              width={cellSize}
              height={cellSize}
              rx={2}
              fill={c}
            />
          ))}
          <text x={svgWidth - 15} y={svgHeight - 4} fill="#8b949e" fontSize={9} fontFamily="Inter, sans-serif">
            More
          </text>
        </svg>
      </div>
    </div>
  );
}
