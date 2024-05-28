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
    query: `query GetAccounts {account {id, name, email}}`,
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
      if (json.errors) {
        if (json.errors[0].extensions.code === 'UNAUTHORIZED') {
          localStorage.removeItem('admin');
        }
      }
      setAccounts(json.data.account);
    })
    .catch(err => {
      console.error(err);
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

  // const handleDeleteUser = (userId: number) => {
  //   console.log(`Deleting user with ID: ${userId}`);
  // };

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
                {/* <TableCell>Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map(account => (
                <TableRow key={account.id}>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    {/* <Button
                      variant="outlined"
                      color="error"
                      data-testid={`delete-account-${account.id}`}
                      onClick={() => handleDeleteUser(account.id)}
                    >
                      Delete
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
