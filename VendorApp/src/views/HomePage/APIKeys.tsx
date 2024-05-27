import {
  Typography,
  Box,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TableHead,
  TableFooter,
} from '@mui/material';
import React from 'react';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoneIcon from '@mui/icons-material/Done';
import { Key, KeyContext } from '@/contexts/KeyContext';
import getConfig from 'next/config';
import { LoginContext } from '@/contexts/LoginContext';

const { basePath } = getConfig().publicRuntimeConfig;

const fetchKeys = (setKeys: (keys: Key[]) => void, accessToken: string) => {
  const query = {
    query: `query key {keys {key, vendor_id, active, blacklisted}}`,
  };
  fetch(`${basePath}/api/graphql`, {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then(res => {
      return res.json();
    })
    .then(json => {
      if (json.errors) {
        if (json.errors[0].extensions.code == 'UNAUTHORIZED') {
          localStorage.removeItem('accessToken');
        }
        setKeys([]);
      } else {
        setKeys(json.data.keys);
      }
    });
};

const setActiveStatus = (
  keys: Key[],
  setKeys: (keys: Key[]) => void,
  key_id: string,
  accessToken: string
) => {
  const query = {
    query: `mutation key {setActiveStatus (apiKey: "${key_id}") {key, vendor_id, blacklisted, active}}`,
  };
  fetch(`${basePath}/api/graphql`, {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      // Need authorization header
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then(res => {
      return res.json();
    })
    .then(json => {
      if (json.errors) {
        console.log(json.errors);
      } else {
        const indexFound = keys.findIndex(
          obj => obj.key === json.data.setActiveStatus.key
        );
        if (indexFound != -1) {
          const temp = keys.slice();
          temp.splice(indexFound, 1, json.data.setActiveStatus);
          setKeys(temp);
        }
        return;
      }
    })
    .catch(err => {
      console.error(err);
    });
};

const APIKeys = () => {
  const loginContext = React.useContext(LoginContext);
  const keyContext = React.useContext(KeyContext);
  React.useEffect(() => {
    fetchKeys(keyContext.setKeys, loginContext.accessToken);
  }, [keyContext.setKeys, loginContext.accessToken]);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 3,
        height: '90vh',
        overflowY: 'scroll',
      }}
    >
      <Paper
        sx={{
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px',
          elevation: 0,
          marginTop: 4,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>API Key ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keyContext.keys.map(key => (
                <TableRow key={key.key}>
                  <TableCell>{key.key}</TableCell>
                  {key.blacklisted ? (
                    <TableCell>
                      <Typography>Invalid Key</Typography>
                      <PendingActionsIcon />
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Typography>Valid Key</Typography>
                      <DoneIcon />
                    </TableCell>
                  )}
                  {key.active ? (
                    <TableCell>
                      <Button
                        disabled={key.blacklisted ? true : false}
                        onClick={event => {
                          event.preventDefault();
                          setActiveStatus(
                            keyContext.keys,
                            keyContext.setKeys,
                            key.key,
                            loginContext.accessToken
                          );
                        }}
                        variant="outlined"
                        color="error"
                      >
                        Deactivate
                      </Button>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Button
                        disabled={key.blacklisted ? true : false}
                        aria-label="active-button"
                        variant="outlined"
                        color="success"
                        onClick={event => {
                          event.preventDefault();
                          setActiveStatus(
                            keyContext.keys,
                            keyContext.setKeys,
                            key.key,
                            loginContext.accessToken
                          );
                        }}
                      >
                        Activate
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableCell>Key Count: {keyContext.keys.length}</TableCell>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default APIKeys;
