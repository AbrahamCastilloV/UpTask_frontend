import { Link } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import Busqueda from "./Busqueda";
import useAuth from "../hooks/useAuth";

export default function Header() {

  const { handleBuscador, cerrarSesion } = useProyectos();
  const { cerrarSesionAuth } = useAuth();

  const handleCerrarSesion = () => {
    if(confirm('¿Desea cerrar sesión?')){
      cerrarSesion();
      cerrarSesionAuth();
      localStorage.removeItem('token')
    }

  }
  return (
    <header className="px-4 py-5 bg-white border-b text-center">
        <div className="md:flex md:justify-between">
            <h2 className="text-4xl text-sky-600 font-black mb-5 md:mb-0">UpTask</h2>
            <div className="flex flex-col md:flex-row items-center gap-5">
                <button onClick={handleBuscador} type="button" className="text-white text-sm bg-sky-600 hover:bg-sky-800 p-3 rounded-md uppercase font-bold transition-colors">Buscar Proyecto</button>
                <Link to="/proyectos" className="font-bold uppercase">Proyectos</Link>
                <button onClick={handleCerrarSesion} type="button" className="text-white text-sm bg-sky-600 hover:bg-sky-800 p-3 rounded-md uppercase font-bold transition-colors">Cerrar Sesión</button>
                <Busqueda/>
            </div>
        </div>
    </header>
  )
}
