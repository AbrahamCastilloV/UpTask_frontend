import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { clienteAxios } from '../config/clienteAxios';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [ auth, setAuth ] = useState({})
    const [ cargando, setCargando ] = useState(true)

    const navigate = useNavigate();

    useEffect(()=>{
        const autenticarUsuario = async () => {

            //Verifica si está el token en LS
            const token = localStorage.getItem('token');
            //Sí no hay, te regresa
            if(!token){
                setCargando(false)
                return
            };
            //Sí hay token, hacemos la configuración para validarlo
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            }
            //Intentamos pasarle la validación a esa URL
            try {
                const {data} = await clienteAxios('/usuarios/perfil', config)
                setAuth(data);
                if(data._id && location.pathname === '/') {
                    navigate('/proyectos')
                }
            } catch (error) {
                setAuth({});
            }
            setCargando(false)
        }
        autenticarUsuario()
    }, [])

    const cerrarSesionAuth = () => {
        setAuth({})
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, cargando,cerrarSesionAuth }}>
            {children}
        </AuthContext.Provider>
    )		
}
export default AuthContext;