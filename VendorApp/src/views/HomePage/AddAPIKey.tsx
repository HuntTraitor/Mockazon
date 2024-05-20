import React, { useContext } from 'react';
import { Button } from '@mui/material';
import AddSharp from '@mui/icons-material/AddSharp';
import { Key, KeyContext } from '@/contexts/KeyContext';
import { LoginContext } from '@/contexts/LoginContext';
import getConfig from 'next/config';
const { basePath } = getConfig().publicRuntimeConfig;

const postAPIKeyRequest = (
  keys: Key[],
  setKeys: (keys: Key[]) => void,
  accessToken: string
) => {
  const query = {
    query: `mutation key {postAPIKeyRequest {key, vendor_id, active, blacklisted}}`,
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
        console.log(json.errors);
      } else {
        const temp = keys.slice();
        temp.push(json.data.postAPIKeyRequest);
        setKeys(temp);
      }
    })
    .catch(() => {
      alert('Error requesting API Keys');
    });
};

const AddAPIKey = () => {
  const keyContext = useContext(KeyContext);
  const loginContext = useContext(LoginContext);
  return (
    <Button
      role="button"
      aria-label="add-key"
      style={{ position: 'absolute', marginLeft: '10px', marginTop: '10px' }}
      variant="contained"
      onClick={event => {
        event.preventDefault();
        postAPIKeyRequest(
          keyContext.keys,
          keyContext.setKeys,
          loginContext.accessToken
        );
      }}
    >
      <AddSharp />
    </Button>
  );
};

export default AddAPIKey;
