import { policies } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PoliciesPage() {
  return (
    <>
      <PageHeader
        title="Policy Management"
        description="Create and manage Rego policies to implement NIST AI RMF controls."
      >
        <Button>Create New Policy</Button>
      </PageHeader>
      <div className="w-full">
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
      </div>
    </>
  );
}
