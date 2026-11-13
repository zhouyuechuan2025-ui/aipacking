import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  GLOBE_LAND_POINTS,
  type GlobeCoordinate,
} from "./globeData";

export type AnimatedRouteMapPoint = GlobeCoordinate & {
  id: string;
  label: string;
};

export type AnimatedRouteMapLink = {
  from: string;
  to: string;
};

export type AnimatedRouteMapPreset = "mono" | "signal" | "neon";

export type AnimatedRouteMapProps = {
  points?: AnimatedRouteMapPoint[];
  links?: AnimatedRouteMapLink[];
  preset?: AnimatedRouteMapPreset;
  dotSize?: "small" | "medium" | "large" | "extra-large";
  dotJitter?: number;
  accent?: string;
  landColor?: string;
  sphereColor?: string;
  labelColor?: string;
  labelBackgroundColor?: string;
  routeWidth?: number;
  routeGlow?: number;
  centerLatitude?: number;
  centerLongitude?: number;
  rotationSpeed?: number;
  backsideOpacity?: number;
  graticuleOpacity?: number;
  sphereOpacity?: number;
  showLabels?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  size?: number;
};

type ProjectedPoint = {
  x: number;
  y: number;
  depth: number;
  visible: boolean;
};

type Vector3 = readonly [x: number, y: number, z: number];

type GlobeProjection = {
  centerX: number;
  centerY: number;
  radius: number;
};

const DEFAULT_POINTS: AnimatedRouteMapPoint[] = [
  { id: "new-york", label: "New York", latitude: 40.7128, longitude: -74.006 },
  { id: "madrid", label: "Madrid", latitude: 40.4168, longitude: -3.7038 },
  { id: "london", label: "London", latitude: 51.5072, longitude: -0.1276 },
  { id: "cairo", label: "Cairo", latitude: 30.0444, longitude: 31.2357 },
  { id: "tokyo", label: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  {
    id: "buenos-aires",
    label: "Buenos Aires",
    latitude: -34.6037,
    longitude: -58.3816,
  },
  { id: "nairobi", label: "Nairobi", latitude: -1.2921, longitude: 36.8219 },
  { id: "oslo", label: "Oslo", latitude: 59.9139, longitude: 10.7522 },
  {
    id: "reykjavik",
    label: "Reykjavik",
    latitude: 64.1466,
    longitude: -21.9426,
  },
  { id: "riyadh", label: "Riyadh", latitude: 24.7136, longitude: 46.6753 },
  { id: "athens", label: "Athens", latitude: 37.9838, longitude: 23.7275 },
  { id: "seoul", label: "Seoul", latitude: 37.5665, longitude: 126.978 },
  { id: "bangkok", label: "Bangkok", latitude: 13.7563, longitude: 100.5018 },
  {
    id: "santiago",
    label: "Santiago",
    latitude: -33.4489,
    longitude: -70.6693,
  },
  { id: "lima", label: "Lima", latitude: -12.0464, longitude: -77.0428 },
  {
    id: "addis-ababa",
    label: "Addis Ababa",
    latitude: 8.9806,
    longitude: 38.7578,
  },
  {
    id: "cape-town",
    label: "Cape Town",
    latitude: -33.9249,
    longitude: 18.4241,
  },
];

const DEFAULT_LINKS: AnimatedRouteMapLink[] = [
  { from: "new-york", to: "madrid" },
  { from: "madrid", to: "london" },
  { from: "madrid", to: "cairo" },
  { from: "madrid", to: "tokyo" },
  { from: "madrid", to: "buenos-aires" },
  { from: "madrid", to: "nairobi" },
  { from: "london", to: "oslo" },
  { from: "london", to: "reykjavik" },
  { from: "cairo", to: "riyadh" },
  { from: "cairo", to: "athens" },
  { from: "tokyo", to: "seoul" },
  { from: "tokyo", to: "bangkok" },
  { from: "buenos-aires", to: "santiago" },
  { from: "buenos-aires", to: "lima" },
  { from: "nairobi", to: "addis-ababa" },
  { from: "nairobi", to: "cape-town" },
];

const PARALLEL_LATITUDES = Array.from(
  { length: 11 },
  (_, index) => -75 + index * 15,
);
const MERIDIAN_LONGITUDES = Array.from(
  { length: 24 },
  (_, index) => -165 + index * 15,
);
const FINAL_ROTATION_SECONDS = 2;

type AnimatedRouteMapPresetProps = Required<
  Pick<
    AnimatedRouteMapProps,
    | "accent"
    | "landColor"
    | "sphereColor"
    | "labelColor"
    | "labelBackgroundColor"
    | "routeWidth"
    | "routeGlow"
  >
>;

export const ANIMATED_ROUTE_MAP_PRESETS: Record<
  AnimatedRouteMapPreset,
  AnimatedRouteMapPresetProps
> = {
  mono: {
    accent: "#f59e0b",
    landColor: "#f7f7f2",
    sphereColor: "#050505",
    labelColor: "#f7f7f2",
    labelBackgroundColor: "#0a0a0ae8",
    routeWidth: 4,
    routeGlow: 7,
  },
  signal: {
    accent: "#ff5c35",
    landColor: "#ffd2a6",
    sphereColor: "#170802",
    labelColor: "#fff7ef",
    labelBackgroundColor: "#1a0b04ed",
    routeWidth: 6,
    routeGlow: 14,
  },
  neon: {
    accent: "#c7ff4a",
    landColor: "#5ff6ff",
    sphereColor: "#011113",
    labelColor: "#e8feff",
    labelBackgroundColor: "#031719ed",
    routeWidth: 7,
    routeGlow: 18,
  },
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
const radiansToDegrees = (radians: number) => (radians * 180) / Math.PI;

const coordinateToVector = ({
  latitude,
  longitude,
}: GlobeCoordinate): Vector3 => {
  const latitudeRadians = degreesToRadians(latitude);
  const longitudeRadians = degreesToRadians(longitude);
  const latitudeCosine = Math.cos(latitudeRadians);

  return [
    latitudeCosine * Math.cos(longitudeRadians),
    Math.sin(latitudeRadians),
    latitudeCosine * Math.sin(longitudeRadians),
  ];
};

const vectorToCoordinate = ([x, y, z]: Vector3): GlobeCoordinate => ({
  latitude: radiansToDegrees(Math.atan2(y, Math.sqrt(x * x + z * z))),
  longitude: radiansToDegrees(Math.atan2(z, x)),
});

const interpolateGreatCircle = (
  from: GlobeCoordinate,
  to: GlobeCoordinate,
  progress: number,
): GlobeCoordinate => {
  const start = coordinateToVector(from);
  const end = coordinateToVector(to);
  const dot = Math.max(
    -1,
    Math.min(1, start[0] * end[0] + start[1] * end[1] + start[2] * end[2]),
  );
  const angle = Math.acos(dot);

  if (angle < 0.0001) return from;

  const angleSine = Math.sin(angle);
  const startWeight = Math.sin((1 - progress) * angle) / angleSine;
  const endWeight = Math.sin(progress * angle) / angleSine;

  return vectorToCoordinate([
    start[0] * startWeight + end[0] * endWeight,
    start[1] * startWeight + end[1] * endWeight,
    start[2] * startWeight + end[2] * endWeight,
  ]);
};

const projectCoordinate = (
  coordinate: GlobeCoordinate,
  centerLatitude: number,
  centerLongitude: number,
  projection: GlobeProjection,
): ProjectedPoint => {
  const latitude = degreesToRadians(coordinate.latitude);
  const longitudeDelta = degreesToRadians(
    coordinate.longitude - centerLongitude,
  );
  const centerLatitudeRadians = degreesToRadians(centerLatitude);
  const latitudeCosine = Math.cos(latitude);
  const depth =
    Math.sin(centerLatitudeRadians) * Math.sin(latitude) +
    Math.cos(centerLatitudeRadians) * latitudeCosine * Math.cos(longitudeDelta);

  return {
    x:
      projection.centerX +
      projection.radius * latitudeCosine * Math.sin(longitudeDelta),
    y:
      projection.centerY -
      projection.radius *
        (Math.cos(centerLatitudeRadians) * Math.sin(latitude) -
          Math.sin(centerLatitudeRadians) *
            latitudeCosine *
            Math.cos(longitudeDelta)),
    depth,
    visible: depth >= 0,
  };
};

const createVisiblePath = (points: ProjectedPoint[]) => {
  let path = "";
  let drawing = false;

  for (const point of points) {
    if (!point.visible) {
      drawing = false;
      continue;
    }

    path += `${drawing ? "L" : "M"}${point.x.toFixed(2)} ${point.y.toFixed(2)} `;
    drawing = true;
  }

  return path.trim();
};

const createLinkStages = (
  points: AnimatedRouteMapPoint[],
  links: AnimatedRouteMapLink[],
) => {
  const pointIds = new Set(points.map((point) => point.id));
  const destinations = new Set(links.map((link) => link.to));
  const nodeStages = new Map<string, number>();
  const linkStages: Array<number | undefined> = links.map(() => undefined);

  for (const pointId of pointIds) {
    if (!destinations.has(pointId)) nodeStages.set(pointId, 0);
  }

  let changed = true;
  while (changed) {
    changed = false;

    links.forEach((link, index) => {
      const fromStage = nodeStages.get(link.from);
      if (fromStage === undefined) return;

      if (linkStages[index] !== fromStage) {
        linkStages[index] = fromStage;
        changed = true;
      }

      const arrivalStage = fromStage + 1;
      const currentArrivalStage = nodeStages.get(link.to);
      if (
        currentArrivalStage === undefined ||
        arrivalStage < currentArrivalStage
      ) {
        nodeStages.set(link.to, arrivalStage);
        changed = true;
      }
    });
  }

  const resolvedStages = linkStages.filter(
    (stage): stage is number => stage !== undefined,
  );
  const fallbackStage =
    resolvedStages.length === 0 ? 0 : Math.max(...resolvedStages) + 1;
  const stages = linkStages.map((stage) => stage ?? fallbackStage);

  return {
    stages,
    stageCount: Math.max(1, ...stages.map((stage) => stage + 1)),
  };
};

export const AnimatedRouteMap: React.FC<AnimatedRouteMapProps> = (props) => {
  const {
    points = DEFAULT_POINTS,
    links = DEFAULT_LINKS,
    preset = "mono",
    dotSize = "medium",
    dotJitter = 0.25,
    centerLatitude = 18,
    centerLongitude = -2,
    rotationSpeed = 16,
    backsideOpacity = 0.16,
    graticuleOpacity = 0.12,
    sphereOpacity = 0,
    showLabels = true,
    x,
    y,
    width,
    height,
    size,
  } = props;
  const frame = useCurrentFrame();
  const {
    durationInFrames,
    fps,
    width: compositionWidth,
    height: compositionHeight,
  } = useVideoConfig();
  const resolvedWidth = width ?? compositionWidth * 0.8;
  const resolvedHeight = height ?? compositionHeight * 0.8;
  const left = x ?? (compositionWidth - resolvedWidth) / 2;
  const top = y ?? (compositionHeight - resolvedHeight) / 2;
  const resolvedGlobeSize =
    size ?? Math.min(resolvedWidth, resolvedHeight) * 0.844;
  const projection: GlobeProjection = {
    centerX: resolvedWidth / 2,
    centerY: resolvedHeight / 2,
    radius: resolvedGlobeSize / 2,
  };
  const safePoints = points.length > 0 ? points : DEFAULT_POINTS;
  const pointById = new Map(safePoints.map((point) => [point.id, point]));
  const safeLinks = links.filter(
    (link) => pointById.has(link.from) && pointById.has(link.to),
  );
  const routeStartFrame = Math.min(18, durationInFrames * 0.12);
  const routeEndFrame = Math.max(
    routeStartFrame + 1,
    durationInFrames - FINAL_ROTATION_SECONDS * fps,
  );
  const routeProgress = interpolate(
    frame,
    [routeStartFrame, routeEndFrame],
    [0, 1],
    {
      easing: Easing.bezier(0.65, 0, 0.35, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const currentCenterLongitude =
    centerLongitude + (rotationSpeed * frame) / fps;
  const presetProps = ANIMATED_ROUTE_MAP_PRESETS[preset];
  const resolvedAccent = props.accent ?? presetProps.accent;
  const landColor = props.landColor ?? presetProps.landColor;
  const sphereColor = props.sphereColor ?? presetProps.sphereColor;
  const labelColor = props.labelColor ?? presetProps.labelColor;
  const labelBackgroundColor =
    props.labelBackgroundColor ?? presetProps.labelBackgroundColor;
  const routeWidth = props.routeWidth ?? presetProps.routeWidth;
  const routeGlow = props.routeGlow ?? presetProps.routeGlow;
  const dotScale =
    dotSize === "small"
      ? 0.65
      : dotSize === "large"
        ? 1.4
        : dotSize === "extra-large"
          ? 1.85
          : 1;
  const landPoints = GLOBE_LAND_POINTS;
  const resolvedDotJitter = clamp(dotJitter);
  const { stages: linkStages, stageCount } = createLinkStages(
    safePoints,
    safeLinks,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: resolvedWidth,
          height: resolvedHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox={`0 0 ${resolvedWidth} ${resolvedHeight}`}
          width="100%"
          height="100%"
          aria-label="Animated dotted globe route map"
          role="img"
          style={{ overflow: "visible" }}
        >
          <defs>
            <radialGradient
              id="animated-route-map-sphere"
              cx="38%"
              cy="32%"
              r="74%"
            >
              <stop offset="0%" stopColor={sphereColor} stopOpacity="0.72" />
              <stop offset="78%" stopColor={sphereColor} stopOpacity="0.94" />
              <stop offset="100%" stopColor="#000000" stopOpacity="1" />
            </radialGradient>
          </defs>

          <g>
            {landPoints.map((point, index) => {
              const projected = projectCoordinate(
                {
                  latitude:
                    point.latitude + point.jitterLatitude * resolvedDotJitter,
                  longitude:
                    point.longitude + point.jitterLongitude * resolvedDotJitter,
                },
                centerLatitude,
                currentCenterLongitude,
                projection,
              );

              if (projected.depth >= 0) return null;

              return (
                <circle
                  key={`back-${index}`}
                  cx={projected.x}
                  cy={projected.y}
                  r={(1 + Math.abs(projected.depth) * 1.25) * dotScale}
                  fill={landColor}
                  opacity={
                    clamp(backsideOpacity) *
                    (0.35 + Math.abs(projected.depth) * 0.65)
                  }
                />
              );
            })}
          </g>

          <circle
            cx={projection.centerX}
            cy={projection.centerY}
            r={projection.radius}
            fill="url(#animated-route-map-sphere)"
            fillOpacity={clamp(sphereOpacity)}
            stroke={landColor}
            strokeOpacity="0.07"
            strokeWidth="2"
          />

          <g
            fill="none"
            stroke={landColor}
            strokeOpacity={clamp(graticuleOpacity)}
            strokeWidth="1.5"
          >
            {PARALLEL_LATITUDES.map((latitude) => {
              const path = createVisiblePath(
                Array.from({ length: 181 }, (_, index) =>
                  projectCoordinate(
                    { latitude, longitude: -180 + index * 2 },
                    centerLatitude,
                    currentCenterLongitude,
                    projection,
                  ),
                ),
              );

              return path ? (
                <path key={`parallel-${latitude}`} d={path} />
              ) : null;
            })}
            {MERIDIAN_LONGITUDES.map((longitude) => {
              const path = createVisiblePath(
                Array.from({ length: 91 }, (_, index) =>
                  projectCoordinate(
                    { latitude: -90 + index * 2, longitude },
                    centerLatitude,
                    currentCenterLongitude,
                    projection,
                  ),
                ),
              );

              return path ? (
                <path key={`meridian-${longitude}`} d={path} />
              ) : null;
            })}
          </g>

          <g>
            {landPoints.map((point, index) => {
              const projected = projectCoordinate(
                {
                  latitude:
                    point.latitude + point.jitterLatitude * resolvedDotJitter,
                  longitude:
                    point.longitude + point.jitterLongitude * resolvedDotJitter,
                },
                centerLatitude,
                currentCenterLongitude,
                projection,
              );

              if (projected.depth < 0) return null;

              return (
                <circle
                  key={index}
                  cx={projected.x}
                  cy={projected.y}
                  r={(1.6 + Math.max(0, projected.depth) * 2.35) * dotScale}
                  fill={landColor}
                  opacity={0.09 + Math.max(0, projected.depth) * 0.91}
                />
              );
            })}
          </g>

          <g
            fill="none"
            stroke={resolvedAccent}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: `drop-shadow(0 0 ${routeGlow}px ${resolvedAccent}99)`,
            }}
          >
            {safeLinks.map((link, linkIndex) => {
              const from = pointById.get(link.from);
              const to = pointById.get(link.to);
              if (!from || !to) return null;

              const linkProgress = clamp(
                routeProgress * stageCount - linkStages[linkIndex],
              );
              const sampleCount = 72;
              const visibleSamples = Math.max(
                1,
                Math.floor((sampleCount - 1) * linkProgress) + 1,
              );
              const projectedSamples = Array.from(
                { length: visibleSamples },
                (_, sampleIndex) =>
                  projectCoordinate(
                    interpolateGreatCircle(
                      from,
                      to,
                      sampleIndex / (sampleCount - 1),
                    ),
                    centerLatitude,
                    currentCenterLongitude,
                    projection,
                  ),
              );
              const path = createVisiblePath(projectedSamples);

              return path ? (
                <path
                  key={`${link.from}-${link.to}`}
                  d={path}
                  strokeWidth={routeWidth}
                  opacity={0.92}
                />
              ) : null;
            })}
          </g>

          {safePoints.map((point) => {
            const projected = projectCoordinate(
              point,
              centerLatitude,
              currentCenterLongitude,
              projection,
            );
            if (!projected.visible) return null;

            const incomingStages = safeLinks.flatMap((link, linkIndex) =>
              link.to === point.id ? [linkStages[linkIndex]] : [],
            );
            const reveal =
              incomingStages.length === 0
                ? 1
                : clamp(
                    (routeProgress * stageCount -
                      Math.min(...incomingStages) -
                      0.88) /
                      0.12,
                  );

            return (
              <g key={point.id} opacity={reveal}>
                <g
                  style={{
                    filter: `drop-shadow(0 0 ${routeGlow}px ${resolvedAccent}aa)`,
                  }}
                >
                  <circle
                    cx={projected.x}
                    cy={projected.y}
                    r={9 + reveal * 3}
                    fill={sphereColor}
                    stroke={resolvedAccent}
                    strokeWidth="4"
                  />
                  <circle
                    cx={projected.x}
                    cy={projected.y}
                    r="4.5"
                    fill={resolvedAccent}
                  />
                </g>
                {showLabels ? (
                  <g
                    transform={`translate(${projected.x + 20} ${projected.y - 52})`}
                  >
                    <rect
                      x="0"
                      y="0"
                      width={Math.max(112, point.label.length * 16 + 32)}
                      height="50"
                      rx="13"
                      fill={labelBackgroundColor}
                      stroke={landColor}
                      strokeOpacity="0.14"
                    />
                    <text
                      x="16"
                      y="33"
                      fill={labelColor}
                      fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                      fontSize="23"
                      fontWeight="700"
                    >
                      {point.label}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}

          {safeLinks.map((link, linkIndex) => {
            const from = pointById.get(link.from);
            const to = pointById.get(link.to);
            if (!from || !to) return null;

            const linkProgress = clamp(
              routeProgress * stageCount - linkStages[linkIndex],
            );
            if (linkProgress <= 0 || linkProgress >= 1) return null;

            const projected = projectCoordinate(
              interpolateGreatCircle(from, to, linkProgress),
              centerLatitude,
              currentCenterLongitude,
              projection,
            );
            if (!projected.visible) return null;

            return (
              <g
                key={`traveler-${link.from}-${link.to}`}
                style={{
                  filter: `drop-shadow(0 0 ${routeGlow + 6}px ${resolvedAccent})`,
                }}
              >
                <circle
                  cx={projected.x}
                  cy={projected.y}
                  r="18"
                  fill={resolvedAccent}
                  opacity="0.2"
                />
                <circle
                  cx={projected.x}
                  cy={projected.y}
                  r="7"
                  fill={resolvedAccent}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
