import React from 'react';
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

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

/**
 * Defines the Users component
 * @return {JSX.Element} Users
 */
export function Users() {
  const users: User[] = [
    {
      id: 1,
      name: 'Evan Metcalf',
      email: 'evmetcal@ucsc.edu',
      username: 'evmetcal',
    },
    {
      id: 2,
      name: 'Lukas Teixeira Döpcke',
      email: 'lteixeir@ucsc.edu',
      username: 'lteixeir',
    },
    {
      id: 3,
      name: 'Trevor Ryles',
      email: 'tryles@ucsc.edu',
      username: 'tryles',
    },
    {
      id: 4,
      name: 'Hunter Risatratar',
      email: 'htratar@ucsc.edu',
      username: 'htratar',
    },
    {
      id: 5,
      name: 'Alfonso Del Rosario',
      email: 'addelros@ucsc.edu',
      username: 'addelros',
    },
    {
      id: 6,
      name: 'Eesha Krishnamagaru',
      email: 'elkrishn@ucsc.edu',
      username: 'elkrishn',
    },
  ];

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
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
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
