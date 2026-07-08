import React, { useRef, useState } from "react";
import emailjs from '@emailjs/browser';
import SendIcon from '@mui/icons-material/Send';
import '../styles/ContactPage.scss';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const form = useRef<HTMLFormElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !message) return;

    const templateParams = { name, email, message };

    emailjs.send(
      'service_e4br5rl',
      'template_g3ftqbm',
      templateParams,
      'public_W9Duj3vaj8ND9MYG'
    ).then(
      () => {
        setStatus('success');
        setStatusMsg('Message sent successfully! I\'ll get back to you soon.');
        setName('');
        setEmail('');
        setMessage('');
      },
      () => {
        setStatus('error');
        setStatusMsg('Something went wrong. Please try again.');
      }
    );
  };

  return (
    <div className="page-wrapper">
      <div className="page-content contact-page fade-in-up">
        <h1 className="section-title">Contact Me</h1>
        <p className="contact-subtitle">
          Gota project waiting to be realized? Let's collaborate and make it happen!
        </p>

        <div className="contact-form-card">
          {status === 'success' && (
            <div className="alert-success">{statusMsg}</div>
          )}
          {status === 'error' && (
            <div className="alert-error">{statusMsg}</div>
          )}

          <form ref={form} onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="What's your name?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
              />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email / Phone</label>
                <input
                  id="email"
                  type="text"
                  placeholder="How can I reach you?"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="Send me any inquiries or questions"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Send
              <SendIcon style={{ fontSize: '1.1rem' }} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;