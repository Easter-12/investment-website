import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

// We now accept a 'containerId' to make each chart unique
export default function TradingViewWidget({ symbol, containerId }) {
  const onLoadScriptRef = useRef(null);

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

      return () => onLoadScriptRef.current = null;

      function createWidget() {
        // We check for the unique containerId here
        if (document.getElementById(containerId) && 'TradingView' in window) {
          new window.TradingView.widget({
            autosize: true,
            symbol: symbol,
            interval: "D",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            // This is the key change to hide the branding link
            hide_top_toolbar: true,
            hide_legend: true,
            save_image: false,
            // We use the unique containerId to tell TradingView where to draw the chart
            container_id: containerId
          });
        }
      }
    },
    // We add containerId to the dependency array
    [symbol, containerId]
  );

  return (
    // The outer container no longer needs the copyright section
    <div style={{ height: "100%", width: "100%" }}>
      {/* This div now uses the unique ID we pass in */}
      <div id={containerId} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}