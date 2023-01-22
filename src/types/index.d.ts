import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Home: undefined;
  Absence: {
    program: {
      id: number;
      pengajarId: number | null;
      pengajarName?: string;
      name: string;
      status: string;
      reason: string | null;
      individual: boolean;
    };
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, Screen>;
