import React from 'react';

const Loader: React.FC = () => {
  // Generates the configuration for the 10 spinner blades dynamically
  const blades = Array.from({ length: 10 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      delay: id * 0.1,
      rotation: id * 36,
      translation: 150,
    };
  });

  return (
    <>
      {/* Native CSS Injection */}
      <style>{`
        .spinner-wrapper {
          position: relative;
          /* Add any layout wrappers here if needed */
        }

        .spinner {
          position: absolute;
          width: 9px;
          height: 9px;
        }

        .spinner div {
          position: absolute;
          width: 50%;
          height: 150%;
          background: #000000;
          transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
          animation: spinner-fzua35 1s calc(var(--delay) * 1s) infinite ease;
        }

        @keyframes spinner-fzua35 {
          0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
            transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
          }
          50% {
            transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
          }
        }
      `}</style>

      {/* Component Markup */}
      <div className="spinner-wrapper">
        <div className="spinner">
          {blades.map((blade) => (
            <div
              key={blade.id}
              style={
                {
                  '--delay': blade.delay,
                  '--rotation': blade.rotation,
                  '--translation': blade.translation,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Loader;