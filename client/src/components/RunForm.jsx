import { useState } from "react";
import { createRun } from "../api";

export default function RunForm({ teams }) {
  const [teamId, setTeamId] = useState("");
  const [round, setRound] = useState("qualifier");
  const [trackTime, setTrackTime] = useState("");
  const [penaltyTime, setPenaltyTime] = useState("0");
  const [dnf, setDnf] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createRun({ teamId, round, trackTime, penaltyTime, dnf });
      setMessage("✅ Run recorded");
      setTrackTime("");
      setPenaltyTime("0");
      setDnf(false);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Record Run</h2>

      <select value={teamId} onChange={(e) => setTeamId(e.target.value)} required>
        <option value="">Select team…</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            #{t.id} {t.teamName} ({t.robotName})
          </option>
        ))}
      </select>

      <select value={round} onChange={(e) => setRound(e.target.value)}>
        <option value="qualifier">Qualifier</option>
        <option value="semi-final">Semi-final</option>
        <option value="final">Final</option>
      </select>

      <input
        type="number"
        step="0.01"
        placeholder="Track time (s)"
        value={trackTime}
        onChange={(e) => setTrackTime(e.target.value)}
        disabled={dnf}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Penalty time (s)"
        value={penaltyTime}
        onChange={(e) => setPenaltyTime(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={dnf}
          onChange={(e) => setDnf(e.target.checked)}
        />{" "}
        DNF (Did Not Finish)
      </label>

      <button type="submit">Submit Run</button>
      {message && <p>{message}</p>}
    </form>
  );
}