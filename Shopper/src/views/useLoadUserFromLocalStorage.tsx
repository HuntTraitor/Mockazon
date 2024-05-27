import { Dispatch, SetStateAction, useEffect } from 'react';

interface User {
  accessToken: string;
  id: string;
  name: string;
  role: string;
}

const useLoadLocalStorageUser = (
  setUser: Dispatch<SetStateAction<User>>,
  setAccessToken: Dispatch<SetStateAction<string>>
) => {
  useEffect(() => {
    const item = localStorage.getItem('user');
    if (item && item !== '{}') {
      const userData = JSON.parse(item);
      setUser(userData);
      setAccessToken(userData.accessToken);
    }
  }, [setAccessToken, setUser]);
};

export default useLoadLocalStorageUser;
