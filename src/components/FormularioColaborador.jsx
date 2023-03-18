
import { useState } from "react";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";


export default function FormularioColaborador() {
    const [ email, setEmail ] = useState('')

    const { mostrarAlerta, alerta, submitColaborador } = useProyectos();


    const handleSubmit = (e) => {
        e.preventDefault();
        if(email === ''){
            mostrarAlerta({msg:'El email es obligatorio', error:true})
            return;
        }
        submitColaborador(email)
    
    }
const {msg} = alerta;
  return (
    <form onSubmit={handleSubmit} className="bg-white py-10 shadow rounded-lg w-full md:w-1/2 px-5">
        {msg && <Alerta alerta={alerta}/>}
        <div className="mt-3 mb-5">
            <label className='text-gray-700 uppercase font-bold text-sm' htmlFor="email">Email del Colaborador</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className='border-2 w-full p-2 mt-2 placerholder-gray-400 rounded-md' placeholder='Email del colaborador' id="email" type="email" />
        </div>
        <input type="submit" className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm' value="Buscar"/>
    </form>
  )
}
