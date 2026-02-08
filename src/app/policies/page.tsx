import { listPolicyAudit } from "@/lib/governance-audit";
import { getPolicies } from "@/lib/data-store";
import { PageHeader } from "@/components/page-header";
import { PoliciesManager } from "@/components/policies-manager";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function PoliciesPage() {
  const [policies, auditLog] = await Promise.all([
    getPolicies(),
    listPolicyAudit(),
  ]);

  return (
    <>
      <PageHeader
        title="Policy Management"
        description="Create and manage Rego policies to implement NIST AI RMF controls."
      />
      <div className="grid gap-6">
        <PoliciesManager policies={policies} />
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
                  auditLog.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        {entry.subject.id} ({entry.subject.role})
                      </TableCell>
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
