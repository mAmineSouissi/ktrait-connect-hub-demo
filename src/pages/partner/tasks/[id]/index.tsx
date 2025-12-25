import { useRouter } from "next/router";

export default function Page() {
  const params = useRouter();
  const { id } = params.query;
  return <div>Project Detail Page</div>;
}
