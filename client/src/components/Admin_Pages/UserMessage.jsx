import emailjs from 'emailjs-com';
import React, { useRef } from 'react';

const UserMessage = ({Info}) => {
  const form = useRef();

    function sendEmail(e) {
      e.preventDefault();
          emailjs.sendForm('gmail', 'template_60xre2s', e.target, 'WEac5P7UXpE2tIWgk')
          .then((result) => {
          console.log(result.text);
          }, (error) => {
          console.log(error.text);
          });
      e.target.reset();
      }
  return (
    <main>
      <form ref={form} onSubmit={sendEmail}>
      <label>Your Name</label>
      <input type="text" name="from_name" />
      <label>To Name</label>
      <input type="text" name="to_name" />
      <label>To Email</label>
      <input type="email" name="email" />
      <label>Message</label>
      <textarea name="message" />
      <input type="submit" value="Send" />
      </form>
    </main>
  );
};

export default UserMessage;