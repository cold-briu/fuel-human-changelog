'use client';

import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

function Card({ name, origin, version, changelog, url, date }: any) {
  return (
    <div className={styles.card}>

      <div className={styles.description}>
        <h2>{origin}</h2>
        <span>{name} - {version}</span>
        <br />
        <span>Date: {date}</span>

      </div>
      <br />
      <button><a target='_blank' href={url}>See on github</a></button>
      <div className={styles.code}>
        <br />
        {
          changelog.split('\n').map((e: string, i: number) => (<p key={i}>{e}</p>))
        }
      </div>
    </div>
  )

}

export default function Home() {

  const [data, setData] = useState<any>();

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

      {!data && <p>Loading...</p>}
      {data && (data.length > 0 ?
        data.map((e: any, i: number) => <Card key={i} {...e} />)
        :
        <p>No data</p>
      )}
    </main>
  )
}
