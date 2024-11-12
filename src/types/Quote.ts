export interface Quote {
  id: string;
  title: string;
  content: string;
  author: string;
}

export interface ApiQuote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
}