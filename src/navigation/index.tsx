import { useGlobalState } from '@app/hooks';
import { Register, Home, Absence } from '@app/screens';
import { RootStackParamList } from '@app/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

function Navigation() {
  const [user, setUser] = useGlobalState<string | null>(['user']);

  async function logout() {
    await AsyncStorage.removeItem('user');
    setUser(null);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user == null ? (
          <Stack.Screen name="Register" component={Register} />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerRight(props) {
                  return <Button title="logout" onPress={logout} />;
                },
              }}
            />
            <Stack.Screen name="Absence" component={Absence} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
