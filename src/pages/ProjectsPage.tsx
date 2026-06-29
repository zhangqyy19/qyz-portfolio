import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faReact } from '@fortawesome/free-brands-svg-icons';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import '../styles/ProjectsPage.scss';

const labelsFirst = ["Python", "Java", "C++", "HTML", "CSS", "R", "SQL"];
const labelsSecond = ["Git", "GitHub Actions", "Linux", "React", "Flask"];
const labelsThird = ["OpenAI", "Google Gemini", "Hugging Face", "Qwen"];

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
                {labelsFirst.map((label, index) => (
                  <span key={index} className="chip">{label}</span>
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
                {labelsSecond.map((label, index) => (
                  <span key={index} className="chip">{label}</span>
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
                {labelsThird.map((label, index) => (
                  <span key={index} className="chip">{label}</span>
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