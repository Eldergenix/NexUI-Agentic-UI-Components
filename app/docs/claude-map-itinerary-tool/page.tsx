"use client";

import dynamic from "next/dynamic";
import type {
  ClaudeMapItineraryDay,
  ClaudeMapItineraryStop,
} from "@/components/ai-components/claude-map-itenerary-tool";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { DocPage, DocSection } from "@/lib/docs/DocPage";

// Leaflet touches `window` at import time, so we load the tool client-only.
// The block already imports `leaflet/dist/leaflet.css` internally.
const ClaudeMapItineraryTool = dynamic(
  () =>
    import("@/components/ai-components/claude-map-itenerary-tool").then(
      (m) => m.ClaudeMapItineraryTool
    ),
  { ssr: false }
);

const sampleDays: ClaudeMapItineraryDay[] = [
  {
    day_number: 1,
    title: "Paris highlights",
    locations: [
      {
        name: "Eiffel Tower",
        latitude: 48.8584,
        longitude: 2.2945,
        arrival_time: "9:00 AM",
        duration_minutes: 90,
        rating: 4.6,
        review_count: 312000,
        category: "Landmark",
        notes: "Start at the south pillar to skip the longest line.",
        image_url:
          "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&q=70",
      },
      {
        name: "Louvre Museum",
        latitude: 48.8606,
        longitude: 2.3376,
        arrival_time: "11:30 AM",
        duration_minutes: 150,
        rating: 4.7,
        review_count: 240000,
        category: "Museum",
        notes: "Enter through the Carrousel; the pyramid line is brutal.",
        image_url:
          "https://images.unsplash.com/photo-1565060169187-5284233dc91d?w=400&q=70",
      },
      {
        name: "Notre-Dame",
        latitude: 48.853,
        longitude: 2.3499,
        arrival_time: "3:00 PM",
        duration_minutes: 60,
        rating: 4.7,
        review_count: 170000,
        category: "Cathedral",
        notes: "Reconstruction views from the Pont au Double.",
        image_url:
          "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=400&q=70",
      },
    ],
  },
  {
    day_number: 2,
    title: "Lyon and Marseille",
    locations: [
      {
        name: "Basilica of Notre-Dame de Fourvière",
        latitude: 45.7621,
        longitude: 4.8224,
        arrival_time: "10:00 AM",
        duration_minutes: 75,
        rating: 4.7,
        review_count: 18500,
        category: "Basilica",
        notes: "Take the funicular from Vieux Lyon, then walk down.",
        image_url:
          "https://images.unsplash.com/photo-1599580232225-a18c6dcdbc24?w=400&q=70",
      },
      {
        name: "Vieux Lyon",
        latitude: 45.7619,
        longitude: 4.8273,
        arrival_time: "12:30 PM",
        duration_minutes: 90,
        rating: 4.6,
        review_count: 22000,
        category: "Historic district",
        notes: "Lunch at a bouchon — try the quenelles.",
        image_url:
          "https://images.unsplash.com/photo-1581262208435-41726149a759?w=400&q=70",
      },
      {
        name: "Old Port of Marseille",
        latitude: 43.2951,
        longitude: 5.3746,
        arrival_time: "5:30 PM",
        duration_minutes: 90,
        rating: 4.5,
        review_count: 32000,
        category: "Harbor",
        notes: "Evening rosé on a café terrace facing the water.",
        image_url:
          "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=400&q=70",
      },
    ],
  },
];

// Keep the JSON in the Code tab readable while matching the demo shape.
const sampleCode = `import { ClaudeMapItineraryTool } from "./components/claude-map-itenerary-tool";

<ClaudeMapItineraryTool
  title="A weekend in France"
  narrative="Two days from Paris to the Mediterranean."
  travel_mode="driving"
  show_route
  defaultDayIndex={0}
  days={[
    {
      day_number: 1,
      title: "Paris highlights",
      locations: [
        {
          name: "Eiffel Tower",
          latitude: 48.8584,
          longitude: 2.2945,
          arrival_time: "9:00 AM",
          rating: 4.6,
          review_count: 312000,
          category: "Landmark",
        },
        {
          name: "Louvre Museum",
          latitude: 48.8606,
          longitude: 2.3376,
          arrival_time: "11:30 AM",
          rating: 4.7,
          category: "Museum",
        },
        {
          name: "Notre-Dame",
          latitude: 48.853,
          longitude: 2.3499,
          arrival_time: "3:00 PM",
          category: "Cathedral",
        },
      ],
    },
    // ... day 2 ...
  ]}
/>`;

const walkingCode = `import { ClaudeMapItineraryTool } from "./components/claude-map-itenerary-tool";

<ClaudeMapItineraryTool
  title="A weekend in France"
  narrative="Two days from Paris to the Mediterranean."
  travel_mode="walking"
  show_route={false}
  defaultDayIndex={1}
  days={days}
/>`;

const stopProps: PropDef[] = [
  {
    name: "name",
    type: "string",
    description: "Display label and map marker tooltip.",
  },
  {
    name: "latitude / longitude",
    type: "number",
    description: "Decimal coordinates used for the Leaflet marker.",
  },
  {
    name: "arrival_time",
    type: "string",
    description:
      'Optional time like "9:00 AM" — drives the morning/afternoon segmentation.',
  },
  {
    name: "duration_minutes",
    type: "number",
    description: "Optional planned duration shown in the detail panel.",
  },
  {
    name: "image_url / image_urls",
    type: "string | string[]",
    description:
      "Photo for the map marker thumbnail and the detail-panel carousel.",
  },
  {
    name: "rating / review_count / category",
    type: "number / number / string",
    description: "Optional metadata shown under each stop.",
  },
  {
    name: "phone / website",
    type: "string",
    description: "Optional contact details rendered in the desktop detail.",
  },
  {
    name: "place_id",
    type: "string",
    description: "Used to deep-link to Google Maps when building directions.",
  },
];

const itineraryProps: PropDef[] = [
  {
    name: "title",
    type: "string",
    description: "Top-level title shown in the sidebar hero and copy payload.",
  },
  {
    name: "narrative",
    type: "string",
    description: "Short intro paragraph rendered under the title.",
  },
  {
    name: "travel_mode",
    type: '"driving" | "walking" | "bicycling" | "transit"',
    description: "Forwarded as the `travelmode` parameter on the Google Maps directions URL.",
  },
  {
    name: "show_route",
    type: "boolean",
    description:
      "When true, draws a polyline between stops and exposes the Open route button.",
  },
  {
    name: "days",
    type: "ClaudeMapItineraryDay[]",
    description: "List of day groups. Each day contains its own locations array.",
  },
  {
    name: "defaultDayIndex",
    type: "number",
    default: "0",
    description: "Zero-based index into `days` that is selected on mount.",
  },
  {
    name: "className",
    type: "string",
    description: "Class names merged onto the wrapper.",
  },
];

export default function ClaudeMapItineraryToolDoc() {
  return (
    <DocPage
      title="Claude Map Itinerary Tool"
      slug="claude-map-itinerary-tool"
      description="Multi-day travel itinerary backed by Leaflet + OpenStreetMap. Renders photo markers, a routed polyline, a sidebar with morning/afternoon segments, and a detail panel for each stop. Includes copy-as-JSON and Google Maps directions deep-links."
    >
      <DocSection title="Two-day route">
        <ComponentPreview code={sampleCode}>
          <div className="w-full max-w-3xl">
            <ClaudeMapItineraryTool
              title="A weekend in France"
              narrative="Two days from Paris to the Mediterranean."
              travel_mode="driving"
              show_route
              defaultDayIndex={0}
              days={sampleDays as ClaudeMapItineraryDay[]}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="Walking, no route line">
        <ComponentPreview code={walkingCode}>
          <div className="w-full max-w-3xl">
            <ClaudeMapItineraryTool
              title="A weekend in France"
              narrative="Two days from Paris to the Mediterranean."
              travel_mode="walking"
              show_route={false}
              defaultDayIndex={1}
              days={sampleDays as ClaudeMapItineraryDay[]}
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection title="API Reference">
        <PropsTable props={itineraryProps} />
      </DocSection>

      <DocSection title="ClaudeMapItineraryStop">
        <PropsTable props={stopProps} />
      </DocSection>
    </DocPage>
  );
}

// Silence unused-import for the type-only re-export pattern in the future.
export type { ClaudeMapItineraryStop };
