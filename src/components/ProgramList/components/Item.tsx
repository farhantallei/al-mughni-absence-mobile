import { Button } from '@app/components/ui';
import { View, Text, ColorValue } from 'react-native';
import Toast from 'react-native-easy-toast';
import { ItemContext, useItemContext } from './Item.context';
import type { PresentStatus, ProgramStatus } from './Item.context';

type PresentIndicator<T = string> = Record<PresentStatus, T>;
type ProgramIndicator<T = string> = Record<ProgramStatus, T>;

interface ItemProps {
  toastRef: React.RefObject<Toast>;
  pengajarName: string;
  pengajarId: number | null;
  program: string;
  individual: boolean;
  pengajar: boolean;
  presentStatus: PresentStatus;
  programStatus: ProgramStatus;
  reason: string | null;
  onAbsen?: () => void;
  onRegister?: () => void;
  onStart?: () => void;
  onChange?: () => void;
}
function Item({ presentStatus, programStatus, ...rest }: ItemProps) {
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
    alibi: 'Berhalangan',
  };

  const programIndicatorColor: ProgramIndicator<ColorValue> = {
    available: 'green',
    unavailable: 'red',
    alibi: 'orange',
  };

  const value: ItemContext = {
    presentIndicatorColor: presentIndicatorColor[presentStatus],
    presentIndicatorLabel: presentIndicatorLabel[presentStatus],
    programIndicatorColor: programIndicatorColor[programStatus],
    programIndicatorLabel: programIndicatorLabel[programStatus],
    programStatus,
    presentStatus,
    ...rest,
  };

  return (
    <ItemContext.Provider value={value}>
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
          <Text style={{ fontWeight: 'bold' }}>{rest.program}</Text>
        </Text>
        {rest.pengajarId != null ? (
          <>
            <Information keyLabel="Pengajar" label={rest.pengajarName} />
            <Information
              keyLabel="Status"
              color={programIndicatorColor[programStatus]}
              label={programIndicatorLabel[programStatus]}
            />
          </>
        ) : null}
        <PresentStatus keyLabel="Kehadiran" />
        <ReasonStatus keyLabel="Udzur" />
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
              rest.toastRef.current?.show('Coming soon');
            }}
            backgroundColor="#7286D3">
            Print
          </Button>
          <SubmitButton />
        </View>
      </View>
    </ItemContext.Provider>
  );
}

function PresentStatus({ keyLabel }: { keyLabel: string }) {
  const {
    individual,
    presentIndicatorColor,
    presentIndicatorLabel,
    pengajar,
    pengajarId,
    programStatus,
  } = useItemContext();

  if (individual)
    return (
      <Information
        keyLabel={keyLabel}
        color={presentIndicatorColor}
        label={presentIndicatorLabel}
      />
    );

  if (pengajar) return null;

  if (programStatus === 'alibi') return null;

  if (pengajarId != null) {
    return (
      <Information
        keyLabel={keyLabel}
        color={presentIndicatorColor}
        label={presentIndicatorLabel}
      />
    );
  }

  return null;
}

function ReasonStatus({ keyLabel }: { keyLabel: string }) {
  const { individual, pengajar, pengajarId, reason, programStatus } =
    useItemContext();

  if (individual) {
    if (reason) return <Information keyLabel={keyLabel} label={reason} />;
  }
  if (pengajar) {
    if (reason)
      return <Information keyLabel={`${keyLabel} Pengajar`} label={reason} />;
  }
  if (pengajarId != null) {
    const label = programStatus === 'alibi' ? `${keyLabel} Pengajar` : keyLabel;
    if (reason) return <Information keyLabel={label} label={reason} />;
    return null;
  }
  return null;
}

function SubmitButton() {
  const {
    individual,
    presentIndicatorColor,
    pengajar,
    pengajarId,
    programStatus,
    onAbsen,
    onRegister,
    onStart,
    onChange,
    toastRef,
  } = useItemContext();

  if (individual)
    return (
      <Button hug onPress={onAbsen} backgroundColor={presentIndicatorColor}>
        Absen
      </Button>
    );
  if (pengajar) {
    if (programStatus === 'available')
      return (
        <Button hug onPress={onChange} backgroundColor="orange">
          Udzur
        </Button>
      );
    return (
      <Button
        hug
        onPress={() => {
          if (programStatus === 'alibi') return onChange?.();
          onStart?.();
        }}
        backgroundColor="green">
        Mulai
      </Button>
    );
  }
  if (pengajarId != null) {
    if (programStatus === 'alibi')
      return (
        <Button hug disabled>
          Libur
        </Button>
      );
    if (programStatus === 'unavailable')
      return (
        <Button hug disabled>
          Tidak ada
        </Button>
      );
    return (
      <Button hug onPress={onAbsen} backgroundColor={presentIndicatorColor}>
        Absen
      </Button>
    );
  }
  return (
    <Button hug onPress={onRegister}>
      Register
    </Button>
  );
}

function Information({
  keyLabel,
  color,
  label,
}: {
  keyLabel: string;
  color?: ColorValue;
  label: string;
}) {
  return (
    <Text>
      <Text>{keyLabel}: </Text>
      <Text style={{ fontWeight: 'bold', color }}>{label}</Text>
    </Text>
  );
}

export default Item;
