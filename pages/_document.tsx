import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html lang="en">
      <Head>
      
      </Head>
      <body>
        <Main />
        <NextScript />
        <link rel="stylesheet" href="https://unpkg.com/@leapwallet/elements@1.4.0-beta.3/dist/umd/style.css" />
        <script defer src="https://unpkg.com/@leapwallet/elements@1.4.0-beta.3/dist/umd/main-v1.4.0-beta.3.js" />
      </body>
    </Html>
  )
}