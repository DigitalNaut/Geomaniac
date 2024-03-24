interface Image {
  source: string;
  width: number;
  height: number;
}

type PageNotFound = {
  ns: "-1";
  title: string;
  missing: string;
};

type PageInfo = {
  pageid: number;
  ns: number;
  title: string;
  extract: string;
  thumbnail?: Image;
  original?: Image;
  fullurl: string;
};

type Pages = Record<number, PageInfo | PageNotFound>;

interface Query {
  pages: Pages;
}

export interface WikidataSummaryResponse {
  batchcomplete: string;
  query: Query;
}
