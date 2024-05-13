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
} from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
import React from 'react';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoneIcon from '@mui/icons-material/Done';
interface Key {
  key: string;
  requested: boolean;
  vendor_id: string;
  active: boolean;
}

const fetchKeys = (setKeys: (products: Key[]) => void) => {
  const query = {
    query: `query key {key (vendor_id: "4f061f79-e0e8-48ff-a2ac-0a56a8ad5f0e") {key, requested, active}}`,
  };
  console.log('Hello');
  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      // Need authorization header
      'Content-Type': 'application/json',
    },
  })
    .then(res => {
      return res.json();
    })
    .then(json => {
      console.log(json);
      if (json.errors) {
        setKeys([]);
      } else {
        console.log(json.data.key);
        setKeys(json.data.key);
      }
    })
    .catch(e => {
      console.log(e.error);
      alert('Error retrieving API Keys');
    });
};

// const setActiveStatus = (key_id: string) => {
//   const query = {
//     query: `mutation key {key (key: ${key_id}) {key, requested, active}}`,
//   };
//   console.log('Hello');
//   fetch('/api/graphql', {
//     method: 'POST',
//     body: JSON.stringify(query),
//     headers: {
//       // Need authorization header
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(res => {
//       return res.json();
//     })
//     .then(json => {
//       console.log(json);
//       if (json.errors) {
//         setKeys([]);
//       } else {
//         console.log(json.data.key);
//         setKeys(json.data.key);
//       }
//     })
//     .catch(e => {
//       console.log(e.error);
//       alert('Error retrieving API Keys');
//     });
// };

const APIKeys = () => {
  const [keys, setKeys] = React.useState<Key[]>([]);
  React.useEffect(() => {
    fetchKeys(setKeys);
  }, []);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: '3' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        API Keys
      </Typography>
      <Paper
        sx={{
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px',
          elevation: 0,
          height: '100vh',
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
              {keys.map(key => (
                <TableRow key={key.key}>
                  <TableCell>{key.key}</TableCell>
                  {key.requested ? (
                    <TableCell>
                      <Typography>Pending Approval</Typography>
                      <PendingActionsIcon />
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Typography>Approved</Typography>
                      <DoneIcon />
                    </TableCell>
                  )}
                  {key.active ? (
                    <TableCell>
                      <Button variant="outlined" color="error">
                        Deactivate
                      </Button>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Button
                        disabled={key.requested ? true : false}
                        variant="outlined"
                        color="success"
                      >
                        Activate
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableHead>
            <TableBody></TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained">Hi</Button>
      </Paper>
    </Box>
  );
};

export default APIKeys;
