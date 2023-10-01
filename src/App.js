import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LoadingIcon() {
  return (
    <div className="flex items-center justify-center space-x-2 animate-pulse">
      <div className="w-2 h-2 sm:w-4 sm:h-4 bg-blue-400 rounded-full"></div>
      <div className="w-2 h-2 sm:w-4 sm:h-4 bg-blue-400 rounded-full"></div>
      <div className="w-2 h-2 sm:w-4 sm:h-4 bg-blue-400 rounded-full"></div>
    </div>
  );
}

function App() {
  const [formattedDate, setFormattedDate] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); 

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/data', {
        timeout: 30000,
      });
      setData(response.data);
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    document.title = 'Ejecución presupuestal amigable';

    fetchData();
    const currentDate = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formatted = currentDate.toLocaleDateString('en-US', options);
    setFormattedDate(formatted);
  }, []);

  const removePrefix = (name) => {
    return name.replace(/^(464: GOBIERNO REGIONAL DE LA PROVINCIA CONSTITUCIONAL DEL |465: |[\d]+: GOBIERNO REGIONAL DEL DEPARTAMENTO DE )\s*/, '');
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-blue-600 mb-8">
          Avance de Ejecución Presupuestal
        </h1>
        <p className="text-gray-600 font-medium">
          Información actualizada al día {formattedDate}
        </p>
      </div>
      <div className="flex justify-center mt-8">
        <div className="w-5/6 sm:w-4/5">
          {loading ? (
            <div className='flex justify-center'>
              <LoadingIcon /> 
            </div>
          ) : (
            <ul>
              {data.map((item, index) => (
                <li className="my-6" key={index}>
                  <p className="text-gray-800 text-lg mb-2">
                    {index + 1}. {removePrefix(item.name)}: {item.avance}%
                  </p>
                  <ProgressBar
                    percentage={item.avance}
                    isAmazonas={item.name.includes('AMAZONAS')}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

const ProgressBar = ({ percentage, isAmazonas }) => {
  const progressBarClassName = isAmazonas
    ? 'h-4 bg-red-100 rounded-full'
    : 'h-4 bg-blue-100 rounded-full';

  return (
    <div className={progressBarClassName}>
      <div
        className={isAmazonas ? 'h-full bg-red-500 rounded-full' : 'h-full bg-blue-500 rounded-full'}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};