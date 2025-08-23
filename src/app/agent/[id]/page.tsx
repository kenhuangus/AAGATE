import { notFound } from "next/navigation";
import { agents, policies as allPolicies } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { RiskScoreChart } from "@/components/risk-score-chart";
import { Bot } from "lucide-react";

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = agents.find((a) => a.id === params.id);

  if (!agent) {
    notFound();
  }

  const agentPolicies = allPolicies.filter(p => agent.policies.includes(p.id));

  return (
    <>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8" />
            {agent.name}
          </div>
        }
        description={`Details for ${agent.type} agent, version ${agent.version}.`}
      />

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>
        <TabsContent value="metrics">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{agent.status}</div>
                <p className="text-xs text-muted-foreground">
                  Last check-in: {new Date(agent.lastCheckIn).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{agent.riskScore}</div>
                <p className="text-xs text-muted-foreground">
                  Based on recent activity and policy adherence
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{agent.model}</div>
                <p className="text-xs text-muted-foreground">
                  Version: {agent.version}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6">
            <RiskScoreChart data={agent.riskHistory} title={`Risk Score Trend for ${agent.name}`} />
          </div>
        </TabsContent>
        <TabsContent value="logs">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Agent Logs</CardTitle>
              <CardDescription>Real-time logs from the agent's operations.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agent.logs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell><Badge variant={log.level === 'ERROR' ? 'destructive' : log.level === 'WARN' ? 'secondary' : 'outline'}>{log.level}</Badge></TableCell>
                      <TableCell className="font-mono">{log.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="policies">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Applied Policies</CardTitle>
              <CardDescription>Policies currently enforced on this agent.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentPolicies.map(policy => (
                  <div key={policy.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{policy.name}</h3>
                    <p className="text-sm text-muted-foreground">{policy.description}</p>
                    <Badge variant="secondary" className="mt-2">{policy.control}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
