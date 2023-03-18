import useProyectos from "../hooks/useProyectos";
import ProyectoPreview from "../components/ProyectoPreview";
import Alerta from "../components/Alerta";

let socket;

export default function Proyectos() {
    const { proyectos, alerta } = useProyectos();
    
    const{msg} = alerta
  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>
      {msg && <Alerta alerta={alerta}/>}
      <div className="bg-white shadow mt-10 rounded-lg">
        {proyectos.length ? proyectos.map(proyecto=>(
          <ProyectoPreview proyecto={proyecto} key={proyecto._id}/>
        )) : <p className="text-center text-gray-600 uppercase p-5">No hay proyectos</p>}
        
      </div>
    </>
  )
}
