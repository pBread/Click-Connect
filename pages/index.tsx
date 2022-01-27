import { Button, Typography, Input } from "antd";
import { useState } from "react";
import { v4 } from "uuid";

const PHONE = process.env.NEXT_PUBLIC_PHONE;
const { Title } = Typography;

export default function Home() {
  const [code] = useState(makeCode);
  const [id, setId] = useState(v4);

  return (
    <div>
      <h2>{code}</h2>
      <Input value={id} />
      <Button href={`tel:${PHONE},${id}#`}>Click to Connect</Button>
    </div>
  );
}

function makeCode() {
  for (var i = 0, str = ""; i < 6; i++)
    str += "0123456789"[Math.floor(Math.random() * 10)];
  return str;
}
