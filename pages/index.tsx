import { Button, Divider, Input } from "antd";
import fetch from "isomorphic-fetch";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";

const PHONE = process.env.NEXT_PUBLIC_PHONE;

export default function Home() {
  const [code] = useState(randomDigits(6));
  const [id, setId] = useState(`anon-${randomDigits(3)}`);

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
      <Button
        onClick={async () => {
          await setSyncMap(code, id);
        }}
      >
        <a href={`tel:${PHONE},${id}#`}> Click to Connect</a>
      </Button>
    </div>
  );
}

function setSyncMap(code: string, id: string) {
  console.log("setSyncMap");

  return axios.post("/api/identify", { code, id });
}

function randomDigits(count: number) {
  for (var i = 0, str = ""; i < count; i++)
    str += "0123456789"[Math.floor(Math.random() * 10)];

  return str;
}
