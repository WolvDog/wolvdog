import { Alert, Platform } from 'react-native';

/**
 * Diálogos multiplataforma: Alert nativo no iOS/Android e window.alert/confirm no web
 * (o Alert do react-native-web é um no-op).
 */
export function showAlert(title: string, message?: string): void {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

interface ConfirmOptions {
  confirmText: string;
  cancelText?: string;
  destructive?: boolean;
}

export function showConfirm(title: string, message: string, options: ConfirmOptions): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: options.cancelText ?? 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: options.confirmText, style: options.destructive ? 'destructive' : 'default', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
