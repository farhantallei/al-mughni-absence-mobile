import { Button } from '@app/components/ui';
import { useRef } from 'react';
import { View, Text, ColorValue } from 'react-native';
import Toast from 'react-native-easy-toast';

type Status = 'alpha' | 'present' | 'absent';
type Indicator<T = String> = Record<Status, T>;

interface ItemProps {
  toastRef: React.RefObject<Toast>;
  program: string;
  status: Status;
  reason: string | null;
  onPress?: () => void;
}
function Item({ toastRef, program, status, reason, onPress }: ItemProps) {
  const indicatorLabel: Indicator = {
    alpha: 'Alpha',
    present: 'Hadir',
    absent: 'Tidak Hadir',
  };
  const indicatorColor: Indicator<ColorValue> = {
    alpha: 'red',
    present: 'blue',
    absent: 'orange',
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 16,
        borderColor: 'rgba(0,0,0,.1)',
        marginBottom: 16,
        padding: 12,
      }}>
      <Text>
        <Text>Program: </Text>
        <Text
          style={{
            fontWeight: 'bold',
            // color: statusColor[status] || undefined,
          }}>
          {program}
        </Text>
      </Text>
      <Text>
        <Text>Status: </Text>
        <Text
          style={{
            fontWeight: 'bold',
            color: indicatorColor[status] || undefined,
          }}>
          {indicatorLabel[status]}
        </Text>
      </Text>
      {reason ? (
        <Text>
          <Text>Udzur: </Text>
          <Text>{reason}</Text>
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Button
          style={{ width: 100, marginRight: 12 }}
          onPress={() => {
            toastRef.current?.show('Coming soon');
          }}
          backgroundColor="#7286D3">
          Print
        </Button>
        <Button
          style={{ width: 100 }}
          onPress={onPress}
          backgroundColor={indicatorColor[status]}>
          Absen
        </Button>
      </View>
    </View>
  );
}

export default Item;
