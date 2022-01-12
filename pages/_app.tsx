import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  )
}
export default MyApp
