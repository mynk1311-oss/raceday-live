import { deleteRun } from "../api";

export default function RunList({ runs, onChanged }) {
  async function handleDelete(run) {
    const ok = window.confirm(
      `Delete this ${run.round} run for ${run.teamName}? This cannot be undone.`
    );
    if (!ok) return;

    try {
      await deleteRun(run.id);
      onChanged();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="card wide">
      <h2>Recent Runs</h2>
      {runs.length === 0 ? (
        <p>No runs recorded yet.</p>
      ) : (
        <table className="runs">
          <thead>
            <tr>
              <th>Team</th>
              <th>Round</th>
              <th>Track</th>
              <th>Penalty</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {runs.slice(0, 10).map((run) => (
              <tr key={run.id}>
                <td>{run.teamName}</td>
                <td>{run.round}</td>
                <td>{run.dnf ? "DNF" : `${run.trackTime}s`}</td>
                <td>{run.penaltyTime}s</td>
                <td>{run.dnf ? "DNF" : `${run.totalTime}s`}</td>
                <td>
                  <button onClick={() => handleDelete(run)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}