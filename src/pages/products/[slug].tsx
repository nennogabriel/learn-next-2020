import { useRouter } from 'next/router';

export default function Product() {
  const routes = useRouter();
  return (
    <div>
      <h1>{routes.query.slug}</h1>
    </div>
  );
}
