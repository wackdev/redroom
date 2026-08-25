export interface FeedSourceConfig {
  name: string;
  url: string;
  category: string;
  defaultPaper: "GS-1" | "GS-2" | "GS-3" | "GS-4";
  enabled: boolean;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export const CURRENT_AFFAIRS_SOURCES: FeedSourceConfig[] = [
  {
    name: "The Indian Express Explained",
    url: "https://indianexpress.com/section/explained/feed/",
    category: "Editorial & Policy Analysis",
    defaultPaper: "GS-2",
    enabled: true,
    priority: "HIGH",
  },
  {
    name: "The Indian Express UPSC Essentials",
    url: "https://indianexpress.com/section/upsc-current-affairs/feed/",
    category: "UPSC Core Concepts",
    defaultPaper: "GS-3",
    enabled: true,
    priority: "HIGH",
  },
  {
    name: "PIB National Releases",
    url: "https://pib.gov.in/RssMain.aspx?ModId=6",
    category: "Government Policy & Schemes",
    defaultPaper: "GS-2",
    enabled: true,
    priority: "HIGH",
  },
  {
    name: "PRS Legislative Research",
    url: "https://prsindia.org/feed",
    category: "Parliament & Governance",
    defaultPaper: "GS-2",
    enabled: true,
    priority: "MEDIUM",
  },
  {
    name: "The Hindu Editorial RSS",
    url: "https://www.thehindu.com/opinion/editorial/feeder/default.rss",
    category: "National Opinion & Editorial",
    defaultPaper: "GS-2",
    enabled: true,
    priority: "HIGH",
  },
];
