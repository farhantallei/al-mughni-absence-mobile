import { Loading, ProgramList } from '@app/components';
import { Button, Container, TextInput } from '@app/components/ui';
import { useGlobalState } from '@app/hooks';
import { getAbsent } from '@app/services/absent';
import { getPengajar, registerPelajar } from '@app/services/pengajar';
import { addSchedule, updateSchedule } from '@app/services/schedule';
import { RootStackScreenProps } from '@app/types';
import { PelajarResponse, ProgramResponse } from '@app/types/rest';
import { formatDate } from '@app/utils';
import { Picker } from '@react-native-picker/picker';
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
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
import styles from './Home.styles';

function Home({ navigation }: RootStackScreenProps<'Home'>) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const udzurInputRef = useRef<TextInputRN>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showReasonInputModal, setShowReasonInputModal] = useState(false);
  const [pengajarId, setPengajarId] = useState(1);
  const [programId, setProgramId] = useState(1);
  const toastRef = useRef<Toast>(null);
  const errorToastRef = useRef<Toast>(null);
  const [userId] = useGlobalState<number>(['userId']);
  const [name] = useGlobalState<string | null>(['name']);
  const [programs] = useGlobalState<ProgramResponse[]>(['program']);
  const [pengajarList] = useGlobalState<PelajarResponse[]>([
    'pengajar',
    { id: programId },
  ]);
  const userDisplay = useMemo((): string => {
    if (name != null) return name;
    return 'guest';
  }, [name]);
  const queryClient = useQueryClient();
  const isFetching = useIsFetching(['pengajar']) + useIsFetching(['absent']);

  const [scheduleForm, setScheduleForm] = useState({
    id: 0,
    name: '',
    available: false,
    reason: '',
  });

  useEffect(() => {
    if (scheduleForm.reason != '') {
      setError(false);
      setErrorMessage('');
      return;
    }
    setError(true);
    setErrorMessage('isi udzur');
  }, [scheduleForm.reason]);

  function resetError() {
    setError(false);
    setErrorMessage('');
  }

  async function prefetchAbsence({
    programId,
    programName,
    individual,
    status,
    reason,
    pengajarId,
    pengajarName,
  }: {
    programId: number;
    programName: string;
    individual: boolean;
    status: string;
    reason: string | null;
    pengajarId: number | null;
    pengajarName?: string;
  }) {
    try {
      // await queryClient.prefetchQuery({
      //   queryKey: ['pengajar', { program: programName }],
      //   queryFn: () => getPengajar(programName),
      //   retry: 1,
      // });

      // if (individual) {
      //   await queryClient.prefetchQuery({
      //     queryKey: [''],
      //   });
      // }

      await queryClient.prefetchQuery({
        queryKey: [
          'absent',
          { program: programName, date: formatDate(new Date()) },
        ],
        queryFn: () =>
          getAbsent({
            pelajarId: userId,
            programId: programId,
            date: formatDate(new Date()),
          }),
        retry: 1,
      });
      navigation.push('Absence', {
        program: {
          id: programId,
          pengajarId,
          pengajarName,
          name: programName,
          individual,
          status,
          reason,
        },
      });
    } catch (err) {
      if (err instanceof Error) errorToastRef.current?.show(err.message);
      else if (err instanceof String) errorToastRef.current?.show(err);
      else errorToastRef.current?.show('ada kesalahan teknis');
    }
  }

  async function handleModal(programId: number) {
    setProgramId(programId);
    try {
      await queryClient.prefetchQuery({
        queryKey: ['pengajar', { id: programId }],
        queryFn: () => getPengajar(programId),
        retry: 1,
      });

      setShowRegisterModal(true);
    } catch (err) {
      if (err instanceof Error) errorToastRef.current?.show(err.message);
      else if (err instanceof String) errorToastRef.current?.show(err);
      else errorToastRef.current?.show('ada kesalahan teknis');
    }
  }

  const { mutate: startScheduleMutate, isLoading: isStartScheduleLoading } =
    useMutation(
      (_var: { id: number; name: string }) =>
        addSchedule({
          pengajarId: userId,
          programId,
          date: formatDate(new Date()),
          available: true,
        }),
      {
        onMutate: async ({ id, name }) => {
          await queryClient.cancelQueries({ queryKey: ['program'] });

          const prevPrograms = queryClient.getQueryData<ProgramResponse[]>([
            'program',
          ]);

          if (prevPrograms) {
            const programs: ProgramResponse[] = [
              ...prevPrograms.filter(program => program.id !== programId),
              {
                id,
                name,
                individual: false,
                pengajar: true,
                presentStatus: 'alpha',
                programStatus: 'available',
                pengajarId: userId,
                reason: null,
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
        },
        onError(error) {
          if (error instanceof Error)
            errorToastRef.current?.show(error.message);
          else if (error instanceof String) errorToastRef.current?.show(error);
          else errorToastRef.current?.show('ada kesalahan teknis');
        },
      },
    );

  const { mutate: updateScheduleMutate, isLoading: isUpdateScheduleLoading } =
    useMutation(
      ({
        available,
        reason,
      }: {
        id: number;
        name: string;
        available: boolean;
        reason?: string;
      }) =>
        updateSchedule({
          pengajarId: userId,
          programId,
          date: formatDate(new Date()),
          available,
          reason,
        }),
      {
        onMutate: async ({ id, name, available, reason }) => {
          resetError();
          await queryClient.cancelQueries({ queryKey: ['program'] });

          const prevPrograms = queryClient.getQueryData<ProgramResponse[]>([
            'program',
          ]);

          if (prevPrograms) {
            const programs: ProgramResponse[] = [
              ...prevPrograms.filter(program => program.id !== programId),
              {
                id,
                name,
                individual: false,
                pengajar: true,
                presentStatus: 'alpha',
                programStatus: available ? 'available' : 'alibi',
                pengajarId: userId,
                reason: reason || null,
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
        },
        onError(error) {
          if (error instanceof Error)
            errorToastRef.current?.show(error.message);
          else if (error instanceof String) errorToastRef.current?.show(error);
          else errorToastRef.current?.show('ada kesalahan teknis');
        },
        onSuccess(_data, { available }) {
          if (!available) setShowReasonInputModal(false);
        },
      },
    );

  const { mutate: registerMutate, isLoading: isRegisterLoading } = useMutation(
    () => registerPelajar({ pelajarId: userId, pengajarId, programId }),
    {
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ['program'] });
      },
      onError(error) {
        if (error instanceof Error) errorToastRef.current?.show(error.message);
        else if (error instanceof String) errorToastRef.current?.show(error);
        else errorToastRef.current?.show('ada kesalahan teknis');
      },
      onSuccess({ programStatus, reason }) {
        const prevPrograms = queryClient.getQueryData<ProgramResponse[]>([
          'program',
        ]);

        if (prevPrograms) {
          const { ...rest } = prevPrograms.filter(
            program => program.id === programId,
          )[0];

          const programs: ProgramResponse[] = [
            ...prevPrograms.filter(program => program.id !== programId),
            {
              ...rest,
              pengajarId,
              programStatus,
              reason,
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
        setShowRegisterModal(false);
      },
    },
  );

  return (
    <Container>
      <View style={styles.top}>
        <Text style={styles.greet}>Hi, {userDisplay}</Text>
        <Text
          style={{
            marginVertical: 12,
            fontSize: 20,
            fontWeight: '600',
          }}>
          {new Intl.DateTimeFormat('id-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format()}
        </Text>
      </View>
      <View style={styles.bottom}>
        <ProgramList>
          {programs
            ? programs.map(
                ({
                  id,
                  pengajarId,
                  name,
                  individual,
                  pengajar,
                  presentStatus,
                  programStatus,
                  reason,
                }) => (
                  <ProgramList.Item
                    key={id}
                    toastRef={toastRef}
                    pengajarName={
                      pengajarList?.filter(
                        pengajar => pengajar.id === pengajarId,
                      )[0]?.name || ''
                    }
                    pengajarId={pengajarId}
                    program={name}
                    individual={individual}
                    pengajar={pengajar}
                    presentStatus={presentStatus}
                    programStatus={programStatus}
                    reason={reason}
                    onAbsen={() =>
                      prefetchAbsence({
                        programId: id,
                        programName: name,
                        individual,
                        pengajarId,
                        pengajarName: pengajarList?.filter(
                          pengajar => pengajar.id === pengajarId,
                        )[0]?.name,
                        status: presentStatus,
                        reason,
                      })
                    }
                    onRegister={() => handleModal(id)}
                    onStart={() => startScheduleMutate({ id, name })}
                    onChange={() => {
                      if (programStatus === 'available') {
                        setScheduleForm(prevForm => ({
                          ...prevForm,
                          id,
                          name,
                        }));
                        return setShowReasonInputModal(true);
                      }
                      updateScheduleMutate({
                        id,
                        name,
                        available: true,
                      });
                    }}
                  />
                ),
              )
            : null}
        </ProgramList>
      </View>
      <Loading
        isLoading={
          isFetching > 0 || isStartScheduleLoading || isUpdateScheduleLoading
        }
      />
      <Toast ref={toastRef} />
      <Toast
        ref={errorToastRef}
        opacity={0.6}
        style={{ backgroundColor: 'red' }}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={showRegisterModal}
        onRequestClose={() => setShowRegisterModal(false)}
        style={{ elevation: 20 }}>
        <Container>
          <Text
            style={{
              marginVertical: 12,
              fontSize: 20,
              fontWeight: '600',
              textAlign: Platform.OS === 'ios' ? 'center' : undefined,
            }}>
            Pengajar
          </Text>
          <Picker
            style={{
              marginBottom: 12,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,.1)',
              borderRadius: 12,
            }}
            selectedValue={pengajarId}
            onValueChange={id => setPengajarId(id)}>
            {pengajarList &&
              pengajarList.map(item => (
                <Picker.Item key={item.id} label={item.name} value={item.id} />
              ))}
          </Picker>
          <View style={{ flexDirection: 'row' }}>
            <Button
              onPress={() => setShowRegisterModal(false)}
              row
              backgroundColor="#bbb"
              style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              onPress={registerMutate}
              row
              backgroundColor="#007aff"
              style={{ marginLeft: 8 }}>
              Submit
            </Button>
          </View>
          <Loading isLoading={isRegisterLoading} />
        </Container>
      </Modal>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showReasonInputModal}
        onRequestClose={() => setShowReasonInputModal(false)}
        style={{ elevation: 20 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ padding: 24, flex: 1, justifyContent: 'center' }}>
              <Text style={{ color: error ? 'red' : undefined }}>
                {error ? errorMessage : 'Udzur'}
              </Text>
              <TextInput
                placeholder="Udzur"
                onChangeText={text =>
                  setScheduleForm(prevForm => ({ ...prevForm, reason: text }))
                }
                error={error}
                autoCapitalize="none"
                ref={udzurInputRef}
              />
              <View style={{ flexDirection: 'row' }}>
                <Button
                  onPress={() => setShowReasonInputModal(false)}
                  row
                  backgroundColor="#bbb"
                  style={{ marginRight: 8 }}>
                  Cancel
                </Button>
                <Button
                  onPress={() => updateScheduleMutate(scheduleForm)}
                  row
                  backgroundColor="#007aff"
                  style={{ marginLeft: 8 }}>
                  Submit
                </Button>
              </View>
              <Loading isLoading={isUpdateScheduleLoading} />
              <Toast ref={toastRef} opacity={0.6} />
              <Toast
                ref={errorToastRef}
                opacity={0.6}
                style={{ backgroundColor: 'red' }}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </Container>
  );
}

export default Home;
