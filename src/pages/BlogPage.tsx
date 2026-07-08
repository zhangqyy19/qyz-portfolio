import React, { useState } from "react";
import '../styles/BlogPage.scss';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building My Portfolio with React & TypeScript",
    date: "Jun 2026",
    tags: ["Web Dev", "Tutorial"],
    summary: "A walkthrough of how I designed and built this portfolio site from scratch.",
    content: `When I started building this portfolio, I wanted something that reflected both my technical skills and my personality. I chose React with TypeScript for type safety and a better developer experience.\n\nKey decisions I made:\n• Used SCSS modules for scoped, maintainable styling\n• Implemented weather-based theming for a unique touch\n• Added interactive easter eggs (try the Konami Code!)\n• Kept the architecture simple — no unnecessary abstractions\n\nThe hardest part was getting the weather API integration right while keeping the UI responsive. I ended up using a custom hook pattern that cleanly separates data fetching from presentation.`
  },
  {
    id: 2,
    title: "My Experience as a Backend Developer at JD",
    date: "Jun 2026",
    tags: ["Career", "Backend"],
    summary: "Reflections on working at one of China's largest tech companies.",
    content: `Interning at Jingdong Group taught me a lot about working at scale. When your systems serve hundreds of millions of users, every decision matters.\n\nWhat I learned:\n• Data governance is crucial — clean data pipelines save countless debugging hours\n• Automation isn't just about saving time, it's about reducing human error\n• Statistical analysis skills are valuable even for backend engineers\n• Communication across teams is as important as writing good code\n\nThe fast-paced environment pushed me to level up quickly and think about systems holistically rather than in isolation.`
  },
  {
    id: 3,
    title: "From Finance to CS: My Transfer Story",
    date: "Mar 2026",
    tags: ["Personal", "Education"],
    summary: "Why I switched paths and transferred from UMich to Columbia.",
    content: `My journey into Computer Science wasn't straightforward. I started exploring CS at Michigan while maintaining a strong GPA, and eventually decided to transfer to Columbia to pursue it fully.\n\nThe transition taught me:\n• It's never too late to pivot — your previous experience adds unique perspective\n• Finance taught me analytical thinking that directly applies to algorithm design\n• The transfer process itself was a lesson in persistence and self-advocacy\n• Every experience, even detours, contributes to who you become as an engineer\n\nNow at Columbia, I'm excited to deepen my CS knowledge while bringing a unique interdisciplinary background to the table.`
  },
  {
    id: 4,
    title: "Getting Started with GenAI Development",
    date: "Feb 2026",
    tags: ["AI", "Tutorial"],
    summary: "A beginner-friendly guide to building with LLMs and generative AI.",
    content: `After working with GenAI at the FREE Lab, I wanted to share some practical tips for developers getting started with LLM-powered applications.\n\nEssential concepts:\n• Prompt engineering is an art — specificity and context matter enormously\n• Always implement proper error handling for API calls (tokens run out, rate limits hit)\n• RAG (Retrieval Augmented Generation) is your friend for domain-specific applications\n• Start simple: a well-crafted system prompt can get you 80% of the way\n\nTools I recommend:\n• OpenAI API for general-purpose tasks\n• Hugging Face for open-source models and fine-tuning\n• LangChain for chaining complex workflows\n\nThe field moves fast — build projects, stay curious, and don't be afraid to experiment.`
  },
  {
    id: 5,
    title: "Lessons from Full-Stack Development",
    date: "Jan 2026",
    tags: ["Web Dev", "Full Stack", "Tips"],
    summary: "Practical lessons learned from building production web applications.",
    content: `After building several full-stack applications, here are the patterns and lessons that keep proving themselves:\n\nFrontend:\n• Component composition > inheritance — keep components small and focused\n• State management: start with local state, only reach for global stores when needed\n• Accessibility matters from day one, not as an afterthought\n\nBackend:\n• API design is a contract — think carefully before shipping\n• Validation at the boundary, trust nothing from the outside\n• Logging and monitoring save you during 2am incidents\n\nGeneral:\n• Ship early, iterate often\n• Tests are documentation for future you\n• Performance optimization: measure first, optimize second`
  },
  {
    id: 6,
    title: "DSA Patterns Every Developer Should Know",
    date: "Jul 2026",
    tags: ["Tutorial", "Tips"],
    summary: "Core data structure and algorithm patterns that show up repeatedly in interviews and real-world code.",
    content: `After grinding through hundreds of problems and applying DSA in production systems, these are the patterns I keep coming back to:\n\nArrays & Strings:\n• Two pointers — shrink window from both ends (palindromes, sorted pair sums)\n• Sliding window — maintain a dynamic range for subarray/substring problems\n• Prefix sums — O(1) range queries after O(n) preprocessing\n\nTrees & Graphs:\n• BFS for shortest path in unweighted graphs, DFS for exhaustive exploration\n• Topological sort for dependency resolution (course schedule, build systems)\n• Union-Find for connected components and cycle detection\n\nDynamic Programming:\n• Identify overlapping subproblems — if you're recomputing, you need memoization\n• 1D DP: climbing stairs, house robber, longest increasing subsequence\n• 2D DP: edit distance, longest common subsequence, grid paths\n• State compression: bitmask DP for subset problems\n\nGreedy & Binary Search:\n• Greedy works when local optimal choices lead to global optimum (interval scheduling)\n• Binary search on answer — when the search space is monotonic, BS the result\n\nKey meta-strategies:\n• Always clarify constraints first — n ≤ 10^5 means O(n log n) is likely the target\n• Start brute force, then optimize — correctness before cleverness\n• Recognize pattern families: most problems are variations of ~15 core patterns`
  }
];

const BlogPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterTags, setFilterTags] = useState<Set<string>>(new Set());

  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  const filteredPosts = filterTags.size === 0
    ? blogPosts
    : blogPosts.filter(post => post.tags.some(tag => filterTags.has(tag)));

  const toggleTag = (tag: string) => {
    setFilterTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const togglePost = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="page-wrapper">
      <div className="page-content blog-page fade-in-up">
        <h1 className="section-title">Blog</h1>
        <p className="blog-subtitle">Thoughts on tech, career, and building things.</p>

        {/* Tag Filter */}
        <div className="blog-tags">
          <button
            className={`tag-btn ${filterTags.size === 0 ? 'active' : ''}`}
            onClick={() => setFilterTags(new Set())}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-btn ${filterTags.has(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Blog Posts */}
        <div className="blog-list">
          {filteredPosts.map(post => (
            <article key={post.id} className={`blog-card ${expandedId === post.id ? 'expanded' : ''}`}>
              <div className="blog-card-header" onClick={() => togglePost(post.id)}>
                <div className="blog-card-meta">
                  <span className="blog-date">{post.date}</span>
                  <div className="blog-card-tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="blog-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <h3>{post.title}</h3>
                <p className="blog-summary">{post.summary}</p>
                <span className="expand-indicator">{expandedId === post.id ? '▲ Collapse' : '▼ Read more'}</span>
              </div>
              {expandedId === post.id && (
                <div className="blog-card-content">
                  {post.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BlogPage;