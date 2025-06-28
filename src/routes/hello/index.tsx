import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/hello/")({
  component: RouteComponent,
});

const API_URL = `${import.meta.env.VITE_API_BASE}/hello`;

function RouteComponent() {
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return <div>Hello "/hello/"!</div>;
}
