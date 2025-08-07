import { ButtonPosition } from '../types/navbarTypes';
import { VISIBLE_ITEMS } from './constants';

export const calculateButtonPosition = (
  displayIndex: number,
  currentRadius: number,
  totalItems: number
): ButtonPosition => {
  const startAngle = -80;
  const endAngle = 80;
  const visibleItemsCount = Math.min(VISIBLE_ITEMS, totalItems);
  const angleStep = visibleItemsCount > 1 ? (endAngle - startAngle) / (visibleItemsCount - 1) : 0;
  const angle = startAngle + displayIndex * angleStep;
  const radian = (angle * Math.PI) / 180;

  return {
    x: Math.cos(radian) * currentRadius,
    y: Math.sin(radian) * currentRadius,
    angle,
    zIndex: Math.round(100 + Math.cos(radian) * 50),
  };
};

export const createPositionCache = (radius: number, totalItems: number) => {
  const cache = new Map<number, ButtonPosition>();
  const visibleItemsCount = Math.min(VISIBLE_ITEMS, totalItems);
  
  for (let i = 0; i < visibleItemsCount; i++) {
    cache.set(i, calculateButtonPosition(i, radius, totalItems));
  }
  
  return cache;
};