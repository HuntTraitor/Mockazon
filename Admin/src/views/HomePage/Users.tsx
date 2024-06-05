import React, { useState, useContext } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import getConfig from 'next/config';
import { LoginContext } from '@/contexts/Login';
import { RefetchContext } from '@/contexts/Refetch';
// import Button from '@mui/material/Button';

const { basePath } = getConfig().publicRuntimeConfig;

interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
  suspended?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const fetchAccounts = async (setAccounts: Function, accessToken: string) => {
  const query = {
    query: `query GetAccounts {account {id, name, email role suspended}}`,
  };

  fetch(`${basePath}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(query),
  })
    .then(res => {
      return res.json();
    })
    .then(json => {
      // console.log(json);
      // If an admin is already logged in then they are not unauthorized

      // if (json.errors) {
      //   if (json.errors[0].extensions.code === 'UNAUTHORIZED') {
      //     localStorage.removeItem('admin');
      //   }
      // }
      setAccounts(json.data.account);
    })
    .catch(() => {
      //console.error(err);
    });
};

/**
 * Defines the Users component
 * @return {JSX.Element} Users
 */
export function Users() {
  const [accounts, setAccounts] = useState<User[]>([]);
  const { accessToken } = useContext(LoginContext);
  const { refetch, setRefetch } = useContext(RefetchContext);

  React.useEffect(() => {
    fetchAccounts(setAccounts, accessToken);
    setRefetch(false);
    // eslint-disable-next-line
  }, [accessToken, refetch]);

  // const handleSuspendUser = (userId: number) => {
  //   const query = {
  //     query: `mutation suspendAccount{suspendAccount(id: "${userId}") {
  //       id name role suspended
  //     }}`
  //   }

  //   fetch(`${basePath}/api/graphql`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${accessToken}`
  //     },
  //     body: JSON.stringify(query),
  //   })
  //   .then(res => {
  //     return res.json()
  //   })
  //   .then(() => {
  //     setRefetch(true)
  //   })
  //   .catch(e => {
  //     console.error(e)
  //   })
  // };

  // const handleResumeUser = (userId: number) => {
  //   const query = {
  //     query: `mutation resumeAccount{resumeAccount(id: "${userId}") {
  //       id name role suspended
  //     }}`
  //   }

  //   fetch(`${basePath}/api/graphql`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${accessToken}`
  //     },
  //     body: JSON.stringify(query),
  //   })
  //   .then(res => {
  //     return res.json()
  //   })
  //   .then(() => {
  //     setRefetch(true)
  //   })
  //   .catch(e => {
  //     console.error(e)
  //   })
  // }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Users
      </Typography>
      <Paper
        sx={{
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px',
          elevation: 0,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                {/* <TableCell>Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map(account => (
                <TableRow key={account.id}>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.role}</TableCell>
                  {/* <TableCell>
                    {account.suspended ? (
                      <Button
                      variant="outlined"
                      data-testid={`delete-account-${account.id}`}
                      onClick={() => handleResumeUser(account.id)}
                      >
                        Resume
                      </Button>
                    ) : <Button
                      variant="outlined"
                      color="error"
                      data-testid={`delete-account-${account.id}`}
                      onClick={() => handleSuspendUser(account.id)}
                      >
                        Suspend
                      </Button>}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
