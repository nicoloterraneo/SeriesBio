import { useEffect, useMemo, useRef, useState } from 'react';

type Language = 'it' | 'en' | 'de';
type RegionId = 'north-america' | 'south-america' | 'europe' | 'africa' | 'asia' | 'oceania';

type Capital = { name: string; country: string; lon: number; lat: number; region: RegionId; featured?: boolean };
const capitals: Capital[] = [
  { name: 'Washington, D.C.', country: 'United States', lon: -77.04, lat: 38.91, region: 'north-america', featured: true },
  { name: 'Ottawa', country: 'Canada', lon: -75.7, lat: 45.42, region: 'north-america' },
  { name: 'Città del Messico', country: 'Mexico', lon: -99.13, lat: 19.43, region: 'north-america' },
  { name: 'Bogotá', country: 'Colombia', lon: -74.07, lat: 4.71, region: 'south-america' },
  { name: 'Lima', country: 'Perù', lon: -77.04, lat: -12.05, region: 'south-america' },
  { name: 'Brasília', country: 'Brasile', lon: -47.88, lat: -15.79, region: 'south-america', featured: true },
  { name: 'Buenos Aires', country: 'Argentina', lon: -58.38, lat: -34.6, region: 'south-america' },
  { name: 'Londra', country: 'Regno Unito', lon: -0.12, lat: 51.51, region: 'europe', featured: true },
  { name: 'Parigi', country: 'Francia', lon: 2.35, lat: 48.86, region: 'europe' },
  { name: 'Berlino', country: 'Germania', lon: 13.4, lat: 52.52, region: 'europe' },
  { name: 'Roma', country: 'Italia', lon: 12.5, lat: 41.9, region: 'europe' },
  { name: 'Madrid', country: 'Spagna', lon: -3.7, lat: 40.42, region: 'europe' },
  { name: 'Cairo', country: 'Egitto', lon: 31.24, lat: 30.04, region: 'africa', featured: true },
  { name: 'Abuja', country: 'Nigeria', lon: 7.49, lat: 9.06, region: 'africa' },
  { name: 'Nairobi', country: 'Kenya', lon: 36.82, lat: -1.29, region: 'africa' },
  { name: 'Pretoria', country: 'Sudafrica', lon: 28.23, lat: -25.75, region: 'africa' },
  { name: 'Riyadh', country: 'Arabia Saudita', lon: 46.68, lat: 24.71, region: 'asia' },
  { name: 'Nuova Delhi', country: 'India', lon: 77.21, lat: 28.61, region: 'asia' },
  { name: 'Pechino', country: 'Cina', lon: 116.41, lat: 39.9, region: 'asia', featured: true },
  { name: 'Seoul', country: 'Corea del Sud', lon: 126.98, lat: 37.57, region: 'asia' },
  { name: 'Tokyo', country: 'Giappone', lon: 139.69, lat: 35.68, region: 'asia' },
  { name: 'Canberra', country: 'Australia', lon: 149.13, lat: -35.28, region: 'oceania', featured: true },
  { name: 'Wellington', country: 'Nuova Zelanda', lon: 174.78, lat: -41.29, region: 'oceania' },
];

const capitalTranslations: Record<string, Partial<Record<Language, { name: string; country: string }>>> = {
  'Città del Messico': { en: { name: 'Mexico City', country: 'Mexico' }, de: { name: 'Mexiko-Stadt', country: 'Mexiko' } },
  Lima: { en: { name: 'Lima', country: 'Peru' }, de: { name: 'Lima', country: 'Peru' } },
  Brasília: { en: { name: 'Brasilia', country: 'Brazil' }, de: { name: 'Brasilia', country: 'Brasilien' } },
  Londra: { en: { name: 'London', country: 'United Kingdom' }, de: { name: 'London', country: 'Vereinigtes Königreich' } },
  Parigi: { en: { name: 'Paris', country: 'France' }, de: { name: 'Paris', country: 'Frankreich' } },
  Berlino: { en: { name: 'Berlin', country: 'Germany' }, de: { name: 'Berlin', country: 'Deutschland' } },
  Roma: { en: { name: 'Rome', country: 'Italy' }, de: { name: 'Rom', country: 'Italien' } },
  Madrid: { en: { name: 'Madrid', country: 'Spain' }, de: { name: 'Madrid', country: 'Spanien' } },
  Cairo: { en: { name: 'Cairo', country: 'Egypt' }, de: { name: 'Kairo', country: 'Ägypten' } },
  'Nuova Delhi': { en: { name: 'New Delhi', country: 'India' }, de: { name: 'Neu-Delhi', country: 'Indien' } },
  Pechino: { en: { name: 'Beijing', country: 'China' }, de: { name: 'Peking', country: 'China' } },
  'Seoul': { en: { name: 'Seoul', country: 'South Korea' }, de: { name: 'Seoul', country: 'Südkorea' } },
  Tokyo: { en: { name: 'Tokyo', country: 'Japan' }, de: { name: 'Tokio', country: 'Japan' } },
  Canberra: { en: { name: 'Canberra', country: 'Australia' }, de: { name: 'Canberra', country: 'Australien' } },
  Wellington: { en: { name: 'Wellington', country: 'New Zealand' }, de: { name: 'Wellington', country: 'Neuseeland' } },
  'Washington, D.C.': { en: { name: 'Washington, D.C.', country: 'United States' }, de: { name: 'Washington, D.C.', country: 'Vereinigte Staaten' } },
  Bogotá: { en: { name: 'Bogotá', country: 'Colombia' }, de: { name: 'Bogotá', country: 'Kolumbien' } },
  'Buenos Aires': { en: { name: 'Buenos Aires', country: 'Argentina' }, de: { name: 'Buenos Aires', country: 'Argentinien' } },
  Abuja: { en: { name: 'Abuja', country: 'Nigeria' }, de: { name: 'Abuja', country: 'Nigeria' } },
  Nairobi: { en: { name: 'Nairobi', country: 'Kenya' }, de: { name: 'Nairobi', country: 'Kenia' } },
  Pretoria: { en: { name: 'Pretoria', country: 'South Africa' }, de: { name: 'Pretoria', country: 'Südafrika' } },
  Riyadh: { en: { name: 'Riyadh', country: 'Saudi Arabia' }, de: { name: 'Riad', country: 'Saudi-Arabien' } },
};
const capitalDisplay = (city: Capital, language: Language) => capitalTranslations[city.name]?.[language] ?? { name: city.name, country: city.country };

const center: Record<RegionId, { lon: number; lat: number; zoom: number }> = {
  'north-america': { lon: -104, lat: 43, zoom: 1.8 },
  'south-america': { lon: -61, lat: -19, zoom: 2.15 },
  europe: { lon: 14, lat: 52, zoom: 3.4 },
  africa: { lon: 20, lat: 0, zoom: 1.9 },
  asia: { lon: 101, lat: 34, zoom: 1.8 },
  oceania: { lon: 143, lat: -24, zoom: 2.35 },
};

const regionNames: Record<Language, Record<RegionId, string>> = {
  it: { 'north-america': 'Nord America', 'south-america': 'Sud America', europe: 'Europa', africa: 'Africa', asia: 'Asia', oceania: 'Oceania' },
  en: { 'north-america': 'North America', 'south-america': 'South America', europe: 'Europe', africa: 'Africa', asia: 'Asia', oceania: 'Oceania' },
  de: { 'north-america': 'Nordamerika', 'south-america': 'Südamerika', europe: 'Europa', africa: 'Afrika', asia: 'Asien', oceania: 'Ozeanien' },
};

const labels = {
  it: {
    eyebrow: 'ORIZZONTE GLOBALE · ESPLORAZIONE', title: <>Dove le connessioni<br/><em>possono fare la differenza.</em></>, intro: 'Esplora ecosistemi e capitali: una mappa geografica precisa per orientare le prossime domande.', world: 'Vista globale', regionPrompt: 'Scegli un continente', capitals: 'Capitali da esplorare', selectPrompt: 'Seleziona un continente sulla mappa o qui accanto per avvicinarti.', cityPrompt: 'Seleziona una capitale per evidenziarla sulla mappa.', selected: 'CAPITALE SELEZIONATA', exploreNote: 'Un punto di partenza per la ricerca', research: 'In una fase successiva, questa mappa potrà integrare indicatori verificati su startup, ricerca, investimenti e bisogni locali.', source: 'Cartografia: Natural Earth · 1:50m', demo: 'Confini geografici di riferimento; linee decorative e opportunità da verificare.', hint: 'Clicca su un continente per entrare nella mappa. Seleziona una capitale per metterla a fuoco.', aria: 'Mappa interattiva delle opportunità globali', cityCountry: (country: string) => country,
  },
  en: {
    eyebrow: 'GLOBAL OUTLOOK · EXPLORATION', title: <>Where connections<br/><em>could make a difference.</em></>, intro: 'Explore ecosystems and capitals on an accurate geographic map, then use it to guide the next questions.', world: 'Global view', regionPrompt: 'Choose a continent', capitals: 'Capitals to explore', selectPrompt: 'Choose a continent on the map or from the list to zoom in.', cityPrompt: 'Select a capital to highlight it on the map.', selected: 'SELECTED CAPITAL', exploreNote: 'A starting point for research', research: 'Later, this map could include verified indicators on startups, research, investment, and local needs.', source: 'Map data: Natural Earth · 1:50m', demo: 'Reference boundaries; routes are decorative and opportunities need validation.', hint: 'Click a continent to zoom in. Select a capital to focus it.', aria: 'Interactive map of global opportunities', cityCountry: (country: string) => country,
  },
  de: {
    eyebrow: 'GLOBALER AUSBLICK · ERKUNDEN', title: <>Wo Verbindungen<br/><em>einen Unterschied machen können.</em></>, intro: 'Erkunde Ökosysteme und Hauptstädte auf einer präzisen geografischen Karte und leite daraus neue Fragen ab.', world: 'Weltansicht', regionPrompt: 'Kontinent auswählen', capitals: 'Hauptstädte erkunden', selectPrompt: 'Wähle einen Kontinent auf der Karte oder aus der Liste, um näher heranzuzoomen.', cityPrompt: 'Wähle eine Hauptstadt aus, um sie auf der Karte hervorzuheben.', selected: 'AUSGEWÄHLTE HAUPTSTADT', exploreNote: 'Ein Ausgangspunkt für die Recherche', research: 'Später kann die Karte verifizierte Kennzahlen zu Startups, Forschung, Investitionen und lokalen Bedürfnissen enthalten.', source: 'Kartografie: Natural Earth · 1:50m', demo: 'Geografische Referenzgrenzen; Verbindungslinien sind illustrativ, Chancen müssen geprüft werden.', hint: 'Klicke auf einen Kontinent, um hineinzuzoomen. Wähle eine Hauptstadt aus, um sie zu fokussieren.', aria: 'Interaktive Karte globaler Chancen', cityCountry: (country: string) => country,
  },
} as const;

const continentOrder: RegionId[] = ['north-america', 'south-america', 'europe', 'africa', 'asia', 'oceania'];
const project = (lon: number, lat: number) => ({ x: (lon + 180) * (1000 / 360), y: (90 - lat) * (500 / 180) });

export function WorldMap({ language }: { language: Language }) {
  const copy = labels[language];
  const [worldMapPaths, setWorldMapPaths] = useState<Record<string, string[]> | null>(null);
  const [activeRegion, setActiveRegion] = useState<RegionId | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const focus = activeRegion ? center[activeRegion] : null;
  const sectionRef = useRef<HTMLElement>(null);
  const cameraRef = useRef<SVGGElement>(null);
  const cameraPosition = useRef({ x: 0, y: 0, zoom: 1 });
  useEffect(() => {
    let cancelled = false;
    const loadMap = async () => {
      try {
        const response = await fetch(new URL('data/world-map.json', document.baseURI));
        if (!response.ok) throw new Error('Map data could not be loaded.');
        const data = await response.json() as Record<string, string[]>;
        if (!cancelled) setWorldMapPaths(data);
      } catch {
        if (!cancelled) setWorldMapPaths({});
      }
    };
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      void loadMap();
      return () => { cancelled = true; };
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        void loadMap();
      }
    }, { rootMargin: '420px 0px' });
    observer.observe(section);
    return () => { cancelled = true; observer.disconnect(); };
  }, []);
  useEffect(() => {
    const targetPoint = focus ? project(focus.lon, focus.lat) : { x: 500, y: 250 };
    const targetZoom = focus?.zoom ?? 1;
    const from = cameraPosition.current;
    const to = { x: 500 - targetPoint.x * targetZoom, y: 250 - targetPoint.y * targetZoom, zoom: targetZoom };
    const startAt = performance.now();
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1050;
    let frame = 0;
    const render = (now: number) => {
      const progress = duration ? Math.min(1, (now - startAt) / duration) : 1;
      const eased = 1 - Math.pow(1 - progress, 4);
      const next = {
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased,
        zoom: from.zoom + (to.zoom - from.zoom) * eased,
      };
      cameraPosition.current = next;
      cameraRef.current?.setAttribute('transform', `translate(${next.x.toFixed(2)} ${next.y.toFixed(2)}) scale(${next.zoom.toFixed(4)})`);
      if (progress < 1) frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frame);
  }, [activeRegion, focus]);
  const visibleCapitals = useMemo(() => capitals.filter((city) => activeRegion ? city.region === activeRegion : city.featured), [activeRegion]);
  const selectedCapital = capitals.find((city) => city.name === activeCity);
  const selectRegion = (region: RegionId) => { setActiveRegion(region); setActiveCity(null); };

  return <section className="world-map-section" id="opportunity-map" aria-label={copy.aria} ref={sectionRef}>
    <div className="wrap">
      <div className="world-map-heading">
        <div><span className="map-eyebrow"><i/> {copy.eyebrow}</span><h2>{copy.title}</h2></div>
        <p>{copy.intro}</p>
      </div>
      <div className={`world-map-card ${activeRegion ? 'map-zoomed' : ''}`}>
        <div className="map-canvas">
          <div className="map-canvas-top"><span><i/> {activeRegion ? regionNames[language][activeRegion] : copy.world}</span><button onClick={() => { setActiveRegion(null); setActiveCity(null); }} disabled={!activeRegion}>{copy.world} <span>↗</span></button></div>
          <svg className="world-map-svg" viewBox="0 0 1000 500" role="group" aria-label={copy.aria}>
            <defs>
              <radialGradient id="map-ocean" cx="50%" cy="48%" r="68%"><stop offset="0" stopColor="#103a2d" stopOpacity=".68"/><stop offset="1" stopColor="#06140f" stopOpacity="0"/></radialGradient>
              <linearGradient id="map-land" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#1a6549" stopOpacity=".48"/><stop offset="1" stopColor="#0a3528" stopOpacity=".78"/></linearGradient>
              <linearGradient id="map-route" x1="0" x2="1"><stop offset="0" stopColor="#63e8bd" stopOpacity=".08"/><stop offset=".48" stopColor="#7bf0cb" stopOpacity=".78"/><stop offset="1" stopColor="#ffc86f" stopOpacity=".14"/></linearGradient>
              <filter id="map-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#9de7c722" strokeWidth=".7"/></pattern>
            </defs>
            <rect width="1000" height="500" fill="url(#map-ocean)"/>
            <rect width="1000" height="500" fill="url(#map-grid)" opacity=".22"/>
            <g className="map-camera" ref={cameraRef} transform="translate(0 0) scale(1)">
              <g className="map-landmasses">
                {continentOrder.map((region) => <g key={region} className={`map-continent ${activeRegion === region ? 'is-active' : ''} ${activeRegion && activeRegion !== region ? 'is-dimmed' : ''}`} role="button" tabIndex={0} aria-label={regionNames[language][region]} onClick={() => selectRegion(region)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectRegion(region); } }}>
                  {worldMapPaths?.[region]?.map((path, index) => <path key={index} d={path} fillRule="evenodd" vectorEffect="non-scaling-stroke"/>)}
                </g>)}
                <g className="map-antarctica" aria-hidden="true">{worldMapPaths?.antarctica?.map((path, index) => <path key={index} d={path} fillRule="evenodd" vectorEffect="non-scaling-stroke"/>)}</g>
              </g>
              {!activeRegion && <g className="map-routes" aria-hidden="true">
                {[[capitals[0],capitals[7]],[capitals[7],capitals[18]],[capitals[2],capitals[5]],[capitals[7],capitals[12]],[capitals[18],capitals[21]],[capitals[12],capitals[21]]].map(([a,b], i) => { const p1 = project(a.lon,a.lat); const p2 = project(b.lon,b.lat); const midX=(p1.x+p2.x)/2; const midY=(p1.y+p2.y)/2-38; return <path key={i} d={`M${p1.x},${p1.y} Q${midX},${midY} ${p2.x},${p2.y}`}/>; })}
              </g>}
              <g className="map-capitals">
                {visibleCapitals.map((city) => { const { x, y } = project(city.lon, city.lat); const picked = activeCity === city.name; const display = capitalDisplay(city, language); const labelLeft = city.region === 'oceania' || city.region === 'north-america' && city.lon < -100 || city.region === 'asia' && city.lon > 130; return <g key={city.name} className={`map-capital ${picked ? 'is-picked' : ''}`} transform={`translate(${x} ${y}) scale(${1 / (focus?.zoom || 1)}) translate(${-x} ${-y})`} role="button" tabIndex={0} aria-label={`${display.name}, ${copy.cityCountry(display.country)}`} onClick={(event) => { event.stopPropagation(); setActiveCity(city.name); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); setActiveCity(city.name); } }}>
                  <circle className="capital-halo" cx={x} cy={y} r={picked ? 12 : 8}/><circle className="capital-dot" cx={x} cy={y} r={picked ? 4.2 : 3.3}/>
                  {(activeRegion || city.featured) && <g className={`capital-label ${labelLeft ? 'label-left' : ''}`}><rect x={labelLeft ? x-112 : x+8} y={y-11} width={display.name.length * 5.25 + 17} height="22" rx="11"/><text x={labelLeft ? x-103 : x+17} y={y+3.5}>{display.name}</text></g>}
                </g>; })}
              </g>
            </g>
          </svg>
          <div className="map-canvas-bottom"><span className="map-scale-mark"><i/><i/><i/></span><span>{copy.hint}</span><span className="map-north">N <b>↑</b></span></div>
        </div>
        <aside className="map-aside">
          <div className="map-aside-head"><span className="map-aside-index">01 / 06</span><span className="map-aside-live"><i/> {language === 'it' ? 'ESPLORA' : language === 'de' ? 'ERKUNDEN' : 'EXPLORE'}</span></div>
          <h3>{activeRegion ? regionNames[language][activeRegion] : copy.regionPrompt}</h3>
          <p>{activeRegion ? copy.cityPrompt : copy.selectPrompt}</p>
          <div className="region-buttons">{continentOrder.map((region, i) => <button key={region} className={activeRegion === region ? 'selected' : ''} onClick={() => selectRegion(region)}><span>{String(i + 1).padStart(2,'0')}</span>{regionNames[language][region]}<b>↗</b></button>)}</div>
          {activeRegion && <div className="capital-list"><span className="capital-list-title">{copy.capitals}</span><div>{capitals.filter((city) => city.region === activeRegion).map((city) => { const display = capitalDisplay(city, language); return <button key={city.name} className={activeCity === city.name ? 'selected' : ''} onClick={() => setActiveCity(city.name)}><span className="capital-list-dot"/>{display.name}<small>{display.country}</small></button>; })}</div></div>}
          <div className="map-selected-place">{selectedCapital ? <><span>{copy.selected}</span><b>{capitalDisplay(selectedCapital, language).name}</b><small>{capitalDisplay(selectedCapital, language).country}</small></> : <><span>{copy.exploreNote}</span><b>{activeRegion ? copy.capitals : copy.world}</b><small>{copy.research}</small></>}</div>
        </aside>
      </div>
      <div className="map-data-note"><span>i</span><p><a href="https://www.naturalearthdata.com/downloads/50m-cultural-vectors/" target="_blank" rel="noreferrer">{copy.source}</a> · {copy.demo}</p></div>
    </div>
  </section>;
}
