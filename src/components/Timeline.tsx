import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss'

function Timeline() {
  return (
    <div id="history">
      <div className="items-container">
        <h1>Education</h1>
        <VerticalTimeline>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            contentArrowStyle={{ borderRight: '7px solid  white' }}
            date="B.S. in Computer Science · Expected May 2028"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBook} />}
          >
            <h3 className="vertical-timeline-element-title">University of Michigan, College of Literature, Science, and the Arts</h3>
            <h4 className="vertical-timeline-element-subtitle">Ann Arbor, MI</h4>
            <ul>
              <li>GPA: 4.00/4.00</li>
              <li>Relevant Coursework: Data Structures and Algorithms</li>
              <li>Awards: Regents Merit Scholarship</li>
            </ul>
          </VerticalTimelineElement>
        </VerticalTimeline>

        <h1>Experience</h1>
        <VerticalTimeline>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            contentArrowStyle={{ borderRight: '7px solid  white' }}
            date="Research Assistant · Sep. 2025 - Present"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">University of Michigan, College of Engineering</h3>
            <h3 className="vertical-timeline-element-title">FREE Laboratory</h3>
            <h4 className="vertical-timeline-element-subtitle">Ann Arbor, MI</h4>
            <p>
              Full-stack Web Development, GenAI/LLM, Project Management, Business Development
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Software Engineer Intern · Jul. 2025 - Aug. 2025"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Alibaba Group</h3>
            <h4 className="vertical-timeline-element-subtitle">Hangzhou, China</h4>
            <p>
              Frontend Development, Backend Development, User Experience, Team Leading
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Outreach Department · Sep. 2025 - Present"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">University of Michigan</h3>
            <h3 className="vertical-timeline-element-title">Chinese Students and Scholars Association</h3>
            <h4 className="vertical-timeline-element-subtitle">Ann Arbor, MI</h4>
            <p>
              Full-stack Development, API Development, User Experience
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="M&A Investment Banking Analyst · Jun. 2025 - Jul. 2025"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Shenwan Hongyuan Securities</h3>
            <h4 className="vertical-timeline-element-subtitle">Beijing, China</h4>
            <p>
              Automation, Data Governance, Statistical Analysis
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </div>
  );
}

export default Timeline;