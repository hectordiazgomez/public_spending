import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ChartBarIcon, PresentationChartBarIcon} from "@heroicons/react/solid"

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

  const [region, setRegion] = useState(true);
  const [provincia, setProvincia] = useState(false)
  const [loadingP, setLoadingP] = useState(false)

 const showR = () => {
  setRegion(true)
  setProvincia(false)
 }

 const showP = () => {
  setRegion(false)
  setProvincia(true)  
 }

  const [formattedDate, setFormattedDate] = useState('');
  const [data, setData] = useState([]);
  const [datap, setDatap] = useState([]);
  const [loading, setLoading] = useState(true); 

  const fetchData = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/getdata', {
            timeout: 20000,
        });
        setData(response.data.region);
        setDatap(response.data.province);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
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
        <p className="text-3xl font-semibold text-blue-600 mb-8">
          Avance de Ejecución Presupuestal
        </p>
      </div>
      <div className='flex justify-center'>
      <div className='w-4/5'>
      <p className="text-gray-600">
          Información actualizada al día {formattedDate} a las 9:00 am (Hora de Lima)
        </p>
      </div>
      </div>
      <div className='flex justify-center'>
        <div className='w-4/5 my-12 sm:w-1/2 flex justify-around'>
          <div onClick={showR} className={`${region? "text-purple-600" : "text-blue-600 hover:text-purple-500 cursor-pointer" } flex`}>
            <ChartBarIcon className='w-7 h-auto mr-2' />
            <p className='text-xl font-medium'>Regiones</p>
          </div>
          <div onClick={showP} className={`${provincia? "text-purple-600" : "text-blue-600 hover:text-purple-500 cursor-pointer" } flex`}>
            <PresentationChartBarIcon className='w-7 h-auto mr-2' />
            <p className='text-xl font-medium'>Provincias</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
          {region &&
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
          }
          {provincia &&
                  <div className="w-5/6 sm:w-4/5">
                  {loadingP ? (
                    <div className='flex justify-center'>
                      <LoadingIcon /> 
                    </div>
                  ) : (
                    <ul>
                      {datap.map((item, index) => (
                        <li className="my-6" key={index}>
                          <p className="text-gray-800 text-lg mb-2">
                            {index + 1}. {item.name}: {item.avance}%
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
          }
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