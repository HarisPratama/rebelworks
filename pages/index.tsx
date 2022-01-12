import Styles from './Landing.module.scss'
import { useEffect, useMemo, useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Logo from '../src/assets/images/Logo.png'

export default function Home() {

  return (
    <div>
      <Head>
        <title>Movie App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={Styles.hero}>
        <div className="px-4">
          <Image
            src={Logo}
            width={43.24}
            height={44}
          />
        </div>
      </div>
    </div>
  )
}
