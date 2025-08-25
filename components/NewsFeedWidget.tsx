import React, { useEffect, useRef } from 'react';

const NewsFeedWidget = () => {
  const container = useRef(null);
  // We use a state to ensure the script only runs once
  const isScriptAppended = useRef(false);

  useEffect(() => {
    // Only run this effect if the script hasn't been appended yet
    if (isScriptAppended.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "feedMode": "all_symbols",
        "colorTheme": "dark",
        "isTransparent": false,
        "displayMode": "regular",
        "width": "100%",
        "height": "600",
        "locale": "en"
      }`;

    if (container.current) {
        container.current.appendChild(script);
        isScriptAppended.current = true; // Mark the script as appended
    }

  }, []); // The empty array ensures this effect runs only once after the component mounts

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: '600px', width: '100%' }}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default NewsFeedWidget;