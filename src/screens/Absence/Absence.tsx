import { Loading } from '@app/components';
import { Button, Container, TextInput } from '@app/components/ui';
import { useGlobalState } from '@app/hooks';
import { addAbsent, updateAbsent } from '@app/services/absent';
import { RootStackScreenProps } from '@app/types';
import {
  AbsentResponse,
  PelajarResponse,
  ProgramResponse,
} from '@app/types/rest';
import { formatDate } from '@app/utils';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  // Button as RNButton,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput as TextInputRN,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import styles from './Absence.styles';

interface form {
  pelajarId: number;
  pengajarId?: number;
  programId: number;
  date: string;
  reason?: string;
}

type status = 'Alpha' | 'Hadir' | 'Tidak Hadir';

function Absence({ route, navigation }: RootStackScreenProps<'Absence'>) {
  // const [date, setDate] = useState(new Date());
  // const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNotPresentModal, setShowNotPresentModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [userId] = useGlobalState<number>(['userId']);
  const [pengajar] = useGlobalState<PelajarResponse[]>([
    'pengajar',
    { program: route.params.program.name },
  ]);
  const [absent] = useGlobalState<AbsentResponse | null>([
    'absent',
    { program: route.params.program.name, date: formatDate(new Date()) },
  ]);
  // const [programs, setPrograms] = useGlobalState<ProgramResponse[]>([
  //   'program',
  // ]);
  const reasonInputRef = useRef<TextInputRN>(null);
  const errorToastRef = useRef<Toast>(null);
  const queryClient = useQueryClient();

  const statusColor: Record<status, string> = {
    Alpha: 'red',
    Hadir: 'blue',
    'Tidak Hadir': 'orange',
  };

  const status = useMemo((): status => {
    if (absent == null) return 'Alpha';
    if (absent.present) return 'Hadir';
    return 'Tidak Hadir';
  }, [absent]);

  const [form, setForm] = useState<form>({
    pelajarId: userId,
    pengajarId: route.params.program.individual
      ? undefined
      : absent?.pengajarId || 1,
    programId: route.params.program.id,
    date: formatDate(new Date()),
  });

  const { mutate: presentMutate, isLoading: isPresentLoading } = useMutation(
    (present: boolean) => addAbsent({ ...form, present }),
    {
      onMutate: async present => {
        await queryClient.cancelQueries({ queryKey: ['program'] });

        const prevPrograms = queryClient.getQueryData<ProgramResponse[]>([
          'program',
        ]);

        if (prevPrograms) {
          const programs: ProgramResponse[] = [
            ...prevPrograms.filter(
              program => program.id !== route.params.program.id,
            ),
            {
              id: route.params.program.id,
              name: route.params.program.name,
              individual: route.params.program.individual,
              pengajar: false,
              status: present ? 'present' : 'absent',
              reason: form.reason || null,
            },
          ];
          queryClient.setQueryData<ProgramResponse[]>(
            ['program'],
            programs.sort((a, b) => {
              if (a.id < b.id) return -1;
              if (a.id > b.id) return 1;
              return 0;
            }),
          );
        }

        // if (prevPrograms) {
        //   setPrograms([
        //     ...prevPrograms.filter(
        //       program => program.id !== route.params.program.id,
        //     ),
        //     {
        //       id: route.params.program.id,
        //       program: route.params.program.name,
        //       status: present ? 'present' : 'absent',
        //       reason: form.reason || null,
        //     },
        //   ]);
        // }
        resetError;

        return { prevPrograms };
      },
      onError(error) {
        if (error instanceof Error) errorToastRef.current?.show(error.message);
        else if (error instanceof String) errorToastRef.current?.show(error);
        else errorToastRef.current?.show('ada kesalahan teknis');
      },
      onSuccess() {
        navigation.navigate('Home');
      },
    },
  );

  const { mutate: presentMutateUpdate, isLoading: isPresentUpdateLoading } =
    useMutation((present: boolean) => updateAbsent({ ...form, present }), {
      onMutate: async present => {
        await queryClient.cancelQueries({ queryKey: ['program'] });

        const prevPrograms = queryClient.getQueryData<ProgramResponse[]>([
          'program',
        ]);

        if (prevPrograms) {
          const programs: ProgramResponse[] = [
            ...prevPrograms.filter(
              program => program.id !== route.params.program.id,
            ),
            {
              id: route.params.program.id,
              name: route.params.program.name,
              individual: route.params.program.individual,
              pengajar: false,
              status: present ? 'present' : 'absent',
              reason: form.reason || null,
            },
          ];
          queryClient.setQueryData<ProgramResponse[]>(
            ['program'],
            programs.sort((a, b) => {
              if (a.id < b.id) return -1;
              if (a.id > b.id) return 1;
              return 0;
            }),
          );
        }

        // if (prevPrograms) {
        //   setPrograms([
        //     ...prevPrograms.filter(
        //       program => program.id !== route.params.program.id,
        //     ),
        //     {
        //       id: route.params.program.id,
        //       program: route.params.program.name,
        //       status: present ? 'present' : 'absent',
        //       reason: form.reason || null,
        //     },
        //   ]);
        // }
        resetError;

        return { prevPrograms };
      },
      onError(error) {
        if (error instanceof Error) errorToastRef.current?.show(error.message);
        else if (error instanceof String) errorToastRef.current?.show(error);
        else errorToastRef.current?.show('ada kesalahan teknis');
      },
      onSuccess() {
        navigation.navigate('Home');
      },
    });

  useEffect(() => {
    if (form.reason == null || form.reason === '') {
      setError(true);
      setErrorMessage('berikan udzur');
      return;
    }
    setError(false);
    setErrorMessage('');
  }, [form.reason]);

  // function onDateChange(_event: any, selectedDate: Date | undefined) {
  //   if (Platform.OS === 'android') setShowDatePicker(false);
  //   if (selectedDate) setDate(selectedDate);
  // }

  function resetError() {
    setError(false);
    setErrorMessage('');
  }

  function handleHadir() {
    if (absent == null) return presentMutate(true);
    presentMutateUpdate(true);
  }

  function handleTidakHadir() {
    if (error) {
      reasonInputRef.current?.focus();
      errorToastRef.current?.show('isi formnya dulu');
      return;
    }
    if (absent == null) return presentMutate(false);
    presentMutateUpdate(false);
  }

  return (
    <Container>
      <View style={styles.form}>
        <Text style={styles.title}>{route.params.program.name}</Text>
        <Text style={{ textAlign: 'center' }}>
          <Text>Status: </Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: statusColor[status] || undefined,
            }}>
            {status}
          </Text>
        </Text>
        {absent?.present === false ? (
          <Text style={{ textAlign: 'center' }}>
            <Text>Alasan:</Text>
            <Text style={{ fontWeight: 'bold' }}>{absent.reason}</Text>
          </Text>
        ) : null}
        {route.params.program.individual ? null : (
          <>
            <Text
              style={[
                styles.subtitle,
                {
                  textAlign: Platform.OS === 'ios' ? 'center' : undefined,
                },
              ]}>
              Pengajar
            </Text>
            <Picker
              style={{
                marginBottom: 12,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,.1)',
                borderRadius: 12,
              }}
              selectedValue={form.pengajarId}
              onValueChange={value =>
                setForm(prevForm => ({ ...prevForm, pengajarId: value }))
              }>
              {pengajar.map(item => (
                <Picker.Item key={item.id} label={item.name} value={item.id} />
              ))}
            </Picker>
          </>
        )}
        <Text style={[styles.subtitle, { textAlign: 'center' }]}>
          {new Intl.DateTimeFormat('id-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format()}
        </Text>
        {/* {Platform.OS === 'android' ? (
          <RNButton
            title={dateFormatter(date)}
            onPress={() => setShowDatePicker(true)}
          />
        ) : null}
        {Platform.OS === 'ios' || showDatePicker ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            is24Hour
            display="default"
            onChange={onDateChange}
          />
        ) : null} */}
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
          onPress={handleHadir}
          row
          backgroundColor="green"
          // disabled={date === undefined}
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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                <Text style={{ color: 'red', alignSelf: 'flex-start' }}>
                  {errorMessage}
                </Text>
                <TextInput
                  style={{ width: '100%' }}
                  placeholder="Alasan tidak hadir"
                  onChangeText={text =>
                    setForm(prevForm => ({ ...prevForm, reason: text }))
                  }
                  error={error}
                  ref={reasonInputRef}
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
                    onPress={handleTidakHadir}
                    row
                    backgroundColor="#007aff"
                    style={{ marginLeft: 8 }}>
                    Submit
                  </Button>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <Toast
              ref={errorToastRef}
              opacity={0.6}
              style={{ backgroundColor: 'red' }}
            />
          </KeyboardAvoidingView>
          <Loading isLoading={isPresentLoading || isPresentUpdateLoading} />
        </Container>
      </Modal>
      <Loading isLoading={isPresentLoading || isPresentUpdateLoading} />
    </Container>
  );
}

// function dateFormatter(date: Date) {
//   return new Intl.DateTimeFormat(undefined, {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   }).format(date);
// }

export default Absence;
