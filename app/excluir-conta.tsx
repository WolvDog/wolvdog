import { LegalPage } from '@/components/LegalPage';
import { DELETE_ACCOUNT } from '@/data/legal';

/** Página pública (sem login): link exigido pelas lojas. */
export default function DeleteAccountInfoScreen() {
  return <LegalPage doc={DELETE_ACCOUNT} />;
}
