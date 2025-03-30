import React from 'react';
import { Platform } from '../types/game';

interface ObstacleProps {
  obstacle: Platform;
}

const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  const { position, type, width, height } = obstacle;

  switch (type) {
    case 'brick':
      return (
        <div
          className="absolute bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-lg shadow-lg"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          {/* Brick pattern */}
          <div className="absolute inset-0 flex flex-col">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1/3 border-b border-[#654321] last:border-b-0" />
            ))}
          </div>
          {/* Brick texture */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CiAgPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0wIDBoNDB2M0gweiIgZmlsbD0iI2Y0ZjRmNCIvPgogIDxwYXRoIGQ9Ik0wIDM3aDQwdjNIMHoiIGZpbGw9IiM2YjZiNmIiLz4KPC9zdmc+')] opacity-20" />
        </div>
      );

    case 'spike':
      return (
        <div
          className="absolute"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          {/* Spike shadow */}
          <div
            className="absolute inset-0 bg-red-900 transform translate-x-1 translate-y-1 rounded-sm"
          />
          {/* Main spike */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-700 rounded-sm"
            style={{
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            }}
          />
          {/* Spike highlight */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-red-400 to-transparent opacity-30"
            style={{
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            }}
          />
        </div>
      );

    case 'barrier':
      return (
        <div
          className="absolute bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-lg"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          {/* Warning stripes */}
          <div className="absolute inset-0 flex flex-col justify-between py-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-1 bg-red-500 shadow-sm"
                style={{
                  background: 'linear-gradient(45deg, #ff0000 25%, transparent 25%, transparent 50%, #ff0000 50%, #ff0000 75%, transparent 75%, transparent)',
                  backgroundSize: '10px 10px',
                }}
              />
            ))}
          </div>
          {/* Metal texture */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CiAgPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0wIDBoNDB2M0gweiIgZmlsbD0iI2Y0ZjRmNCIvPgogIDxwYXRoIGQ9Ik0wIDM3aDQwdjNIMHoiIGZpbGw9IiM2YjZiNmIiLz4KPC9zdmc+')] opacity-10" />
        </div>
      );

    default:
      return null;
  }
};

interface ObstaclesProps {
  obstacles: Platform[];
}

const Obstacles: React.FC<ObstaclesProps> = ({ obstacles }) => {
  return (
    <>
      {obstacles.map((obstacle, index) => (
        <Obstacle key={`${obstacle.position.x}-${obstacle.position.y}-${index}`} obstacle={obstacle} />
      ))}
    </>
  );
};

export default Obstacles; 