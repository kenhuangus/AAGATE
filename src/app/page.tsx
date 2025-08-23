import Link from "next/link";
import { agents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { RiskScoreChart } from "@/components/risk-score-chart";
import { Bot, ShieldCheck, Shield, ShieldAlert } from "lucide-react";

const getStatusClass = (status: 'Online' | 'Offline' | 'Warning') => {
  switch (status) {
    case 'Online': return 'bg-green-500';
    case 'Offline': return 'bg-gray-500';
    case 'Warning': return 'bg-yellow-500';
  }
};

const getRiskIcon = (score: number) => {
  if (score < 40) return <ShieldCheck className="w-5 h-5 text-green-500" />;
  if (score < 70) return <Shield className="w-5 h-5 text-yellow-500" />;
  return <ShieldAlert className="w-5 h-5 text-red-500" />;
};

const aggregateRiskHistory = () => {
  const history: { [date: string]: { total: number; count: number } } = {};
  agents.forEach(agent => {
    agent.riskHistory.forEach(h => {
      if (!history[h.date]) {
        history[h.date] = { total: 0, count: 0 };
      }
      history[h.date].total += h.riskScore;
      history[h.date].count++;
    });
  });

  return Object.entries(history).map(([date, { total, count }]) => ({
    date,
    riskScore: Math.round(total / count),
  })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export default function DashboardPage() {
  const overallRiskHistory = aggregateRiskHistory();

  return (
    <>
      <PageHeader
        title="Agent Overview"
        description="A summary of all registered AI agents and their current status."
      />
      <div className="grid gap-6">
        <RiskScoreChart data={overallRiskHistory} title="Platform-Wide Risk Trend" description="Average risk score across all agents over time." />
        <Card>
          <CardHeader>
            <CardTitle>All Agents</CardTitle>
            <CardDescription>
              Detailed list of all agents in the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Risk Score</TableHead>
                  <TableHead>Last Check-in</TableHead>
                  <TableHead className="text-right">Model</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id} className="cursor-pointer hover:bg-accent">
                    <TableCell>
                      <Link href={`/agent/${agent.id}`} className="flex items-center gap-2">
                        <span className={cn("h-2.5 w-2.5 rounded-full", getStatusClass(agent.status))}></span>
                        <span>{agent.status}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/agent/${agent.id}`} className="font-medium flex items-center gap-2">
                        <Bot />
                        {agent.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/agent/${agent.id}`}>
                        <Badge variant="outline">{agent.type}</Badge>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/agent/${agent.id}`} className="flex items-center justify-center gap-2">
                        {getRiskIcon(agent.riskScore)}
                        <span>{agent.riskScore}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/agent/${agent.id}`}>
                        {new Date(agent.lastCheckIn).toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/agent/${agent.id}`}>
                        {agent.model}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
