import { Link } from "react-router-dom"

import useAuth from "../hooks/useAuth"
import useProyectos from "../hooks/useProyectos"


export default function ProyectoPreview({proyecto}) {
    const { nombre, _id, cliente, creador} = proyecto

    const {auth} = useAuth();

  return (
    <div className="border-b-4 border-sky-600 p-5 flex justify-between flex-col md:flex-row">
      <div className="flex gap-2">
        <p className="flex-1 font-bold">{nombre}<span className="font-normal text-sm text-gray-500 uppercase">{''} {cliente}</span></p>
        {auth._id !== creador && <p className="p-1 text-xs rounded-lg text-white bg-emerald-600 font-bold uppercase">Colaborador</p>}
      </div>

        <Link to={`${_id}`} className="text-gray-400 hover:text-gray-800 uppercase text-sm font-bold">Ver Proyecto</Link>
    </div>
  )
}
