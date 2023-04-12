'use client';

import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

function Card({ name, origin, version, changelog, url }: any) {
  return (
    <div className={styles.card}>

      <div className={styles.description}>
        <h2>{origin}</h2>
        <span>Release: {version}</span>
        {/* <a href={url}>{url}</a> */}
      </div>
      <div className={styles.code}>
        <br />
        {
          changelog.split('\n').map((e: string) => (<p>{e}</p>))
        }
      </div>
    </div>
  )

}

export default function Home() {

  const [data, setData] = useState([]);

  async function fetchData() {
    const res = await fetch("../api/changelogs");
    const newData = await res.json();
    console.log(newData);

    setData(newData);
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className={styles.main}>

      {data.length > 0 ?
        data.map((e: any, i) => <Card key={i} {...e} />)
        :
        <p>Loading...</p>
      }
    </main>
  )
}
