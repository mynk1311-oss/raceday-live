import { useState } from "react";
import { createTeam } from "../api";

export default function TeamForm({ onCreated }) {
  const [teamName, setTeamName] = useState("");
  const [robotName, setRobotName] = useState("");
  const [membersText, setMembersText] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // One member per line: "Name, email"
    const members = membersText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, email = ""] = line.split(",").map((s) => s.trim());
        return { name, email };
      });

    try {
      const team = await createTeam({ teamName, robotName, members });
      setMessage(`✅ Registered "${team.teamName}" (ID ${team.id})`);
      setTeamName("");
      setRobotName("");
      setMembersText("");
      onCreated();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Register Team</h2>
      <input
        placeholder="Team name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <input
        placeholder="Robot name"
        value={robotName}
        onChange={(e) => setRobotName(e.target.value)}
      />
      <textarea
        placeholder={"Members, one per line:\nAsha, asha@mail.com\nRavi, ravi@mail.com"}
        rows={4}
        value={membersText}
        onChange={(e) => setMembersText(e.target.value)}
      />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
}