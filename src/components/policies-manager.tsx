"use client";

import { useMemo, useState, useTransition } from "react";
import type { Policy } from "@/lib/types";
import { createPolicyAction, updatePolicyAction, type PolicyFormValues } from "@/actions/policies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PoliciesManagerProps = {
  policies: Policy[];
};

const defaultFormValues: PolicyFormValues = {
  name: "",
  description: "",
  control: "",
  regoCode: "",
};

export function PoliciesManager({ policies }: PoliciesManagerProps) {
  const [activePolicyId, setActivePolicyId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<PolicyFormValues>(defaultFormValues);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isFormValid = Boolean(
    formValues.name.trim() &&
      formValues.description.trim() &&
      formValues.control.trim() &&
      formValues.regoCode.trim()
  );

  const sortedPolicies = useMemo(
    () => [...policies].sort((a, b) => a.name.localeCompare(b.name)),
    [policies]
  );

  const modeLabel = activePolicyId ? "Edit Policy" : "Create Policy";

  const handleEdit = (policy: Policy) => {
    setActivePolicyId(policy.id);
    setFormValues({
      name: policy.name,
      description: policy.description,
      control: policy.control,
      regoCode: policy.regoCode,
    });
    setError(null);
  };

  const handleCancelEdit = () => {
    setActivePolicyId(null);
    setFormValues(defaultFormValues);
    setError(null);
  };

  const handleChange = (field: keyof PolicyFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      try {
        if (activePolicyId) {
          await updatePolicyAction(activePolicyId, formValues);
        } else {
          await createPolicyAction(formValues);
        }
        handleCancelEdit();
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "Failed to save policy.");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        {sortedPolicies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
                {policy.name}
                <Badge variant="secondary">{policy.control}</Badge>
              </CardTitle>
              <CardDescription>{policy.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="rounded-md bg-muted p-4 text-sm overflow-x-auto">
                <code className="font-code">{policy.regoCode}</code>
              </pre>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => handleEdit(policy)}>
                  Edit Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{modeLabel}</CardTitle>
          <CardDescription>
            {activePolicyId
              ? "Update the policy fields and save changes."
              : "Add a new policy with control mapping and Rego code."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="policy-name">Policy Name</Label>
            <Input
              id="policy-name"
              value={formValues.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="Data Access Control"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policy-description">Description</Label>
            <Textarea
              id="policy-description"
              value={formValues.description}
              onChange={(event) => handleChange("description", event.target.value)}
              placeholder="Describe the intent of the policy."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policy-control">Control Mapping</Label>
            <Input
              id="policy-control"
              value={formValues.control}
              onChange={(event) => handleChange("control", event.target.value)}
              placeholder="NIST AI RMF - V.1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policy-rego">Rego Code</Label>
            <Textarea
              id="policy-rego"
              value={formValues.regoCode}
              onChange={(event) => handleChange("regoCode", event.target.value)}
              placeholder="package aagate"
              className="min-h-[160px] font-mono"
            />
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
          <div className={cn("flex flex-wrap gap-2", activePolicyId ? "justify-between" : "justify-end")}>
            {activePolicyId ? (
              <Button variant="ghost" onClick={handleCancelEdit} disabled={isPending}>
                Cancel
              </Button>
            ) : null}
            <Button onClick={handleSubmit} disabled={isPending || !isFormValid}>
              {isPending ? "Saving..." : activePolicyId ? "Save Changes" : "Create Policy"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
