import { useState, useEffect } from "react";
import { getLeaderboard } from "../api";
import Leaderboard from "../components/Leaderboard";

export default function ProjectorPage() {
  const [round, setRound] = useState("qualifier");
  const [data, setData] = useState({ leaderboard: [], latestRun: null });
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const result = await getLeaderboard(round);
        if (!cancelled) {
          setData(result);
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError("Connection lost, retrying…");
      }
    }

    refresh();                                // fetch immediately
    const timer = setInterval(refresh, 3000); // then every 3 seconds

    return () => {                            // cleanup when round changes or page closes
      cancelled = true;
      clearInterval(timer);
    };
  }, [round]);

  return (
    <div className="projector">
      <header>
        <h1>🏁 RaceDay Live</h1>
        <select value={round} onChange={(e) => setRound(e.target.value)}>
          <option value="qualifier">Qualifier</option>
          <option value="semi-final">Semi-final</option>
          <option value="final">Final</option>
        </select>
      </header>
      {error && <p className="error">{error}</p>}
      <Leaderboard rows={data.leaderboard} latestRun={data.latestRun} />
    </div>
  );
}