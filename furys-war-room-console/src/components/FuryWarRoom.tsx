"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, BarChart3, Settings, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface Project {
  id: number;
  name: string;
  votes: number;
  locked: boolean;
}

interface Alert {
  id: number;
  message: string;
  timestamp: number;
}

export default function FuryWarRoom() {
  const [projects, setProjects] = useState<Project[]>([
  { id: 1, name: "Project Tesseract", votes: 1247, locked: false },
  { id: 2, name: "Operation Mjolnir", votes: 982, locked: true },
  { id: 3, name: "Initiative Avengers", votes: 2104, locked: false },
  { id: 4, name: "Protocol Hydra", votes: 567, locked: true },
  { id: 5, name: "Mission Pegasus", votes: 1893, locked: false }]
  );

  const [votingActive, setVotingActive] = useState(false);
  const [emergencyLockdown, setEmergencyLockdown] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activePanel, setActivePanel] = useState<"lock" | "" | "">("lock");

  // Live stats
  const totalVotes = projects.reduce((sum, p) => sum + p.votes, 0);
  const topProject = projects.reduce((top, p) => p.votes > top.votes ? p : top, projects[0]);
  const activeUsers = 347; // Simulated

  // Particle effect positions
  const [particles, setParticles] = useState<Array<{x: number;y: number;delay: number;}>>([]);

  useEffect(() => {
    // Generate random particles for holographic effect
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);

    // Simulate vote updates
    const interval = setInterval(() => {
      if (votingActive && !emergencyLockdown) {
        setProjects((prev) =>
        prev.map((p) =>
        !p.locked ? { ...p, votes: p.votes + Math.floor(Math.random() * 5) } : p
        )
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [votingActive, emergencyLockdown]);

  const toggleProjectLock = (id: number) => {
    setProjects((prev) =>
    prev.map((p) => {
      if (p.id === id) {
        const newLocked = !p.locked;
        if (!newLocked) {
          // Project unlocked - show alert
          addAlert(`PROJECT ${p.name.toUpperCase()} NOW LIVE`);
        }
        return { ...p, locked: newLocked };
      }
      return p;
    })
    );
  };

  const addAlert = (message: string) => {
    const alert = { id: Date.now(), message, timestamp: Date.now() };
    setAlerts((prev) => [...prev, alert]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    }, 5000);
  };

  const handleActivateVoting = () => {
    setVotingActive(!votingActive);
    addAlert(votingActive ? "VOTING SYSTEM DEACTIVATED" : "VOTING SYSTEM ACTIVATED");
  };

  const handleEmergencyLockdown = () => {
    setEmergencyLockdown(!emergencyLockdown);
    if (!emergencyLockdown) {
      setProjects((prev) => prev.map((p) => ({ ...p, locked: true })));
      addAlert("EMERGENCY LOCKDOWN INITIATED - ALL SYSTEMS SECURED");
    } else {
      addAlert("LOCKDOWN RELEASED");
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 overflow-hidden relative">
      {/* Holographic Background Map */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-purple-900/30" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px"
          }} />

        {/* Animated particles */}
        {particles.map((particle, i) =>
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`
          }} />

        )}
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="bg-gradient-to-b from-gray-900 to-black border-r-2 border-cyan-600/50 flex flex-col items-center py-8 gap-8 !w-[7%] !h-full">
          <div className="text-cyan-400 font-bold text-xs tracking-widest rotate-180 [writing-mode:vertical-lr]">
            S.H.I.E.L.D ADMIN
          </div>
          
          <div className="flex-1 flex flex-col gap-6 mt-8 !w-[75.3%] !h-[374px]">
            <button
              onClick={() => setActivePanel("lock")}
              className={`relative group p-4 rounded-lg transition-all ${
              activePanel === "lock" ?
              "bg-cyan-600/30 shadow-lg shadow-cyan-500/50" :
              "hover:bg-cyan-600/10"}`
              }>

              <Lock className="w-6 h-6" />
              {activePanel === "lock" &&
              <div className="absolute left-full ml-2 px-2 py-1 bg-cyan-600 text-black text-xs font-bold whitespace-nowrap rounded !whitespace-pre-line !whitespace-pre-line !w-5 !h-5">

              </div>
              }
            </button>

            <button
              onClick={() => setActivePanel("")}
              className={`relative group p-4 rounded-lg transition-all ${
              activePanel === "analytics" ?
              "bg-cyan-600/30 shadow-lg shadow-cyan-500/50" :
              "hover:bg-cyan-600/10"}`
              }>

              <BarChart3 className="w-6 h-6" />
              {activePanel === "analytics" &&
              <div className="absolute left-full ml-2 px-2 py-1 bg-cyan-600 text-black text-xs font-bold whitespace-nowrap rounded !whitespace-pre-line !whitespace-pre-line !w-5 !h-5">
                  ANALYTICS
                </div>
              }
            </button>

            <button
              onClick={() => setActivePanel("")}
              className={`relative group p-4 rounded-lg transition-all ${
              activePanel === "controls" ?
              "bg-cyan-600/30 shadow-lg shadow-cyan-500/50" :
              "hover:bg-cyan-600/10"}`
              }>

              <Settings className="w-6 h-6" />
              {activePanel === "controls" &&
              <div className="absolute left-full ml-2 px-2 py-1 bg-cyan-600 text-black text-xs font-bold whitespace-nowrap rounded !w-5 !h-5 !whitespace-pre-line !whitespace-pre-line">
                  CONTROLS
                </div>
              }
            </button>
          </div>

          {/* Tesseract Symbol */}
          <div className="relative w-12 h-12 mb-4">
            <div className="absolute inset-0 border-2 border-cyan-400 rotate-45 animate-spin-slow" />
            <div className="absolute inset-2 border-2 border-blue-400 rotate-45 animate-spin-reverse" />
            <div className="absolute inset-4 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-500/50" />
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 flex flex-col p-8 gap-6">
          {/* Header Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/20 border-2 border-cyan-600/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-xs text-cyan-300 font-mono mb-2 tracking-widest">TOTAL VOTES</div>
              <div className="text-4xl font-bold text-cyan-400 font-mono tabular-nums">
                {totalVotes.toLocaleString()}
              </div>
              <div className="text-xs text-cyan-500 mt-1 font-mono">+{Math.floor(Math.random() * 50)} LIVE</div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/20 border-2 border-purple-600/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-xs text-purple-300 font-mono mb-2 tracking-widest">TOP PROJECT</div>
              <div className="text-2xl font-bold text-purple-400 font-mono truncate">
                {topProject?.name}
              </div>
              <div className="text-xs text-purple-500 mt-1 font-mono">{topProject?.votes} VOTES</div>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-blue-900/20 border-2 border-green-600/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-xs text-green-300 font-mono mb-2 tracking-widest">ACTIVE USERS</div>
              <div className="text-4xl font-bold text-green-400 font-mono tabular-nums animate-pulse">
                {activeUsers}
              </div>
              <div className="text-xs text-green-500 mt-1 font-mono">ONLINE NOW</div>
            </div>
          </div>

          {/* Global Controls */}
          <div className="flex gap-4">
            <button
              onClick={handleActivateVoting}
              disabled={emergencyLockdown}
              className={`flex-1 relative group overflow-hidden rounded-lg border-4 p-6 transition-all disabled:opacity-50 ${
              votingActive ?
              "border-red-600 bg-red-900/30 shadow-lg shadow-red-500/50" :
              "border-gray-600 bg-gray-900/30 hover:border-red-600"}`
              }>

              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400 mb-2 tracking-widest">SYSTEM STATUS</div>
                <div className="text-2xl font-bold text-red-500 font-mono tracking-wider">
                  {votingActive ? "⚡ VOTING ACTIVE" : "ACTIVATE VOTING"}
                </div>
              </div>
              {votingActive &&
              <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
              }
            </button>

            <button
              onClick={handleEmergencyLockdown}
              className={`flex-1 relative group overflow-hidden rounded-lg border-4 p-6 transition-all ${
              emergencyLockdown ?
              "border-orange-600 bg-orange-900/30 shadow-lg shadow-orange-500/50" :
              "border-gray-600 bg-gray-900/30 hover:border-orange-600"}`
              }>

              <div className="relative z-10 flex items-center gap-3">
                <AlertTriangle className={`w-8 h-8 ${emergencyLockdown ? "text-orange-500 animate-pulse" : "text-gray-500"}`} />
                <div>
                  <div className="text-xs font-mono text-gray-400 tracking-widest">SECURITY</div>
                  <div className="text-2xl font-bold text-orange-500 font-mono tracking-wider">
                    {emergencyLockdown ? "🔒 LOCKDOWN" : "EMERGENCY LOCKDOWN"}
                  </div>
                </div>
              </div>
              {emergencyLockdown &&
              <div className="absolute inset-0 bg-orange-500/20 animate-pulse" />
              }
            </button>
          </div>

          {/* Project Table */}
          <div className="flex-1 bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-cyan-600/50 rounded-lg backdrop-blur-sm overflow-hidden">
            <div className="border-b-2 border-cyan-600/50 p-4 bg-cyan-900/20">
              <h2 className="text-xl font-bold text-cyan-400 font-mono tracking-widest">PROJECT ROSTER</h2>
            </div>
            
            <div className="overflow-auto max-h-[400px]">
              <table className="w-full">
                <thead className="bg-gray-900/50 sticky top-0">
                  <tr className="border-b border-cyan-600/30">
                    <th className="text-left p-4 text-xs font-mono text-cyan-300 tracking-widest">ID</th>
                    <th className="text-left p-4 text-xs font-mono text-cyan-300 tracking-widest">PROJECT NAME</th>
                    <th className="text-center p-4 text-xs font-mono text-cyan-300 tracking-widest">VOTE COUNT</th>
                    <th className="text-center p-4 text-xs font-mono text-cyan-300 tracking-widest">STATUS</th>
                    <th className="text-center p-4 text-xs font-mono text-cyan-300 tracking-widest">CONTROL</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, idx) =>
                  <tr
                    key={project.id}
                    className="border-b border-cyan-600/10 hover:bg-cyan-900/10 transition-colors">

                      <td className="p-4 font-mono text-cyan-500">#{String(idx + 1).padStart(3, "0")}</td>
                      <td className="p-4 font-mono text-cyan-400 font-bold">{project.name}</td>
                      <td className="p-4 text-center font-mono text-2xl text-cyan-400 tabular-nums">
                        {project.votes.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      project.locked ?
                      "bg-red-900/30 text-red-400 border border-red-600" :
                      "bg-blue-900/30 text-blue-400 border border-blue-600"}`
                      }>
                          {project.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          {project.locked ? "LOCKED" : "UNLOCKED"}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Switch
                        checked={!project.locked}
                        onCheckedChange={() => toggleProjectLock(project.id)}
                        disabled={emergencyLockdown}
                        className={`data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-red-600`} />

                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts/Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {alerts.map((alert) =>
        <div
          key={alert.id}
          className="bg-cyan-900/90 border-2 border-cyan-400 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-cyan-500/50 animate-in slide-in-from-right">

            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="w-8 h-8 border-2 border-cyan-400 rotate-45 animate-pulse" />
                <div className="absolute inset-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50" />
              </div>
              <div>
                <div className="text-xs text-cyan-300 font-mono mb-1 tracking-widest">SYSTEM ALERT</div>
                <div className="text-sm font-bold text-cyan-400 font-mono">{alert.message}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>);

}