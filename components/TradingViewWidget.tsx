import React, { useEffect, useRef } from 'react';

// --- CHANGE 1: Define a type for the TradingView object ---
// This tells TypeScript what the TradingView object will look like once it's loaded.
declare global {
  interface Window {
    TradingView: any;
  }
}

let tvScriptLoadingPromise;

export default function TradingViewWidget({ symbol, containerId }) {
  const onLoadScriptRef = useRef(null); // This fix was correct

  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => { onLoadScriptRef.current = null; };

      function createWidget() {
        // --- CHANGE 2: Check if TradingView exists on window BEFORE using it ---
        if (document.getElementById(containerId) && typeof window.TradingView !== 'undefined') {
          new window.TradingView.widget({
            autosize: true,
            symbol: symbol,
            interval: "D",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            hide_top_toolbar: true,
            hide_legend: true,
            save_image: false,
            container_id: containerId
          });
        }
      }
    },
    [symbol, containerId]
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div id={containerId} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}