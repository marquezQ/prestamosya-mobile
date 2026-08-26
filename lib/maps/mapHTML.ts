interface MapHTMLConfig {
  latitude: number;
  longitude: number;
  zoom: number;
  interactive: boolean;
  clickable: boolean;
  showMarker: boolean;
}

/**
 * Genera HTML completo con Leaflet + OpenStreetMap para renderizar
 * un mapa interactivo dentro de un WebView (compatible Expo Go).
 *
 * Expone globalmente:
 *   - updateMarker(lat, lng, show) — agrega/quita marker sin recargar
 *   - centerMap(lat, lng) — centra el mapa sin recargar
 * Ambos son invocados desde RN vía WebView.injectJavaScript().
 */
export function generateMapHTML({
  latitude,
  longitude,
  zoom,
  interactive,
  clickable,
  showMarker,
}: MapHTMLConfig): string {
  const markerInit = showMarker
    ? `m=L.marker([${latitude},${longitude}]).addTo(map);`
    : '';

  const clickHandler = clickable
    ? `map.on('click',function(e){
        if(m){m.setLatLng(e.latlng)}else{m=L.marker(e.latlng).addTo(map)}
        window.ReactNativeWebView.postMessage(JSON.stringify({latitude:e.latlng.lat,longitude:e.latlng.lng}));
      });`
    : '';

  return `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:100%;height:100%;overflow:hidden;position:fixed}
  #map{width:100%;height:100%;touch-action:none;position:absolute;top:0;left:0}
  .leaflet-control-attribution{font-size:8px!important;background:rgba(255,255,255,0.7)!important}
</style>
</head><body><div id="map"></div><script>
var map=L.map('map',{
  center:[${latitude},${longitude}],
  zoom:${zoom},
  zoomControl:${interactive},
  dragging:${interactive},
  touchZoom:${interactive},
  doubleClickZoom:${interactive},
  scrollWheelZoom:${interactive},
  attributionControl:true
});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'&copy; OpenStreetMap',
  maxZoom:19
}).addTo(map);
var m=null;
${markerInit}
${clickHandler}
window.updateMarker=function(a,b,show){
  if(show){if(m){m.setLatLng([a,b])}else{m=L.marker([a,b]).addTo(map)}map.panTo([a,b])}
  else if(m){map.removeLayer(m);m=null}
};
window.centerMap=function(a,b){map.panTo([a,b])};
</script></body></html>`;
}
