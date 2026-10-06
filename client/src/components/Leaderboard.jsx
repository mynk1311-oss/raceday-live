export default function Leaderboard({ rows, latestRun }) {
  if (rows.length === 0) {
    return <p className="empty">No runs yet for this round.</p>;
  }

  return (
    <table className="board">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team</th>
          <th>Robot</th>
          <th>Best Time</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const isLatest = latestRun && latestRun.teamId === row.teamId;
          return (
            <tr
              key={`${row.teamId}-${isLatest ? latestRun.id : ""}`}
              className={isLatest ? "highlight" : ""}
            >
              <td>{row.dnf ? "—" : row.rank}</td>
              <td>{row.teamName}</td>
              <td>{row.robotName}</td>
              <td>{row.dnf ? "DNF" : `${row.bestTime.toFixed(2)} s`}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}