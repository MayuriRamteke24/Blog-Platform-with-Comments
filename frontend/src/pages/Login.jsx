import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import { useContext, useState } from "react"
import axios from "axios"
import { URL } from "../url"
import { UserContext } from "../context/UserContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post(URL + "/api/auth/login", { email, password }, { withCredentials: true })
      setUser(res.data)
      navigate("/")
    } catch (err) {
      setError(true)
      console.log(err)
    }
  }

  return (
    <>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-black tracking-tight text-slate-900">Blog Market</Link>
        <Link to="/register" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600">
          Register
        </Link>
      </nav>

      <div className="flex min-h-[78vh] items-center justify-center px-4 py-10 sm:px-6">
        <div className="glass-card soft-shadow w-full max-w-md rounded-[28px] p-6 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-black text-white">
              B
            </div>
            <h1 className="text-2xl font-black text-slate-900">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">Log in to continue reading and writing stories.</p>
          </div>

          <div className="space-y-4">
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              type="text"
              placeholder="Enter your email"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              type="password"
              placeholder="Enter your password"
            />
            <button
              onClick={handleLogin}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-lg font-bold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95"
            >
              Log in
            </button>
            {error && <h3 className="text-sm font-medium text-red-500">Something went wrong. Please try again.</h3>}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600">
            <p>New here?</p>
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">Register</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Login