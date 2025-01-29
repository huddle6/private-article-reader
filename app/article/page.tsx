"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArticleData, extract } from '@extractus/article-extractor';
import { FiFileText, FiMic, FiUser, FiWatch } from 'react-icons/fi';
import validator from 'validator';

const roboto = Roboto({ subsets: ['latin'], weight: '300' });

const getArticle = async (article_url: string | null, userAgent: string) => {
  try {
    if (article_url === null || !validator.isURL(article_url)) {
      throw new Error('The provided URL is invalid. Please check the URL and try again.');
    }

    const parserOptions = {
      wordsPerMinute: 300,
      descriptionTruncateLen: 210,
      descriptionLengthThreshold: 180,
      contentLengthThreshold: 200,
    };

    // Scraping and preparing article with user-agent header.
    const article = await extract(article_url, parserOptions, {
      headers: {
        'user-agent': userAgent,
      },
    });

    // Returning parsed article data in props to UI.
    return article;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching article: ${error.message}`);
      if (error.message.includes('INVALID URL')) {
        throw new Error('The provided URL is invalid. Please check the URL and try again.');
      } else {
        throw new Error('An error occurred while fetching the article. Please try again later.');
      }
    } else {
      console.error('An unknown error occurred.');
      throw new Error('An unknown error occurred. Please try again later.');
    }
  }
};

const ArticleImage: React.FC<{ article: ArticleData }> = ({ article }) => {
  if (article.image) {
    return (
      <div>
        {article.content?.includes(article.image) ? null : (
          <img
            src={article.image}
            alt={article.title}
            className="w-full mx-auto my-5 rounded"
          />
        )}
      </div>
    );
  }

  return null;
};

const ArticlePage: React.FC = () => {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { url, userAgent } = router.query;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (typeof url === 'string' && typeof userAgent === 'string') {
          const fetchedArticle = await getArticle(url, userAgent);
          setArticle(fetchedArticle);
        } else {
          throw new Error('Invalid URL or user agent.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    };

    if (router.isReady) {
      fetchArticle();
    }
  }, [url, userAgent, router.isReady]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Link href={article.source || '/'}>
          <a className="flex items-center justify-center gap-2 py-1 my-2 font-bold text-center underline bg-yellow-500 item">
            <FiFileText /> <span>Read at source.</span>
          </a>
        </Link>

        <div className="px-2">
          <h2 className="my-8 text-2xl font-bold text-center">
            {article.title}
          </h2>

          <ArticleImage article={article} />

          <div className="flex flex-row justify-center gap-6 mt-4">
            <div className="flex flex-row items-center gap-2">
              <FiUser /> {article.author || 'No author found.'}
            </div>

            <div className="flex flex-row items-center gap-2">
              <FiWatch /> {new Date(article.published || '').toLocaleDateString() || 'Publishing time not found.'}
            </div>

            <div className="flex flex-row items-center gap-2">
              <FiMic /> {`${Math.round(Number(article.ttr) / 60)} Minutes` || '0 Minutes'}
            </div>
          </div>

          <article className="mx-auto my-0 prose max-w-6xl" dangerouslySetInnerHTML={{ __html: String(article.content) }} />
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
