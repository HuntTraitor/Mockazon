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

interface Request {
  id: number;
  name: string;
  email: string;
  username: string;
  requestType: string;
}

/**
 * Defines the AdminRequests component
 * @return {JSX.Element} AdminRequests
 */
export function AdminRequests() {
  const requests: Request[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      requestType: 'Account Upgrade',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      username: 'janesmith',
      requestType: 'Password Reset',
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michaeljohnson@example.com',
      username: 'michaelj',
      requestType: 'Account Deletion',
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emilydavis@example.com',
      username: 'emilydavis',
      requestType: 'Account Upgrade',
    },
    {
      id: 5,
      name: 'Daniel Wilson',
      email: 'danielwilson@example.com',
      username: 'danielw',
      requestType: 'Password Reset',
    },
  ];

  const handleApproveRequest = (requestId: number) => {
    console.log(`Approving request with ID: ${requestId}`);
  };

  const handleRejectRequest = (requestId: number) => {
    console.log(`Rejecting request with ID: ${requestId}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Requests
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
                <TableCell>Request Type</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map(request => (
                <TableRow key={request.id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.username}</TableCell>
                  <TableCell>{request.requestType}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      data-testid={`approve-request-${request.id}`}
                      onClick={() => handleApproveRequest(request.id)}
                      style={{ marginRight: '8px' }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      data-testid={`reject-request-${request.id}`}
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      Reject
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