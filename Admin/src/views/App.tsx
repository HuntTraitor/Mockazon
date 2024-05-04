import { LoginProvider } from '@/contexts/Login';
import { Home } from './HomePage/Home';
import Login from './Login';

export const App = () => {
  return (
    <>
      <LoginProvider>
        <Login />
        <Home />
      </LoginProvider>
    </>
  );
};
