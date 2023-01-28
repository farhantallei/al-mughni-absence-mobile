import { createContext, useContext } from 'react';
import { ColorValue } from 'react-native';
import Toast from 'react-native-easy-toast';

export type PresentStatus = 'alpha' | 'present' | 'absent';
export type ProgramStatus = 'available' | 'unavailable' | 'alibi';

export interface ItemContext {
  toastRef: React.RefObject<Toast>;
  individual: boolean;
  presentIndicatorColor: ColorValue;
  presentIndicatorLabel: string;
  programIndicatorColor: ColorValue;
  programIndicatorLabel: string;
  presentStatus: PresentStatus;
  programStatus: ProgramStatus;
  pengajar: boolean;
  pengajarId: string | null;
  reason: string | null;
  isDayOff: boolean;
  onAbsen?: () => void;
  onRegister?: () => void;
  onStart?: () => void;
  onChange?: () => void;
  onDelete?: () => void;
}

export const ItemContext = createContext<ItemContext>(null!);

export function useItemContext(): ItemContext {
  return useContext(ItemContext || {});
}
