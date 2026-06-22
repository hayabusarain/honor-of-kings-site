import { create } from 'zustand';

export type BoardItemType = 'hero' | 'ward' | 'drawing';

export interface BoardItem {
  id: string;
  type: BoardItemType;
  x: number;
  y: number;
  label?: string;
  color?: string;
  points?: number[]; // For drawings
}

interface BoardState {
  items: BoardItem[];
  addItem: (item: Omit<BoardItem, 'id'>) => void;
  updateItemPosition: (id: string, x: number, y: number) => void;
  clearBoard: () => void;
  setBoardState: (items: BoardItem[]) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, { ...item, id: crypto.randomUUID() }]
  })),
  updateItemPosition: (id, x, y) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, x, y } : item
    )
  })),
  clearBoard: () => set({ items: [] }),
  setBoardState: (items) => set({ items }),
}));
