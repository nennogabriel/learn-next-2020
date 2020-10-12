import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import PrismicDom from 'prismic-dom';
import { client } from '@/lib/prismic';

interface ProductProps {
  product: Document;
}

export default function Product({ product }: ProductProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h1>{PrismicDom.RichText.asText(product.data.title)}</h1>

      <img
        src={product.data.thumbnail.url}
        height="300"
        alt={PrismicDom.RichText.asText(product.data.title)}
      />

      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDom.RichText.asHtml(product.data.description),
        }}
      />

      <p>price: $ {product.data.price}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = await context.params;

  const product = await client().getByUID('product', String(slug), {});

  return {
    props: {
      product,
    },
    revalidate: 5,
  };
};
