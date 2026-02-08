import { PageHeader } from "@/components/page-header";
import { PoliciesManager } from "@/components/policies-manager";
import { getPolicies } from "@/lib/data-store";

export default async function PoliciesPage() {
  const policies = await getPolicies();

  return (
    <>
      <PageHeader
        title="Policy Management"
        description="Create and manage Rego policies to implement NIST AI RMF controls."
      />
      <PoliciesManager policies={policies} />
    </>
  );
}
