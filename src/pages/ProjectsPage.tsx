import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faReact } from '@fortawesome/free-brands-svg-icons';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import '../styles/ProjectsPage.scss';

interface SkillLink {
  label: string;
  url: string;
}

const labelsFirst: SkillLink[] = [
  { label: "Python", url: "https://www.python.org/" },
  { label: "Java", url: "https://dev.java/" },
  { label: "C++", url: "https://isocpp.org/" },
  { label: "HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { label: "CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { label: "R", url: "https://www.r-project.org/" },
  { label: "SQL", url: "https://www.w3schools.com/sql/" }
];

const labelsSecond: SkillLink[] = [
  { label: "Git", url: "https://git-scm.com/doc" },
  { label: "GitHub Actions", url: "https://docs.github.com/en/actions" },
  { label: "Linux", url: "https://www.kernel.org/" },
  { label: "React", url: "https://react.dev/" },
  { label: "Flask", url: "https://flask.palletsprojects.com/" }
];

const labelsThird: SkillLink[] = [
  { label: "OpenAI", url: "https://platform.openai.com/docs" },
  { label: "Google Gemini", url: "https://ai.google.dev/" },
  { label: "Hugging Face", url: "https://huggingface.co/docs" },
  { label: "Qwen", url: "https://qwen.readthedocs.io/" }
];

const ProjectsPage: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="page-content projects-page fade-in-up">
        <h1 className="section-title">Skills & Projects</h1>

        {/* Skills Section */}
        <div className="skills-section">
          <h2>Expertise</h2>
          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-icon">
                <FontAwesomeIcon icon={faPython} />
              </div>
              <h3>Programming Languages</h3>
              <p>
                I have built a diverse array of web applications from scratch 
                using modern technologies such as React and Flask.
              </p>
              <div className="chips-wrapper">
                {labelsFirst.map((item, index) => (
                  <a key={index} href={item.url} target="_blank" rel="noreferrer" className="chip chip-link">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-icon">
                <FontAwesomeIcon icon={faReact} />
              </div>
              <h3>Developer Tools</h3>
              <p>
                I help set up DevOps testing, CI/CD pipelines, and deployment 
                automation to support successful project delivery.
              </p>
              <div className="chips-wrapper">
                {labelsSecond.map((item, index) => (
                  <a key={index} href={item.url} target="_blank" rel="noreferrer" className="chip chip-link">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-icon">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <h3>GenAI & LLM</h3>
              <p>
                Professional experience building enterprise grade GenAI-enabled 
                solutions to empower intelligent decision making.
              </p>
              <div className="chips-wrapper">
                {labelsThird.map((item, index) => (
                  <a key={index} href={item.url} target="_blank" rel="noreferrer" className="chip chip-link">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="projects-section">
          <h2>Personal Projects</h2>
          <div className="coming-soon">
            <p>Demos coming soon! Stay tuned for exciting project showcases.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectsPage;