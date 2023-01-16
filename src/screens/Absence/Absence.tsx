import { Button, Container, TextInput } from '@app/components/ui';
import mudarrisin from '@app/data/mudarrisin.json';
import { RootStackScreenProps } from '@app/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  Button as RNButton,
  Keyboard,
  Modal,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './Absence.styles';

type Level = 'dasar' | 'lanjut';

interface LevelOption {
  label: string;
  value: Level;
}

function Absence({ navigation, route }: RootStackScreenProps<'Absence'>) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNotPresentModal, setShowNotPresentModal] = useState(false);
  const [cause, setCause] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);

  const levelOptions: LevelOption[] = [
    { label: 'Dasar', value: 'dasar' },
    { label: 'Lanjut', value: 'lanjut' },
  ];

  const [level, setLevel] = useState<Level>('dasar');
  const [mudarris, setMudarris] = useState('fuad');

  const subject: Record<typeof route.params.subject, string> = {
    'baca kitab': 'Baca Kitab',
    tahfizh: 'Tahfizh',
  };

  useEffect(() => {
    if (cause != '') {
      setError(false);
      setErrorMessage('');
      return;
    }
    setError(true);
    setErrorMessage('berikan udzur');
  }, [cause]);

  function onDateChange(event: any, selectedDate: Date | undefined) {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  }

  return (
    <Container>
      <View style={styles.form}>
        <Text style={styles.title}>{subject[route.params.subject]}</Text>
        {route.params.subject === 'baca kitab' ? (
          <>
            <Text
              style={{
                textAlign: Platform.OS === 'ios' ? 'center' : undefined,
              }}>
              Kelas
            </Text>
            {Platform.OS === 'ios' ? (
              <PickerIOS
                selectedValue={level}
                onValueChange={value => setLevel(value as Level)}>
                {levelOptions.map(picker => (
                  <PickerIOS.Item
                    key={picker.value}
                    label={picker.label}
                    value={picker.value}
                  />
                ))}
              </PickerIOS>
            ) : (
              <Picker
                selectedValue={level}
                onValueChange={value => setLevel(value)}>
                {levelOptions.map(picker => (
                  <Picker.Item
                    key={picker.value}
                    label={picker.label}
                    value={picker.value}
                  />
                ))}
              </Picker>
            )}
          </>
        ) : undefined}
        <Text
          style={{ textAlign: Platform.OS === 'ios' ? 'center' : undefined }}>
          Pengajar
        </Text>
        {route.params.subject === 'baca kitab' ? (
          Platform.OS === 'ios' ? (
            <PickerIOS
              selectedValue={mudarris}
              onValueChange={value => setMudarris(value as string)}>
              {mudarrisin
                .filter(mudarris =>
                  mudarris.ngajar.some(ngajar =>
                    ngajar.includes(route.params.subject),
                  ),
                )
                .filter(mudarris =>
                  mudarris.ngajar.some(ngajar => ngajar.includes(level)),
                )
                .map(mudarris => (
                  <Picker.Item
                    key={mudarris.name}
                    label={mudarris.name.toUpperCase()}
                    value={mudarris.name}
                  />
                ))}
            </PickerIOS>
          ) : (
            <Picker
              selectedValue={mudarris}
              onValueChange={value => setMudarris(value)}>
              {mudarrisin
                .filter(mudarris =>
                  mudarris.ngajar.some(ngajar =>
                    ngajar.includes(route.params.subject),
                  ),
                )
                .filter(mudarris =>
                  mudarris.ngajar.some(ngajar => ngajar.includes(level)),
                )
                .map(mudarris => (
                  <Picker.Item
                    key={mudarris.name}
                    label={mudarris.name.toUpperCase()}
                    value={mudarris.name}
                  />
                ))}
            </Picker>
          )
        ) : Platform.OS === 'ios' ? (
          <PickerIOS
            selectedValue={mudarris}
            onValueChange={value => setMudarris(value as string)}>
            {mudarrisin
              .filter(mudarris =>
                mudarris.ngajar.some(ngajar =>
                  ngajar.includes(route.params.subject),
                ),
              )
              .map(mudarris => (
                <Picker.Item
                  key={mudarris.name}
                  label={mudarris.name.toUpperCase()}
                  value={mudarris.name}
                />
              ))}
          </PickerIOS>
        ) : (
          <Picker
            selectedValue={mudarris}
            onValueChange={value => setMudarris(value)}>
            {mudarrisin
              .filter(mudarris =>
                mudarris.ngajar.some(ngajar =>
                  ngajar.includes(route.params.subject),
                ),
              )
              .map(mudarris => (
                <Picker.Item
                  key={mudarris.name}
                  label={mudarris.name.toUpperCase()}
                  value={mudarris.name}
                />
              ))}
          </Picker>
        )}
        {Platform.OS === 'android' ? (
          <RNButton
            title={dateFormatter(date)}
            onPress={() => setShowDatePicker(true)}
          />
        ) : undefined}
        {Platform.OS === 'ios' || showDatePicker ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            is24Hour
            display="default"
            onChange={onDateChange}
          />
        ) : undefined}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button
          onPress={() => setShowNotPresentModal(true)}
          row
          backgroundColor="red"
          style={{ marginRight: 8 }}>
          Tidak hadir
        </Button>
        <Button
          row
          backgroundColor="green"
          disabled={date === undefined}
          style={{ marginLeft: 8 }}>
          Hadir
        </Button>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showNotPresentModal}
        onRequestClose={() => setShowNotPresentModal(false)}
        style={{ elevation: 20 }}>
        <Container>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <Text style={{ color: 'red', alignSelf: 'flex-start' }}>
                {errorMessage}
              </Text>
              <TextInput
                style={{ width: '100%' }}
                placeholder="Alasan tidak hadir"
                onChangeText={text => setCause(text)}
                error={error}
              />
              <View style={{ flexDirection: 'row' }}>
                <Button
                  onPress={() => setShowNotPresentModal(false)}
                  row
                  backgroundColor="#bbb"
                  style={{ marginRight: 8 }}>
                  Cancel
                </Button>
                <Button
                  row
                  backgroundColor="#007aff"
                  disabled={date === undefined}
                  style={{ marginLeft: 8 }}>
                  Submit
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Container>
      </Modal>
    </Container>
  );
}

function dateFormatter(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export default Absence;
