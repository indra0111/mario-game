import React, { useRef, useEffect, useState } from 'react';
import { Apple } from 'lucide-react';

const Background: React.FC = () => {
  const [gameState, setGameState] = useState('playing');
  const [decorations, setDecorations] = useState([]);
  
  const mountainsRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement[]>([]);
  const treesRef = useRef<HTMLDivElement>(null);
  const buildingsRef = useRef<HTMLDivElement>(null);
  const peopleRef = useRef<HTMLDivElement>(null);
  const templesRef = useRef<HTMLDivElement>(null);
  const cowsRef = useRef<HTMLDivElement>(null);
  const fruitSellersRef = useRef<HTMLDivElement>(null);
  const religiousStructuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const scrollSpeed = {
      mountains: 0.2,     // Reduced from 0.5
      trees: 0.5,         // Reduced from 1.2
      clouds: 0.25,       // Reduced from 0.6
      buildings: 0.3,     // Reduced from 0.8
      people: 0.4,        // Reduced from 1.0
      temples: 0.35,      // Reduced from 0.9
      cows: 0.45,         // Reduced from 1.1
      fruitSellers: 0.4,  // Reduced from 1.0
      religiousStructures: 0.3  // Reduced from 0.85
    };
    
    let animationFrameId: number;
    let scrollPos = 0;
    
    const animateBackground = () => {
      if (gameState !== 'playing') {
        animationFrameId = requestAnimationFrame(animateBackground);
        return;
      }
      
      scrollPos += 1;  // Reduced from 3 to slow down overall movement
      
      if (mountainsRef.current) {
        const translateX = scrollPos * scrollSpeed.mountains;
        const normalizedPos = translateX % 100;
        mountainsRef.current.style.transform = `translateX(-${normalizedPos}%)`;
      }
      
      if (treesRef.current) {
        const translateX = scrollPos * scrollSpeed.trees;
        const normalizedPos = translateX % 100;
        treesRef.current.style.transform = `translateX(-${normalizedPos}%)`;
      }
      
      if (buildingsRef.current) {
        const translateX = scrollPos * scrollSpeed.buildings;
        const normalizedPos = translateX % 100;
        buildingsRef.current.style.transform = `translateX(-${normalizedPos}%)`;
      }
      
      if (peopleRef.current) {
        const translateX = scrollPos * scrollSpeed.people;
        const normalizedPos = translateX % 100;
        peopleRef.current.style.transform = `translateX(-${normalizedPos}%)`;
      }
      
      if (templesRef.current) {
        const translateX = scrollPos * scrollSpeed.temples;
        const normalizedPos = translateX % 100;
        templesRef.current.style.transform = `translateX(-${normalizedPos}%)`;
      }
      
      if (religiousStructuresRef.current) {
        const translateX = scrollPos * scrollSpeed.religiousStructures;
        const normalizedPos = translateX % 100;
        religiousStructuresRef.current.style.transform = `translateX(-${normalizedPos}%)`;
      }
      
      if (cowsRef.current) {
        const translateX = scrollPos * scrollSpeed.cows;
        const normalizedPos = translateX % 100;
        cowsRef.current.style.transform = `translateX(-${normalizedPos}%)`;
      }
      
      if (fruitSellersRef.current) {
        const translateX = scrollPos * scrollSpeed.fruitSellers;
        const normalizedPos = translateX % 100;
        fruitSellersRef.current.style.transform = `translateX(-${normalizedPos}%)`;
      }
      
      cloudsRef.current.forEach((cloud, index) => {
        const cloudSpeed = scrollSpeed.clouds * (0.8 + (index * 0.1));
        const translateX = scrollPos * cloudSpeed;
        const normalizedPos = translateX % 100;
        cloud.style.transform = `translateX(-${normalizedPos}%)`;
      });
      
      animationFrameId = requestAnimationFrame(animateBackground);
    };
    
    animateBackground();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState]);

  const renderReligiousBuildings = () => {
    return null;
  };
  
  const renderBuildingLogos = () => {
    return null;
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div ref={mountainsRef} className="absolute bottom-[20%] w-[200%] h-[20%]">
        <div className="absolute w-full h-full" style={{ 
          backgroundImage: 'linear-gradient(to bottom right, #8C6D46, #A08562)',
          clipPath: 'polygon(0% 100%, 8% 60%, 15% 80%, 22% 60%, 30% 90%, 35% 70%, 45% 100%, 52% 75%, 60% 100%, 70% 80%, 80% 50%, 90% 75%, 100% 100%)' 
        }}></div>
        <div className="absolute left-[100%] w-full h-full" style={{ 
          backgroundImage: 'linear-gradient(to bottom right, #8C6D46, #A08562)',
          clipPath: 'polygon(0% 100%, 8% 60%, 15% 80%, 22% 60%, 30% 90%, 35% 70%, 45% 100%, 52% 75%, 60% 100%, 70% 80%, 80% 50%, 90% 75%, 100% 100%)' 
        }}></div>
      </div>
      
      <div ref={religiousStructuresRef} className="absolute bottom-[20%] w-[300%] h-[18%]">
        {renderReligiousBuildings()}
        
        <div className="absolute bottom-0 left-[10%] w-24 h-36">
          <div className="absolute bottom-0 w-full h-2/3 bg-amber-200"></div>
          <div className="absolute top-0 w-full h-1/3 bg-amber-700" style={{ 
            clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' 
          }}></div>
          <div className="absolute w-8 h-8 bg-red-600 rounded-full -top-3 left-1/2 -translate-x-1/2"></div>
          <div className="absolute w-8 h-12 bg-amber-900 rounded-t-md bottom-0 left-1/2 -translate-x-1/2"></div>
          
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-8 h-8 z-10">
            <Apple size={24} color="#000000e6" strokeWidth={1} />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-[30%] w-28 h-32">
          <div className="absolute bottom-0 w-full h-2/3 bg-white"></div>
          <div className="absolute w-12 h-12 bg-green-600 rounded-full -top-6 left-1/2 -translate-x-1/2" style={{
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%"
          }}></div>
          <div className="absolute bottom-0 left-2 w-4 h-24 bg-white"></div>
          <div className="absolute -top-4 left-2 w-4 h-4 bg-green-600 rounded-full"></div>
          <div className="absolute w-6 h-8 bg-blue-200 rounded-t-md bottom-6 left-4"></div>
          <div className="absolute w-6 h-8 bg-blue-200 rounded-t-md bottom-6 right-4"></div>
          
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-10 h-10 z-10">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="bg-black w-4 h-4"></div>
              <div className="bg-black w-4 h-4"></div>
              <div className="bg-black w-4 h-4"></div>
              <div className="bg-black w-4 h-4"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-[50%] w-30 h-38">
          <div className="absolute bottom-0 w-full h-2/3 bg-white border-2 border-amber-300"></div>
          <div className="absolute w-14 h-14 bg-game-yellow rounded-full -top-8 left-1/2 -translate-x-1/2"></div>
          <div className="absolute left-full -top-24 w-1 h-24 bg-amber-800">
            <div className="absolute top-0 left-0 w-8 h-8 bg-game-saffron"></div>
          </div>
          <div className="absolute w-10 h-14 bg-amber-600 rounded-t-md bottom-0 left-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="absolute bottom-0 left-[70%] w-26 h-32">
          <div className="absolute bottom-0 w-full h-2/3 bg-amber-100"></div>
          <div className="absolute top-0 w-full h-1/3 bg-amber-600" style={{ 
            clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' 
          }}></div>
          <div className="absolute w-10 h-10 bg-red-500 rounded-full -top-5 left-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="absolute bottom-0 left-[90%] w-24 h-28">
          <div className="absolute bottom-0 w-full h-2/3 bg-white"></div>
          <div className="absolute w-10 h-10 bg-green-600 rounded-full -top-5 left-1/2 -translate-x-1/2" style={{
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%"
          }}></div>
        </div>
        
        <div className="absolute bottom-0 left-[110%] w-24 h-36">
          <div className="absolute bottom-0 w-full h-2/3 bg-amber-200"></div>
          <div className="absolute top-0 w-full h-1/3 bg-amber-700" style={{ 
            clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' 
          }}></div>
          <div className="absolute w-8 h-8 bg-red-600 rounded-full -top-3 left-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="absolute bottom-0 left-[130%] w-28 h-32">
          <div className="absolute bottom-0 w-full h-2/3 bg-white"></div>
          <div className="absolute w-12 h-12 bg-green-600 rounded-full -top-6 left-1/2 -translate-x-1/2" style={{
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%"
          }}></div>
        </div>
      </div>
      
      <div ref={cowsRef} className="absolute bottom-[20%] w-[300%] h-[6%]">
        <div className="absolute bottom-0 left-[15%] w-16 h-10">
          <div className="w-10 h-6 bg-white rounded-lg"></div>
          <div className="absolute w-4 h-4 bg-white rounded-lg -left-2 top-1"></div>
          <div className="absolute w-1 h-3 bg-white rounded-b-lg right-0 -top-1"></div>
          <div className="absolute w-1 h-3 bg-gray-300 left-2 -bottom-3"></div>
          <div className="absolute w-1 h-3 bg-gray-300 left-6 -bottom-3"></div>
        </div>
        
        <div className="absolute bottom-0 left-[35%] w-18 h-12">
          <div className="w-12 h-7 bg-brown-100 rounded-lg"></div>
          <div className="absolute w-5 h-5 bg-brown-100 rounded-lg -left-3 top-1"></div>
          <div className="absolute w-1 h-4 bg-brown-100 rounded-b-lg right-0 -top-2"></div>
          <div className="absolute w-1 h-3 bg-gray-400 left-2 -bottom-3"></div>
          <div className="absolute w-1 h-3 bg-gray-400 left-8 -bottom-3"></div>
        </div>
        
        <div className="absolute bottom-0 left-[55%] w-16 h-10 scale-x-[-1]">
          <div className="w-10 h-6 bg-white rounded-lg"></div>
          <div className="absolute w-4 h-4 bg-white rounded-lg -left-2 top-1"></div>
          <div className="absolute w-1 h-3 bg-white rounded-b-lg right-0 -top-1"></div>
          <div className="absolute w-1 h-3 bg-gray-300 left-2 -bottom-3"></div>
          <div className="absolute w-1 h-3 bg-gray-300 left-6 -bottom-3"></div>
        </div>
        
        <div className="absolute bottom-0 left-[75%] w-14 h-9">
          <div className="w-9 h-5 bg-amber-200 rounded-lg"></div>
          <div className="absolute w-3 h-3 bg-amber-200 rounded-lg -left-1 top-1"></div>
          <div className="absolute w-1 h-2 bg-amber-200 rounded-b-lg right-0 -top-1"></div>
          <div className="absolute w-1 h-3 bg-gray-300 left-2 -bottom-3"></div>
          <div className="absolute w-1 h-3 bg-gray-300 left-5 -bottom-3"></div>
        </div>
        
        <div className="absolute bottom-0 left-[100%] w-16 h-10">
          <div className="w-10 h-6 bg-white rounded-lg"></div>
          <div className="absolute w-4 h-4 bg-white rounded-lg -left-2 top-1"></div>
          <div className="absolute w-1 h-3 bg-white rounded-b-lg right-0 -top-1"></div>
          <div className="absolute w-1 h-3 bg-gray-300 left-2 -bottom-3"></div>
          <div className="absolute w-1 h-3 bg-gray-300 left-6 -bottom-3"></div>
        </div>
      </div>
      
      <div ref={fruitSellersRef} className="absolute bottom-[20%] w-[300%] h-[8%]">
        <div className="absolute bottom-0 left-[25%] w-14 h-14">
          <div className="absolute bottom-0 w-10 h-6 bg-red-700 rounded-md"></div>
          <div className="absolute bottom-6 left-0 w-10 h-4 bg-yellow-500"></div>
          <div className="absolute bottom-6 left-2 w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-orange-500 rounded-full"></div>
          <div className="absolute bottom-10 w-3 h-4 bg-amber-800 rounded-full"></div>
          <div className="absolute bottom-6 w-1 h-4 bg-blue-800"></div>
        </div>
        
        <div className="absolute bottom-0 left-[45%] w-16 h-14">
          <div className="absolute bottom-0 w-12 h-5 bg-green-700 rounded-md"></div>
          <div className="absolute bottom-5 left-0 w-12 h-3 bg-yellow-400"></div>
          <div className="absolute bottom-5 left-2 w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="absolute bottom-5 left-8 w-2 h-2 bg-yellow-600 rounded-full"></div>
          <div className="absolute bottom-8 left-3 w-3 h-3 bg-amber-800 rounded-full"></div>
          <div className="absolute bottom-5 left-4 w-1 h-3 bg-red-800"></div>
        </div>
        
        <div className="absolute bottom-0 left-[65%] w-14 h-12">
          <div className="absolute bottom-0 w-10 h-4 bg-amber-700 rounded-md"></div>
          <div className="absolute bottom-4 left-0 w-10 h-3 bg-green-400"></div>
          <div className="absolute bottom-4 left-2 w-2 h-2 bg-purple-500 rounded-full"></div>
          <div className="absolute bottom-4 left-6 w-2 h-2 bg-yellow-300 rounded-full"></div>
          <div className="absolute bottom-7 left-2 w-3 h-3 bg-amber-800 rounded-full"></div>
          <div className="absolute bottom-4 left-3 w-1 h-3 bg-green-800"></div>
        </div>
        
        <div className="absolute bottom-0 left-[120%] w-14 h-14">
          <div className="absolute bottom-0 w-10 h-6 bg-red-700 rounded-md"></div>
          <div className="absolute bottom-6 left-0 w-10 h-4 bg-yellow-500"></div>
          <div className="absolute bottom-6 left-2 w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-orange-500 rounded-full"></div>
          <div className="absolute bottom-10 w-3 h-4 bg-amber-800 rounded-full"></div>
          <div className="absolute bottom-6 w-1 h-4 bg-blue-800"></div>
        </div>
      </div>
      
      <div ref={peopleRef} className="absolute bottom-[20%] w-[200%] h-[6%]">
        <div className="absolute bottom-0 left-[15%] w-3 h-8">
          <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
          <div className="w-1 h-5 bg-blue-700 absolute top-2 left-1"></div>
        </div>
        
        <div className="absolute bottom-0 left-[30%] w-3 h-8">
          <div className="w-3 h-3 bg-red-800 rounded-full"></div>
          <div className="w-1 h-5 bg-red-700 absolute top-2 left-1"></div>
        </div>
        
        <div className="absolute bottom-0 left-[50%] w-3 h-8">
          <div className="w-3 h-3 bg-green-800 rounded-full"></div>
          <div className="w-1 h-5 bg-green-700 absolute top-2 left-1"></div>
        </div>
        
        <div className="absolute bottom-0 left-[70%] w-3 h-8">
          <div className="w-3 h-3 bg-purple-800 rounded-full"></div>
          <div className="w-1 h-5 bg-purple-700 absolute top-2 left-1"></div>
        </div>
        
        <div className="absolute bottom-0 left-[20%] w-3 h-9">
          <div className="w-3 h-3 bg-amber-800 rounded-full"></div>
          <div className="w-1 h-6 bg-amber-700 absolute top-2 left-1"></div>
        </div>
        
        <div className="absolute bottom-0 left-[40%] w-3 h-7">
          <div className="w-3 h-3 bg-pink-800 rounded-full"></div>
          <div className="w-1 h-4 bg-pink-700 absolute top-2 left-1"></div>
        </div>
        
        <div className="absolute bottom-0 left-[60%] w-3 h-8">
          <div className="w-3 h-3 bg-yellow-800 rounded-full"></div>
          <div className="w-1 h-5 bg-yellow-700 absolute top-2 left-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Background;
