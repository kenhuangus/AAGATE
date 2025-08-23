"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeViolationAction } from "@/actions/violation";
import type { AnalyzePolicyViolationOutput } from "@/ai/flows/analyze-policy-violation";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertTriangle, Wand2 } from "lucide-react";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  policyViolationDescription: z.string().min(10, "Please provide a detailed description."),
  securityLogs: z.string().min(10, "Please provide relevant security logs."),
});

type FormValues = z.infer<typeof formSchema>;

export default function ViolationAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzePolicyViolationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policyViolationDescription: "Agent 'Sentinel' attempted to access a restricted database '/secure/db1' multiple times, violating the 'Data Access Control' policy.",
      securityLogs: "timestamp: 2024-07-31T09:59:05Z, agent_id: agent-003, action: read, resource: /secure/db1, status: denied, policy_id: p001\ntimestamp: 2024-07-31T09:59:15Z, agent_id: agent-003, action: read, resource: /secure/db1, status: denied, policy_id: p001",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    const response = await analyzeViolationAction(values);
    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error);
    }
    setIsLoading(false);
  }

  return (
    <>
      <PageHeader
        title="Violation Analysis"
        description="AI-powered analysis for policy violations with contextual insights and remediation steps."
      />
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Policy Violation</CardTitle>
            <CardDescription>Describe a policy violation and provide logs for an AI-driven analysis.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="policyViolationDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Violation Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the policy violation in detail."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="securityLogs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Logs</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide relevant security logs, one per line."
                          className="min-h-[120px] font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Analyze Violation
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        <div className="space-y-4">
            {isLoading && (
                <Card className="flex flex-col items-center justify-center p-8 h-full">
                    <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">AI is analyzing the violation...</p>
                </Card>
            )}
            {error && (
                <Card className="flex flex-col items-center justify-center p-8 h-full bg-destructive/20 border-destructive">
                    <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
                    <p className="text-destructive-foreground font-bold">Analysis Failed</p>
                    <p className="text-center text-sm text-destructive-foreground/80">{error}</p>
                </Card>
            )}
            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wand2 className="text-primary" />
                          Violation Analysis Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label>Classification</Label>
                            <p className="font-semibold text-lg p-3 bg-muted rounded-md">{result.classification}</p>
                        </div>
                        <div>
                            <Label>Context (MAESTRO, AIVSS, etc.)</Label>
                            <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md whitespace-pre-wrap">{result.context}</p>
                        </div>
                        <div>
                            <Label>Suggested Remediations</Label>
                            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md whitespace-pre-wrap">{result.suggestedRemediations}</div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </>
  );
}
