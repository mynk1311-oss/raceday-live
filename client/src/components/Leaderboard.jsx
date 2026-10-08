export default function Leaderboard({ rows, latestRun }) {
  if (rows.length === 0) {
    return <p className="empty">No runs yet for this round.</p>;
  }

  return (
    <div className="board">
      {rows.map((row) => {
        const isLatest = latestRun && latestRun.teamId === row.teamId;
        return (
          <div
            key={`${row.teamId}-${isLatest ? latestRun.id : ""}`}
            className={`row${isLatest ? " highlight" : ""}`}
          >
            <div className="rank">{row.dnf ? "—" : row.rank}</div>
            <div className="bar">
              <div className="names">
                <span className="team">{row.teamName}</span>
                <span className="robot">{row.robotName}</span>
              </div>
              <div className="time">
                {row.dnf ? "DNF" : `${row.bestTime.toFixed(2)} s`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}