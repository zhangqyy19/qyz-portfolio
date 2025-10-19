import React, { useRef, useState } from 'react';
import '../assets/styles/Contact.scss';
import emailjs from '@emailjs/browser';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

function Contact() {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [nameError, setNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<boolean>(false);
  
  const [status, setStatus] = useState<'idle'|'success'|'error'>('idle'); 
  const [statusMsg, setStatusMsg] = useState('');                         

  const form = useRef<HTMLFormElement | null>(null);

  
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();

    setNameError(name === '');
    setEmailError(email === '');
    setMessageError(message === '');

    /* Uncomment below if you want to enable the emailJS */

     if (name !== '' && email !== '' && message !== '') {
       const templateParams = {
         name: name,
         email: email,
         message: message
       };
      
       setStatus('idle');                                        
       console.log(templateParams);

       emailjs.send(
        'service_e4br5rl', 
        'template_g3ftqbm', 
        templateParams, 
        'public_W9Duj3vaj8ND9MYG'
      )
      .then(
         (response) => {
          console.log('SUCCESS!', response.status, response.text);
          setStatus('success');                                
          setStatusMsg('Message sent successfully! I’ll get back to you soon.');
          setName('');
          setEmail('');
          setMessage('');
         },
         (error) => {
           console.log('FAILED...', error);
           setStatus('error');                                  
           setStatusMsg('Something went wrong sending your message. Please try again.');
         },
      );
       setName('');
       setEmail('');
       setMessage('');
     }
  };


  const fieldSX = {
    // input text color
    '& .MuiInputBase-input': { color: '#111' },
    // label color
    '& .MuiInputLabel-root': { color: '#333' },
    // focused label color
    '& .MuiInputLabel-root.Mui-focused': { color: '#111' },
    // outline colors
    '& .MuiOutlinedInput-root fieldset': { borderColor: '#999' },
    '& .MuiOutlinedInput-root:hover fieldset': { borderColor: '#666' },
    '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#111' },
  };


  return (
    <div id="contact">
      <div className="items-container">
        <div className="contact_wrapper">
          <h1>Contact Me</h1>
          <p>Got a project waiting to be realized? Let's collaborate and make it happen!</p>
          <Box
            ref={form}
            component="form"
            noValidate
            autoComplete="off"
            className='contact-form'
            onSubmit={sendEmail} 
          >
            {status === 'success' && <Alert severity="success" sx={{ mb: 2 }}>{statusMsg}</Alert>}
            {status === 'error'   && <Alert severity="error"   sx={{ mb: 2 }}>{statusMsg}</Alert>}

            <div className='form-flex'>
              <TextField
                required
                id="outlined-required"
                label="Your Name"
                placeholder="What's your name?"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                error={nameError}
                helperText={nameError ? "Please enter your name" : ""}
              />
              <TextField
                required
                id="outlined-required"
                label="Email / Phone"
                placeholder="How can I reach you?"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                error={emailError}
                helperText={emailError ? "Please enter your email or phone number" : ""}
              />
            </div>
            <TextField
              required
              id="outlined-multiline-static"
              label="Message"
              placeholder="Send me any inquiries or questions"
              multiline
              rows={10}
              className="body-form"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              error={messageError}
              helperText={messageError ? "Please enter the message" : ""}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              type="submit"                                        
            >
              Send
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Contact;