import React, { useContext } from 'react';
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
import { LoginContext } from '@/contexts/Login';
import { RefetchContext } from '@/contexts/Refetch';

const { basePath } = getConfig().publicRuntimeConfig;

interface Request {
  id: number;
  name: string;
  email: string;
  username: string;
  requestType: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const fetchRequests = async (setRequests: Function, accessToken: string) => {
  const query = {
    query: `query GetRequests {request {id name email role suspended}}`,
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
      if (json.errors) {
        if (json.errors[0].extensions.code === 'UNAUTHORIZED') {
          localStorage.removeItem('user');
        }
      }
      setRequests(json.data.request);
    })
    .catch(err => {
      console.error(err);
    });
};

/**
 * Defines the AdminRequests component
 * @return {JSX.Element} AdminRequests
 */
export function AdminRequests() {
  const [requests, setRequests] = React.useState<Request[]>([]);
  const { accessToken } = useContext(LoginContext);
  const { refetch, setRefetch } = useContext(RefetchContext);

  React.useEffect(() => {
    fetchRequests(setRequests, accessToken);
    setRefetch(false);

    // eslint-disable-next-line
  }, [accessToken, refetch]);

  const handleApproveRequest = (
    vendorId: number,
    accessToken: string,
    setRefetch: (refetch: boolean) => void
  ) => {
    const query = {
      query: `mutation approveVendor{approveVendor(VendorId: "${vendorId}") {
        id email name role suspended
      }}`,
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
        if (json.errors) {
          throw new Error(json.errors[0].message);
        } else {
          console.log(json);
          setRefetch(true);
        }
      })
      .catch(e => {
        alert(e.toString());
      });
  };

  const handleRejectRequest = (requestId: number) => {
    console.log(`Rejecting request with ID: ${requestId}`); // FIXME: what is this
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
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map(request => (
                <TableRow key={request.id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      data-testid={`approve-request-${request.id}`}
                      onClick={() =>
                        handleApproveRequest(
                          request.id,
                          accessToken,
                          setRefetch
                        )
                      }
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
