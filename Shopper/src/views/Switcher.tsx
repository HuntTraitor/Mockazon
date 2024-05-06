import Link from 'next/link';
import { useContext } from 'react';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';

const Switcher = () => {
  const { locale, setLocale } = useContext(LoggedInContext);
  // const { t } = useTranslation('common');

  return (
    <>
      <Link
        aria-label={'translate'}
        href="/"
        locale={locale === 'en' ? 'es' : 'en'}
      >
        <button onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}>
          {locale === 'en' ? 'Cambiar a Español' : 'Change to English'}
        </button>
      </Link>
    </>
  );
};

export default Switcher;
