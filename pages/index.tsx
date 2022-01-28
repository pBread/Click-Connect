import { Button, Divider, Input } from "antd";
import fetch from "isomorphic-fetch";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import styles from "../styles/Home.module.css";

const PHONE = process.env.NEXT_PUBLIC_PHONE;

export default function Home() {
  const [code] = useState(makeCode());
  const [id, setId] = useState(v4());

  useEffect(() => {
    (async () =>
      fetch("https://pbread.ngrok.io/api/identify", {
        body: JSON.stringify({ code, id }),
        headers: { "Content-type": "application/json" },
        method: "POST",
      }))();
  }, [code, id]);

  return (
    <div className={styles.wrapper}>
      <div>
        <h5>Code</h5>
        <h2>{code}</h2>
      </div>
      <div>
        <h5>Identifier</h5>
        <Input onChange={(ev) => setId(ev.target.value)} value={id} />
      </div>

      <Divider />
      <Button href={`tel:${PHONE},${id}#`}>Click to Connect</Button>
    </div>
  );
}

function makeCode() {
  for (var i = 0, str = ""; i < 6; i++)
    str += "0123456789"[Math.floor(Math.random() * 10)];

  return str;
}
