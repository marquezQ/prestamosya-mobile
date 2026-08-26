import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { generateMapHTML } from '@/lib/maps/mapHTML';
import { DEFAULT_MAP_COORDS, DEFAULT_MAP_ZOOM } from '@/lib/maps/config';

interface AppMapViewProps {
  latitude?: number | null;
  longitude?: number | null;
  zoom?: number;
  interactive?: boolean;
  showMarker?: boolean;
  onPress?: (latitude: number, longitude: number) => void;
  className?: string;
}

export function AppMapView({
  latitude,
  longitude,
  zoom = DEFAULT_MAP_ZOOM,
  interactive = true,
  showMarker = false,
  onPress,
  className = 'h-80 w-full',
}: AppMapViewProps) {
  const webViewRef = useRef<WebView>(null);

  const lat = latitude ?? DEFAULT_MAP_COORDS.latitude;
  const lng = longitude ?? DEFAULT_MAP_COORDS.longitude;

  const initialHtml = useMemo(
    () => generateMapHTML({ latitude: lat, longitude: lng, zoom, interactive, clickable: !!onPress, showMarker }),
    // Solo genera HTML al montar — actualizaciones posteriores vía injectJavaScript
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    webViewRef.current?.injectJavaScript(
      `window.updateMarker(${lat},${lng},${showMarker});true;`
    );
  }, [lat, lng, showMarker]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.latitude != null && data.longitude != null) {
          onPress?.(data.latitude, data.longitude);
        }
      } catch {
        // Mensajes malformados se ignoran
      }
    },
    [onPress]
  );

  return (
    <View className={`overflow-hidden ${className}`}>
      <WebView
        ref={webViewRef}
        source={{ html: initialHtml }}
        onMessage={handleMessage}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        javaScriptEnabled
        originWhitelist={['*']}
        style={{ flex: 1 }}
      />
    </View>
  );
}
