import { LoginProvider } from '@/contexts/Login';
import { PageProvider } from '@/contexts/PageContext';
import { Home } from './HomePage/Home';
import Login from './Login';

export const App = () => {
  return (
    <>
      <LoginProvider>
        <Login />
        <PageProvider>
          <Home />
        </PageProvider>
      </LoginProvider>
    </>
  );
};
