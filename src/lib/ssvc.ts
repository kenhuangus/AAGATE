export type SsvcInput = {
  exploitation: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
};

export type SsvcDecision = "Track" | "Attend" | "Act" | "Quarantine";

export function decideSsvc(input: SsvcInput): SsvcDecision {
  if (input.exploitation === "High" && input.impact === "High") {
    return "Quarantine";
  }
  if (input.exploitation === "High" || input.impact === "High") {
    return "Act";
  }
  if (input.exploitation === "Medium" || input.impact === "Medium") {
    return "Attend";
  }
  return "Track";
}
