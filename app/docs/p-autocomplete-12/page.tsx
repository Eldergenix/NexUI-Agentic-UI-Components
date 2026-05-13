"use client";

import PAutocomplete12 from "@/components/p-autocomplete-12";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";

const usageCode = `import PAutocomplete12 from "@/components/p-autocomplete-12";

<PAutocomplete12 />`;

export default function PAutocomplete12Doc() {
  return (
    <DocPage
      title="PAutocomplete12"
      slug="p-autocomplete-12"
      description="Async-loading autocomplete combobox with Spinner."
    >
      <DocSection title="Preview">
        <ComponentPreview code={usageCode}>
          <PAutocomplete12 />
        </ComponentPreview>
      </DocSection>
    </DocPage>
  );
}
