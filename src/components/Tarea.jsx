import { formatearFecha } from "../helpers";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";


export default function Tarea({tarea}) {

    const {handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos();
    const admin = useAdmin();


    const {descripcion,nombre,prioridad,fechaEntrega, estado, _id} = tarea
  return (
    <div className="border-b-2 p-5 flex justify-between items-center">
        <div className="flex flex-col items-start">
            <p className="mb-1 text-xl font-bold">{nombre}</p>
            <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
            <p className="mb-1 text-sm">{formatearFecha(fechaEntrega)}</p>
            <p className="mb-1 text-gray-600">Prioridad: <span className={`${prioridad === 'Alta' ? 'text-red-600' : prioridad === "Media" ? 'text-yellow-500' : 'text-emerald-600'}  font-bold`}> {prioridad}</span></p>
            {estado && <p className="text-xs   font-bold ">Completada por: <span className="rounded-lg p-1 bg-emerald-600 uppercase text-white"> {tarea.completado.nombre}</span></p>}
        </div>
        <div className="flex flex-col md:flex-row gap-4">
            {admin && <button onClick={() => handleModalEditarTarea(tarea)} className="bg-indigo-600 px-4 py-3 uppercase font-bold text-sm text-white rounded-lg">Editar</button>}

            {<button onClick={() => completarTarea(_id)} className={`${estado ? 'bg-emerald-600' : 'bg-amber-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}>{estado ? 'Completado' : 'Incompleta'}</button>}
                 
            {admin && <button onClick={() => handleModalEliminarTarea(tarea)} className="bg-red-600 px-4 py-3 uppercase font-bold text-sm text-white rounded-lg">Eliminar</button>}
        </div>
        
    </div>
  )
}
