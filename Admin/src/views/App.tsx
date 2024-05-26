import { LoginProvider } from '@/contexts/Login';
import { PageProvider } from '@/contexts/PageContext';
import { Home } from './HomePage/Home';
import Login from './Login';
import { RefetchProvider } from '@/contexts/Refetch';

export const App = () => {
  return (
    <>
      <LoginProvider>
        <RefetchProvider>
          <Login />
          <PageProvider>
            <Home />
          </PageProvider>
        </RefetchProvider>
      </LoginProvider>
    </>
  );
};
