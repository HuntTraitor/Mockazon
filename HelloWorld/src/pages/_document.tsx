import { Head, Html, Main, NextScript } from 'next/document';

/**
 * Renders the document.
 * @return {JSX.Element} The rendered document.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
