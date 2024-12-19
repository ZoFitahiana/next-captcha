"use client"
import { useEffect, useState } from 'react';
import Captcha from './captcha';
const Sequence = ({ number }) => {
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [captchaRequired, setCaptchaRequired] = useState(false);

  useEffect(() => {
    const makeRequest = async (index) => {
      try {
        const response = await fetch('https://api.prod.jcloudify.com/whoami');
        if (response.status === 403) {
          setSequence((prev) => [...prev, `${index + 1}. Forbidden`]);
          setCurrentIndex(index + 1);
        } else if (response.status === 405) {
          setCaptchaRequired(true);
        }
      } catch (error) {
        console.error('Error making request:', error);
      }
    };

    if (currentIndex < number && !captchaRequired) {
      makeRequest(currentIndex);
    }
  }, [currentIndex, number, captchaRequired]);

  useEffect(() => {
    if (currentIndex < number && !captchaRequired) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, number, captchaRequired]);

  const handleCaptchaSuccess = () => {
    setCaptchaRequired(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="sequence-container">
      {sequence.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
      {captchaRequired && <Captcha onSuccess={handleCaptchaSuccess} />}
    </div>
  );
};

export default Sequence;
