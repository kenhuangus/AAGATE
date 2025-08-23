import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const agentConfig = `{
  "name": "Janus",
  "version": "1.2.3",
  "model": "Gemini 2.0-Flash",
  "permissions": [
    "read:database",
    "write:logs",
    "api:external"
  ],
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 1024
  }
}`;

const shadowConfig = `{
  "name": "Janus",
  "version": "1.2.4-shadow",
  "model": "Gemini 2.0-Flash",
  "permissions": [
    "read:database",
    "write:logs",
<span class="bg-destructive/30 rounded px-1">    "api:external",</span>
<span class="bg-green-500/30 rounded px-1">    "api:billing"</span>
  ],
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 2048
  }
}`;


export default function ShadowMonitorPage() {
  return (
    <>
      <PageHeader
        title="Shadow Monitor"
        description="Real-time comparison of Janus Shadow-Monitor-Agent, highlighting structural drifts."
      />
      <Card>
        <CardHeader>
          <CardTitle>Configuration Drift: Agent Janus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Production Agent (v1.2.3)</h3>
              <pre className="p-4 bg-muted rounded-md overflow-x-auto h-full">
                <code className="font-code text-sm">{agentConfig}</code>
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Shadow Agent (v1.2.4-shadow)</h3>
              <pre className="p-4 bg-muted rounded-md overflow-x-auto h-full">
                <code className="font-code text-sm" dangerouslySetInnerHTML={{ __html: shadowConfig }}></code>
              </pre>
            </div>
          </div>
          <Separator className="my-6" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Analysis</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><span className="font-semibold text-foreground">Added Permission:</span> <code className="text-sm bg-green-500/30 rounded px-1 py-0.5">api:billing</code>. The shadow agent has a new permission not present in production. This could pose a security risk if deployed.</li>
                <li><span className="font-semibold text-foreground">Modified Parameter:</span> <code className="text-sm bg-yellow-500/30 rounded px-1 py-0.5">max_tokens</code> changed from 1024 to 2048. This could impact performance and cost.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
