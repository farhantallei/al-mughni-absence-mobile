import { StyleSheet, ViewStyle } from 'react-native';

export interface ButtonStyleProps {
  row?: boolean;
  height?: ViewStyle['height'];
  marginBottom?: ViewStyle['marginBottom'];
  backgroundColor?: ViewStyle['backgroundColor'];
}

export default StyleSheet.create(
  (
    props: ButtonStyleProps,
  ): StyleSheet.NamedStyles<{
    container: {};
    button: {};
    height: {};
    heightPress: {};
    inner: {};
    label: {};
  }> => ({
    container: {
      flex: props.row ? 1 : 0,
      width: props.row ? '100%' : undefined,
      marginTop: 0,
      marginBottom: props.marginBottom,
    },
    button: {
      backgroundColor: props.backgroundColor || '#007aff',
      width: '100%',
      height: props.height || 45,
      borderRadius: 12,
      justifyContent: 'center',
      marginTop: 6,
    },
    height: {
      backgroundColor: 'rgba(0, 0, 0, .1)',
      borderRadius: 12,
      marginTop: -6,
      paddingBottom: 6,
    },
    heightPress: {
      marginTop: 0,
      paddingBottom: 0,
    },
    inner: {
      height: '100%',
      backgroundColor: props.backgroundColor || '#007aff',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
    },
    label: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 18,
      textTransform: 'uppercase',
    },
  }),
);
