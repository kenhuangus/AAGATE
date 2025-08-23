"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { detectAnomaliesAction } from "@/actions/anomaly";
import type { DetectAgentAnomaliesOutput } from "@/ai/flows/detect-agent-anomalies";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required."),
  securitySignals: z.string().min(10, "Please provide detailed security signals."),
});

type FormValues = z.infer<typeof formSchema>;

export default function AnomalyDetectionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectAgentAnomaliesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentId: "agent-003",
      securitySignals: "High memory usage detected: 92%.\nFailed to access data source: /secure/db1. Permission denied.\nUnusual number of outbound API calls to unknown endpoint: api.example.com",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    const response = await detectAnomaliesAction({
        agentId: values.agentId,
        securitySignals: values.securitySignals.split('\n').filter(s => s.trim() !== ''),
    });
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
        title="Anomaly Detection"
        description="Leverage AI to flag unusual agent behavior based on security signals."
      />
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Agent Behavior</CardTitle>
            <CardDescription>Enter an agent's ID and relevant security signals to check for anomalies.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="agentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., agent-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="securitySignals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Signals</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter each signal on a new line."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Provide logs, alerts, or other behavioral data.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Analyze
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        <div className="space-y-4">
            {isLoading && (
                <Card className="flex flex-col items-center justify-center p-8 h-full">
                    <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Analyzing signals...</p>
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
                        {result.isAnomalous ? <AlertTriangle className="text-destructive" /> : <CheckCircle2 className="text-green-500" />}
                        Analysis Result: {result.isAnomalous ? "Anomalous" : "Normal"}
                        </CardTitle>
                        <CardDescription>AI-powered analysis of the provided signals.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <FormLabel>Anomaly Score (0-100)</FormLabel>
                            <Progress value={result.anomalyScore} className="w-full mt-2 h-4" />
                            <p className="text-right font-bold text-lg mt-1">{result.anomalyScore}</p>
                        </div>
                        <div>
                            <FormLabel>Explanation</FormLabel>
                            <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{result.explanation}</p>
                        </div>
                        <div>
                            <FormLabel>Suggested Remediation</FormLabel>
                            <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{result.suggestedRemediation}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </>
  );
}
