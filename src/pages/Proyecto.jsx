import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import io from 'socket.io-client'

import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import ModalEliminarTarea from "../components/ModalEliminarModal";
import Spinner from "../components/Spinner";
import Tarea from "../components/Tarea"; 
import Colaborador from "../components/Colaborador";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";

let socket;

export default function Proyecto() {

    const {obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyectos, eliminarTareaProyecto, editarTareaProyecto, cambiarEstadoTarea } = useProyectos();
    const params = useParams();

    const admin = useAdmin();

    useEffect(() => {
        obtenerProyecto(params.id);
    }, [])

    useEffect(() => {
      socket = io(import.meta.env.VITE_BACKEND_URL);
      socket.emit('abrir proyecto', params.id)
    },[])

    useEffect(() => {
        socket.on('tarea agregada', (tareaNueva) => {
            if(tareaNueva.proyecto === proyecto._id){
                submitTareasProyectos(tareaNueva)
            }
        })
        socket.on('tarea eliminada', (tareaEliminada) => {
            if(tareaEliminada.proyecto === proyecto._id){
                eliminarTareaProyecto(tareaEliminada)
            }
        })
        socket.on('tarea actualizada', (tareaActualizada) => {
            if(tareaActualizada.proyecto._id === proyecto._id){
                editarTareaProyecto(tareaActualizada)
            }
        })
        socket.on('nuevo estado', (nuevoEstadoTarea) => {
            if(nuevoEstadoTarea.proyecto._id === proyecto._id){
                cambiarEstadoTarea(nuevoEstadoTarea)
            }
        })
    },)
    
    const {msg} = alerta;
    
    if (cargando) return <Spinner/>
  return (
   
    <>
        <div className="flex justify-between items-center">
            <h1 className="font-black text-3xl ">{proyecto.nombre}</h1>
            {admin &&<div className="">
                <div className="mb-2 flex items-center gap-2 text-gray-400 hover:text-emerald-600 font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                     <Link to={`/proyectos/editar/${params.id}`} className='uppercase font-bold'>Editar</Link>
                </div>
            </div>}
        </div>
        
        { admin && <button onClick={handleModalTarea} type="button" className="mt-5 text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 hover:bg-sky-600 cursor-pointer text-white text-center flex gap-3 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        Nueva Tarea
        </button>}

        <p className="font-black text-2xl mt-10 mb-5">Tareas del proyecto</p>

        <div className="bg-white shadow mt-5 rounded-lg">
            {proyecto.tareas?.length ? 
            proyecto.tareas?.map(tarea =>(
                <Tarea key={tarea._id} tarea={tarea}/>
            ))
            : <p className="text-center my-10 p-10">No hay tareas en éste proyecto</p>}
        </div>

        <div className="flex items-center justify-between mt-10">
            <p className="font-black text-2xl mt-10 mb-5">Colaboradores</p>
            <Link to={`/proyectos/colaboradores/${proyecto._id}`} className='text-gray-400 uppercase hover:text-emerald-600 font-bold'>Añadir</Link>
        </div>

        <div className="bg-white shadow mt-5 rounded-lg">
            {proyecto.colaboradores?.length ? 
            proyecto.colaboradores?.map(colaborador =>(
                <Colaborador key={colaborador._id} colaborador={colaborador}/>
            ))
            : <p className="text-center my-10 p-10">No hay colaboradores en éste proyecto</p>}
        </div>

        <ModalFormularioTarea />
        <ModalEliminarTarea />
        <ModalEliminarColaborador />
    </>

    )
  
}
