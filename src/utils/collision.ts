import { DesktopItem } from '../types';

export interface Position {
  x: number;
  y: number;
}

export interface ItemBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// 默认的书签/文件夹尺寸
export const ITEM_SIZE = {
  width: 120,
  height: 120
};

// 最小间距
export const MIN_SPACING = 10;

// 检查两个矩形是否重叠
export const isOverlapping = (item1: ItemBounds, item2: ItemBounds): boolean => {
  return !(
    item1.x + item1.width + MIN_SPACING <= item2.x ||
    item2.x + item2.width + MIN_SPACING <= item1.x ||
    item1.y + item1.height + MIN_SPACING <= item2.y ||
    item2.y + item2.height + MIN_SPACING <= item1.y
  );
};

// 获取项目的边界框
export const getItemBounds = (item: DesktopItem): ItemBounds => {
  return {
    id: item.id,
    x: item.position.x,
    y: item.position.y,
    width: ITEM_SIZE.width,
    height: ITEM_SIZE.height
  };
};

// 查找所有与给定位置重叠的项目
export const findOverlappingItems = (
  position: Position,
  items: DesktopItem[],
  excludeId?: string
): DesktopItem[] => {
  const targetBounds: ItemBounds = {
    id: 'temp',
    x: position.x,
    y: position.y,
    width: ITEM_SIZE.width,
    height: ITEM_SIZE.height
  };

  return items.filter(item => {
    if (excludeId && item.id === excludeId) return false;
    const itemBounds = getItemBounds(item);
    return isOverlapping(targetBounds, itemBounds);
  });
};

// 寻找最近的非重叠位置
export const findNearestNonOverlappingPosition = (
  desiredPosition: Position,
  items: DesktopItem[],
  excludeId?: string,
  containerBounds?: { width: number; height: number }
): Position => {
  let bestPosition = { ...desiredPosition };
  let minDistance = Infinity;
  
  // 确保位置在容器范围内
  const maxX = containerBounds ? containerBounds.width - ITEM_SIZE.width : window.innerWidth - ITEM_SIZE.width;
  const maxY = containerBounds ? containerBounds.height - ITEM_SIZE.height : window.innerHeight - ITEM_SIZE.height;
  
  bestPosition.x = Math.max(0, Math.min(bestPosition.x, maxX));
  bestPosition.y = Math.max(80, Math.min(bestPosition.y, maxY)); // 80px 为工具栏高度
  
  // 如果当前位置没有重叠，直接返回
  const overlapping = findOverlappingItems(bestPosition, items, excludeId);
  if (overlapping.length === 0) {
    return bestPosition;
  }
  
  // 搜索范围
  const searchRadius = 200;
  const step = MIN_SPACING + 5;
  
  // 螺旋搜索最近的非重叠位置
  for (let radius = step; radius <= searchRadius; radius += step) {
    for (let angle = 0; angle < 360; angle += 15) {
      const radian = (angle * Math.PI) / 180;
      const testX = desiredPosition.x + radius * Math.cos(radian);
      const testY = desiredPosition.y + radius * Math.sin(radian);
      
      // 确保在边界内
      if (testX < 0 || testX > maxX || testY < 80 || testY > maxY) {
        continue;
      }
      
      const testPosition = { x: testX, y: testY };
      const testOverlapping = findOverlappingItems(testPosition, items, excludeId);
      
      if (testOverlapping.length === 0) {
        const distance = Math.sqrt(
          Math.pow(testX - desiredPosition.x, 2) + Math.pow(testY - desiredPosition.y, 2)
        );
        
        if (distance < minDistance) {
          bestPosition = testPosition;
          minDistance = distance;
        }
      }
    }
    
    // 如果找到了合适的位置，提前退出
    if (minDistance < Infinity) {
      break;
    }
  }
  
  return bestPosition;
}; 