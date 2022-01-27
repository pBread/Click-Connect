import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Click Connect</title>
      </Head>
      <div className="app">
        <div className="app-header">
          <img
            alt=""
            style={{ height: 47, width: 47 * (1005 / 305) }}
            src="https://i.imgur.com/WH6bRfg.png"
          />
        </div>
        <div className="app-main">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}
