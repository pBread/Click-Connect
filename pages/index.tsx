import { Button, Divider, Input } from "antd";
import axios from "axios";
import { useState } from "react";
import styles from "../styles/Home.module.css";

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
      <Button onClick={() => axios.post("/api/identify", { code, id })}>
        <a href={`tel:${PHONE},${code}#`}>Click to Connect</a>
      </Button>
    </div>
  );
}

function randomDigits(count: number) {
  for (var i = 0, str = ""; i < count; i++)
    str += "0123456789"[Math.floor(Math.random() * 10)];

  return str;
}
