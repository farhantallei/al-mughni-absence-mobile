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

  async function prefetchAbsence(
    programId: number,
    programName: string,
    individual: boolean,
  ) {
    try {
      await queryClient.prefetchQuery({
        queryKey: ['pengajar', { program: programName }],
        queryFn: () => getPengajar(programName),
        retry: 1,
      });

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
        program: { id: programId, name: programName, individual },
      });
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
            ? programs.map(
                ({ id, name, individual, pengajar, status, reason }) => (
                  <ProgramList.Item
                    key={id}
                    toastRef={toastRef}
                    program={name}
                    individual={individual}
                    pengajar={pengajar}
                    status={status}
                    reason={reason}
                    onPress={() => prefetchAbsence(id, name, individual)}
                  />
                ),
              )
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
