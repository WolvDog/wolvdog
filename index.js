// Ponto de entrada: instala o "pega-erro" ANTES de carregar o app.
// Em APK de release, um erro de JavaScript na abertura fecha o app sem explicação.
// Aqui ele vira um aviso na tela, com a mensagem do erro, para sabermos o que corrigir.
const { Alert } = require('react-native');

const errorUtils = global.ErrorUtils;
const previousHandler = errorUtils?.getGlobalHandler?.();

errorUtils?.setGlobalHandler?.((error, isFatal) => {
  if (!isFatal) {
    previousHandler?.(error, isFatal);
    return;
  }
  const message = String(error?.message ?? error);
  const stack = String(error?.stack ?? '')
    .split('\n')
    .slice(0, 8)
    .join('\n');
  try {
    Alert.alert('WolvDog encontrou um erro', `${message}\n\n${stack}\n\nTire um print desta tela e envie para o suporte.`);
  } catch {
    previousHandler?.(error, isFatal);
  }
});

require('expo-router/entry');
