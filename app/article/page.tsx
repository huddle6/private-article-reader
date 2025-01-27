"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Roboto } from "next/font/google";
import { redirect } from "next/navigation";
import { ArticleData, extract } from "@extractus/article-extractor";
import { FiFileText, FiMic, FiUser, FiWatch } from "react-icons/fi";
import LoadingIndicator from "./loading";
import ErrorBoundary from "./error";
import { ArticleData } from "./Types"; 

const roboto = Roboto({ subsets: ["latin"], weight: "300" });

const getArticle = async (article_url: string | null): Promise<ArticleData | null> => {
  try {
    if (!article_url || typeof article_url !== "string") {
      throw new Error("Article URL is invalid or missing.");
    }

    const article = await extract(article_url);

    if (!article || !article.content) {
      throw new Error("Failed to extract article content.");
    }

    return article;
  } catch (error) {
    console.error("Error fetching article:", error.message);
    throw new Error("Failed to fetch article. Please check the URL and try again.");
  }
};

const ArticleImage: React.FC<{ article: ArticleData }> = ({ article }) => {
  if (article.image) {
    return (
      <div>
        {article.content?.includes(article.image) ? (
          <></>
        ) : (
          <img
            src={article.image}
            alt={article.title}
            className="w-full mx-auto my-5 rounded"
          />
        )}
      </div>
    );
  }
  return <></>;
};

const ArticlePage = ({ searchParams }: { searchParams: { url: string } }) => {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const articlesPerPage = 5; // Adjust as needed
  const url = searchParams.url;

  const fetchArticle = useCallback(async (page: number) => {
    try {
      setLoading(true);

      const articleData = await getArticle(url);
      setArticle((prevArticle) => ({
        ...prevArticle,
        content: prevArticle?.content
          ? prevArticle.content + "<br/>" + articleData?.content
          : articleData?.content,
      }));

      // Assuming articleData has a totalPages property
      setTotalPages(articleData?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (currentPage <= totalPages) {
      fetchArticle(currentPage);
    }
  }, [currentPage, totalPages, fetchArticle]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }, { threshold: 1.0 });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [currentPage, totalPages]);

  if (loading && currentPage === 1) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>No article found.</div>;
  }

  return (
    <div>
      <div>
        <Link
          href={article.source || "/"}
          className="flex items-center justify-center gap-2 py-1 my-2 font-bold text-center underline bg-yellow-500 item"
        >
          <FiFileText /> <span>Read at source.</span>
        </Link>
        <div className="px-2">
          <h2 className="my-8 text-2xl font-bold text-center">
            {article.title}
          </h2>
          <ArticleImage article={article} />
          <div className="flex flex-row justify-center gap-6 mt-4">
            <div className="flex flex-row items-center gap-2">
              <FiUser /> {article.author || "No author found."}
            </div>
            <div className="flex flex-row items-center gap-2">
              <FiWatch />{" "}
              {new Date(article.published || "").toLocaleDateString() ||
                "Publishing time not found."}
            </div>
            <div className="flex flex-row items-center gap-2">
              <FiMic />{" "}
              {`${Math.round(Number(article.ttr) / 60)} Minutes` || "0 Minutes"}
            </div>
          </div>
          <article
            className={"mx-auto my-0 prose max-w-6xl " + roboto.className}
            dangerouslySetInnerHTML={{ __html: String(article.content) }}
          ></article>
          <div ref={loadMoreRef} style={{ height: "20px" }}></div>
        </div>
        {loading && currentPage > 1 && <LoadingIndicator />}
      </div>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <ArticlePage searchParams={{ url: "https://example.com/article" }} />
  </ErrorBoundary>
);

export default App;
