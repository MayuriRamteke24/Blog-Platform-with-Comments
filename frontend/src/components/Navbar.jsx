import { Link, useLocation, useNavigate } from "react-router-dom"
import { BsSearch } from 'react-icons/bs'
import { FaBars } from 'react-icons/fa'
import { useContext, useState } from "react"
import Menu from "./Menu"
import { UserContext } from "../context/UserContext"

const Navbar = () => {
  const [prompt, setPrompt] = useState("")
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  const path = useLocation().pathname
  const { user } = useContext(UserContext)

  const handleSearch = () => {
    if (prompt.trim()) {
      navigate(`/?search=${encodeURIComponent(prompt.trim())}`)
      return
    }
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-black text-white shadow-lg shadow-blue-500/30">
            P
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-900">Piyu</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Stories & Ideas</p>
          </div>
        </Link>

        {path === "/" && (
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
              <BsSearch className="text-slate-400" />
              <input
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Search a post"
                type="text"
                value={prompt}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch()
                }}
              />
              <button
                onClick={handleSearch}
                className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </div>
        )}

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/write" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600">
                Write
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenu(!menu)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:bg-white"
                >
                  <FaBars />
                </button>
                {menu && <Menu onClose={() => setMenu(false)} />}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
                Register
              </Link>
            </>
          )}
        </div>

        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() => setMenu(!menu)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
          >
            <FaBars />
          </button>
          {menu && <Menu onClose={() => setMenu(false)} mobile />}
        </div>
      </div>
    </header>
  )
}

export default Navbar