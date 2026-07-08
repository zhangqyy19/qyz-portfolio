import React, { useState } from 'react';
import '../styles/CheatSheets.scss';

interface SheetItem {
  code: string;
  description: string;
}

interface Sheet {
  name: string;
  items: SheetItem[];
}

interface Category {
  id: string;
  icon: string;
  title: string;
  sheets: Sheet[];
}

const categories: Category[] = [
  {
    id: 'languages',
    icon: '{}>',
    title: 'Language Cheat Sheets',
    sheets: [
      {
        name: 'SQL',
        items: [
          { code: 'SELECT col FROM table WHERE cond GROUP BY col HAVING count > 1', description: 'Query with filtering, grouping, and aggregate conditions' },
          { code: 'JOIN: INNER | LEFT | RIGHT | FULL OUTER | CROSS', description: 'Table join types — combine rows from multiple tables' },
          { code: 'INSERT INTO t (col) VALUES (v); UPDATE t SET col=v WHERE id=1', description: 'Data manipulation — insert new rows or update existing ones' },
          { code: 'CREATE INDEX idx ON table(col); DROP INDEX idx', description: 'Index management — speed up queries on specific columns' },
          { code: 'WINDOW: ROW_NUMBER() OVER (PARTITION BY col ORDER BY col2)', description: 'Window functions — compute values across row sets without grouping' },
          { code: 'CTE: WITH name AS (SELECT ...) SELECT * FROM name', description: 'Common Table Expressions — reusable named subqueries' },
        ]
      },
      {
        name: 'Regex',
        items: [
          { code: '. any | \\d digit | \\w word | \\s space | ^ start | $ end', description: 'Character classes and anchors — match specific character types or positions' },
          { code: '* 0+ | + 1+ | ? 0-1 | {n,m} range | () group | [] set', description: 'Quantifiers and grouping — control repetition and capture patterns' },
          { code: '(?=...) lookahead | (?<=...) lookbehind | (?:...) non-capture', description: 'Lookarounds and non-capturing groups — assert without consuming' },
          { code: '\\b word boundary | [^abc] negated set | a|b alternation', description: 'Boundaries and alternation — match edges or either/or patterns' },
        ]
      },
      {
        name: 'Python',
        items: [
          { code: '[x for x in range(10) if x % 2 == 0]  # list comprehension', description: 'Build filtered lists in a single concise expression' },
          { code: '{k: v for k, v in items.items()}  # dict comprehension', description: 'Create dictionaries from iterables inline' },
          { code: 'lambda x, y: x + y | map(fn, iter) | filter(fn, iter)', description: 'Anonymous functions and functional programming tools' },
          { code: 'with open("f.txt") as f: content = f.read()', description: 'Context managers — auto-close resources after use' },
          { code: 'try/except/else/finally | raise ValueError("msg")', description: 'Exception handling — catch errors and define cleanup logic' },
          { code: '@decorator | *args, **kwargs | yield (generators)', description: 'Decorators, variadic args, and lazy generators' },
        ]
      }
    ]
  },
  {
    id: 'tools',
    icon: '$_',
    title: 'Tool Cheat Sheets',
    sheets: [
      {
        name: 'Bash',
        items: [
          { code: 'find . -name "*.ts" -exec grep -l "pattern" {} \\;', description: 'Recursively find files by name and search content within them' },
          { code: "awk '{print $1}' file | sort | uniq -c | sort -rn | head", description: 'Extract fields, sort, count unique values, show top results' },
          { code: 'sed -i "s/old/new/g" file | xargs | tee output.log', description: 'In-place text replacement, argument piping, and output logging' },
          { code: 'tar -czf archive.tar.gz dir/ | chmod 755 script.sh', description: 'Compress directories and set file permissions' },
          { code: 'curl -X POST -H "Content-Type: json" -d \'{"k":"v"}\' url', description: 'Send HTTP POST requests with headers and JSON body' },
        ]
      },
      {
        name: 'Git',
        items: [
          { code: 'git rebase -i HEAD~3 | git stash pop | git cherry-pick <sha>', description: 'Interactive rebase, restore stashed changes, apply specific commits' },
          { code: 'git log --oneline --graph | git diff --staged | git blame file', description: 'View commit graph, staged changes, and line-by-line authorship' },
          { code: 'git reset --soft HEAD~1 | git reflog | git bisect start', description: 'Undo commits, recover lost refs, binary search for bugs' },
          { code: 'git worktree add ../branch branch-name', description: 'Work on multiple branches simultaneously in separate directories' },
        ]
      },
      {
        name: 'Docker',
        items: [
          { code: 'docker build -t img . | docker run -d -p 8080:80 img', description: 'Build image from Dockerfile and run container with port mapping' },
          { code: 'docker compose up -d | docker exec -it ctr /bin/sh', description: 'Start multi-container app and open interactive shell in container' },
          { code: 'docker volume create vol | docker network create net', description: 'Create persistent storage volumes and custom networks' },
          { code: 'COPY --from=builder /app/dist . (multi-stage)', description: 'Multi-stage builds — copy artifacts from build stage to slim image' },
        ]
      },
      {
        name: 'Vim',
        items: [
          { code: ':w save | :q quit | :wq | dd del line | yy yank | p paste', description: 'Essential file operations and basic copy/paste commands' },
          { code: ':/pattern search | :%s/old/new/g replace all | :noh clear', description: 'Search text, global find-and-replace, clear highlights' },
          { code: 'ciw change word | di" del inside | va{ select block', description: 'Text objects — edit/delete/select by semantic boundaries' },
          { code: ':sp split | :vsp vsplit | Ctrl-w hjkl navigate', description: 'Window splitting and navigation between panes' },
        ]
      }
    ]
  },
  {
    id: 'llm',
    icon: 'AI',
    title: 'LLM Cheat Sheets',
    sheets: [
      {
        name: 'Prompt Engineering',
        items: [
          { code: 'System > User > Assistant role hierarchy | temperature 0-1', description: 'Role-based message structure and creativity control' },
          { code: 'Chain-of-thought: "Let\'s think step by step" | few-shot examples', description: 'Elicit reasoning with step-by-step prompts and examples' },
          { code: 'Output format: JSON mode | structured outputs | schema enforcement', description: 'Constrain output to specific formats for reliable parsing' },
          { code: 'Constraints: "Do not..." | "Only respond with..." | guardrails', description: 'Set boundaries to prevent unwanted or off-topic responses' },
          { code: 'Role prompting | delimiters ### | numbered steps | self-consistency', description: 'Techniques to improve clarity, structure, and reliability' },
        ]
      },
      {
        name: 'RAG',
        items: [
          { code: 'Chunk: fixed-size | semantic | recursive split | overlap 10-20%', description: 'Split documents into retrievable pieces with overlap for context' },
          { code: 'Embed: text-embedding-3-small | BGE | GTE | dim 768-1536', description: 'Convert text to vectors using embedding models for similarity search' },
          { code: 'Retrieve: cosine sim | MMR | hybrid (BM25 + vector)', description: 'Find relevant chunks using similarity, diversity, or hybrid methods' },
          { code: 'Rerank: cross-encoder | cohere rerank | lost-in-middle fix', description: 'Re-score retrieved results to improve relevance ordering' },
        ]
      },
      {
        name: 'Agents',
        items: [
          { code: 'ReAct: Thought → Action → Observation loop | tool-use', description: 'Reasoning + Acting loop — think, execute tools, observe results' },
          { code: 'Planning: task decomposition | self-reflection | refinement', description: 'Break complex tasks into steps with iterative improvement' },
          { code: 'Memory: short-term (context) | long-term (vector) | episodic', description: 'Store and recall information across different time horizons' },
          { code: 'Multi-agent: supervisor | debate | consensus | handoff', description: 'Orchestration patterns for multiple cooperating agents' },
        ]
      }
    ]
  }
];

interface CheatSheetsProps {
  categoryId: string;
}

const CheatSheets: React.FC<CheatSheetsProps> = ({ categoryId }) => {
  const [openSheet, setOpenSheet] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const category = categories.find(c => c.id === categoryId);
  if (!category) return null;

  const handleSheetToggle = (e: React.MouseEvent, sheetName: string) => {
    e.stopPropagation();
    setOpenSheet(openSheet === sheetName ? null : sheetName);
  };

  const handleItemToggle = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="cs-card-content" onClick={(e) => e.stopPropagation()}>
      <div className="cs-card-header">
        <span className="cs-card-icon">{category.icon}</span>
        <h3>{category.title}</h3>
      </div>
      <div className="cs-sheets-list">
        {category.sheets.map((sheet) => (
          <div key={sheet.name} className={`cs-sheet-item ${openSheet === sheet.name ? 'active' : ''}`}>
            <button className="cs-sheet-btn" onClick={(e) => handleSheetToggle(e, sheet.name)}>
              <span className="cs-dot" />
              <span className="cs-sheet-label">{sheet.name}</span>
              <span className="cs-indicator">{openSheet === sheet.name ? '\u2212' : '+'}</span>
            </button>
            {openSheet === sheet.name && (
              <div className="cs-sheet-content">
                <ul>
                  {sheet.items.map((item, idx) => {
                    const key = `${sheet.name}-${idx}`;
                    return (
                      <li key={key}>
                        <div
                          className={`cs-item-wrapper ${expandedItems.has(key) ? 'expanded' : ''}`}
                          onClick={(e) => handleItemToggle(e, key)}
                        >
                          <span className="cs-item-description">{item.description}</span>
                          <code>{item.code}</code>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheatSheets;