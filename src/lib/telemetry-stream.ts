export type TelemetryEvent = {
  eventType: string;
  timestamp: string;
  payload: Record<string, unknown>;
};

const inMemoryStream: TelemetryEvent[] = [];

const kafkaRestUrl = process.env.KAFKA_REST_PROXY_URL;

export async function publishTelemetry(event: TelemetryEvent) {
  if (kafkaRestUrl) {
    await fetch(`${kafkaRestUrl}/topics/aagate.telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/vnd.kafka.json.v2+json" },
      body: JSON.stringify({
        records: [{ value: event }],
      }),
    });
    return;
  }

  inMemoryStream.push(event);
}

export async function listTelemetry() {
  return inMemoryStream.slice().reverse();
}

export async function resetTelemetry() {
  inMemoryStream.length = 0;
}
