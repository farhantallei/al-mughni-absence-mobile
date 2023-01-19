import { Loading, ProgramList } from '@app/components';
import { Container } from '@app/components/ui';
import { useGlobalState } from '@app/hooks';
import { getAbsent } from '@app/services/absent';
import { getPengajar } from '@app/services/pengajar';
import { RootStackScreenProps } from '@app/types';
import { ProgramResponse } from '@app/types/rest';
import { formatDate } from '@app/utils';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useRef } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import styles from './Home.styles';

function Home({ navigation }: RootStackScreenProps<'Home'>) {
  const toastRef = useRef<Toast>(null);
  const errorToastRef = useRef<Toast>(null);
  const [userId] = useGlobalState<number>(['userId']);
  const [name] = useGlobalState<string | null>(['name']);
  const [programs] = useGlobalState<ProgramResponse[]>(['program']);
  const userDisplay = useMemo((): string => {
    if (name != null) return name;
    return 'guest';
  }, [name]);
  const queryClient = useQueryClient();
  const isFetching = useIsFetching(['pengajar']) + useIsFetching(['absent']);

  async function prefetchAbsence(id: number, program: string) {
    try {
      await queryClient.prefetchQuery({
        queryKey: ['pengajar', { program }],
        queryFn: () => getPengajar(program),
        retry: 1,
      });

      await queryClient.prefetchQuery({
        queryKey: ['absent', { program, date: formatDate(new Date()) }],
        queryFn: () =>
          getAbsent({
            pelajarId: userId,
            programId: id,
            date: formatDate(new Date()),
          }),
        retry: 1,
      });
      navigation.push('Absence', { program: { id, name: program } });
    } catch (err) {
      if (err instanceof Error) errorToastRef.current?.show(err.message);
      else if (err instanceof String) errorToastRef.current?.show(err);
      else errorToastRef.current?.show('ada kesalahan teknis');
    }
  }

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
            ? programs.map(program => (
                <ProgramList.Item
                  key={program.program}
                  toastRef={toastRef}
                  program={program.program}
                  status={program.status}
                  reason={program.reason}
                  onPress={() => prefetchAbsence(program.id, program.program)}
                />
              ))
            : null}
        </ProgramList>
      </View>
      <Loading isLoading={isFetching > 0} />
      <Toast ref={toastRef} />
      <Toast
        ref={errorToastRef}
        opacity={0.6}
        style={{ backgroundColor: 'red' }}
      />
    </Container>
  );
}

export default Home;
