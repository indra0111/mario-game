import React from 'react';
import { Sweet } from '../types/game';

interface SweetsProps {
  coins: Sweet[];
}

const SweetItem: React.FC<{ sweet: Sweet }> = ({ sweet }) => {
  const sweetStyles = {
    left: `${sweet.position.x}px`,
    top: `${sweet.position.y}px`,
    width: '32px',
    height: '32px',
  };

  return (
    <div
      className={`absolute animate-floating-sweet shadow-glow ${sweet.collected ? 'opacity-50' : ''}`}
      style={sweetStyles}
    >
      {sweet.type === 'dhokla' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full bg-yellow-200 rounded-sm border-2 border-yellow-300 flex items-center justify-center shadow-lg animate-spin-slow">
            <div className="w-3/4 h-3/4 bg-yellow-100 rounded-sm"></div>
          </div>
        </div>
      )}
      
      {sweet.type === 'mithai' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full bg-orange-400 rounded-md border-2 border-orange-500 flex items-center justify-center shadow-lg animate-spin-slow">
            <div className="w-2/3 h-2/3 bg-green-300 rounded-sm"></div>
          </div>
        </div>
      )}
      
      {sweet.type === 'vadapav' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full bg-yellow-600 rounded-full border-2 border-yellow-700 flex items-center justify-center shadow-lg animate-spin-slow">
            <div className="w-2/3 h-1/2 bg-amber-800 rounded-sm"></div>
          </div>
        </div>
      )}
      
      {sweet.type === 'jalebi' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full bg-yellow-500 rounded-full border-2 border-yellow-600 shadow-lg animate-spin-slow" style={{
            clipPath: 'spiral(circle at center)'
          }}></div>
        </div>
      )}
      
      {sweet.type === 'ladoo' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full bg-orange-300 rounded-full border-2 border-orange-400 flex items-center justify-center shadow-lg animate-spin-slow">
            <div className="w-1/2 h-1/2 bg-orange-200 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const Sweets: React.FC<SweetsProps> = ({ coins }) => {
  return (
    <>
      {coins.map((sweet) => (
        !sweet.collected && (
          <SweetItem key={sweet.id} sweet={sweet} />
        )
      ))}
    </>
  );
};

export default Sweets; 