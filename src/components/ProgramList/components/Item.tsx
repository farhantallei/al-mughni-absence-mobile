import { Button } from '@app/components/ui';
import { View, Text, ColorValue } from 'react-native';
import Toast from 'react-native-easy-toast';

type PresentStatus = 'alpha' | 'present' | 'absent';
type PresentIndicator<T = String> = Record<PresentStatus, T>;
type ProgramStatus = 'available' | 'unavailable' | 'alibi';
type ProgramIndicator<T = String> = Record<ProgramStatus, T>;

interface ItemProps {
  toastRef: React.RefObject<Toast>;
  program: string;
  individual: boolean;
  pengajar: boolean;
  status: PresentStatus;
  reason: string | null;
  onPress?: () => void;
}
function Item({
  toastRef,
  program,
  individual,
  pengajar,
  status,
  reason,
  onPress,
}: ItemProps) {
  const presentIndicatorLabel: PresentIndicator = {
    alpha: 'Alpha',
    present: 'Hadir',
    absent: 'Tidak Hadir',
  };
  const presentIndicatorColor: PresentIndicator<ColorValue> = {
    alpha: 'red',
    present: 'blue',
    absent: 'orange',
  };

  const programIndicatorLabel: ProgramIndicator = {
    available: 'Tersedia',
    unavailable: 'Tidak Ada',
    alibi: 'Isi sendiri',
  };

  const programIndicatorColor: ProgramIndicator<ColorValue> = {
    available: 'green',
    unavailable: 'red',
    alibi: 'orange',
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
            color:
              individual || !pengajar
                ? presentIndicatorColor[status]
                : programIndicatorColor['unavailable'],
          }}>
          {individual || !pengajar
            ? presentIndicatorLabel[status]
            : programIndicatorLabel['unavailable']}
        </Text>
      </Text>
      {reason ? (
        <Text>
          <Text>Udzur: </Text>
          <Text>{reason}</Text>
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 12,
        }}>
        <Button
          style={{ marginRight: 12 }}
          hug
          onPress={() => {
            toastRef.current?.show('Coming soon');
          }}
          backgroundColor="#7286D3">
          Print
        </Button>
        {individual || !pengajar ? (
          <Button
            hug
            onPress={onPress}
            backgroundColor={presentIndicatorColor[status]}>
            Absen
          </Button>
        ) : (
          <Button
            hug
            onPress={() => {
              toastRef.current?.show('On working');
            }}>
            Mulai
          </Button>
        )}
      </View>
    </View>
  );
}

export default Item;
