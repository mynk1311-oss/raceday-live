import { useState, useEffect } from "react";
import { getTeams, getRuns } from "../api";
import TeamForm from "../components/TeamForm";
import RunForm from "../components/RunForm";
import RunList from "../components/RunList";

export default function AdminPage() {
  const [teams, setTeams] = useState([]);
  const [runs, setRuns] = useState([]);

  async function loadTeams() {
    setTeams(await getTeams());
  }

  async function loadRuns() {
    setRuns(await getRuns());
  }

  useEffect(() => {
    loadTeams();
    loadRuns();
  }, []);

  return (
    <div className="admin">
      <TeamForm onCreated={loadTeams} />
      <RunForm teams={teams} onCreated={loadRuns} />
      <RunList runs={runs} onChanged={loadRuns} />
    </div>
  );
}