import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api');
      const data = await res.json();
      console.log(data);
      setData(data.message.name);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <div className="App">{data}</div>;
}

export default App;
