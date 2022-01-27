import { Button, Typography } from "antd";
import { useEffect, useState } from "react";

const { Title } = Typography;

export default function Home() {
  const id = useSessionId();

  return (
    <div>
      <Title>{id}</Title>
      <Button href={`tel:+16067320851,${id}#`}>Click to Connect</Button>
    </div>
  );
}

function useSessionId() {
  const [id, setId] = useState("");
  useEffect(() => {
    for (var i = 0, str = ""; i < 6; i++)
      str += "0123456789"[Math.floor(Math.random() * 10)];

    setId(str);
  }, []);

  return id;
}
