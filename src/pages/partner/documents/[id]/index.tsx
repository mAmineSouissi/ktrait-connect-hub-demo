import { useRouter } from "next/router";

export default function Page() {
  const params = useRouter();
  const { id } = params.query;
  return <div>Document Detail Page</div>;
}
