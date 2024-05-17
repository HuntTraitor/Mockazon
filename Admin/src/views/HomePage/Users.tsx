import React, { useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from '@mui/material';

import getConfig from 'next/config';

const { basePath } = getConfig().publicRuntimeConfig;

interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  role?: string;
  suspended?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const fetchAccounts = async (setAccounts: Function) => {
  const query = {
    query: `query GetAccounts {account {id, name, email, username}}`,
  };

  fetch(`${basePath}/api/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  })
    .then(res => {
      return res.json();
    })
    .then(json => {
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

  React.useEffect(() => {
    fetchAccounts(setAccounts);
  }, []);

  const handleDeleteUser = (userId: number) => {
    console.log(`Deleting user with ID: ${userId}`);
  };

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
                <TableCell>Username</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map(account => (
                <TableRow key={account.id}>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      data-testid={`delete-account-${account.id}`}
                      onClick={() => handleDeleteUser(account.id)}
                    >
                      Delete
                    </Button>
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
