import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    marginVertical: 12,
    fontSize: 20,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'center',
    width: '100%',
  },
});
