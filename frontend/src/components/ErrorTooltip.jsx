import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ErrorTooltip({ error }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [placeAbove, setPlaceAbove] = useState(true);
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    function updatePosition() {
      if (!iconRef.current) return;

      const iconRect = iconRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      const estimatedTooltipHeight = tooltipRef.current
        ? tooltipRef.current.offsetHeight
        : 80; // fallback height in px

      // Decide if tooltip should be placed above or below icon
      const canPlaceAbove = iconRect.top > estimatedTooltipHeight + 10; // 10px margin

      setPlaceAbove(canPlaceAbove);

      setPos({
        top: scrollY + (canPlaceAbove ? iconRect.top : iconRect.bottom),
        left: scrollX + iconRect.left + iconRect.width / 2,
      });
    }

    if (visible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [visible]);

  return (
    <>
      <div
        ref={iconRef}
        className="relative inline-block"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        aria-label="Error info"
        role="img"
      >
        {/* Info icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-600 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth={2} />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      </div>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: placeAbove
                ? "translate(-50%, -100%)"
                : "translate(-50%, 0)",
              width: "16rem",
              padding: "0.5rem",
              backgroundColor: "#dc2626",
              color: "white",
              fontSize: "0.875rem",
              borderRadius: "0.375rem",
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
              whiteSpace: "normal",
              zIndex: 9999,
              pointerEvents: "none",
              wordBreak: "break-word",
              userSelect: "none",
            }}
          >
            {error}
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                width: "12px",
                height: "12px",
                backgroundColor: "#dc2626",
                bottom: placeAbove ? "-6px" : "auto",
                top: placeAbove ? "auto" : "-6px",
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
}
