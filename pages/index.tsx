import { Button, Divider } from "antd";
import axios from "axios";
import { useState } from "react";
import styles from "../styles/Home.module.css";

const PHONE = process.env.NEXT_PUBLIC_PHONE;

export default function Home() {
  const [code] = useState(digits(6));
  const [id] = useState(`anon-${digits(3)}`);

  return (
    <div className={styles.wrapper}>
      <div>
        <h5>Code</h5>
        <h2>{code}</h2>
      </div>
      <div>
        <h5>Identifier</h5>
        <h2>{id}</h2>
      </div>
      <Divider />
      <Button onClick={() => axios.post("/api/identify", { code, id })}>
        <a href={`tel:${PHONE},${code}#`}>Click to Call</a>
      </Button>

      <Divider />
      <Button onClick={() => axios.post("/api/identify", { code, id })}>
        <a href={`sms:${PHONE}&body=(${code}) Hello there!`}>Click to Text</a>
      </Button>
    </div>
  );
}

function digits(count: number) {
  for (var i = 0, str = ""; i < count; i++)
    str += "0123456789"[Math.floor(Math.random() * 10)];

  return str;
}
