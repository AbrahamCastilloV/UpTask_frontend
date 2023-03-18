import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";


export default function Colaborador({colaborador}) {
    const {nombre, email} = colaborador;
    

    const { handleModalEliminarColaborador, modalEliminarColaborador } = useProyectos();
    const admin = useAdmin();

  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div>
            <p>{nombre}</p>
            <p className="text-sm text-gray-700">{email}</p>
        </div>

        <div>
            {admin && <button onClick={() => handleModalEliminarColaborador(colaborador)} type="button" className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">Eliminar</button>}
        </div>
    </div>
  )
}
