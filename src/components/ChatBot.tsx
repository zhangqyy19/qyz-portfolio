import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatBot.scss';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const resumeData: Record<string, string> = {
  name: "My name is Qian Yun Zhang (张千云). I'm a CS student and developer!",
  education: "I'm currently at Columbia University (expected 2029) studying Computer Science with a 4.0 GPA. Previously at University of Michigan.",
  experience: "I've worked at Jingdong Group (Backend Developer), University of Michigan FREE Lab (Research Assistant), Alibaba Group (Software Engineer Intern), and Shenwan Hongyuan Securities (M&A Analyst).",
  skills: "I'm proficient in Python, Java, C++, HTML/CSS, R, SQL. I use tools like Git, GitHub Actions, Linux, React, Flask. I also work with GenAI/LLM platforms like OpenAI, Google Gemini, Hugging Face, and Qwen.",
  projects: "Check out the Projects page! I work on full-stack web apps, GenAI solutions, and more. Demos coming soon!",
  contact: "You can reach me through the Contact page! I'd love to connect.",
  hobbies: "I enjoy coding side projects, exploring new AI technologies, and building cool web experiences like this portfolio!",
  location: "I'm based in New York, NY (Columbia University). Previously in Ann Arbor, MI.",
  gpa: "My GPA at Columbia is 4.00/4.00!",
  alibaba: "At Alibaba Group, I worked as a Software Engineer Intern doing Frontend Development, Backend Development, User Experience, and Team Leading in Hangzhou, China (Jul-Aug 2025).",
  jd: "At Jingdong Group, I work as a Backend Developer focusing on Automation, Data Governance, and Statistical Analysis in Beijing (Jun-Aug 2026).",
  research: "At the University of Michigan FREE Laboratory, I work on Full-stack Web Development, GenAI/LLM, Project Management, and Business Development.",
};

const matchResponse = (input: string): string => {
  const lower = input.toLowerCase();
  
  if (lower.match(/hi|hello|hey|你好/)) return "Hey there! 👋 I'm Qian Yun's portfolio bot. Ask me anything about her background!";
  if (lower.match(/name|who|你是谁/)) return resumeData.name;
  if (lower.match(/school|education|university|college|gpa|学校|教育/)) {
    if (lower.includes('gpa')) return resumeData.gpa;
    return resumeData.education;
  }
  if (lower.match(/experience|work|job|intern|工作|实习/)) {
    if (lower.match(/alibaba|阿里/)) return resumeData.alibaba;
    if (lower.match(/jd|jingdong|京东/)) return resumeData.jd;
    if (lower.match(/research|lab|实验室/)) return resumeData.research;
    return resumeData.experience;
  }
  if (lower.match(/skill|tech|language|tool|技能|技术/)) return resumeData.skills;
  if (lower.match(/project|项目/)) return resumeData.projects;
  if (lower.match(/contact|reach|email|联系/)) return resumeData.contact;
  if (lower.match(/hobby|hobbies|fun|兴趣/)) return resumeData.hobbies;
  if (lower.match(/where|location|city|地方|住/)) return resumeData.location;
  if (lower.match(/thank|thanks|谢谢/)) return "You're welcome! Happy to help! 😊";
  if (lower.match(/bye|goodbye|再见/)) return "Goodbye! Thanks for visiting! 🎉";
  
  return "Hmm, I'm not sure about that. Try asking about education, experience, skills, projects, or contact info! 🤔";
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] =useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Hi! 🌸 I'm Qian Yun's portfolio assistant. Ask me about her education, experience, skills, or anything else!", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botResponse = matchResponse(input);
      const botMsg: Message = { id: Date.now() + 1, text: botResponse, isBot: true };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className={`chatbot-window ${isClosing ? 'closing' : ''}`}>
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <span className="chatbot-avatar">🌸</span>
              <div>
                <h4>Portfolio Bot</h4>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={handleClose} aria-label="Close chat">✕</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-msg ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.isBot && <span className="msg-avatar">🌸</span>}
                <div className="msg-bubble">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              autoFocus
            />
            <button onClick={sendMessage} disabled={!input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          className="chatbot-toggle"
          onClick={handleOpen}
          aria-label="Open chatbot"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatBot;