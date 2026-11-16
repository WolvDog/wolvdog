import { LegalPage } from '@/components/LegalPage';
import { PRIVACY_POLICY } from '@/data/legal';

/** Página pública (sem login): link exigido pelas lojas. */
export default function PrivacyScreen() {
  return <LegalPage doc={PRIVACY_POLICY} />;
}
