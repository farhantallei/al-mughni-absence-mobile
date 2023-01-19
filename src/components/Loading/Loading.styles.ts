import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
