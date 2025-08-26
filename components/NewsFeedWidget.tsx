import React, { useEffect, useRef } from 'react';

const NewsFeedWidget = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const isScriptAppended = useRef(false);

  useEffect(() => {
    if (isScriptAppended.current || !container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "feedMode": "all_symbols",
      "colorTheme": "dark",
      "isTransparent": false,
      "displayMode": "regular",
      "width": "100%",
      "height": 600,
      "locale": "en"
    });

    container.current.appendChild(script);
    isScriptAppended.current = true;

  }, []);

  return (
    // Step 1: Add a parent container with position: 'relative'
    <div style={{ height: '600px', width: '100%', position: 'relative' }}>

      {/* The original container that holds the TradingView script */}
      <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}>
        <div className="tradingview-widget-container__widget"></div>
      </div>

      {/* --- THIS IS THE GUARANTEED FIX --- */}
      {/* Step 2: Add the invisible overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10, // Make sure it's on top of the news feed
        cursor: 'default', // Show a normal cursor
      }}></div>
    </div>
  );
};

export default NewsFeedWidget;