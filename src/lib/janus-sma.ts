import { decideSsvc } from "@/lib/ssvc";
import { scoreAivss } from "@/lib/aivss";
import { activateKillSwitch } from "@/lib/killswitch";

export type JanusInput = {
  agentId: string;
  plannedAction: string;
  exploitation: number;
  impact: number;
  detectability: number;
};

export type JanusResult = {
  aivssScore: number;
  ssvcDecision: string;
  enforcement: "allow" | "kill_switch";
  reason: string;
};

export async function evaluateJanus(input: JanusInput): Promise<JanusResult> {
  const aivss = scoreAivss({
    exploitation: input.exploitation,
    impact: input.impact,
    detectability: input.detectability,
  });

  const ssvcDecision = decideSsvc({
    exploitation: input.exploitation >= 7 ? "High" : input.exploitation >= 4 ? "Medium" : "Low",
    impact: input.impact >= 7 ? "High" : input.impact >= 4 ? "Medium" : "Low",
  });

  if (ssvcDecision === "Quarantine") {
    await activateKillSwitch(input.agentId, "Janus SMA flagged critical risk.");
    return {
      aivssScore: aivss.score,
      ssvcDecision,
      enforcement: "kill_switch",
      reason: "Critical risk detected. Kill switch activated.",
    };
  }

  return {
    aivssScore: aivss.score,
    ssvcDecision,
    enforcement: "allow",
    reason: "No critical risk detected.",
  };
}
