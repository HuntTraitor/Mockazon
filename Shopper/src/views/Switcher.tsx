import { useRouter } from 'next/router';
import Link from 'next/link';

const Switcher = () => {
  const router = useRouter();

  return (
    <div>
      <Link aria-label={'translate-english'} href={router.asPath} locale="en">
        <span className={'link'}>English</span>
      </Link>
      {' | '}
      <Link aria-label={'translate-spanish'} href={router.asPath} locale="es">
        <span>Español</span>
      </Link>
    </div>
  );
};

export default Switcher;
