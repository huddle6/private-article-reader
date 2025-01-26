import React from "react";
import ErrorBoundary from "./article/error";
import ArticlePage from "./article/page";

const App = () => (
  <ErrorBoundary>
    <ArticlePage searchParams={{ url: "https://example.com/article" }} />
  </ErrorBoundary>
);

export default App;
