import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {ChartBarIcon, PresentationChartBarIcon, SparklesIcon, SunIcon} from "@heroicons/react/solid"

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
  const [distrito, setDistrito] = useState(false);
  const [proyecto, setProyecto] = useState(false);
  const [loadingP, setLoadingP] = useState(false);

 const showR = () => {
  setRegion(true)
  setProvincia(false)
  setDistrito(false)
   setProyecto(false)
 }

 const showP = () => {
  setRegion(false)
  setProvincia(true) 
  setDistrito(false)
   setProyecto(false) 
 }

 const showD = () => {
  setRegion(false)
  setProvincia(false) 
  setDistrito(true) 
  setProyecto(false)  
 }

 const showPr = () => {
   setRegion(false)
   setProvincia(false)
   setDistrito(false)
   setProyecto(true)  
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
  const [proyectos, setProyectos] = useState([])
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
        setProyectos(response.data.proyectos)
        setLoading(false);
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        setLoading(false);
    } finally {
      console.log(proyectos)
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

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = useMemo(() => {
    return proyectos.filter(proyecto =>
      proyecto.projectname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [proyectos, searchTerm]);

  const [fechaActual, setFechaActual] = useState(new Date());

  useEffect(() => {
    // Actualiza la fecha cada minuto (60000 milisegundos)
    const intervalId = setInterval(() => {
      setFechaActual(new Date());
    }, 60000);

    // Limpieza al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Función para formatear la fecha al formato deseado
  const formatearFecha = (fecha) => {
    const opciones = { day: 'numeric', month: 'long' };
    const horaFormateada = `9:00 am (Hora de Lima)`;
    return `Información actualizada al día ${fecha.toLocaleDateString('es-PE', opciones)} a las ${horaFormateada}`;
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
            Información actualizada al día {formatearFecha(fechaActual)}
        </p>
      </div>
      </div>
      <div className='flex justify-center'>
        <div className='w-5/6 my-12 sm:w-2/3 flex justify-evenly'>
          <div onClick={showR} className={`${region? "text-purple-600" : "text-blue-600 hover:text-purple-500 cursor-pointer" } flex`}>
            <ChartBarIcon className='w-5 sm:w-7 sm:flex hidden h-auto mr-1 sm:mr-2' />
            <p className='text-lg sm:text-xl font-medium'>Regiones</p>
          </div>
          <div onClick={showP} className={`${provincia? "text-purple-600" : "text-blue-600 hover:text-purple-500 cursor-pointer" } hidden sm:flex`}>
            <PresentationChartBarIcon className='w-5 sm:flex hidden sm:w-7 h-auto mr-1 sm:mr-2' />
            <p className='text-lg sm:text-xl font-medium'>Provincias</p>
          </div>
          <div onClick={showD} className={`${distrito? "text-purple-600" : "text-blue-600 hover:text-purple-500 cursor-pointer" } flex`}>
            <SparklesIcon className='w-5 sm:w-7 sm:flex hidden h-auto mr-1 sm:mr-2' />
            <p className='text-lg sm:text-xl font-medium'>Distritos</p>
          </div>
          <div onClick={showPr} className={`${proyecto ? "text-purple-600" : "text-blue-600 hover:text-purple-500 cursor-pointer"} flex`}>
            <SunIcon className='w-5 sm:w-7 sm:flex hidden h-auto mr-1 sm:mr-2' />
            <p className='text-lg sm:flex hidden sm:text-xl font-medium'>Proyectos regionales</p>
            <p className='text-lg flex sm:hidden sm:text-xl font-medium'>Proyectos</p>
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
          {proyecto &&
          <div className='w-5/6 sm:w-4/5'>
              <div className='sm:mx-24'>
                <p className='text-gray-800 font-semibold text-xl pb-8'>Buscar proyectos por nombre</p>
              </div>
            <div className='sm:mx-24'>
              <input
                value={searchTerm}
                onChange={handleSearchChange}
               placeholder='Search project' className='py-2 w-full sm:w-2/3 px-2 rounded outline-none border-2 border-gray-300' />
            </div>
            <div className='sm:mx-24'>
              {
                filteredProjects
                  .sort((a, b) => parseInt(a.PORCENTAJE_AVANCE) - parseInt(b.PORCENTAJE_AVANCE))
                  .map(proyecto => (
                    <div className='my-12' key={proyecto._id}>
                      <h2 className='font-semibold'>{proyecto.projectname}</h2>
                      <div className='w-1/2 py-3 grid grid-cols-1 sm:grid-cols-3'>
                        <div>
                          <a className='flex'><p className='text-gray-600'>PIM: </p><p className='text-gray-700 ml-1 font-semibold'>{proyecto.PIM}</p></a>
                        </div>
                        <div>
                          <a className='flex'><p className='text-gray-600'>Certificación: </p> <p className='text-gray-700 ml-1 font-semibold'>{proyecto.CERTIFICACION}</p></a>
                        </div>
                        <div>
                          <a className='flex'><p className='text-gray-600'>Avance:</p> <p className='text-gray-700 ml-1 font-semibold'>{proyecto.PORCENTAJE_AVANCE}%</p> </a>
                        </div>
                      </div>
                      <div className="bg-blue-100 w-full h-4 rounded">
                        <div
                          className="bg-blue-600 h-4 rounded"
                          style={{ width: `${parseInt(proyecto.PORCENTAJE_AVANCE)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
              }
            </div>
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
