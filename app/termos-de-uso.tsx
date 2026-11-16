import { LegalPage } from '@/components/LegalPage';
import { TERMS_OF_USE } from '@/data/legal';

/** Página pública (sem login): link exigido pelas lojas. */
export default function TermsScreen() {
  return <LegalPage doc={TERMS_OF_USE} />;
}
