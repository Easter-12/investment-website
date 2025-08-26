import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

let tvScriptLoadingPromise: Promise<void> | undefined;

export default function TradingViewWidget({ symbol, containerId }: { symbol: string; containerId: string; }) {
  const onLoadScriptRef = useRef<(() => void) | "loaded" | null>(null);

  useEffect(() => {
    if (onLoadScriptRef.current === "loaded") {
      return;
    }

    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => {
      if (onLoadScriptRef.current === createWidget) {
        onLoadScriptRef.current();
      }
    });

    return () => {
      onLoadScriptRef.current = null;
    };

    function createWidget() {
      if (document.getElementById(containerId) && typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "1",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6", // This will be hidden but is good practice to set
          enable_publishing: false,
          hide_top_toolbar: true, // Hides the top bar with drawing tools
          hide_bottom_toolbar: true, // Hides the bottom bar with the logo
          allow_symbol_change: false, // Prevents user from changing the symbol
          container_id: containerId,
        });
        onLoadScriptRef.current = "loaded";
      }
    }
  }, [symbol, containerId]);

  return (
    // Step 1: Add a parent container with position: 'relative'
    <div style={{ height: "100%", width: "100%", position: 'relative' }}>
      {/* The TradingView chart will be placed here */}
      <div id={containerId} style={{ height: "100%", width: "100%" }} />

      {/* --- THIS IS THE GUARANTEED FIX --- */}
      {/* Step 2: Add the invisible overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10, // Make sure it's on top of the chart
        cursor: 'default', // Show a normal cursor, not a link cursor
      }}></div>
    </div>
  );
}