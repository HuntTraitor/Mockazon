import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import APIKeys from '@/views/HomePage/APIKeys';
import { LoginContext } from '@/contexts/LoginContext';
import { Key, KeyContext } from '@/contexts/KeyContext';
import '@testing-library/jest-dom';
let returnError = false;

const handlers = [
  graphql.query('key', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [
          { message: 'Some Error', extensions: { code: 'UNAUTHORIZED' } },
        ],
      });
    }
    return HttpResponse.json({
      data: {
        keys: [
          {
            key: 'some key',
            vendor_id: 'some id',
            active: true,
            blacklisted: false,
          },
          {
            key: 'some key2',
            vendor_id: 'some id',
            active: false,
            blacklisted: false,
          },
        ],
      },
    });
  }),
  graphql.mutation('key', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      });
    }
    return HttpResponse.json({
      data: {
        setActiveStatus: {
          key: 'some key',
          vendor_id: 'some id',
          active: false,
          blacklisted: false,
        },
      },
    });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Renders', async () => {
  render(<APIKeys />);
  await screen.findByText('API Key ID', {
    exact: false,
  });
  await screen.findByText('Status');
  await screen.findByText('Actions');
});

it('Renders keys', async () => {
  const id: string = 'some id';
  const accessToken: string = 'some token';
  const setAccessToken = jest.fn();
  const setId = () => {};

  let keys: Key[] = [
    {
      key: 'some key',
      vendor_id: 'some id',
      active: true,
      blacklisted: false,
    },
    {
      key: 'some key 2',
      vendor_id: 'some id',
      active: false,
      blacklisted: false,
    },
  ];
  const setKeys = (newKeys: Key[]) => {
    keys = newKeys;
  };
  returnError = false;
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <KeyContext.Provider value={{ keys, setKeys }}>
        <APIKeys />
      </KeyContext.Provider>
    </LoginContext.Provider>
  );
  await waitFor(() => {
    expect(keys.length).toEqual(2);
    console.log(keys);
    // Understand why buttons are not displaying
    expect(screen.queryAllByText('Activate').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Deactivate').length).toBeGreaterThan(0);
  });
});

it('Does not render keys', async () => {
  const id: string = 'some id';
  const accessToken: string = 'some token';
  const setAccessToken = () => {};
  const setId = () => {};

  let keys: Key[] = [];
  const setKeys = (newKeys: Key[]) => {
    keys = newKeys;
  };
  returnError = true;
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <KeyContext.Provider value={{ keys, setKeys }}>
        <APIKeys />
      </KeyContext.Provider>
    </LoginContext.Provider>
  );
  await waitFor(() => {
    expect(keys.length).toEqual(0);
  });
});

it('Set key status', async () => {
  returnError = false;
  const id: string = 'some id';
  const accessToken: string = 'some token';
  const setAccessToken = jest.fn();
  const setId = () => {};

  let keys: Key[] = [
    {
      key: 'some key',
      vendor_id: 'some id',
      active: true,
      blacklisted: false,
    },
    {
      key: 'some key2',
      vendor_id: 'some id',
      active: false,
      blacklisted: false,
    },
  ];
  const setKeys = (newKeys: Key[]) => {
    keys = newKeys;
  };
  returnError = false;
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <KeyContext.Provider value={{ keys, setKeys }}>
        <APIKeys />
      </KeyContext.Provider>
    </LoginContext.Provider>
  );
  await waitFor(() => {
    // Understand why buttons are not displaying
    expect(screen.queryAllByText('Activate').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Deactivate').length).toBeGreaterThan(0);
    console.log(keys);
  });
  const button = await screen.getByText('Activate');
  await fireEvent.click(button);
  waitFor(() => {
    expect(keys.length).toEqual(2);
    expect(keys[0].active).toBe(false);
  });
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <KeyContext.Provider value={{ keys, setKeys }}>
        <APIKeys />
      </KeyContext.Provider>
    </LoginContext.Provider>
  );

  await waitFor(() => {
    // Understand why buttons are not displaying
    expect(screen.queryAllByText('Deactivate').length).toBeGreaterThan(1);
    console.log(keys);
  });
});

it('Renders blacklisted keys', async () => {
  const id: string = 'some id';
  const accessToken: string = 'some token';
  const setAccessToken = jest.fn();
  const setId = () => {};

  let keys: Key[] = [
    {
      key: 'some key',
      vendor_id: 'some id',
      active: true,
      blacklisted: true,
    },
  ];
  const setKeys = jest.fn();
  returnError = false;
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <KeyContext.Provider value={{ keys, setKeys }}>
        <APIKeys />
      </KeyContext.Provider>
    </LoginContext.Provider>
  );
  await waitFor(() => {
    expect(keys.length).toEqual(1);
    expect(screen.queryAllByText('Invalid Key').length).toBeGreaterThan(0);
  });
  const button = screen.getByText('Deactivate', { selector: 'button' });
  expect(button).toBeDisabled();
});

it('Renders regular keys', async () => {
  const id: string = 'some id';
  const accessToken: string = 'some token';
  const setAccessToken = jest.fn();
  const setId = () => {};

  let keys: Key[] = [
    {
      key: 'some key',
      vendor_id: 'some id',
      active: true,
      blacklisted: false,
    },
  ];
  const setKeys = jest.fn();
  returnError = false;
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <KeyContext.Provider value={{ keys, setKeys }}>
        <APIKeys />
      </KeyContext.Provider>
    </LoginContext.Provider>
  );
  await waitFor(() => {
    expect(keys.length).toEqual(1);
    expect(screen.queryAllByText('Valid Key').length).toBeGreaterThan(0);
  });
  const button = screen.getByText('Deactivate', { selector: 'button' });
  expect(button).not.toBeDisabled();
});

it('Error setting key status', async () => {
  const id: string = 'some id';
  const accessToken: string = 'some token';
  const setAccessToken = jest.fn();
  const setId = () => {};

  let keys: Key[] = [
    {
      key: 'some key',
      vendor_id: 'some id',
      active: true,
      blacklisted: false,
    },
  ];
  const setKeys = (newKeys: Key[]) => {
    keys = newKeys;
  };
  returnError = true;
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <KeyContext.Provider value={{ keys, setKeys }}>
        <APIKeys />
      </KeyContext.Provider>
    </LoginContext.Provider>
  );

  await waitFor(() => {
    // Understand why buttons are not displaying
    expect(screen.queryAllByText('Deactivate').length).toBeGreaterThan(0);
  });
  const button = screen.getByText('Deactivate');
  await waitFor(() => {
    fireEvent.click(button);
  });
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <KeyContext.Provider value={{ keys, setKeys }}>
        <APIKeys />
      </KeyContext.Provider>
    </LoginContext.Provider>
  );
  await waitFor(() => {
    expect(screen.queryAllByText('Deactivate').length).toBeGreaterThan(0);
  });
});
