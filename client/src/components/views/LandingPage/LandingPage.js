import React, { useEffect } from 'react';
import axios from 'axios';

export default function LandingPage() {
  useEffect(() => {
    axios
      // .get('http://localhost:5000/api/hello')
      .get('/api/hello')
      .then((response) => console.log(response));
  }, []);

  return <div>Landing Page</div>;
}
