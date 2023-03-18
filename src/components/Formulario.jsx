import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";

import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta";

export default function Formulario() {
    const [ id, setId ] = useState(null)
    const [ nombre, setNombre ] = useState('');
    const [ descripcion, setDescripcion ] = useState('')
    const [ fechaEntrega, setFechaEntrega ] = useState('')
    const [ cliente, setCliente ] = useState('')

    const params = useParams();
    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();

    useEffect(() => {
        const { _id, nombre, descripcion, cliente, fechaEntrega} = proyecto;
        if(params.id){
        setId(_id)
        setNombre(nombre);
        setDescripcion(descripcion);
        setFechaEntrega(fechaEntrega?.split('T')[0]);
        setCliente(cliente);
      }
    

    }, [params])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if([nombre,descripcion,fechaEntrega,cliente].includes('')){
            mostrarAlerta({msg:'Todos los campos son obligatorios', error:true})
            return;
          }
          await submitProyecto({id, nombre,descripcion,fechaEntrega,cliente})
          setId(null)
          setNombre('')
          setDescripcion('')
          setFechaEntrega('')
          setCliente('')

    }

    const {msg} = alerta;
  return (
    <form onSubmit={handleSubmit} className='bg-white py-10 px-5 md:w1-2 rounded-lg shadow'>
        {msg && <Alerta alerta={alerta}/>}

        <div className="my-5">
            <label htmlFor="nombre" className='text-gray-700 uppercase font-bold text-sm'>Nombre proyecto</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} id="nombre" type="text" className='border w-full p-2 mt-5 placeholder-gray-400 rounded-md' placeholder='Nombre del Proyecto'/>
        </div>
        <div className="mb-5">
            <label htmlFor="descripcion" className='text-gray-700 uppercase font-bold text-sm'>Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} id="descripcion" type="text" className='border w-full p-2 mt-5 placeholder-gray-400 rounded-md' placeholder='Descripción del Proyecto'/>
        </div>
        <div className="mb-5">
            <label htmlFor="fecha-entregas" className='text-gray-700 uppercase font-bold text-sm'>Fecha de Entrega</label>
            <input value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} id="fecha-entrega" type="date" className='border w-full p-2 mt-5 placeholder-gray-400 rounded-md'/>
        </div>
        <div className="mb-5">
            <label htmlFor="nombre" className='text-gray-700 uppercase font-bold text-sm'>Cliente del proyecto</label>
            <input value={cliente} onChange={e => setCliente(e.target.value)} id="cliente" type="text" className='border w-full p-2 mt-5 placeholder-gray-400 rounded-md' placeholder='cliente del Proyecto'/>
        </div>
        <input type="submit" value={params.id ? 'Actualizar Proyecto' : 'Crear Proyecto'}className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-800 transition-colors" />
    </form>
  )
}
