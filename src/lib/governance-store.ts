import type { GovernanceEventSummary } from "@/lib/event-schemas";
import { governanceEvents as seedEvents } from "@/lib/mock-events";

let events: GovernanceEventSummary[] = [...seedEvents];

export async function getGovernanceEvents(): Promise<GovernanceEventSummary[]> {
  return events
    .slice()
    .sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

export async function addGovernanceEvent(
  event: GovernanceEventSummary
): Promise<GovernanceEventSummary> {
  events = [event, ...events];
  return event;
}

export async function resetGovernanceEvents(): Promise<void> {
  events = [...seedEvents];
}
