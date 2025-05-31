export interface DocItem {
  type: 'text' | 'code' | 'mermaid' | 'table';
  content: string | {
    headers: string[];
    rows: string[][];
  };
  language?: string;
}

export interface Subsection {
  id: string;
  title: string;
  content: DocItem[];
}

export interface Section {
  id: string;
  title: string;
  subsections: Subsection[];
}

export interface Project {
  id: string;
  name: string;
  sections: Section[];
}
