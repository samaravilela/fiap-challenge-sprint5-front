import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'

type HeaderProps = {
    showConsultasButton?: boolean
    className?: string
}

export default function Header({ showConsultasButton = true, className = '' }: HeaderProps) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onResize = () => { if (window.innerWidth > 1024) setOpen(false) }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    return (
        <header className={`bg-white shadow-md ${className}`}>
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
                <Link to="/" className="flex items-center gap-3">
                    <img src="/imagens/LOGO.png" className="h-20 md:h-22 lg:h-24" alt="Logo EaseHC" />
                    <span className="font-bold text-blue-600 text-xl md:text-2xl whitespace-nowrap"></span>
                </Link>

                <button
                    className="lg:hidden p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>

                <nav className={`absolute lg:static top-16 lg:top-0 left-0 right-0 bg-white lg:bg-transparent shadow-lg lg:shadow-none transition-all duration-300 ${open ? 'block' : 'hidden lg:block'}`}>
                    <ul className="flex flex-col lg:flex-row lg:items-center gap-1 p-4 lg:p-0">
                        <li><NavLink to="/" className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Início</NavLink></li>
                        <li><NavLink to="/about" className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Sobre Nós</NavLink></li>
                        <li><NavLink to="/features" className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Funcionalidades</NavLink></li>
                        <li><NavLink to="/solutions" className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Soluções</NavLink></li>
                        <li><NavLink to="/team" className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Equipe</NavLink></li>
                        <li><NavLink to="/faq" className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">FAQ</NavLink></li>
                        {showConsultasButton && (
                            <li className="lg:ml-4">
                                <NavLink to="/consultas" className="block px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium">
                                    Consultas
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    )
}
