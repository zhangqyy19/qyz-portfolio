import React from "react";
import '../styles/ExperiencePage.scss';

const ExperiencePage: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="page-content experience-page fade-in-up">
        
        {/* Education Section */}
        <div className="section-block">
          <h1 className="section-title">Education</h1>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-card">
                <div className="timeline-header">
                  <div className="logo-placeholder">
                    <img src={`${process.env.PUBLIC_URL}/logos/columbia.jpeg`} alt="Columbia University Logo" />
                  </div>
                  <div className="timeline-info">
                    <h3>Columbia University - Columbia College</h3>
                    <span className="role">B.A. in Computer Science</span>
                  </div>
                </div>
                <p className="timeline-date">Expected April 2029</p>
                <p className="timeline-location">New York, NY</p>
                <div className="timeline-description">
                  <ul>
                    <li>GPA: 4.00/4.00</li>
                    <li>Relevant Coursework: Data Structures and Algorithms</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-card">
                <div className="timeline-header">
                  <div className="logo-placeholder">
                    <img src={`${process.env.PUBLIC_URL}/logos/umich2.jpeg`} alt="University of Michigan Logo" />
                  </div>
                  <div className="timeline-info">
                    <h3>University of Michigan - College of Literature, Science, and the Arts</h3>
                    <span className="role">B.S. in Computer Science</span>
                  </div>
                </div>
                <p className="timeline-date">Aug. 2025 - Apr. 2026</p>
                <p className="timeline-location">Ann Arbor, MI</p>
                <div className="timeline-description">
                  <ul>
                    <li>Transferred</li>
                    <li>Relevant Coursework: Data Structures and Algorithms, Discrete Math, Linear Algebra</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="section-block">
          <h1 className="section-title">Experience</h1>
          <div className="timeline">

            <div className="timeline-item">
              <div className="timeline-card">
                <div className="timeline-header">
                  <div className="logo-placeholder">
                    <img src={`${process.env.PUBLIC_URL}/logos/jd.webp`} alt="JD Logo" />
                  </div>
                  <div className="timeline-info">
                    <h3>Jingdong Group</h3>
                    <span className="role">Backend Developer</span>
                  </div>
                </div>
                <p className="timeline-date">Jun. 2026 - Aug. 2026</p>
                <p className="timeline-location">Beijing, China</p>
                <div className="timeline-description">
                  <p>Automation, Data Governance, Statistical Analysis</p>
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-card">
                <div className="timeline-header">
                  <div className="logo-placeholder">
                    {/* Add UMich/FREE Lab logo */}
                    LOGO
                  </div>
                  <div className="timeline-info">
                    <h3>University of Michigan - FREE Laboratory</h3>
                    <span className="role">Research Assistant</span>
                  </div>
                </div>
                <p className="timeline-date">Sep. 2025 - Present</p>
                <p className="timeline-location">Ann Arbor, MI</p>
                <div className="timeline-description">
                  <p>Full-stack Web Development, GenAI/LLM, Project Management, Business Development</p>
            </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-card">
                <div className="timeline-header">
                  <div className="logo-placeholder">
                    {/* Add Alibaba logo */}
                    LOGO
                  </div>
                  <div className="timeline-info">
                    <h3>Alibaba Group</h3>
                    <span className="role">Software Engineer Intern</span>
                  </div>
                </div>
                <p className="timeline-date">Jul. 2025 - Aug. 2025</p>
                <p className="timeline-location">Hangzhou, China</p>
                <div className="timeline-description">
                  <p>Frontend Development, Backend Development, User Experience, Team Leading</p>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-card">
                <div className="timeline-header">
                  <div className="logo-placeholder">
                    {/* Add CSSA logo */}
                    LOGO
                  </div>
                  <div className="timeline-info">
                    <h3>UMich Chinese Students and Scholars Association</h3>
                    <span className="role">Outreach Department</span>
                  </div>
                </div>
                <p className="timeline-date">Sep. 2025 - Present</p>
                <p className="timeline-location">Ann Arbor, MI</p>
                <div className="timeline-description">
                  <p>Full-stack Development, API Development, User Experience</p>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-card">
                <div className="timeline-header">
                  <div className="logo-placeholder">
                    {/* Add Shenwan Hongyuan logo */}
                    LOGO
                  </div>
                  <div className="timeline-info">
                    <h3>Shenwan Hongyuan Securities</h3>
                    <span className="role">M&A Investment Banking Analyst</span>
                  </div>
                </div>
                <p className="timeline-date">Jun. 2025 - Jul. 2025</p>
                <p className="timeline-location">Beijing, China</p>
                <div className="timeline-description">
                  <p>Automation, Data Governance, Statistical Analysis</p>
                </div>
              </div>
            </div>


          </div>
        </div>

      </div>
    </div>
  );
};

export default ExperiencePage;