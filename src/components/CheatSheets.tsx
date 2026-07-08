import React, { useState } from 'react';
import '../styles/CheatSheets.scss';

interface SheetItem {
  code: string;
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
          { code: 'SELECT col FROM table WHERE cond GROUP BY col HAVING count > 1' },
          { code: 'JOIN: INNER | LEFT | RIGHT | FULL OUTER | CROSS' },
          { code: 'INSERT INTO t (col) VALUES (v); UPDATE t SET col=v WHERE id=1' },
          { code: 'CREATE INDEX idx ON table(col); DROP INDEX idx' },
          { code: 'WINDOW: ROW_NUMBER() OVER (PARTITION BY col ORDER BY col2)' },
          { code: 'CTE: WITH name AS (SELECT ...) SELECT * FROM name' },
        ]
      },
      {
        name: 'Regex',
        items: [
          { code: '. any | \\d digit | \\w word | \\s space | ^ start | $ end' },
          { code: '* 0+ | + 1+ | ? 0-1 | {n,m} range | () group | [] set' },
          { code: '(?=...) lookahead | (?<=...) lookbehind | (?:...) non-capture' },
          { code: '\\b word boundary | [^abc] negated set | a|b alternation' },
        ]
      },
      {
        name: 'Python',
        items: [
          { code: '[x for x in range(10) if x % 2 == 0]  # list comprehension' },
          { code: '{k: v for k, v in items.items()}  # dict comprehension' },
          { code: 'lambda x, y: x + y | map(fn, iter) | filter(fn, iter)' },
          { code: 'with open("f.txt") as f: content = f.read()' },
          { code: 'try/except/else/finally | raise ValueError("msg")' },
          { code: '@decorator | *args, **kwargs | yield (generators)' },
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
          { code: 'find . -name "*.ts" -exec grep -l "pattern" {} \\;' },
          { code: 'awk \'{print $1}\' file | sort | uniq -c | sort -rn | head' },
          { code: 'sed -i "s/old/new/g" file | xargs | tee output.log' },
          { code: 'tar -czf archive.tar.gz dir/ | chmod 755 script.sh' },
          { code: 'curl -X POST -H "Content-Type: json" -d \'{"k":"v"}\' url' },
        ]
      },
      {
        name: 'Git',
        items: [
          { code: 'git rebase -i HEAD~3 | git stash pop | git cherry-pick <sha>' },
          { code: 'git log --oneline --graph | git diff --staged | git blame file' },
          { code: 'git reset --soft HEAD~1 | git reflog | git bisect start' },
          { code: 'git worktree add ../branch branch-name' },
        ]
      },
      {
        name: 'Docker',
        items: [
          { code: 'docker build -t img . | docker run -d -p 8080:80 img' },
          { code: 'docker compose up -d | docker exec -it ctr /bin/sh' },
          { code: 'docker volume create vol | docker network create net' },
          { code: 'COPY --from=builder /app/dist . (multi-stage)' },
        ]
      },
      {
        name: 'Vim',
        items: [
          { code: ':w save | :q quit | :wq | dd del line | yy yank | p paste' },
          { code: '/pattern search | :%s/old/new/g replace all | :noh clear' },
          { code: 'ciw change word | di" del inside | va{ select block' },
          { code: ':sp split | :vsp vsplit | Ctrl-w hjkl navigate' },
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
          { code: 'System > User > Assistant role hierarchy | temperature 0-1' },
          { code: 'Chain-of-thought: "Let\'s think step by step" | few-shot examples' },
          { code: 'Output format: JSON mode | structured outputs | schema enforcement' },
          { code: 'Constraints: "Do not..." | "Only respond with..." | guardrails' },
          { code: 'Role prompting | delimiters ### | numbered steps | self-consistency' },
        ]
      },
      {
        name: 'RAG',
        items: [
          { code: 'Chunk: fixed-size | semantic | recursive split | overlap 10-20%' },
          { code: 'Embed: text-embedding-3-small | BGE | GTE | dim 768-1536' },
          { code: 'Retrieve: cosine sim | MMR | hybrid (BM25 + vector)' },
          { code: 'Rerank: cross-encoder | cohere rerank | lost-in-middle fix' },
        ]
      },
      {
        name: 'Agents',
        items: [
          { code: 'ReAct: Thought → Action → Observation loop | tool-use' },
          { code: 'Planning: task decomposition | self-reflection | refinement' },
          { code: 'Memory: short-term (context) | long-term (vector) | episodic' },
          { code: 'Multi-agent: supervisor | debate | consensus | handoff' },
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
                        <code
                          className={expandedItems.has(key) ? 'expanded' : ''}
                          onClick={(e) => handleItemToggle(e, key)}
                        >
                          {item.code}
                        </code>
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