import { client } from '@/lib/prismic';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import PrismicDom from 'prismic-dom';

interface CategoryProps {
  category: Document;
  products: Document[];
}

export default function Category({ category, products }: CategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h1>{PrismicDom.RichText.asText(category.data.title)}</h1>

      <ul>
        {products.map((product) => {
          return (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`}>
                <a>{PrismicDom.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ]);

  const paths = categories.results.map((category) => {
    return {
      params: {
        slug: category.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (
  context
) => {
  const { slug } = await context.params;

  const category = await client().getByUID('category', String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id),
  ]);

  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 60,
  };
};
