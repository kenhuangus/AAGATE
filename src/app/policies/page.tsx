import { policies } from "@/lib/mock-data";
import { listPolicyAudit } from "@/lib/governance-audit";
import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function PoliciesPage() {
  const auditLog = await listPolicyAudit();

  return (
    <>
      <PageHeader
        title="Policy Management"
        description="Create and manage Rego policies to implement NIST AI RMF controls."
      >
        <Button>Create New Policy</Button>
      </PageHeader>
      <div className="grid gap-6">
        <Accordion type="single" collapsible className="w-full">
          {policies.map((policy) => (
            <AccordionItem key={policy.id} value={policy.id}>
              <AccordionTrigger>
                <div className="flex flex-col md:flex-row md:items-center gap-2 text-left">
                  <span className="font-semibold">{policy.name}</span>
                  <Badge variant="secondary">{policy.control}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                  <p className="text-muted-foreground">{policy.description}</p>
                  <pre className="p-4 bg-background rounded-md overflow-x-auto">
                    <code className="font-code text-sm">{policy.regoCode}</code>
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Card>
          <CardHeader>
            <CardTitle>Policy Evaluation Audit</CardTitle>
            <CardDescription>Latest policy decisions recorded by the governance engine.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Decision</TableHead>
                  <TableHead>Matched Policies</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLog.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No evaluations yet. Submit requests to /api/governance-policies/evaluate.
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLog.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{entry.subject.id} ({entry.subject.role})</TableCell>
                      <TableCell>{entry.action}</TableCell>
                      <TableCell>
                        <Badge variant={entry.decision === "allow" ? "secondary" : "destructive"}>
                          {entry.decision.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {entry.matchedPolicies.join(", ") || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
