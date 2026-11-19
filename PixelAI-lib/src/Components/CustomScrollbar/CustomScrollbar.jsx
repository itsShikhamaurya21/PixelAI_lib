import React from "react";
const CustomScrollbar = () => {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const scrollContainerRef = React.useRef(null);
  const scrollThumbRef = React.useRef(null);
  const startY = React.useRef(0);
  const thumbPosition = React.useRef(0);

  const content = Array(50).fill().map((_, i) => (
    <div key={i} style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
      Scrollable content item #{i + 1}
    </div>
  ));

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const maxScrollTop = scrollHeight - clientHeight;
      const percentage = (scrollTop / maxScrollTop) * 100;
      setScrollPosition(percentage);
    }
  };

  const handleThumbMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.clientY;
    thumbPosition.current = scrollPosition;
    document.addEventListener('mousemove', handleThumbMouseMove);
    document.addEventListener('mouseup', handleThumbMouseUp);
  };

  const handleThumbMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    const { scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScrollTop = scrollHeight - clientHeight;
    const deltaY = e.clientY - startY.current;
    const containerHeight = scrollContainerRef.current.clientHeight;
    const thumbHeight = (clientHeight / scrollHeight) * containerHeight;
    const trackHeight = containerHeight - thumbHeight;
    
    const deltaPercentage = (deltaY / trackHeight) * 100;
    const newPercentage = Math.min(100, Math.max(0, thumbPosition.current + deltaPercentage));
    
    setScrollPosition(newPercentage);
    scrollContainerRef.current.scrollTop = (newPercentage / 100) * maxScrollTop;
  };

  const handleThumbMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleThumbMouseMove);
    document.removeEventListener('mouseup', handleThumbMouseUp);
  };

  const handleTrackClick = (e) => {
    if (!scrollContainerRef.current || !scrollThumbRef.current) return;
    
    const { scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScrollTop = scrollHeight - clientHeight;
    const trackRect = e.currentTarget.getBoundingClientRect();
    const thumbHeight = scrollThumbRef.current.clientHeight;
    
    const clickPosition = e.clientY - trackRect.top - (thumbHeight / 2);
    const trackHeight = trackRect.height - thumbHeight;
    const newPercentage = (clickPosition / trackHeight) * 100;
    
    const clampedPercentage = Math.min(100, Math.max(0, newPercentage));
    setScrollPosition(clampedPercentage);
    scrollContainerRef.current.scrollTop = (clampedPercentage / 100) * maxScrollTop;
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const containerHeight = 400;
  const contentHeight = 50 * 40; // 50 items * ~40px each
  const thumbHeight = (containerHeight / contentHeight) * containerHeight;
  
  return (
    <div style={{
      display: "flex",
      height: `${containerHeight}px`,
      position: "relative",
      backgroundColor: "#f5f5f5",
      borderRadius: "8px",
      overflow: "hidden"
    }}>
      <div 
        ref={scrollContainerRef}
        style={{
          flex: 1,
          overflowY: "scroll",
          paddingRight: "12px",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
        {content}
        <style>{`
          .custom-scrollbar-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
      
      <div 
        style={{
          width: "10px",
          backgroundColor: "#e0e0e0",
          borderRadius: "5px",
          position: "relative",
          margin: "4px 4px 4px 0"
        }}
        onClick={handleTrackClick}
      >
        <div
          ref={scrollThumbRef}
          style={{
            width: "100%",
            height: `${Math.max(20, thumbHeight)}px`,
            backgroundColor: isDragging ? "#555" : "#888",
            borderRadius: "5px",
            position: "absolute",
            top: `${scrollPosition}%`,
            transform: "translateY(-50%)",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseDown={handleThumbMouseDown}
        />
      </div>
    </div>
  );
};

// For live preview
// render(<CustomScrollbar />);

export default CustomScrollbar;