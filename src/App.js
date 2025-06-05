import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { soundVariations, createSassySound, createCelebrationSound } from './soundEffects';

const screenShake = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(-5px, -5px) rotate(-1deg); }
  50% { transform: translate(5px, 5px) rotate(1deg); }
  75% { transform: translate(-3px, 3px) rotate(-0.5deg); }
`;

const rainbowText = keyframes`
  0% { color: red; }
  15% { color: orange; }
  30% { color: yellow; }
  45% { color: green; }
  60% { color: blue; }
  75% { color: indigo; }
  90% { color: violet; }
  100% { color: red; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const GlobalStyle = createGlobalStyle`
  .screen-shake {
    animation: ${screenShake} 0.5s ease-in-out;
  }

  ${screenShake}
  
  html {
    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }

  body {
    margin: 0;
    padding: 0;
    background: #1e1e1e;
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
  }
`;

const Container = styled.div`
  text-align: center;
  padding: 0;
  position: relative;
  z-index: 2;
  pointer-events: none;
`;

const ButtonArea = styled.div`
  position: relative;
  z-index: 3;
  background: transparent;
  padding: 0.5rem;
  display: inline-block;
  pointer-events: auto;
  margin: 2rem 0;
`;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: crosshair;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 1rem 0;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  pointer-events: none;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin: 0.5rem 0;
  }
`;

const Button = styled(motion.button)`
  background: radial-gradient(circle at 30% 30%, #ff4444, #cc0000);
  border: none;
  padding: 2rem 4rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 
    0 8px 0 #990000,
    0 10px 15px rgba(0, 0, 0, 0.35),
    inset 0 -8px 12px rgba(0, 0, 0, 0.35);
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  position: relative;
  width: 200px;
  height: 200px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.1s ease-in-out;
  transform-style: preserve-3d;
  perspective: 1000px;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    font-size: 1.4rem;
    padding: 1.5rem 3rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 70% 70%, transparent, rgba(0, 0, 0, 0.2));
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 10%;
    left: 20%;
    width: 30%;
    height: 15%;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: rotate(-35deg);
    pointer-events: none;
    filter: blur(2px);
  }
`;

const ScoreText = styled(motion.div)`
  font-size: 1.5rem;
  color: #FF6B6B;
  margin-top: 1rem;
  font-weight: 600;
  pointer-events: none;
`;

const SoundToggle = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  z-index: 3;
  pointer-events: auto;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    font-size: 1.8rem;
  }

  &:hover {
    opacity: 1;
  }
`;

const MilestoneText = styled(motion.div)`
  font-size: 2.5rem;
  color: #FF8E53;
  position: fixed;
  bottom: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  font-weight: bold;
  text-shadow: 0 0 15px rgba(255, 142, 83, 0.5);
  pointer-events: none;
  z-index: 1000;
`;

const ToggleButton = styled.button`
  position: fixed;
  background: rgba(40, 40, 40, 0.9);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  z-index: 4;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: rgba(60, 60, 60, 0.9);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PaletteToggle = styled(ToggleButton)`
  bottom: ${props => props.show ? '240px' : '20px'};
  right: ${props => props.show ? '20px' : '50%'};
  transform: ${props => props.show ? 'none' : 'translateX(50%)'};

  @media (max-width: 768px) {
    bottom: ${props => props.show ? '200px' : '20px'};
    right: 50%;
    transform: translateX(50%);
  }
`;

const DealerToggle = styled(ToggleButton)`
  bottom: 20px;
  left: ${props => props.show ? '220px' : '20px'};

  @media (max-width: 768px) {
    display: none;
  }
`;

const ColorPalette = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(40, 40, 40, 0.9);
  padding: 10px;
  border-radius: 8px;
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: column;
  gap: 8px;
  z-index: 3;
  pointer-events: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    bottom: 70px;
    right: 50%;
    transform: translateX(50%);
    width: 90%;
    max-width: 300px;
  }
`;

const ColorRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ColorButton = styled.button`
  width: 30px;
  height: 30px;
  border: 2px solid ${props => props.isSelected ? '#fff' : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.color};
  transition: transform 0.1s;

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
  }

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SizeSlider = styled.input`
  width: 100%;
  margin-top: 5px;
  height: 20px;

  @media (max-width: 768px) {
    height: 30px;
    margin: 10px 0;
  }
`;

const SizeLabel = styled.div`
  color: white;
  font-size: 12px;
  text-align: center;
  margin-bottom: 5px;
`;

const Star = styled(motion.div)`
  position: fixed;
  width: 20px;
  height: 20px;
  color: ${props => props.color};
  pointer-events: none;
  z-index: 1000;
  font-size: 20px;
  user-select: none;
`;

const CelebrationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
`;

const CuteStar = styled(motion.div)`
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 60px;
  cursor: pointer;
  user-select: none;
  z-index: 3;
  filter: drop-shadow(0 0 10px rgba(255, 223, 0, 0.3));
  background: linear-gradient(45deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  pointer-events: auto;

  @media (max-width: 768px) {
    right: 20px;
    font-size: 40px;
    width: 40px;
    height: 40px;
  }
`;

const StarMessage = styled(motion.div)`
  position: fixed;
  right: 80px;
  top: ${props => props.y}px;
  transform: translateY(-50%);
  font-size: 24px;
  color: #FFD700;
  font-weight: bold;
  pointer-events: none;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  white-space: nowrap;
`;

const HitMarker = styled(motion.div)`
  position: fixed;
  font-size: 40px;
  pointer-events: none;
  z-index: 1000;
  user-select: none;
  font-weight: bold;
  text-shadow: 2px 2px 0 #000;
`;

const WowText = styled(motion.div)`
  position: fixed;
  font-size: 60px;
  color: #FF0000;
  font-weight: bold;
  text-shadow: 
    -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000,
    2px 2px 0 #000;
  pointer-events: none;
  z-index: 1000;
  animation: ${rainbowText} 1s linear infinite;
`;

const DoritosImage = styled(motion.div)`
  position: fixed;
  width: 100px;
  height: 100px;
  background: url('https://www.freepnglogos.com/uploads/doritos-png-logo/doritos-png-logo-0.png') center/contain no-repeat;
  pointer-events: none;
  z-index: 999;
  animation: ${spin} 2s linear infinite;
`;

const MountainDewImage = styled(motion.div)`
  position: fixed;
  width: 80px;
  height: 150px;
  background: url('https://www.pngmart.com/files/4/Mountain-Dew-PNG-Picture.png') center/contain no-repeat;
  pointer-events: none;
  z-index: 999;
`;

const DealerSection = styled.div`
  position: fixed;
  left: 20px;
  bottom: 20px;
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: flex-end;
  gap: 2px;
  z-index: 3;
  pointer-events: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DealerCharacter = styled(motion.div)`
  width: 140px;
  height: 160px;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
  svg {
    width: 100%;
    height: 100%;
  }
`;

const DealerTitle = styled.div`
  font-size: 18px;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  margin-bottom: 5px;
`;

const DealerInput = styled.input`
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid #666;
  border-radius: 8px;
  color: #fff;
  padding: 8px 12px;
  font-size: 16px;
  width: 200px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #888;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: #888;
  }
`;

function App() {
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMilestone, setShowMilestone] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('rgba(255, 142, 83, 0.6)');
  const [lineWidth, setLineWidth] = useState(4);
  const [stars, setStars] = useState([]);
  const [showStarMessage, setShowStarMessage] = useState(false);
  const [starMessageY, setStarMessageY] = useState(0);
  const [hitMarkers, setHitMarkers] = useState([]);
  const [wowEffects, setWowEffects] = useState([]);
  const [showMLG, setShowMLG] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showPalette, setShowPalette] = useState(false);
  const [showDealer, setShowDealer] = useState(true);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const points = useRef([]);
  const lastPoint = useRef(null);
  const buttonRef = useRef(null);
  const titleRef = useRef(null);
  const scoreRef = useRef(null);

  const colors = [
    ['#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff'],
    ['#990000', '#994c00', '#999900', '#009900', '#009999', '#000099', '#4c0099', '#990099'],
    ['#000000', '#404040', '#808080', '#bfbfbf', '#ffffff']
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = currentColor;
    context.lineWidth = lineWidth;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    contextRef.current = context;

    context.fillStyle = '#1e1e1e';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = currentColor;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [currentColor, lineWidth]);

  const smoothPoints = (points) => {
    if (points.length < 3) return points;

    const smoothed = [];
    smoothed.push(points[0]);

    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const current = points[i];
      const next = points[i + 1];

      const controlPoint1 = {
        x: current.x - (next.x - prev.x) * 0.2,
        y: current.y - (next.y - prev.y) * 0.2
      };

      const controlPoint2 = {
        x: current.x + (next.x - prev.x) * 0.2,
        y: current.y + (next.y - prev.y) * 0.2
      };

      smoothed.push(controlPoint1, current, controlPoint2);
    }

    smoothed.push(points[points.length - 1]);
    return smoothed;
  };

  const getCoordinates = (event) => {
    if (event.touches) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    }
    return {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY
    };
  };

  const startDrawing = (event) => {
    const { x, y } = getCoordinates(event);
    points.current = [{ x, y }];
    lastPoint.current = { x, y };
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    
    const { x, y } = getCoordinates(event);
    const ctx = contextRef.current;
    
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const titleRect = titleRef.current?.getBoundingClientRect();
    const scoreRect = scoreRef.current?.getBoundingClientRect();

    if (buttonRect && titleRect && scoreRect) {
      const isNearButton = y > buttonRect.top - 10 && 
                          y < buttonRect.bottom + 10 && 
                          x > buttonRect.left - 10 && 
                          x < buttonRect.right + 10;
                          
      const isNearTitle = y > titleRect.top - 10 && 
                         y < titleRect.bottom + 10 && 
                         x > titleRect.left - 10 && 
                         x < titleRect.right + 10;
                         
      const isNearScore = y > scoreRect.top - 10 && 
                         y < scoreRect.bottom + 10 && 
                         x > scoreRect.left - 10 && 
                         x < scoreRect.right + 10;

      if (isNearButton || isNearTitle || isNearScore) return;
    }

    if (lastPoint.current) {
      const dx = x - lastPoint.current.x;
      const dy = y - lastPoint.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= 2) {
        points.current.push({ x, y });
        
        if (points.current.length > 3) {
          const smoothedPoints = smoothPoints(points.current.slice(-4));
          
          ctx.beginPath();
          ctx.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);
          
          for (let i = 1; i < smoothedPoints.length - 2; i += 3) {
            ctx.bezierCurveTo(
              smoothedPoints[i].x, smoothedPoints[i].y,
              smoothedPoints[i + 1].x, smoothedPoints[i + 1].y,
              smoothedPoints[i + 2].x, smoothedPoints[i + 2].y
            );
          }
          
          ctx.stroke();
        }

        lastPoint.current = { x, y };
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    lastPoint.current = null;
    points.current = [];
  };

  const handleButtonClick = () => {
    const newScore = score + 1;
    setScore(newScore);
    if (soundEnabled) {
      playRandomSound();
      checkMilestone(newScore);
    }
    
    // Add MLG effects extremely rarely or on very special milestones
    if (Math.random() < 0.01 || newScore % 500 === 0) {
      triggerMLGEffects();
    }
  };

  const playRandomSound = () => {
    try {
      const randomSound = soundVariations[Math.floor(Math.random() * soundVariations.length)];
      randomSound();
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  };

  const createStar = () => {
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB'];
    return {
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: -20,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5
    };
  };

  const startCelebration = () => {
    const newStars = Array(20).fill(null).map(createStar);
    setStars(newStars);
    if (soundEnabled) {
      createCelebrationSound();
    }
    setTimeout(() => setStars([]), 3000);
  };

  const checkMilestone = (newScore) => {
    // Check for 69 milestone
    if (newScore.toString().includes('69')) {
      createSassySound();
      setShowMilestone(true);
      setTimeout(() => setShowMilestone(false), 1500);
    }

    // Check for multiples of 100
    if (newScore % 100 === 0 && newScore > 0) {
      startCelebration();
    }
  };

  const handleColorChange = (color) => {
    setCurrentColor(color);
  };

  const handleSizeChange = (e) => {
    setLineWidth(Number(e.target.value));
  };

  const handleStarClick = (event) => {
    event.stopPropagation(); // Prevent event from reaching canvas
    setShowStarMessage(false); // Reset first to ensure animation triggers
    setTimeout(() => {
      setShowStarMessage(true);
      setStarMessageY(event.clientY);
    }, 10);
    setTimeout(() => setShowStarMessage(false), 1000);

    // Play a cute "ouch" sound
    if (soundEnabled) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, context.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.2);
    }
  };

  // MLG Sound Effects
  const playMLGSound = () => {
    if (!soundEnabled) return;
    
    const sounds = [
      'https://www.myinstants.com/media/sounds/wow.mp3'
    ];
    
    const audio = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
    audio.volume = 0.1;
    audio.play().catch(console.error);
  };

  const addHitMarker = (x, y) => {
    const newMarker = {
      id: Date.now(),
      x,
      y,
      text: ['💥', '✨', '⚡'][Math.floor(Math.random() * 3)]
    };
    setHitMarkers(prev => [...prev, newMarker]);
    setTimeout(() => {
      setHitMarkers(prev => prev.filter(marker => marker.id !== newMarker.id));
    }, 500);
  };

  const addWowEffect = () => {
    const texts = ['WOW!', 'OMG!', 'BOOM!', 'POW!', 'KAPOW!'];
    const newEffect = {
      id: Date.now(),
      text: texts[Math.floor(Math.random() * texts.length)],
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 100)
    };
    setWowEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setWowEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1000);
  };

  const triggerMLGEffects = () => {
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 500);
    
    playMLGSound();
    addWowEffect();
    setShowMLG(true);
    setTimeout(() => setShowMLG(false), 2000);
    
    // Add multiple hit markers
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        addHitMarker(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        );
      }, i * 100);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <GlobalStyle />
      <Canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
      />
      
      <PaletteToggle 
        show={showPalette}
        onClick={() => setShowPalette(!showPalette)}
      >
        {showPalette ? '✕ Hide Paint' : '🎨 Show Paint'}
      </PaletteToggle>

      <DealerToggle
        show={showDealer}
        onClick={() => setShowDealer(!showDealer)}
      >
        {showDealer ? '✕ Hide Dealer' : '👽 Show Dealer'}
      </DealerToggle>

      <Container>
        <Title ref={titleRef}>Press for Dopamine!</Title>
        <ButtonArea>
          <Button
            ref={buttonRef}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 0 #990000, 0 12px 20px rgba(0, 0, 0, 0.35), inset 0 -8px 12px rgba(0, 0, 0, 0.35)'
            }}
            whileTap={{ 
              scale: 0.92,
              y: 10,
              boxShadow: '0 2px 0 #990000, 0 4px 8px rgba(0, 0, 0, 0.35), inset 0 -4px 6px rgba(0, 0, 0, 0.35)',
              background: 'radial-gradient(circle at 30% 30%, #ee3333, #bb0000)'
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15
            }}
            onClick={handleButtonClick}
          >
            Feel Good!
          </Button>
        </ButtonArea>

        <SoundToggle onClick={() => setSoundEnabled(!soundEnabled)}>
          {soundEnabled ? '🔊' : '🔇'}
        </SoundToggle>

        <ColorPalette show={showPalette}>
          {colors.map((row, rowIndex) => (
            <ColorRow key={rowIndex}>
              {row.map((color) => (
                <ColorButton
                  key={color}
                  color={color}
                  isSelected={currentColor === color}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </ColorRow>
          ))}
          <SizeLabel>Brush Size: {lineWidth}px</SizeLabel>
          <SizeSlider
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={handleSizeChange}
          />
        </ColorPalette>

        <CelebrationContainer>
          <AnimatePresence>
            {stars.map(star => (
              <Star
                key={star.id}
                color={star.color}
                initial={{ 
                  x: star.x,
                  y: star.y,
                  rotate: star.rotation,
                  scale: 0
                }}
                animate={{ 
                  y: window.innerHeight + 20,
                  rotate: star.rotation + 360,
                  scale: 1
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: star.delay,
                  ease: "easeOut"
                }}
              >
                ⭐
              </Star>
            ))}
          </AnimatePresence>
        </CelebrationContainer>

        <AnimatePresence>
          {showMilestone && (
            <MilestoneText
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0, y: -50 }}
              transition={{ duration: 0.4 }}
            >
              Nice! 😏
            </MilestoneText>
          )}
        </AnimatePresence>

        <ScoreText
          ref={scoreRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={score}
        >
          Dopamine Level: {score}
        </ScoreText>

        <CuteStar
          whileHover={{ 
            scale: 1.2,
            rotate: 20,
            filter: 'drop-shadow(0 0 15px rgba(255, 223, 0, 0.5))'
          }}
          whileTap={{ 
            scale: 0.8,
            rotate: -20,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          animate={{ 
            y: [-5, 5, -5],
            rotate: [-5, 5, -5]
          }}
          transition={{ 
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
          onClick={handleStarClick}
        >
          ★
        </CuteStar>
      </Container>

      <AnimatePresence>
        {showStarMessage && (
          <StarMessage
            y={starMessageY}
            initial={{ opacity: 0, x: 20, scale: 0.5 }}
            animate={{ opacity: 1, x: 40, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.5 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 20,
              duration: 0.3 
            }}
          >
            OUCH! 😣
          </StarMessage>
        )}
      </AnimatePresence>

      <DealerSection show={showDealer}>
        <div>
          <DealerTitle>Dealer</DealerTitle>
          <DealerCharacter
            animate={{ 
              y: [-2, 2, -2],
              rotate: [-1, 1, -1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="alienSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#33FF33' }} />
                  <stop offset="100%" style={{ stopColor: '#229922' }} />
                </linearGradient>
                <linearGradient id="alienHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#44FF44' }} />
                  <stop offset="100%" style={{ stopColor: '#33FF33' }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Background Window Frame */}
              <rect x="15" y="10" width="70" height="120" rx="8" ry="8" 
                    fill="#1A1A1A" />
              <rect x="18" y="13" width="64" height="114" rx="6" ry="6" 
                    fill="#2A2A2A" />

              {/* Alien Head with better shading */}
              <path d="M30 45 C30 20, 70 20, 70 45 L65 65 L35 65 Z" fill="url(#alienSkin)" />
              <path d="M32 43 C32 22, 68 22, 68 43 L64 62 L36 62 Z" fill="url(#alienHighlight)" />
              
              {/* Glowing Evil Eyes */}
              <g filter="url(#glow)">
                <path d="M35 38 L45 42 L35 46 Z" fill="#FFFF00" opacity="0.8" />
                <path d="M65 38 L55 42 L65 46 Z" fill="#FFFF00" opacity="0.8" />
              </g>
              <circle cx="40" cy="42" r="2" fill="#000000" />
              <circle cx="60" cy="42" r="2" fill="#000000" />
              
              {/* Enhanced Alien Features */}
              <path d="M40 52 Q50 58 60 52" fill="none" stroke="#1A1A1A" strokeWidth="2" />
              <path d="M42 54 Q50 59 58 54" fill="none" stroke="#2A2A2A" strokeWidth="1" />
              
              {/* Detailed Tank Top */}
              <path d="M35 65 L30 120 L70 120 L65 65" fill="#FFFFFF" />
              <path d="M38 70 L34 115 L66 115 L62 70" fill="#EEEEEE" />
              <path d="M36 75 L33 110 L67 110 L64 75" fill="#DDDDDD" />
              
              {/* Enhanced Neck Details */}
              <path d="M40 65 L42 70 L45 65" fill="none" stroke="#228822" strokeWidth="1.5" />
              <path d="M55 65 L58 70 L60 65" fill="none" stroke="#228822" strokeWidth="1.5" />
              
              {/* More Alien Texture */}
              <path d="M35 30 L38 33" stroke="#33DD33" strokeWidth="1.5" />
              <path d="M62 30 L65 33" stroke="#33DD33" strokeWidth="1.5" />
              <path d="M45 25 L48 28" stroke="#33DD33" strokeWidth="1.5" />
              <path d="M52 25 L55 28" stroke="#33DD33" strokeWidth="1.5" />
              <path d="M40 35 L43 38" stroke="#228822" strokeWidth="1" />
              <path d="M57 35 L60 38" stroke="#228822" strokeWidth="1" />
              
              {/* Enhanced Chain */}
              <g transform="translate(0, -2)">
                <rect x="35" y="80" width="30" height="6" fill="#333333" />
                <rect x="36" y="81" width="28" height="4" fill="#4A4A4A" />
                {[0, 1, 2, 3, 4].map(i => (
                  <g key={i}>
                    <circle cx={38 + i * 6} cy="83" r="2.5" fill="#666666" />
                    <circle cx={38 + i * 6} cy="83" r="1.5" fill="#888888" />
                  </g>
                ))}
              </g>
              
              {/* Subtle Veins */}
              <path d="M33 35 C35 33, 37 34, 38 36" stroke="#228822" strokeWidth="0.5" fill="none" />
              <path d="M62 35 C64 33, 66 34, 67 36" stroke="#228822" strokeWidth="0.5" fill="none" />
            </svg>
          </DealerCharacter>
        </div>
        <DealerInput
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          style={{ marginLeft: '4px' }}
        />
      </DealerSection>
    </>
  );
}

export default App; 