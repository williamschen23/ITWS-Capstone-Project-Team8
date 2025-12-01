import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ErrorTooltip({ error }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);

  useEffect(() => {
    function updatePosition() {
      if (!iconRef.current) return;

      const rect = iconRef.current.getBoundingClientRect();

      setPos({
        top: window.scrollY + rect.top - 8, // 8px above the icon
        left: window.scrollX + rect.left + rect.width / 2,
      });
    }

    if (visible) {
      updatePosition();

      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
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
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              transform: 'translate(-50%, -100%)',
              width: '16rem', // w-64 in tailwind is 16rem
              padding: '0.5rem',
              backgroundColor: '#dc2626', // Tailwind red-600
              color: 'white',
              fontSize: '0.875rem',
              borderRadius: '0.375rem', // rounded
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
              whiteSpace: 'normal',
              zIndex: 9999,
              pointerEvents: 'none',
              wordBreak: 'break-word',
            }}
          >
            {error}
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                width: '12px',
                height: '12px',
                backgroundColor: '#dc2626',
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
}
