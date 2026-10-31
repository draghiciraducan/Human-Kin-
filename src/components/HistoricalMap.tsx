import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Person, MapLocation } from '../types/genealogy';
import {
  MAP_LOCATIONS,
  MIGRATION_PATHS,
  TERRITORY_AREAS,
  HISTORICAL_PERIODS
} from '../data/biblicalData';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  MapPin,
  User,
  ChevronRight,
  Filter,
  Info,
  Globe,
  Scroll,
  Minimize2,
  X,
  Compass,
  Cpu,
  Sparkles
} from 'lucide-react';

interface HistoricalMapProps {
  onSelectPerson: (personId: string) => void;
  people: Person[];
  selectedLocationId?: string | null;
}

type MapMode = 'tiled_satellite' | 'parchment';

interface TileInfo {
  col: number;
  row: number;
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
}

// Global master dimension: 21600 x 10800
const MASTER_WIDTH = 21600;
const MASTER_HEIGHT = 10800;
const TILE_COLS = 8;
const TILE_ROWS = 4;
const TILE_WIDTH = MASTER_WIDTH / TILE_COLS; // 2700
const TILE_HEIGHT = MASTER_HEIGHT / TILE_ROWS; // 2700

export const HistoricalMap: React.FC<HistoricalMapProps> = ({
  onSelectPerson,
  people,
  selectedLocationId
}) => {
  // Map Mode: Dynamic Tiled Satellite Map (Default) or Parchment
  const [mapMode, setMapMode] = useState<MapMode>('tiled_satellite');

  // Contextual menu collapsed state
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);

  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [filterPersonId, setFilterPersonId] = useState<string>('all');
  const [showTerritories, setShowTerritories] = useState<boolean>(true);
  const [showMigrations, setShowMigrations] = useState<boolean>(true);
  const [showCities, setShowCities] = useState<boolean>(true);
  const [animateMigrations, setAnimateMigrations] = useState<boolean>(true);

  // Active expanded item
  const [activeLocation, setActiveLocation] = useState<MapLocation | null>(() => {
    if (selectedLocationId) {
      return MAP_LOCATIONS.find((l) => l.id === selectedLocationId) || null;
    }
    return MAP_LOCATIONS[0]; // Eden
  });
  const [activeMigrationId, setActiveMigrationId] = useState<string | null>(null);

  // Viewport / Pan & Zoom state
  // On a 21600 x 10800 canvas:
  // zoom 0.065 = fit whole globe on ~1400px screen
  // zoom 0.35 = regional Near East view
  // zoom 1.0 = native 1:1 pixel scale (1 km per pixel)
  // zoom 2.5 = deep super-zoom
  const [zoom, setZoom] = useState<number>(0.28);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 1400,
    height: 800
  });

  // Track container size
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch pinch tracking
  const touchStateRef = useRef<{
    mode: 'none' | 'pan' | 'pinch';
    startX: number;
    startY: number;
    initialPanX: number;
    initialPanY: number;
    initialDist: number;
    initialZoom: number;
    midpointX: number;
    midpointY: number;
  }>({
    mode: 'none',
    startX: 0,
    startY: 0,
    initialPanX: 0,
    initialPanY: 0,
    initialDist: 0,
    initialZoom: 0.28,
    midpointX: 0,
    midpointY: 0
  });

  // Measure container dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Set initial centering on Near East / Mesopotamia
  const centerOnBiblicalRegion = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (mapMode === 'tiled_satellite') {
      // Mesopotamia is at X: ~63% (13,600), Y: ~32.5% (3,510) of 21600x10800
      const targetMapX = MASTER_WIDTH * 0.63;
      const targetMapY = MASTER_HEIGHT * 0.325;
      const initialZ = 0.32;
      setZoom(initialZ);
      setPan({
        x: rect.width / 2 - targetMapX * initialZ,
        y: rect.height / 2 - targetMapY * initialZ
      });
    } else {
      const initialZ = 1.1;
      setZoom(initialZ);
      setPan({
        x: rect.width / 2 - (1400 / 2) * initialZ,
        y: rect.height / 2 - (787.5 / 2) * initialZ
      });
    }
  }, [mapMode]);

  useEffect(() => {
    centerOnBiblicalRegion();
  }, [centerOnBiblicalRegion]);

  // Center on specific location when selectedLocationId changes
  useEffect(() => {
    if (selectedLocationId) {
      const loc = MAP_LOCATIONS.find((l) => l.id === selectedLocationId);
      if (loc) {
        setActiveLocation(loc);
        focusLocation(loc);
      }
    }
  }, [selectedLocationId]);

  const focusLocation = (loc: MapLocation) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (mapMode === 'tiled_satellite') {
      const coords = loc.satelliteCoordinates;
      const targetX = (coords.x / 100) * MASTER_WIDTH;
      const targetY = (coords.y / 100) * MASTER_HEIGHT;
      const targetZoom = Math.max(zoom, 0.65);

      setZoom(targetZoom);
      setPan({
        x: rect.width / 2 - targetX * targetZoom,
        y: rect.height / 2 - targetY * targetZoom
      });
    } else {
      const coords = loc.coordinates;
      const targetX = (coords.x / 100) * 1400;
      const targetY = (coords.y / 100) * 787.5;
      const targetZoom = Math.max(zoom, 1.5);

      setZoom(targetZoom);
      setPan({
        x: rect.width / 2 - targetX * targetZoom,
        y: rect.height / 2 - targetY * targetZoom
      });
    }
  };

  // Zoom centered on a focal point
  const applyZoomAtPoint = (newZoom: number, focalX: number, focalY: number) => {
    const minZ = mapMode === 'tiled_satellite' ? 0.05 : 0.6;
    const maxZ = mapMode === 'tiled_satellite' ? 3.0 : 5.0;
    const clampedZoom = Math.min(Math.max(minZ, newZoom), maxZ);

    setZoom((oldZoom) => {
      const zoomRatio = clampedZoom / oldZoom;
      setPan((oldPan) => ({
        x: focalX - (focalX - oldPan.x) * zoomRatio,
        y: focalY - (focalY - oldPan.y) * zoomRatio
      }));
      return clampedZoom;
    });
  };

  // MOUSE DRAG HANDLERS
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // MOUSE WHEEL ZOOM
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const focalX = e.clientX - rect.left;
    const focalY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.18 : 0.85;
    applyZoomAtPoint(zoom * zoomFactor, focalX, focalY);
  };

  // TOUCH GESTURE HANDLERS (Drag & Pinch to Zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (e.touches.length === 1) {
      touchStateRef.current = {
        mode: 'pan',
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
        initialDist: 0,
        initialZoom: zoom,
        midpointX: 0,
        midpointY: 0
      };
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const midX = (t1.clientX + t2.clientX) / 2 - rect.left;
      const midY = (t1.clientY + t2.clientY) / 2 - rect.top;

      touchStateRef.current = {
        mode: 'pinch',
        startX: 0,
        startY: 0,
        initialPanX: pan.x,
        initialPanY: pan.y,
        initialDist: dist,
        initialZoom: zoom,
        midpointX: midX,
        midpointY: midY
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const state = touchStateRef.current;

    if (e.touches.length === 1 && state.mode === 'pan') {
      const deltaX = e.touches[0].clientX - state.startX;
      const deltaY = e.touches[0].clientY - state.startY;
      setPan({
        x: state.initialPanX + deltaX,
        y: state.initialPanY + deltaY
      });
    } else if (e.touches.length === 2 && state.mode === 'pinch') {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

      if (state.initialDist > 0) {
        const pinchRatio = dist / state.initialDist;
        const minZ = mapMode === 'tiled_satellite' ? 0.05 : 0.6;
        const maxZ = mapMode === 'tiled_satellite' ? 3.0 : 5.0;
        const targetZoom = Math.min(Math.max(minZ, state.initialZoom * pinchRatio), maxZ);

        const currentMidX = (t1.clientX + t2.clientX) / 2 - rect.left;
        const currentMidY = (t1.clientY + t2.clientY) / 2 - rect.top;

        const zoomRatio = targetZoom / state.initialZoom;
        setZoom(targetZoom);
        setPan({
          x: currentMidX - (state.midpointX - state.initialPanX) * zoomRatio,
          y: currentMidY - (state.midpointY - state.initialPanY) * zoomRatio
        });
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      touchStateRef.current.mode = 'none';
    } else if (e.touches.length === 1) {
      touchStateRef.current = {
        mode: 'pan',
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
        initialDist: 0,
        initialZoom: zoom,
        midpointX: 0,
        midpointY: 0
      };
    }
  };

  // Zoom control buttons
  const zoomIn = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    applyZoomAtPoint(zoom * 1.35, rect.width / 2, rect.height / 2);
  };

  const zoomOut = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    applyZoomAtPoint(zoom * 0.75, rect.width / 2, rect.height / 2);
  };

  const zoomToGlobal = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const z = rect.width / MASTER_WIDTH;
    setZoom(z);
    setPan({ x: 0, y: (rect.height - MASTER_HEIGHT * z) / 2 });
  };

  const setNative1kmZoom = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    applyZoomAtPoint(1.0, rect.width / 2, rect.height / 2);
  };

  // -------------------------------------------------------------
  // DYNAMIC TILE VIEWPORT CULLING & RAM MANAGEMENT
  // Keep only the tiles currently visible on the screen in RAM!
  // Outside tiles are immediately unmounted and released from memory.
  // -------------------------------------------------------------
  const allTiles: TileInfo[] = useMemo(() => {
    const list: TileInfo[] = [];
    for (let r = 0; r < TILE_ROWS; r++) {
      for (let c = 0; c < TILE_COLS; c++) {
        list.push({
          col: c,
          row: r,
          x: c * TILE_WIDTH,
          y: r * TILE_HEIGHT,
          width: TILE_WIDTH,
          height: TILE_HEIGHT,
          src: `/assets/tiles/tile_${c}_${r}.jpg`
        });
      }
    }
    return list;
  }, []);

  // Compute which tiles intersect with the active screen viewport
  const visibleTiles = useMemo(() => {
    if (mapMode !== 'tiled_satellite') return [];

    // Pre-buffer by 300px in screen space so tiles render seamlessly right before entering view
    const buffer = 300 / zoom;
    const visibleLeft = -pan.x / zoom - buffer;
    const visibleTop = -pan.y / zoom - buffer;
    const visibleRight = (containerSize.width - pan.x) / zoom + buffer;
    const visibleBottom = (containerSize.height - pan.y) / zoom + buffer;

    return allTiles.filter((tile) => {
      const tileRight = tile.x + tile.width;
      const tileBottom = tile.y + tile.height;
      return (
        tileRight >= visibleLeft &&
        tile.x <= visibleRight &&
        tileBottom >= visibleTop &&
        tile.y <= visibleBottom
      );
    });
  }, [allTiles, mapMode, pan.x, pan.y, zoom, containerSize.width, containerSize.height]);

  // Filtered dataset
  const filteredMigrations = MIGRATION_PATHS.filter((mig) => {
    if (filterPersonId !== 'all' && mig.personId !== filterPersonId) return false;
    if (selectedPeriod === 'creation') {
      return mig.id === 'mig-eden-expulsion';
    }
    if (selectedPeriod === 'first_sons') {
      return mig.id === 'mig-eden-expulsion' || mig.id.startsWith('mig-cain');
    }
    if (selectedPeriod === 'set_line') {
      return mig.id === 'mig-set-expansion';
    }
    return true;
  });

  const filteredLocations = MAP_LOCATIONS.filter((loc) => {
    if (filterPersonId !== 'all') {
      return loc.associatedPersonIds.includes(filterPersonId);
    }
    if (selectedPeriod === 'creation') {
      return loc.id === 'eden' || loc.id === 'havilah';
    }
    if (selectedPeriod === 'first_sons') {
      return loc.id === 'eden' || loc.id === 'nod' || loc.id === 'enoch_city';
    }
    if (selectedPeriod === 'set_line') {
      return loc.id === 'mesopotamia' || loc.id === 'eden' || loc.id === 'hebron';
    }
    return true;
  });

  const activeMigration = MIGRATION_PATHS.find((m) => m.id === activeMigrationId);

  // INVERSE ZOOM SCALING:
  // In mapMode === 'tiled_satellite', the SVG space is 21600 x 10800.
  // 1 screen pixel = 1 / zoom SVG units.
  // We scale pins and labels by (1 / zoom) so they always stay crisp 11px!
  const markerScale = 1 / zoom;

  // Approximate RAM usage for visible tiles (~1.5MB per tile uncompressed in VRAM)
  const estimatedRamMB = Math.round(visibleTiles.length * 2.8 + 4);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] max-h-[calc(100dvh-4rem)] bg-[#020202] overflow-hidden select-none touch-none">
      
      {/* 1. FULL VIEWPORT TILED MAP CANVAS */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div
          className="absolute inset-0 transition-transform duration-75 origin-top-left pointer-events-none"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            willChange: 'transform'
          }}
        >
          {/* Base Map Frame */}
          <div
            style={{
              width: mapMode === 'tiled_satellite' ? `${MASTER_WIDTH}px` : '1400px',
              height: mapMode === 'tiled_satellite' ? `${MASTER_HEIGHT}px` : '787.5px'
            }}
            className="relative shadow-2xl overflow-hidden bg-black pointer-events-auto"
          >
            {mapMode === 'tiled_satellite' ? (
              <>
                {/* 1.1 Low-res base overview backdrop (Only 400KB - always in RAM for smooth gliding) */}
                <img
                  src="/assets/tiles/overview.jpg"
                  style={{ width: `${MASTER_WIDTH}px`, height: `${MASTER_HEIGHT}px` }}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                />

                {/* 1.2 DYNAMICALLY MOUNTED TILES (Only visible ones in RAM! Unmounted when outside screen) */}
                {visibleTiles.map((tile) => (
                  <img
                    key={`tile-${tile.col}-${tile.row}`}
                    src={tile.src}
                    style={{
                      position: 'absolute',
                      left: `${tile.x}px`,
                      top: `${tile.y}px`,
                      width: `${tile.width}px`,
                      height: `${tile.height}px`
                    }}
                    alt=""
                    loading="eager"
                    className="pointer-events-none select-none"
                  />
                ))}
              </>
            ) : (
              /* 1.3 Parchment Map */
              <img
                src="/src/assets/images/ancient_biblical_map_1793478786885.jpg"
                alt="Harta Pergament Antică"
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            )}

            {/* SVG Interactive Overlay Layer */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-auto"
              viewBox={mapMode === 'tiled_satellite' ? '0 0 21600 10800' : '0 0 1000 562.5'}
              preserveAspectRatio="none"
            >
              <defs>
                {/* SVG Hatch Patterns */}
                <pattern
                  id="tile-hatch-diagonal"
                  width="32"
                  height="32"
                  patternTransform="rotate(45 0 0)"
                  patternUnits="userSpaceOnUse"
                >
                  <line x1="0" y1="0" x2="0" y2="32" stroke="#22c55e" strokeWidth="4" strokeOpacity="0.65" />
                </pattern>
                <pattern
                  id="tile-hatch-cross"
                  width="36"
                  height="36"
                  patternUnits="userSpaceOnUse"
                >
                  <line x1="0" y1="0" x2="36" y2="36" stroke="#ef4444" strokeWidth="4" strokeOpacity="0.65" />
                  <line x1="36" y1="0" x2="0" y2="36" stroke="#ef4444" strokeWidth="4" strokeOpacity="0.65" />
                </pattern>
                <pattern
                  id="tile-hatch-dots"
                  width="36"
                  height="36"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="18" cy="18" r="4.5" fill="#f59e0b" fillOpacity="0.75" />
                </pattern>

                {/* Arrow markers */}
                <marker
                  id="arrow-tile-red"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
                </marker>
                <marker
                  id="arrow-tile-amber"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                </marker>
                <marker
                  id="arrow-tile-blue"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                </marker>
              </defs>

              {/* 1. TERRITORY HATCHINGS (Hașuri de teritorii) */}
              {showTerritories && (
                <g className="territory-layer">
                  {TERRITORY_AREAS.map((terr) => {
                    let pathData = terr.path;
                    if (mapMode === 'tiled_satellite') {
                      // Scale satellite path from 2000x1000 to 21600x10800
                      pathData = terr.satellitePath.replace(
                        /([0-9.]+)\s+([0-9.]+)/g,
                        (_, px, py) => `${Number(px) * 10.8} ${Number(py) * 10.8}`
                      );
                    }

                    const patternId =
                      terr.hatchPattern === 'cross'
                        ? 'tile-hatch-cross'
                        : terr.hatchPattern === 'dots'
                        ? 'tile-hatch-dots'
                        : 'tile-hatch-diagonal';

                    return (
                      <g key={terr.id} className="cursor-pointer group">
                        <path
                          d={pathData}
                          fill={`url(#${patternId})`}
                          stroke={terr.color}
                          strokeWidth="3"
                          strokeDasharray="8 5"
                          vectorEffect="non-scaling-stroke"
                          className="transition-all duration-200 group-hover:opacity-100 opacity-80"
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* 2. MIGRATION ARROWS (Săgeți de migrație) */}
              {showMigrations && (
                <g className="migration-layer">
                  {filteredMigrations.map((mig) => {
                    const isSat = mapMode === 'tiled_satellite';
                    const start = isSat ? mig.satelliteStartCoord : mig.startCoord;
                    const end = isSat ? mig.satelliteEndCoord : mig.endCoord;
                    const ctrl = isSat
                      ? mig.satelliteControlPoint || { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 2 }
                      : mig.controlPoint || { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 5 };

                    const vW = isSat ? MASTER_WIDTH : 1000;
                    const vH = isSat ? MASTER_HEIGHT : 562.5;

                    const startX = (start.x / 100) * vW;
                    const startY = (start.y / 100) * vH;
                    const endX = (end.x / 100) * vW;
                    const endY = (end.y / 100) * vH;
                    const ctrlX = (ctrl.x / 100) * vW;
                    const ctrlY = (ctrl.y / 100) * vH;

                    const pathData = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
                    const isSelected = activeMigrationId === mig.id;
                    const markerColor =
                      mig.color === '#dc2626'
                        ? 'url(#arrow-tile-red)'
                        : mig.color === '#2563eb'
                        ? 'url(#arrow-tile-blue)'
                        : 'url(#arrow-tile-amber)';

                    return (
                      <g
                        key={mig.id}
                        className="cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMigrationId(isSelected ? null : mig.id);
                        }}
                      >
                        {/* Hover hit area */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke="transparent"
                          strokeWidth="40"
                          className="cursor-pointer"
                        />
                        {/* Dark contrast halo */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke="#000000"
                          strokeWidth={isSelected ? 6 : 4}
                          vectorEffect="non-scaling-stroke"
                          strokeOpacity="0.85"
                        />
                        {/* Animated flowing line */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke={mig.color === '#2563eb' ? '#38bdf8' : mig.color}
                          strokeWidth={isSelected ? 4 : 2.8}
                          vectorEffect="non-scaling-stroke"
                          strokeDasharray={animateMigrations ? '8 5' : 'none'}
                          markerEnd={markerColor}
                          className={animateMigrations ? 'animate-[dash_1.5s_linear_infinite]' : ''}
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* 3. CITIES & SETTLEMENTS (Scalare inversă pentru mărime fină de 11px) */}
              {showCities && (
                <g className="cities-layer">
                  {filteredLocations.map((loc) => {
                    const isSat = mapMode === 'tiled_satellite';
                    const coords = isSat ? loc.satelliteCoordinates : loc.coordinates;
                    const vW = isSat ? MASTER_WIDTH : 1000;
                    const vH = isSat ? MASTER_HEIGHT : 562.5;

                    const cx = (coords.x / 100) * vW;
                    const cy = (coords.y / 100) * vH;
                    const isSelected = activeLocation?.id === loc.id;

                    const dotColor =
                      loc.type === 'garden'
                        ? '#22c55e'
                        : loc.type === 'city'
                        ? '#ef4444'
                        : loc.type === 'mountain'
                        ? '#a855f7'
                        : '#f59e0b';

                    const textLabel = loc.name;
                    const approxTextWidth = textLabel.length * 6.8 + 16;

                    return (
                      <g
                        key={loc.id}
                        className="cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveLocation(loc);
                          setActiveMigrationId(null);
                        }}
                        /* INVERSE ZOOM SCALING:
                           Pivots around (cx, cy) using scale(1 / zoom).
                           Inside this group, coordinates are in constant screen pixels! */
                        transform={`translate(${cx}, ${cy}) scale(${markerScale})`}
                      >
                        {/* Pulse beacon when selected */}
                        {isSelected && (
                          <circle
                            cx="0"
                            cy="0"
                            r="16"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2.5"
                            className="animate-ping opacity-80"
                          />
                        )}

                        {/* High-visibility pin marker (6px in screen pixels) */}
                        <circle
                          cx="0"
                          cy="0"
                          r={isSelected ? 8 : 6}
                          fill={dotColor}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="transition-transform group-hover:scale-125 shadow-xl"
                        />
                        <circle
                          cx="0"
                          cy="0"
                          r="2.5"
                          fill="#ffffff"
                        />

                        {/* Crisp cartographic nameplate */}
                        <g transform="translate(0, -13)">
                          <rect
                            x={-approxTextWidth / 2}
                            y="-16"
                            width={approxTextWidth}
                            height="19"
                            rx="4"
                            fill="#09090b"
                            fillOpacity="0.92"
                            stroke={isSelected ? '#f59e0b' : '#3f3f46'}
                            strokeWidth="1.2"
                          />
                          <text
                            x="0"
                            y="-3.5"
                            textAnchor="middle"
                            fill={isSelected ? '#fef08a' : '#f4f4f5'}
                            fontSize="11"
                            fontFamily="Cinzel, serif"
                            fontWeight="600"
                            letterSpacing="0.4"
                          >
                            {textLabel}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* 2. CONTEXTUAL CONTROL MENU (Cu buton de închidere / restrângere) */}
      <div className="interactive-control absolute top-4 left-4 z-30 select-none">
        {isMenuCollapsed ? (
          /* Minimized pill icon button */
          <button
            onClick={() => setIsMenuCollapsed(false)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-[#181614]/95 hover:bg-[#25221e] text-amber-200 border border-stone-700/80 rounded-lg shadow-2xl backdrop-blur-md transition-all duration-200 group cursor-pointer"
            title="Deschide Meniul de Control și Filtre"
          >
            <Filter className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-cinzel text-xs font-semibold tracking-wide">
              Filtre & Perioade ({filteredLocations.length})
            </span>
            <ChevronRight className="w-3 h-3 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          /* Expanded Full Control Panel */
          <div className="w-80 max-w-[calc(100vw-2rem)] bg-[#1c1917]/95 text-stone-100 backdrop-blur-md rounded-lg shadow-2xl border border-stone-700 overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150">
            {/* Header with Close Button */}
            <div className="p-3 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-cinzel font-semibold tracking-wider text-amber-100 text-xs">
                  Control & Filtre Istorice
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsMenuCollapsed(true)}
                className="flex items-center gap-1 px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                title="Închide / Restrânge Meniul"
              >
                <Minimize2 className="w-3 h-3 text-amber-400" />
                <span>Închide</span>
              </button>
            </div>

            <div className="p-3 space-y-3 max-h-[calc(100vh-14rem)] overflow-y-auto">
              {/* Map Theme Toggle: Dynamic Tiled Satellite vs Parchment */}
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1">
                  Fundal Cartografic & Încărcare RAM
                </label>
                <div className="flex flex-col gap-1 p-1 bg-stone-900 rounded-md border border-stone-800">
                  <button
                    onClick={() => setMapMode('tiled_satellite')}
                    className={`flex items-center justify-between py-1.5 px-2.5 rounded text-xs transition-colors cursor-pointer ${
                      mapMode === 'tiled_satellite'
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Satelit Dinamic (Harta Ta 21.600 px)</span>
                    </span>
                    <span className="text-[10px] font-mono opacity-80 font-bold">1 km/px</span>
                  </button>

                  <button
                    onClick={() => setMapMode('parchment')}
                    className={`flex items-center justify-between py-1.5 px-2.5 rounded text-xs transition-colors cursor-pointer ${
                      mapMode === 'parchment'
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Scroll className="w-3.5 h-3.5" />
                      <span>Harta Pergament Antică</span>
                    </span>
                    <span className="text-[10px] font-mono opacity-80">Atlas</span>
                  </button>
                </div>
              </div>

              {/* Dynamic RAM Protection Indicator (Cerut explicit de utilizator) */}
              {mapMode === 'tiled_satellite' && (
                <div className="p-2 bg-stone-900/90 rounded border border-stone-800 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>RAM Protejat Activ:</span>
                  </span>
                  <span className="text-stone-200">
                    {visibleTiles.length} / 32 segmente (~{estimatedRamMB} MB)
                  </span>
                </div>
              )}

              {/* Historical Period Selector */}
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1">
                  Perioadă Istorică
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  {HISTORICAL_PERIODS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.rangeAM})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Biblical Person */}
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1">
                  Filtrează după Personaj
                </label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setFilterPersonId('all')}
                    className={`px-2 py-1 rounded text-center truncate cursor-pointer ${
                      filterPersonId === 'all'
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    Toți ({people.length})
                  </button>
                  {people.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setFilterPersonId(p.id)}
                      className={`px-2 py-1 rounded text-center truncate cursor-pointer ${
                        filterPersonId === p.id
                          ? 'bg-amber-400 text-stone-950 font-bold'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                      title={p.name}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layer Toggles */}
              <div className="pt-2 border-t border-stone-800 space-y-2">
                <span className="block text-[11px] font-medium text-stone-400">
                  Straturi Active
                </span>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-stone-300 hover:text-white cursor-pointer text-xs">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hașuri de Teritorii</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={showTerritories}
                      onChange={(e) => setShowTerritories(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-stone-300 hover:text-white cursor-pointer text-xs">
                    <span className="flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-red-400" />
                      <span>Săgeți de Migrație</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={showMigrations}
                      onChange={(e) => setShowMigrations(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-stone-300 hover:text-white cursor-pointer text-xs">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cetăți & Așezări</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={showCities}
                      onChange={(e) => setShowCities(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div className="pt-2 border-t border-stone-800 space-y-1.5">
                <span className="block text-[11px] font-medium text-stone-400">
                  Focalizează Reper
                </span>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => {
                      const eden = MAP_LOCATIONS.find((l) => l.id === 'eden');
                      if (eden) focusLocation(eden);
                    }}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs cursor-pointer"
                  >
                    Eden
                  </button>
                  <button
                    onClick={() => {
                      const enoch = MAP_LOCATIONS.find((l) => l.id === 'enoch_city');
                      if (enoch) focusLocation(enoch);
                    }}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-red-300 rounded text-xs cursor-pointer"
                  >
                    Cetatea Enoh
                  </button>
                  <button
                    onClick={() => {
                      const mesop = MAP_LOCATIONS.find((l) => l.id === 'mesopotamia');
                      if (mesop) focusLocation(mesop);
                    }}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-sky-300 rounded text-xs cursor-pointer"
                  >
                    Mesopotamia
                  </button>
                  <button
                    onClick={() => {
                      const ararat = MAP_LOCATIONS.find((l) => l.id === 'ararat');
                      if (ararat) focusLocation(ararat);
                    }}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-purple-300 rounded text-xs cursor-pointer"
                  >
                    Ararat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. ZOOM & ORIENTATION CONTROLS (Top-Right) */}
      <div className="interactive-control absolute top-4 right-4 z-30 flex flex-col gap-1.5 bg-[#1c1917]/95 text-stone-200 backdrop-blur-md p-1.5 rounded-lg shadow-xl border border-stone-700">
        <button
          onClick={zoomIn}
          className="p-2 rounded hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
          title="Mărește (Zoom In)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 rounded hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
          title="Micșorează (Zoom Out)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        {mapMode === 'tiled_satellite' && (
          <>
            <button
              onClick={setNative1kmZoom}
              className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-[10px] font-mono font-bold text-amber-300 transition-colors cursor-pointer"
              title="Zoom Nativ 1:1 (1 km/pixel)"
            >
              1 km/px
            </button>
            <button
              onClick={zoomToGlobal}
              className="p-2 rounded hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
              title="Vedere Globală Planetară"
            >
              <Globe className="w-4 h-4 text-sky-400" />
            </button>
          </>
        )}
        <button
          onClick={centerOnBiblicalRegion}
          className="p-2 rounded hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
          title="Focalizează Orientul Apropiat & Eden"
        >
          <Compass className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* 4. EXPANDABLE LANDMARK DETAIL CARD (Bottom-Right) */}
      {activeLocation && (
        <div className="interactive-control absolute bottom-4 right-4 z-30 w-88 max-w-[calc(100vw-2rem)] bg-[#1c1917]/98 text-stone-100 backdrop-blur-md rounded-lg shadow-2xl border border-stone-700 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-3 bg-stone-900/90 border-b border-stone-800 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    activeLocation.type === 'garden'
                      ? 'bg-green-500'
                      : activeLocation.type === 'city'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  }`}
                />
                <h3 className="font-cinzel text-sm font-bold text-amber-200">
                  {activeLocation.name}
                </h3>
              </div>
              <p className="text-[11px] font-serif text-stone-400 italic mt-0.5">
                {activeLocation.biblicalName}
              </p>
            </div>
            <button
              onClick={() => setActiveLocation(null)}
              className="text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer"
              title="Închide fișa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3.5 space-y-2.5 max-h-64 overflow-y-auto text-xs">
            <div className="flex items-center justify-between text-[10px] text-stone-400 pb-1.5 border-b border-stone-800">
              <span>{activeLocation.period}</span>
              <span className="font-mono text-amber-400 font-semibold">
                {activeLocation.biblicalReference}
              </span>
            </div>

            <p className="text-stone-300 leading-relaxed font-serif text-[12px]">
              {activeLocation.description}
            </p>

            <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20 text-[11px]">
              <span className="font-semibold text-amber-300 block mb-0.5">
                Semnificație Biblică:
              </span>
              <p className="text-stone-300">
                {activeLocation.significance}
              </p>
            </div>

            {activeLocation.associatedPersonIds.length > 0 && (
              <div className="pt-2 border-t border-stone-800">
                <span className="block text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  Personaje Consemnate Aici
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeLocation.associatedPersonIds.map((pId) => {
                    const person = people.find((p) => p.id === pId);
                    if (!person) return null;
                    return (
                      <button
                        key={pId}
                        onClick={() => onSelectPerson(pId)}
                        className="flex items-center gap-1 px-2 py-0.5 bg-stone-800 hover:bg-amber-400 hover:text-stone-950 rounded text-[11px] transition-colors cursor-pointer font-medium"
                      >
                        <User className="w-3 h-3" />
                        <span>{person.name}</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. ACTIVE MIGRATION DETAIL CARD */}
      {activeMigration && (
        <div className="interactive-control absolute bottom-4 left-4 z-30 w-76 bg-[#1c1917]/98 text-stone-200 backdrop-blur-md rounded-lg shadow-xl border border-stone-700 p-3 text-xs">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-red-400" />
              <h4 className="font-cinzel font-semibold text-amber-200 text-xs">
                {activeMigration.title}
              </h4>
            </div>
            <button
              onClick={() => setActiveMigrationId(null)}
              className="text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="font-serif text-stone-300 mb-2 leading-relaxed text-[11px]">
            {activeMigration.description}
          </p>
          <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1.5 border-t border-stone-800">
            <span>{activeMigration.period}</span>
            <span className="font-mono text-amber-400">
              {activeMigration.biblicalReference}
            </span>
          </div>
        </div>
      )}

      {/* 6. BOTTOM BANNER HINT */}
      <div className="no-print absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 bg-black/80 backdrop-blur-xs rounded-full text-[10px] text-stone-300 pointer-events-none flex items-center gap-2.5 shadow-lg border border-stone-800">
        <Info className="w-3 h-3 text-amber-400 shrink-0" />
        <span>
          Glisare dinamică activă · RAM: {visibleTiles.length} segmente în memorie · Întreaga planetă 21.600 px accesibilă
        </span>
      </div>
    </div>
  );
};
