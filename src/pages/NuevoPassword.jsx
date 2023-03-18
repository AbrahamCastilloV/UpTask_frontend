import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom";
import { clienteAxios } from "../config/clienteAxios"

import Alerta from "../components/Alerta";

export default function NuevoPassword() {
  const [ cuentaConfirmada, setCuentaConfirmada ] = useState(false)
  const [ password, setPassword ] = useState('');
  const [ repetirPassword, setRepetirPassword ] = useState('');
  const [ alerta, setAlerta ] = useState({});

  const params = useParams();

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/olvide-password/${params.token}`
        const {data} = await clienteAxios(url);
        setAlerta({msg:data.msg});
        setCuentaConfirmada(true)
      } catch (error) {
        setAlerta({msg:error.response.data.msg, error:true});
      }
    }
    confirmarCuenta();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if([password,repetirPassword].includes('')){
      setAlerta({msg:'Todos los campos son obligatorios', error:true})
      return;
    }
    if(password.length  < 6){
      setAlerta({msg:'La contraseña es de mínimo 6 caracteres', error:true})
      return;
    }
    if(password !== repetirPassword){
      setAlerta({msg:'Las contraseñas no son iguales', error:true})
      return;
    }

     //Crear Usuario
    try {
      const {data} = await clienteAxios.post(`/usuarios/olvide-password/${params.token}`, {password} );
      setAlerta({msg:data.msg});
      setCuentaConfirmada(false)
    } catch (error) {
        setAlerta({msg:error.response.data.msg, error:true});
    } 
  }

  const {msg} = alerta;

  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">Reestablece tu password y no pierdas acceso a tus {''}<span className="text-slate-700">proyectos</span></h1>
        <form  onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">
          {msg && <Alerta alerta={alerta}/>}
          {cuentaConfirmada && ( 
            <>
            <div className="my-5">
                <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">password: </label>
                <input value={password} onChange={e => setPassword(e.target.value)} id="password" type="password" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" placeholder="Escribe tu nuevo password"/>
            </div>
            <div className="my-5">
                <label htmlFor="password2" className="uppercase text-gray-600 block text-xl font-bold">repetir password: </label>
                <input value={repetirPassword} onChange={e => setRepetirPassword(e.target.value)} id="password2" type="password" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" placeholder="Repite tu nuevo password"/>
            </div>
            <input type="submit" value='Confirmar Password' className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:bg-sky-800 cursor-pointer transition-colors mb-5" />
            </>
          )}
        </form>
        <Link to="/" className="block text-center my-5 text-slate-500 uppercase font-bold underline">Inicia Sesión</Link>
    </>
  )
}
