import { Fragment } from 'react';

export const App = () => {
  return (
    <Fragment>
      <h1>Mockazon Admin App</h1>
      <img
        src="/mockazon_logo_white.png"
        alt="Mockazon Logo"
        style={{
          width: '400px',
          height: 'auto',
          boxShadow: '0px 0px 10px 5px rgba(0, 0, 0, 0.1)',
          margin: '20px',
        }}
      />
      <p>Hello World this is Evan Metcalf</p>
      <p>Hello World this is Lukas Teixeira Döpcke</p>
      <p>Hello, salute. It&apos;s me... your duke - Trevor Ryles</p>
      <p>Hello World im Hunter!</p>
      <p>Hello World this is Alfonso Del Rosario... I think...</p>
      <p>Hello World, this is Eesha Krishnamagaru</p>
    </Fragment>
  );
};
