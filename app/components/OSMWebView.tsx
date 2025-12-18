import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

// --- O SEGREDO ESTÁ AQUI: O CÓDIGO HTML DO MAPA ---
// Estamos criando uma "mini página web" stringificada que carrega o Leaflet via CDN.
const mapHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // 1. Inicializa o mapa
        var map = L.map('map').setView([-23.55052, -46.63330], 13); // Ex: São Paulo

        // 2. Adiciona os Tiles do OpenStreetMap (GRÁTIS)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // 3. Adiciona um Marcador de Exemplo
        L.marker([-23.55052, -46.63330]).addTo(map)
            .bindPopup('<b>Olá!</b><br />Eu sou um WebView.')
            .openPopup();
    </script>
</body>
</html>
`;

export default function OSMWebView() {
  // Estratégia para WEB (Navegador)
  if (Platform.OS === 'web') {
    return (
      <iframe
        srcDoc={mapHTML}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="OSM Map"
      />
    );
  }

  // Estratégia para MOBILE (Android/iOS)
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={{ flex: 1 }}
        // Dicas de performance para Android
        androidHardwareAccelerationDisabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});