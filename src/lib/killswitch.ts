type KillSwitchState = {
  agentId: string;
  reason: string;
  activatedAt: string;
};

let quarantined: KillSwitchState[] = [];

export async function activateKillSwitch(agentId: string, reason: string) {
  const state: KillSwitchState = {
    agentId,
    reason,
    activatedAt: new Date().toISOString(),
  };
  quarantined = [state, ...quarantined.filter(item => item.agentId !== agentId)];
  return state;
}

export async function clearKillSwitch(agentId: string) {
  quarantined = quarantined.filter(item => item.agentId !== agentId);
}

export async function listKillSwitches() {
  return quarantined.slice();
}

export async function isQuarantined(agentId: string) {
  return quarantined.some(item => item.agentId === agentId);
}
