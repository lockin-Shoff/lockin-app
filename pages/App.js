import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="application-name" content="Lock In" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lock In" />
        <meta name="description" content="Track workouts, match with fitness partners, and lock in on your goals." />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
        <meta property="og:title" content="Lock In - Find Your Fitness Match" />
        <meta property="og:description" content="Track workouts, scan food barcodes, match with people who share your fitness goal." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lock In - Find Your Fitness Match" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" href="/favicon.ico" />
        <title>Lock In</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
