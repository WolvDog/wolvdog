import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

/**
 * A galeria devolve a foto numa pasta de cache, que o Android pode limpar a qualquer momento.
 * Copiamos para a pasta de documentos do app para a foto do pet não sumir.
 */
export function persistPetPhoto(uri: string): string {
  if (Platform.OS === 'web' || !uri.startsWith('file://')) return uri;
  try {
    const dir = new Directory(Paths.document, 'pet-photos');
    if (!dir.exists) dir.create({ intermediates: true });
    const ext = uri.split('?')[0]!.split('.').pop()?.toLowerCase() || 'jpg';
    const dest = new File(dir, `pet-${Date.now()}.${ext}`);
    new File(uri).copy(dest);
    return dest.uri;
  } catch (e) {
    console.warn('[photos] não foi possível salvar a foto', e);
    return uri;
  }
}
