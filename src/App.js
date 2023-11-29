import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ChartBarIcon, PresentationChartBarIcon, SparklesIcon} from "@heroicons/react/solid"

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
  const [provincia, setProvincia] = useState(false);
  const [distrito, setDistrito] = useState(false)
  const [loadingP, setLoadingP] = useState(false)

 const showR = () => {
  setRegion(true)
  setProvincia(false)
  setDistrito(false)
 }

 const showP = () => {
  setRegion(false)
  setProvincia(true) 
  setDistrito(false) 
 }

 const showD = () => {
  setRegion(false)
  setProvincia(false) 
  setDistrito(true)   
 }

  const [popUp, setPopUp] = useState(false);

 const toggle = () => {
   setPopUp(!popUp)
 }

  const [popUp2, setPopUp2] = useState(false);

  const toggle2 = () => {
    setPopUp2(!popUp2)
  }

  const [formattedDate, setFormattedDate] = useState('');
  const [data, setData] = useState([]);
  const [datap, setDatap] = useState([]);
  const [datad, setDatad] = useState([]);
  const [districtsProjects, setDistrictProjects] = useState([])
  const [proyectosAmazonas, setProyectosAmazonas] = useState([])
  const [loading, setLoading] = useState(false); 

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://awsdata.konlaptechs.com:9020/getdatall', {
            timeout: 100000,
        });
        setData(response.data.region);
        setDatap(response.data.province);
        setDatad(response.data.distrito);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        setLoading(false);
    }
};

  useEffect(() => {
    fetchData()
  }, [])

const districtData = async () => {
  try {
    const answer = await axios.get(`http://localhost:5000/getdatadistrict`, {
      timeout: 100000,
    });
    setDistrictProjects(answer.data.distritox);
    toggle();
    console.log(answer.data.distritox)
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    setLoading(false);
  }
}
  const [provinceProjects, setProvinceProjects] = useState([])
  const provinceData = async () => {
    try {
      const answer = await axios.get(`http://localhost:5000/getdataprovince`, {
        timeout: 100000,
      });
      setProvinceProjects(answer.data.provincex);
      console.log(answer.data.provincex)
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
    }
  }


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
        <div className='w-5/6 my-12 sm:w-1/2 flex justify-evenly'>
          <div onClick={showR} className={`${region? "text-purple-600" : "text-blue-600 hover:text-purple-500 cursor-pointer" } flex`}>
            <ChartBarIcon className='w-5 sm:w-7 sm:flex hidden h-auto mr-1 sm:mr-2' />
            <p className='text-lg sm:text-xl font-medium'>Regiones</p>
          </div>
          <div onClick={showP} className={`${provincia? "text-purple-600" : "text-blue-600 hover:text-purple-500 cursor-pointer" } flex`}>
            <PresentationChartBarIcon className='w-5 sm:flex hidden sm:w-7 h-auto mr-1 sm:mr-2' />
            <p className='text-lg sm:text-xl font-medium'>Provincias</p>
          </div>
          <div onClick={showD} className={`${distrito? "text-purple-600" : "text-blue-600 hover:text-purple-500 cursor-pointer" } flex`}>
            <SparklesIcon className='w-5 sm:w-7 sm:flex hidden h-auto mr-1 sm:mr-2' />
            <p className='text-lg sm:text-xl font-medium'>Distritos</p>
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
                        <li className="my-6" key={index} onClick={provinceData} >
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
          {distrito &&
                  <div className="w-5/6 sm:w-4/5">
                  {loadingP ? (
                    <div className='flex justify-center'>
                      <LoadingIcon /> 
                    </div>
                  ) : (
                    <ul>
                      {datad.map((item, index) => (
                        <li className="my-6 cursor-pointer" key={index} onClick={() => districtData(item.name)}>
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
        {popUp && <Projects toggle={toggle} districtsProjects={districtsProjects} />}
        {popUp2 && <ProjectsProvince toggle2={toggle2} provinceProjects={provinceProjects} />}
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

const ProjectsProvince = ({ provinceProjects, toggle2 }) => {

  return (
    <div className=''>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:w-4/5"
            role="dialog"
            aria-labelledby="modal-headline"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {provinceProjects?.map((item, index) => (
                <li className="my-6" key={index}>
                  <p className="text-gray-800 text-lg my-2">
                    {item.projectname} - {item.PIM} - {item.CERTIFICACION}
                  </p>
                  <ProgressBard percentage={parseInt(item.PORCENTAJE_AVANCE)} />
                </li>
              ))}
            </div>
            <div className="bg-gray-50 px-4 mt-6 sm:mt-0 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={toggle2}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Projects = ({ districtsProjects, toggle }) => {

  return (
    <div className=''>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:w-4/5"
            role="dialog"
            aria-labelledby="modal-headline"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {districtsProjects?.map((item, index) => (
                <li className="my-6" key={index}>
                  <p className="text-gray-800 text-lg my-2">
                    {item.projectname} - {item.PIM} - {item.CERTIFICACION}
                  </p>
                  <ProgressBard percentage={parseInt(item.PORCENTAJE_AVANCE)} />
                </li>
              ))}
            </div>
            <div className="bg-gray-50 px-4 mt-6 sm:mt-0 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={toggle}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressBard = ({ percentage }) => {
  return (
    <div className="h-4 w-full bg-gray-200 rounded-full">
      <div
        className="h-full bg-blue-500 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
