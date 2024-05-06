import { LoggedInUserProvider } from '@/contexts/LoggedInUserContext';
import Content from '@/views/Content';
import Login from '@/views/Login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Signup from '@/views/Signup';
import Switcher from '@/views/Switcher';

export const App = () => {
  // ok to hardcode as it's publicly accessible
  const OAUTH_CLIENT_ID =
    '655989276717-5viil57sbom25s2804kadpdt3kiaa4on.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
      <LoggedInUserProvider>
        <Switcher />
        <Content />
        <Login />
        <Signup />
      </LoggedInUserProvider>
    </GoogleOAuthProvider>
  );
};
