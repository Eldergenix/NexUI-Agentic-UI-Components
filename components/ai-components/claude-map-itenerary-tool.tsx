"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Globe,
  Minus,
  Navigation,
  Phone,
  Plus,
  Star,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ClaudeMapItineraryTravelMode =
  | "driving"
  | "walking"
  | "bicycling"
  | "transit";

/** One stop on an itinerary day — include `image_url` for photo markers. */
export type ClaudeMapItineraryStop = {
  name: string;
  latitude: number;
  longitude: number;
  place_id?: string;
  image_url?: string;
  /** Extra photos for the desktop detail carousel; falls back to `image_url`. */
  image_urls?: string[];
  arrival_time?: string;
  duration_minutes?: number;
  notes?: string;
  rating?: number;
  review_count?: number;
  category?: string;
  phone?: string;
  /** Hostname or full URL (shown in detail panel). */
  website?: string;
};

export type ClaudeMapItineraryDay = {
  day_number: number;
  title: string;
  locations: ClaudeMapItineraryStop[];
};

type ItineraryCopyMenuSlot = "sidebar-hero" | "sidebar-sticky" | "mobile";

export type ClaudeMapItineraryToolProps = {
  title: string;
  narrative: string;
  travel_mode: ClaudeMapItineraryTravelMode;
  show_route: boolean;
  days: ClaudeMapItineraryDay[];
  /** Zero-based index into `days`. */
  defaultDayIndex?: number;
  className?: string;
};

const motionEase = { type: "spring" as const, duration: 0.3, bounce: 0 };

const ARRIVAL_TIME_RE = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
const URL_PROTOCOL_RE = /^https?:\/\//i;
const TRAILING_SLASH_RE = /\/$/;

function arrivalHour24(arrival?: string): number | null {
  if (!arrival) {
    return null;
  }
  const m = arrival.trim().match(ARRIVAL_TIME_RE);
  if (!m) {
    return null;
  }
  let h = Number(m[1]);
  const ampm = m[3].toUpperCase();
  if (ampm === "AM") {
    if (h === 12) {
      h = 0;
    }
  } else if (h !== 12) {
    h += 12;
  }
  return h;
}

function timeSegment(arrival?: string): "morning" | "afternoon" {
  const h = arrivalHour24(arrival);
  if (h === null) {
    return "morning";
  }
  return h < 12 ? "morning" : "afternoon";
}

function formatReviewCount(n: number): string {
  return n.toLocaleString("en-US");
}

function buildDirectionsUrl(
  locations: ClaudeMapItineraryStop[],
  travelMode: ClaudeMapItineraryTravelMode
): string | null {
  if (locations.length < 2) {
    return null;
  }
  const [first, ...rest] = locations;
  const last = rest.at(-1) as ClaudeMapItineraryStop;
  const middle = rest.slice(0, -1);
  const params = new URLSearchParams({ api: "1" });
  params.set("origin", first.name);
  if (first.place_id) {
    params.set("origin_place_id", first.place_id);
  }
  params.set("destination", last.name);
  if (last.place_id) {
    params.set("destination_place_id", last.place_id);
  }
  if (middle.length > 0) {
    params.set("waypoints", middle.map((l) => l.name).join("|"));
  }
  params.set("travelmode", travelMode);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function buildJsonPayload(props: ClaudeMapItineraryToolProps): string {
  const { title, narrative, travel_mode, show_route, days } = props;
  return JSON.stringify(
    { title, narrative, travel_mode, show_route, days },
    null,
    2
  );
}

function buildPlainItinerary(props: ClaudeMapItineraryToolProps): string {
  const lines = [props.title, "", props.narrative, ""];
  for (const day of props.days) {
    lines.push(`Day ${day.day_number}: ${day.title}`, "");
    for (const loc of day.locations) {
      const bits = [loc.name];
      if (loc.arrival_time) {
        bits.unshift(loc.arrival_time);
      }
      if (loc.notes) {
        bits.push(loc.notes);
      }
      lines.push(`— ${bits.join(" — ")}`);
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

function photoMarkerIcon(
  selected: boolean,
  loc: ClaudeMapItineraryStop,
  stopNumber: number
): L.DivIcon {
  const thumb = stopThumbSrc(loc);
  const stackHintCount = stopPhotoUrlsFrom(
    loc.image_url,
    loc.image_urls
  ).length;
  return mapPhotoDivIcon(
    buildMapPhotoMarkerHtml({
      name: loc.name,
      thumbUrl: thumb,
      initial: loc.name.slice(0, 1).toUpperCase(),
      labelNumber: stopNumber,
      selected,
      stackHintCount: Math.max(1, stackHintCount),
    })
  );
}

function MapFocus({
  selected,
  locations,
}: {
  selected: number;
  locations: ClaudeMapItineraryStop[];
}) {
  const map = useMap();
  const locKey = useMemo(
    () => locations.map((l) => `${l.latitude},${l.longitude}`).join("|"),
    [locations]
  );
  const prevLocKey = useRef("");
  const skipNextFly = useRef(true);

  useEffect(() => {
    if (prevLocKey.current !== locKey) {
      prevLocKey.current = locKey;
      skipNextFly.current = true;
    }
  }, [locKey]);

  useEffect(() => {
    if (skipNextFly.current) {
      skipNextFly.current = false;
      return;
    }
    const loc = locations[selected];
    if (!loc) {
      return;
    }
    map.flyTo([loc.latitude, loc.longitude], Math.max(map.getZoom(), 14), {
      duration: 0.35,
      easeLinearity: 0.6,
    });
  }, [locations, map, selected]);

  return null;
}

function FitBounds({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds?.isValid()) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
    }
  }, [bounds, map]);
  return null;
}

/** Leaflet can leave a bottom gap if the container size is finalized after first paint. */
function MapLayoutSync() {
  const map = useMap();
  useEffect(() => {
    const sync = () => {
      map.invalidateSize({ animate: false });
    };
    let raf1 = 0;
    let raf2 = 0;
    const runAfterPanes = () => {
      raf1 = requestAnimationFrame(() => {
        sync();
        raf2 = requestAnimationFrame(sync);
      });
    };
    map.whenReady(runAfterPanes);
    globalThis.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      globalThis.removeEventListener("resize", sync);
    };
  }, [map]);
  return null;
}

function ItineraryMapZoomControls({
  mapRef,
}: {
  mapRef: RefObject<L.Map | null>;
}) {
  return (
    <div className="pointer-events-auto absolute bottom-8 left-3 z-1000">
      <div className="flex flex-col overflow-hidden rounded-lg border border-border/80 bg-background/90 shadow-sm backdrop-blur-md">
        <Button
          aria-label="Zoom in"
          className="h-6 w-6 rounded-none border-0 shadow-none"
          onClick={() => {
            mapRef.current?.zoomIn();
          }}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Plus className="size-3 text-muted-foreground" />
        </Button>
        <div className="h-px bg-border" />
        <Button
          aria-label="Zoom out"
          className="h-6 w-6 rounded-none border-0 shadow-none"
          onClick={() => {
            mapRef.current?.zoomOut();
          }}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Minus className="size-3 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

type CopyMenuProps = {
  copyRef: RefObject<HTMLDivElement | null>;
  isCopyOpen: boolean;
  onToggle: () => void;
  copied: boolean;
  reduceMotion: boolean | null;
  transition: Transition;
  onCopy: (format: "json" | "list") => void;
  /** Compact icon for sticky sidebar chrome; hero = secondary row button with chevron. */
  trigger?: "hero" | "icon";
};

function ItineraryCopyMenu({
  copyRef,
  isCopyOpen,
  onToggle,
  copied,
  reduceMotion,
  transition,
  onCopy,
  trigger = "hero",
}: CopyMenuProps) {
  const iconSlot = (
    <span className="relative flex size-3.5 items-center justify-center">
      <AnimatePresence initial={false} mode="popLayout">
        {copied ? (
          <motion.span
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            key="check"
            transition={transition}
          >
            <Check className="size-3.5" />
          </motion.span>
        ) : (
          <motion.span
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            key="copy"
            transition={transition}
          >
            <Copy className="size-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );

  return (
    <div className="relative w-fit" ref={copyRef}>
      {trigger === "icon" ? (
        <Button
          aria-expanded={isCopyOpen}
          aria-haspopup="menu"
          aria-label="Copy"
          className="h-6 w-6 shrink-0"
          onClick={onToggle}
          size="icon"
          type="button"
          variant="outline"
        >
          {iconSlot}
        </Button>
      ) : (
        <Button
          aria-expanded={isCopyOpen}
          aria-haspopup="menu"
          className="h-8 gap-1 pr-2 pl-2.5 text-xs"
          onClick={onToggle}
          type="button"
          variant="secondary"
        >
          {iconSlot}
          Copy
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 opacity-70 transition-transform duration-200",
              isCopyOpen && "rotate-180"
            )}
          />
        </Button>
      )}
      <AnimatePresence>
        {isCopyOpen && (
          <motion.div
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            className="absolute top-full right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-popover shadow-md"
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            transition={transition}
          >
            <button
              className="flex min-h-9 w-full items-center gap-2 px-3 py-2 text-left text-popover-foreground text-xs hover:bg-accent"
              onClick={() => onCopy("json")}
              role="menuitem"
              type="button"
            >
              Copy as JSON
            </button>
            <button
              className="flex min-h-9 w-full items-center gap-2 px-3 py-2 text-left text-popover-foreground text-xs hover:bg-accent"
              onClick={() => onCopy("list")}
              role="menuitem"
              type="button"
            >
              Copy as list
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ItineraryStopThumb({
  loc,
  elevatedFrame,
}: {
  loc: ClaudeMapItineraryStop;
  /** Claude-style white mat + soft shadow around the thumbnail. */
  elevatedFrame?: boolean;
}) {
  const thumb = stopThumbSrc(loc);
  return (
    <div
      className={cn(
        "shrink-0 rounded-lg bg-background p-0.5",
        !elevatedFrame && "shadow-sm"
      )}
      style={
        elevatedFrame ? { boxShadow: "0 0 4px hsl(0 0% 0% / 0.15)" } : undefined
      }
    >
      {thumb ? (
        // biome-ignore lint/performance/noImgElement: external place photos; next/image domains not configured
        <img
          alt=""
          className="h-14 w-14 rounded-md object-cover"
          height={56}
          src={thumb}
          width={56}
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-muted font-semibold text-muted-foreground text-sm">
          {loc.name.slice(0, 1)}
        </div>
      )}
    </div>
  );
}

function ItineraryStopMeta({
  loc,
  variant = "default",
}: {
  loc: ClaudeMapItineraryStop;
  variant?: "default" | "sidebar";
}) {
  if (loc.rating == null && loc.review_count == null && !loc.category) {
    return null;
  }
  const isSb = variant === "sidebar";
  return (
    <div
      className={cn(
        "mt-0.5 flex items-center gap-1.5 overflow-hidden text-xs",
        isSb ? "text-muted-foreground" : "text-muted-foreground"
      )}
    >
      {loc.rating == null ? null : (
        <span className="flex shrink-0 items-center gap-0.5">
          <span>{loc.rating}</span>
          <Star
            className={cn(
              "size-3",
              isSb ? "fill-current text-muted-foreground" : "fill-current"
            )}
          />
          {loc.review_count == null ? null : (
            <span
              className={
                isSb ? "text-muted-foreground/70" : "text-muted-foreground/80"
              }
            >
              ({formatReviewCount(loc.review_count)})
            </span>
          )}
        </span>
      )}
      {loc.category ? (
        <>
          <span
            className={cn(
              "shrink-0",
              isSb ? "text-muted-foreground/70" : "text-muted-foreground/60"
            )}
          >
            ·
          </span>
          <span className="truncate">{loc.category}</span>
        </>
      ) : null}
    </div>
  );
}

function ItineraryStopCard({
  loc,
  index,
  selected,
  compact,
  onSelect,
  appearance = "default",
}: {
  loc: ClaudeMapItineraryStop;
  index: number;
  selected: boolean;
  compact?: boolean;
  onSelect: (i: number) => void;
  /** Sidebar list rows match Claude map itinerary chrome. */
  appearance?: "default" | "sidebar";
}) {
  const sidebar = appearance === "sidebar" && !compact;
  let rowLayout =
    "w-full gap-3 rounded-xl bg-muted/70 p-3 fine-hover:hover:bg-muted";
  if (compact) {
    rowLayout = "w-[220px] shrink-0 gap-3 rounded-xl bg-muted/80 p-2";
  } else if (sidebar) {
    rowLayout =
      "w-full cursor-pointer gap-3 overflow-hidden rounded-xl bg-muted/50 p-3 fine-hover:hover:bg-muted/80";
  }
  return (
    <button
      aria-current={selected ? "true" : undefined}
      aria-label={loc.name}
      className={cn(
        "flex items-start text-left transition-colors",
        rowLayout,
        selected && "ring-2 ring-primary/35"
      )}
      onClick={() => onSelect(index)}
      type="button"
    >
      <ItineraryStopThumb elevatedFrame={sidebar} loc={loc} />
      <div className="min-w-0 flex-1 py-0.5">
        {loc.arrival_time ? (
          <div className="text-muted-foreground text-xs leading-tight">
            {loc.arrival_time}
          </div>
        ) : null}
        <div className="line-clamp-1 font-semibold text-foreground text-sm leading-tight">
          {loc.name}
        </div>
        {compact ? null : (
          <ItineraryStopMeta
            loc={loc}
            variant={sidebar ? "sidebar" : "default"}
          />
        )}
        {!compact && loc.notes ? (
          <p className="mt-1 line-clamp-2 text-muted-foreground text-xs leading-snug">
            {loc.notes}
          </p>
        ) : null}
      </div>
    </button>
  );
}

function stopPhotoUrlsFrom(
  image_url?: string,
  image_urls?: string[]
): string[] {
  if (image_urls?.length) {
    return image_urls;
  }
  if (image_url) {
    return [image_url];
  }
  return [];
}

/** First image for list rows and map markers (prefers `image_url`, then `image_urls[0]`). */
function stopThumbSrc(loc: ClaudeMapItineraryStop): string | undefined {
  return loc.image_url ?? loc.image_urls?.[0];
}

function websiteHrefAndLabel(
  raw?: string
): { href: string; label: string } | null {
  if (!raw?.trim()) {
    return null;
  }
  const t = raw.trim();
  const href = URL_PROTOCOL_RE.test(t) ? t : `https://${t}`;
  const label = t
    .replace(URL_PROTOCOL_RE, "")
    .replace(TRAILING_SLASH_RE, "")
    .split("/")[0];
  return { href, label };
}

function StopDetailHeroPhoto({
  photos,
  stopName,
}: {
  photos: string[];
  stopName: string;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const multiPhotos = photos.length > 1;
  const cyclePhoto = (delta: -1 | 1) => {
    if (!multiPhotos) {
      return;
    }
    setPhotoIndex((i) => (i + delta + photos.length) % photos.length);
  };
  const currentSrc = photos[photoIndex];

  return (
    <div className="group/photo relative h-36 bg-muted">
      {currentSrc ? (
        // biome-ignore lint/performance/noImgElement: external place photos
        <img
          alt={stopName}
          className="h-full w-full cursor-pointer object-cover"
          height={144}
          src={currentSrc}
          width={400}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
          No photo
        </div>
      )}
      {photos.length > 0 ? (
        <div className="absolute right-0 bottom-1.5 left-0 flex items-center justify-center gap-1.5">
          {multiPhotos ? (
            <button
              aria-label="Previous photo"
              className="text-white opacity-0 drop-shadow-md transition-opacity group-hover/photo:opacity-100"
              onClick={() => cyclePhoto(-1)}
              type="button"
            >
              <ChevronLeft className="size-3" />
            </button>
          ) : null}
          {photos.map((src, i) => (
            <button
              aria-current={i === photoIndex ? "true" : undefined}
              aria-label={`Photo ${i + 1} of ${photos.length}`}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === photoIndex ? "bg-foreground" : "bg-foreground/45"
              )}
              key={src}
              onClick={() => setPhotoIndex(i)}
              type="button"
            />
          ))}
          {multiPhotos ? (
            <button
              aria-label="Next photo"
              className="text-white opacity-0 drop-shadow-md transition-opacity group-hover/photo:opacity-100"
              onClick={() => cyclePhoto(1)}
              type="button"
            >
              <ChevronRight className="size-3" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DesktopSidebarStopDetail({
  stop,
  dayNumber,
  stopIndex,
  stopCount,
  onClose,
  onStepStop,
}: {
  stop: ClaudeMapItineraryStop;
  dayNumber: number;
  stopIndex: number;
  stopCount: number;
  onClose: () => void;
  onStepStop: (delta: -1 | 1) => void;
}) {
  const photos = useMemo(
    () => stopPhotoUrlsFrom(stop.image_url, stop.image_urls),
    [stop.image_url, stop.image_urls]
  );

  const canPrevStop = stopIndex > 0;
  const canNextStop = stopIndex < stopCount - 1;

  const web = websiteHrefAndLabel(stop.website);
  const tel = stop.phone?.trim();
  const telHref = tel ? `tel:${tel.replace(/\s/g, "")}` : null;

  return (
    <div className="relative flex h-full flex-col bg-background">
      <Button
        aria-label="Close"
        className="absolute top-3 right-3 z-20 h-8 w-8 rounded-md bg-background/80 hover:bg-background"
        onClick={onClose}
        size="icon"
        type="button"
        variant="ghost"
      >
        <X className="size-4 text-muted-foreground" />
      </Button>

      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <StopDetailHeroPhoto photos={photos} stopName={stop.name} />

        <div className="px-4 pt-3">
          <div className="mb-2 text-muted-foreground text-xs">
            Day {dayNumber}
            {stop.arrival_time ? (
              <>
                <span className="mx-1.5">·</span>
                <span>{stop.arrival_time}</span>
              </>
            ) : null}
          </div>
          <h2 className="font-bold text-foreground text-lg leading-tight">
            {stop.name}
          </h2>
          {stop.rating != null || stop.review_count != null || stop.category ? (
            <div className="mt-1 flex items-center gap-1.5 text-muted-foreground text-xs">
              {stop.rating == null ? null : (
                <span className="flex items-center gap-0.5">
                  <span>{stop.rating}</span>
                  <Star className="size-3 fill-current text-muted-foreground" />
                  {stop.review_count == null ? null : (
                    <span className="text-muted-foreground/80">
                      ({formatReviewCount(stop.review_count)})
                    </span>
                  )}
                </span>
              )}
              {stop.category ? (
                <>
                  <span className="text-muted-foreground/80">·</span>
                  <span>{stop.category}</span>
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="px-4 pt-2 pb-4">
          {stop.notes ? (
            <div className="rounded-lg bg-muted/80 p-3">
              <p className="mb-1 text-muted-foreground text-xs">
                Notes from Claude
              </p>
              <p className="text-foreground text-xs leading-relaxed">
                {stop.notes}
              </p>
            </div>
          ) : null}
          {telHref ? (
            <a
              className="group/phone mt-2 flex items-start gap-2"
              href={telHref}
            >
              <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover/phone:text-primary" />
              <span className="text-muted-foreground text-xs transition-colors group-hover/phone:text-primary">
                {tel}
              </span>
            </a>
          ) : null}
          {web ? (
            <a
              className="group/website mt-2 flex items-start gap-2 text-left"
              href={web.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover/website:text-primary" />
              <span className="truncate text-muted-foreground text-xs transition-colors group-hover/website:text-primary">
                {web.label}
              </span>
            </a>
          ) : null}
          <p className="mt-6 text-[10px] text-muted-foreground opacity-60">
            Google Maps
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-between border-border/80 border-t p-3">
        <Button
          aria-label="Previous stop"
          className="h-8 w-8"
          disabled={!canPrevStop}
          onClick={() => onStepStop(-1)}
          size="icon"
          type="button"
          variant="outline"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="-translate-x-1/2 absolute left-1/2 text-muted-foreground text-xs">
          {stopIndex + 1} of {stopCount}
        </span>
        <Button
          aria-label="Next stop"
          className="h-8 w-8"
          disabled={!canNextStop}
          onClick={() => onStepStop(1)}
          size="icon"
          type="button"
          variant="outline"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function MapLoader() {
  return (
    <div
      aria-hidden
      className="flex h-full min-h-[450px] w-full animate-pulse items-center justify-center bg-muted/60"
    />
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: single orchestrator for map, day chrome, sidebars, and copy
export function ClaudeMapItineraryTool({
  title,
  narrative,
  travel_mode,
  show_route,
  days,
  defaultDayIndex = 0,
  className,
}: ClaudeMapItineraryToolProps) {
  const mapRef = useRef<L.Map | null>(null);
  const safeDefaultDay = Math.min(
    Math.max(0, defaultDayIndex),
    Math.max(0, days.length - 1)
  );
  const [dayIndex, setDayIndex] = useState(safeDefaultDay);
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const [copyMenuSlot, setCopyMenuSlot] =
    useState<ItineraryCopyMenuSlot | null>(null);
  const [copied, setCopied] = useState(false);
  const [sidebarScrolled, setSidebarScrolled] = useState(false);
  const [desktopSidebarDetail, setDesktopSidebarDetail] = useState(false);
  const copyRefSidebarHero = useRef<HTMLDivElement>(null);
  const copyRefSidebarSticky = useRef<HTMLDivElement>(null);
  const copyRefMobile = useRef<HTMLDivElement>(null);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? { duration: 0 } : motionEase;
  const mapSectionId = useId();

  const currentDay = days[dayIndex] ?? days[0];
  const locations = currentDay?.locations ?? [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset stop when the active day changes
  useEffect(() => {
    setSelectedStopIndex(0);
  }, [dayIndex]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset scroll + chrome when the active day changes
  useEffect(() => {
    const el = sidebarScrollRef.current;
    if (el) {
      el.scrollTop = 0;
    }
    setSidebarScrolled(false);
    setCopyMenuSlot(null);
    setDesktopSidebarDetail(false);
  }, [dayIndex]);

  const onSidebarScroll = useCallback(() => {
    const el = sidebarScrollRef.current;
    if (!el) {
      return;
    }
    setSidebarScrolled(el.scrollTop > 10);
  }, []);

  useEffect(() => {
    if (selectedStopIndex >= locations.length) {
      setSelectedStopIndex(locations.length > 0 ? locations.length - 1 : 0);
    }
  }, [locations.length, selectedStopIndex]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const t = e.target as Node;
      if (
        copyRefSidebarHero.current?.contains(t) ||
        copyRefSidebarSticky.current?.contains(t) ||
        copyRefMobile.current?.contains(t)
      ) {
        return;
      }
      setCopyMenuSlot(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safeStopIndex =
    locations.length === 0
      ? 0
      : Math.min(Math.max(0, selectedStopIndex), locations.length - 1);

  const bounds = useMemo(() => {
    if (locations.length === 0) {
      return null;
    }
    const b = L.latLngBounds(
      locations.map((loc) => [loc.latitude, loc.longitude] as L.LatLngTuple)
    );
    if (locations.length === 1) {
      b.pad(0.35);
    }
    return b;
  }, [locations]);

  const polylinePositions = useMemo(
    () =>
      locations.map((loc) => [loc.latitude, loc.longitude] as L.LatLngTuple),
    [locations]
  );

  const directionsUrl =
    show_route && locations.length > 1
      ? buildDirectionsUrl(locations, travel_mode)
      : null;

  const grouped = useMemo(() => {
    const morning: { stop: ClaudeMapItineraryStop; index: number }[] = [];
    const afternoon: { stop: ClaudeMapItineraryStop; index: number }[] = [];
    locations.forEach((stop, index) => {
      const seg = timeSegment(stop.arrival_time);
      if (seg === "afternoon") {
        afternoon.push({ stop, index });
      } else {
        morning.push({ stop, index });
      }
    });
    return { morning, afternoon };
  }, [locations]);

  const handleCopy = async (format: "json" | "list") => {
    const payload: ClaudeMapItineraryToolProps = {
      title,
      narrative,
      travel_mode,
      show_route,
      days,
    };
    const text =
      format === "json"
        ? buildJsonPayload(payload)
        : buildPlainItinerary(payload);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setCopyMenuSlot(null);
    setTimeout(() => setCopied(false), 2000);
  };

  let mapBody: ReactNode;
  if (locations.length === 0) {
    mapBody = (
      <div className="flex h-full w-full items-center justify-center bg-muted/40">
        <p className="text-pretty px-4 text-center text-muted-foreground text-sm">
          No stops for this day.
        </p>
      </div>
    );
  } else if (bounds) {
    mapBody = (
      <div
        className="absolute inset-0 min-h-0 w-full overflow-hidden"
        data-testid="map"
      >
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [48, 48] }}
          className={cn(
            "z-0 h-full min-h-0 w-full [&_.leaflet-control-zoom]:hidden [&_.leaflet-div-icon]:border-0! [&_.leaflet-div-icon]:bg-transparent!"
          )}
          ref={mapRef}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <FitBounds bounds={bounds} />
          <MapFocus locations={locations} selected={safeStopIndex} />
          {show_route && polylinePositions.length > 1 ? (
            <Polyline
              pathOptions={{
                color: "var(--primary)",
                weight: 4,
                opacity: 0.75,
              }}
              positions={polylinePositions}
            />
          ) : null}
          {locations.map((loc, index) => (
            <Marker
              eventHandlers={{
                click: (e) => {
                  e.originalEvent?.stopPropagation();
                  setSelectedStopIndex(index);
                  setDesktopSidebarDetail(true);
                },
              }}
              icon={photoMarkerIcon(index === safeStopIndex, loc, index + 1)}
              key={
                loc.place_id
                  ? `${loc.place_id}-${index}`
                  : `${loc.name}-${loc.latitude}-${loc.longitude}-${index}`
              }
              position={[loc.latitude, loc.longitude]}
              zIndexOffset={index === safeStopIndex ? 1000 : index}
            />
          ))}
          <MapLayoutSync />
        </MapContainer>
        <ItineraryMapZoomControls mapRef={mapRef} />
      </div>
    );
  } else {
    mapBody = <MapLoader />;
  }

  const dayLabel = currentDay ? `Day ${currentDay.day_number}` : "";
  const sidebarHeaderId = `${mapSectionId}-sidebar-title`;

  function renderSegment(
    label: string,
    items: { stop: ClaudeMapItineraryStop; index: number }[]
  ) {
    if (items.length === 0) {
      return null;
    }
    return (
      <div className="mt-3 first:mt-0">
        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="font-semibold text-foreground/85 text-sm">{label}</h3>
        </div>
        <div className="space-y-2">
          {items.map(({ stop, index }) => (
            <ItineraryStopCard
              appearance="sidebar"
              compact={false}
              index={index}
              key={`${stop.place_id ?? stop.name}-${index}`}
              loc={stop}
              onSelect={(i) => {
                setSelectedStopIndex(i);
                setDesktopSidebarDetail(true);
              }}
              selected={index === safeStopIndex}
            />
          ))}
        </div>
      </div>
    );
  }

  const routePrimaryLinkClass = cn(
    buttonVariants({ size: "sm", variant: "default" }),
    "relative h-8 min-w-16 gap-1 overflow-hidden pr-2.5 pl-2 text-xs",
    "transition-transform duration-150 ease-[cubic-bezier(0.165,0.85,0.45,1)]",
    "hover:scale-x-[1.005] hover:scale-y-[1.015]",
    "after:pointer-events-none after:absolute after:inset-0 after:translate-y-2 after:bg-[radial-gradient(at_bottom,hsl(0_0%_0%/0.07),transparent)] after:opacity-0 after:transition-all after:duration-200",
    "hover:after:translate-y-0 hover:after:opacity-100"
  );

  const routeIconLinkClass = cn(
    buttonVariants({ size: "icon", variant: "default" }),
    "relative h-6 w-6 overflow-hidden rounded-md",
    "transition-transform duration-150 ease-[cubic-bezier(0.165,0.85,0.45,1)]",
    "hover:scale-x-[1.005] hover:scale-y-[1.015]",
    "after:pointer-events-none after:absolute after:inset-0 after:translate-y-2 after:bg-[radial-gradient(at_bottom,hsl(0_0%_0%/0.07),transparent)] after:opacity-0 after:transition-all after:duration-200",
    "hover:after:translate-y-0 hover:after:opacity-100"
  );

  return (
    <div className={cn("pt-1 pb-0 pl-2", className)}>
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-background/50 p-0 shadow-sm">
        <div className="relative h-[450px] min-h-0 w-full overflow-hidden rounded-2xl">
          <section
            aria-label={`Map: ${title}`}
            className="absolute inset-0 z-0 min-h-0 overflow-hidden rounded-2xl"
            id={mapSectionId}
          >
            {mapBody}
          </section>

          {days.length > 1 ? (
            <div className="pointer-events-auto absolute top-3 right-0 left-3 z-10 overflow-x-auto px-3 [scrollbar-width:none] md:right-[296px] md:px-0 [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-1.5">
                {days.map((d, i) => {
                  const pressed = i === dayIndex;
                  return (
                    <button
                      aria-pressed={pressed}
                      className={cn(
                        "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-xs transition-colors",
                        pressed
                          ? "bg-primary text-primary-foreground"
                          : "border border-border/80 bg-background/85 text-muted-foreground hover:bg-background"
                      )}
                      key={d.day_number}
                      onClick={() => setDayIndex(i)}
                      type="button"
                    >
                      Day {d.day_number}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="pointer-events-none absolute top-0 right-3 bottom-0 hidden w-[280px] flex-col md:flex">
            <div className="pointer-events-auto flex h-full flex-col py-3">
              <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-background">
                {desktopSidebarDetail && locations.length > 0 ? (
                  <DesktopSidebarStopDetail
                    dayNumber={currentDay.day_number}
                    key={`${dayIndex}-${safeStopIndex}`}
                    onClose={() => setDesktopSidebarDetail(false)}
                    onStepStop={(delta) => {
                      setSelectedStopIndex((i) =>
                        Math.max(0, Math.min(locations.length - 1, i + delta))
                      );
                    }}
                    stop={locations[safeStopIndex]}
                    stopCount={locations.length}
                    stopIndex={safeStopIndex}
                  />
                ) : (
                  <>
                    <div
                      className={cn(
                        "absolute top-0 right-0 left-0 z-10 flex items-center justify-between gap-2 rounded-t-xl border-border/80 border-b bg-background/95 px-4 py-3 backdrop-blur-sm transition-opacity duration-150",
                        sidebarScrolled
                          ? "pointer-events-auto opacity-100"
                          : "pointer-events-none opacity-0"
                      )}
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          {dayLabel}
                        </div>
                        <h3 className="truncate font-semibold text-foreground text-sm leading-snug">
                          {currentDay?.title ?? title}
                        </h3>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <ItineraryCopyMenu
                          copied={copied}
                          copyRef={copyRefSidebarSticky}
                          isCopyOpen={copyMenuSlot === "sidebar-sticky"}
                          onCopy={handleCopy}
                          onToggle={() =>
                            setCopyMenuSlot((s) =>
                              s === "sidebar-sticky" ? null : "sidebar-sticky"
                            )
                          }
                          reduceMotion={reduceMotion}
                          transition={transition}
                          trigger="icon"
                        />
                        {directionsUrl ? (
                          <a
                            aria-label="Open route in Google Maps"
                            className={routeIconLinkClass}
                            href={directionsUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <Navigation className="size-3.5 rotate-90" />
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div
                      className="h-full overflow-y-auto overscroll-contain"
                      onScroll={onSidebarScroll}
                      ref={sidebarScrollRef}
                    >
                      <div className="px-4 pt-4 pb-4">
                        <div className="mb-1 text-[10px] text-muted-foreground uppercase tracking-wide">
                          {dayLabel}
                        </div>
                        <h2
                          className="font-bold text-foreground text-xl leading-snug"
                          id={sidebarHeaderId}
                        >
                          {currentDay?.title ?? title}
                        </h2>
                        <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                          {narrative}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {directionsUrl ? (
                            <a
                              className={routePrimaryLinkClass}
                              href={directionsUrl}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <Navigation className="size-3.5 shrink-0 rotate-90" />
                              Open route
                            </a>
                          ) : null}
                          <ItineraryCopyMenu
                            copied={copied}
                            copyRef={copyRefSidebarHero}
                            isCopyOpen={copyMenuSlot === "sidebar-hero"}
                            onCopy={handleCopy}
                            onToggle={() =>
                              setCopyMenuSlot((s) =>
                                s === "sidebar-hero" ? null : "sidebar-hero"
                              )
                            }
                            reduceMotion={reduceMotion}
                            transition={transition}
                            trigger="hero"
                          />
                        </div>
                      </div>
                      <section
                        aria-labelledby={sidebarHeaderId}
                        className="px-3 pb-3"
                      >
                        {renderSegment("Morning", grouped.morning)}
                        {renderSegment("Afternoon", grouped.afternoon)}
                      </section>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 pt-3 pb-3 md:hidden">
          <div className="rounded-xl border border-border/80 bg-background">
            <div className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {dayLabel}
                </div>
                <h2 className="font-semibold text-foreground text-lg leading-snug">
                  {currentDay?.title ?? title}
                </h2>
                <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                  {narrative}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <ItineraryCopyMenu
                  copied={copied}
                  copyRef={copyRefMobile}
                  isCopyOpen={copyMenuSlot === "mobile"}
                  onCopy={handleCopy}
                  onToggle={() =>
                    setCopyMenuSlot((s) => (s === "mobile" ? null : "mobile"))
                  }
                  reduceMotion={reduceMotion}
                  transition={transition}
                />
                {directionsUrl ? (
                  <a
                    aria-label="Open route in Google Maps"
                    className={cn(buttonVariants({ size: "icon" }), "h-8 w-8")}
                    href={directionsUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Navigation className="size-4 rotate-90" />
                  </a>
                ) : null}
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 overflow-x-auto overscroll-contain px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {locations.map((loc, index) => (
                <ItineraryStopCard
                  compact
                  index={index}
                  key={`${loc.place_id ?? loc.name}-${index}`}
                  loc={loc}
                  onSelect={setSelectedStopIndex}
                  selected={index === safeStopIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Escape text embedded in static Leaflet marker HTML. */
export function escapeHtmlForMapMarker(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type MapPhotoMarkerContent = {
  name: string;
  thumbUrl?: string;
  /** Single letter or short fallback when there is no image. */
  initial: string;
  /** Shown in the top-right roundel (e.g. stop index). */
  labelNumber: number;
  selected: boolean;
  /**
   * When >1, draws one or two empty “back” cards (travel-app style) to hint
   * multiple photos for this place.
   */
  stackHintCount?: number;
};

/**
 * HTML for a “travel map” photo marker: white mat, thin dark outline, float
 * shadow, optional fanned back cards, black badge with a white number.
 */
export function buildMapPhotoMarkerHtml(c: MapPhotoMarkerContent): string {
  const {
    name,
    thumbUrl,
    initial,
    labelNumber,
    selected,
    stackHintCount = 0,
  } = c;
  const safeName = escapeHtmlForMapMarker(name);
  const hasImg = Boolean(thumbUrl);
  const clipBox =
    "overflow:hidden;border-radius:9px;width:40px;height:40px;line-height:0;flex-shrink:0";
  const mediaInner = hasImg
    ? `<div style="${clipBox}"><img alt="${safeName}" class="m-0 block" style="width:100%;height:100%;max-width:100%;max-height:100%;object-fit:cover;vertical-align:top;display:block" src="${escapeHtmlForMapMarker(thumbUrl as string)}" /></div>`
    : `<div style="${clipBox}"><span class="flex h-full w-full select-none items-center justify-center bg-stone-200 text-stone-600 text-sm font-semibold">${escapeHtmlForMapMarker(initial)}</span></div>`;
  const dropShadow = selected
    ? "0 0 0 2px var(--ring), 0 6px 20px -4px rgba(0,0,0,0.3), 0 2px 8px -2px rgba(0,0,0,0.16)"
    : "0 6px 20px -4px rgba(0,0,0,0.3), 0 2px 8px -2px rgba(0,0,0,0.16)";
  const frame = [
    "box-sizing:border-box",
    "position:relative",
    "width:48px",
    "height:48px",
    "padding:3px",
    "background:#fff",
    "border:1px solid rgba(0,0,0,0.9)",
    "border-radius:14px",
    `box-shadow:${dropShadow}`,
  ].join(";");

  const showStack = stackHintCount > 1;
  /** Furthest back first in DOM. */
  const backFurthest =
    showStack && stackHintCount > 2
      ? `<div style="position:absolute;z-index:0;left:0;top:0;width:48px;height:48px;border-radius:14px;background:#fff;border:1px solid rgba(0,0,0,0.7);box-shadow:0 2px 4px rgba(0,0,0,0.1);transform:translate(5px,5px)"></div>`
      : "";
  const backNearer = showStack
    ? `<div style="position:absolute;z-index:0;left:0;top:0;width:48px;height:48px;border-radius:14px;background:#fff;border:1px solid rgba(0,0,0,0.82);box-shadow:0 2px 6px rgba(0,0,0,0.12);transform:translate(2.5px,2.5px)"></div>`
    : "";

  return `
<div class="pointer-events-none" style="transform:translate(-50%,-100%)">
  <div class="pointer-events-auto" style="position:relative;width:56px;height:56px;overflow:visible">
    ${backFurthest}
    ${backNearer}
    <div class="absolute top-0 left-0" style="z-index:1;${frame}">
    ${mediaInner}
    <div style="position:absolute;top:-4px;right:-4px;z-index:2;display:flex;min-width:18px;height:18px;align-items:center;justify-content:center;border-radius:9999px;background:#0a0a0a;padding:0 4px;font-size:10px;font-weight:700;line-height:1;color:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.35)">${labelNumber}</div>
    </div>
  </div>
  <div class="pointer-events-none" style="position:absolute;top:100%;left:50%;margin-top:4px;min-width:120px;max-width:200px;transform:translateX(-50%);text-align:center;font-size:11px;font-weight:700;color:var(--foreground);line-height:1.25;text-shadow:0 0 4px #fff,0 0 8px #fff,1px 1px 2px #fff">
    ${safeName}
  </div>
</div>`;
}

export function mapPhotoDivIcon(html: string): L.DivIcon {
  return L.divIcon({
    className:
      "leaflet-div-icon !m-0 !border-0 !bg-transparent p-0 shadow-none [&_.leaflet-marker-icon]:!border-0",
    html,
    iconAnchor: [0, 0],
    iconSize: [1, 1],
    popupAnchor: [0, 0],
  });
}
