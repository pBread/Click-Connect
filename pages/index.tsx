import { Button, Divider } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Radio } from "antd";

const PHONE = process.env.NEXT_PUBLIC_PHONE;

const phones = {
  simple: "+18106424565",
  twilio4sf: "+17656362659",
  flex: "+13478348123",
};

export default function Home() {
  const [code, setCode] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    setCode(digits(6));
    setId(`anon-${digits(3)}`);
  }, []);

  const [phone, setPhone] = useState(phones.simple);

  const [isAnon, setAnon] = useState(true);

  return (
    <div className={styles.wrapper}>
      <div>
        <Radio.Group
          buttonStyle="solid"
          defaultValue="true"
          onChange={({ target }) => {
            setAnon(target.value === "true" ? true : false);
          }}
        >
          <Radio.Button value="true">Anon</Radio.Button>
          <Radio.Button value="false">Identified</Radio.Button>
        </Radio.Group>
      </div>

      {isAnon && (
        <div>
          <h5>Code</h5>
          <h2>{code}</h2>
        </div>
      )}
      {isAnon && (
        <div>
          <h5>Identifier</h5>
          <h2>{id}</h2>
        </div>
      )}

      <Divider />
      <div>
        <h5>Integration</h5>
        <Radio.Group
          buttonStyle="solid"
          defaultValue="simple"
          onChange={({ target }) => {
            setPhone(phones[target.value as "simple" | "twilio4sf" | "flex"]);
            setCode(digits(6));
            setId(`anon-${digits(3)}`);
          }}
        >
          <Radio.Button value="simple">Simple</Radio.Button>
          <Radio.Button value="twilio4sf">Twilio for Salesforce</Radio.Button>
          <Radio.Button value="flex">Flex</Radio.Button>
        </Radio.Group>
      </div>
      <Divider />
      <div>
        <Button onClick={() => axios.post("/api/identify", { code, id })}>
          <a href={`tel:${phone},${code}#`}>Click to Call</a>
        </Button>
        <Button onClick={() => axios.post("/api/identify", { code, id })}>
          <a
            href={`sms:${phone}&body=${isAnon ? `(${code}) ` : ""}Hello there!`}
          >
            Click to Text
          </a>
        </Button>
      </div>
    </div>
  );
}

function digits(count: number) {
  for (var i = 0, str = ""; i < count; i++)
    str += "0123456789"[Math.floor(Math.random() * 10)];

  return str;
}
