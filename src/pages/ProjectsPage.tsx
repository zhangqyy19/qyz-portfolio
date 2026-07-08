import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faReact } from '@fortawesome/free-brands-svg-icons';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

import '../styles/ProjectsPage.scss';
import MiniGames from '../components/games/MiniGames';
import CheatSheets from '../components/CheatSheets';

interface SkillLink {
  label: string;
  url: string;
}

interface SkillCardData {
  id: string;
  icon: any;
  title: string;
  description: string;
  chips: SkillLink[];
  cheatCategory: string;
}

const initialCards: SkillCardData[] = [
  {
    id: 'languages',
    icon: faPython,
    title: 'Programming Languages',
    description: 'I have built a diverse array of web applications from scratch using modern technologies such as React and Flask.',
    chips: [
      { label: "Python", url: "https://www.python.org/" },
      { label: "Java", url: "https://dev.java/" },
      { label: "C++", url: "https://isocpp.org/" },
      { label: "HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
      { label: "CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      { label: "R", url: "https://www.r-project.org/" },
      { label: "SQL", url: "https://www.w3schools.com/sql/" }
    ],
    cheatCategory: 'languages'
  },
  {
    id: 'tools',
    icon: faReact,
    title: 'Developer Tools',
    description: 'I help set up DevOps testing, CI/CD pipelines, and deployment automation to support successful project delivery.',
    chips: [
      { label: "Git", url: "https://git-scm.com/doc" },
      { label: "GitHub Actions", url: "https://docs.github.com/en/actions" },
      { label: "Linux", url: "https://www.kernel.org/" },
      { label: "React", url: "https://react.dev/" },
      { label: "Flask", url: "https://flask.palletsprojects.com/" }
    ],
    cheatCategory: 'tools'
  },
  {
    id: 'ai',
    icon: faRobot,
    title: 'GenAI & LLM',
    description: 'Professional experience building enterprise grade GenAI-enabled solutions to empower intelligent decision making.',
    chips: [
      { label: "OpenAI", url: "https://platform.openai.com/docs" },
      { label: "Google Gemini", url: "https://ai.google.dev/" },
      { label: "Hugging Face", url: "https://huggingface.co/docs" },
      { label: "Qwen", url: "https://qwen.readthedocs.io/" }
    ],
    cheatCategory: 'llm'
  }
];

const ProjectsPage: React.FC = () => {
  const [cards, setCards] = useState<SkillCardData[]>(initialCards);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [shuffledCards, setShuffledCards] = useState<Set<string>>(new Set());
  const dragNode = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    dragNode.current = e.currentTarget as HTMLDivElement;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (dragNode.current) {
        dragNode.current.classList.add('dragging');
      }
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newCards = [...cards];
      const [removed] = newCards.splice(draggedIndex, 1);
      newCards.splice(dragOverIndex, 0, removed);
      setCards(newCards);
    }
    if (dragNode.current) {
      dragNode.current.classList.remove('dragging');
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragNode.current = null;
  };

  const handleCardClick = (cardId: string) => {
    setShuffledCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  return (
    <div className="page-wrapper">
      <div className="page-content projects-page fade-in-up">
        <h1 className="section-title">Skills & Projects</h1>

        {/* Skills Section */}
        <div className="skills-section">
          <h2>Expertise</h2>
          <p className="drag-hint">Drag the cards to reorder them!</p>
          <div className="skills-grid">
            {cards.map((card, index) => {
              const isShuffled = shuffledCards.has(card.id);
              return (
                <div
                  key={card.id}
                  className={`card-deck ${isShuffled ? 'shuffled' : ''} ${dragOverIndex === index ? 'drag-over' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragLeave={() => setDragOverIndex(null)}
                  onClick={() => handleCardClick(card.id)}
                >
                  {/* Back card - Cheat Sheet */}
                  <div
                    className="cheat-sheet-card"
                    onClick={(e) => isShuffled && e.stopPropagation()}
                  >
                    <CheatSheets categoryId={card.cheatCategory} />
                  </div>

                  {/* Front card - Skill Card */}
                  <div
                    className="skill-card"
                    onClick={(e) => !isShuffled && e.stopPropagation()}
                  >
                    <div className="skill-icon">
                      <FontAwesomeIcon icon={card.icon} />
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <div className="chips-wrapper">
                      {card.chips.map((item, i) => (
                        <a
                          key={i}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="chip chip-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects Section */}
        <div className="projects-section">
          <h2>Personal Projects</h2>
          <div className="coming-soon">
            <p>Demos coming soon! Stay tuned for exciting project showcases.</p>
          </div>
        </div>

        {/* Mini Games Section */}
        <MiniGames />

      </div>
    </div>
  );
};

export default ProjectsPage;