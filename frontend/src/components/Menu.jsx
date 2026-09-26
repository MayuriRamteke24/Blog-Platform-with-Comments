import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import { URL } from "../url"
import { Link, useNavigate } from "react-router-dom"

const Menu = ({ onClose, mobile }) => {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get(URL + "/api/auth/logout", { withCredentials: true })
      setUser(null)
      onClose?.()
      navigate('/login')
    } catch (err) {
      console.log(err)
    }
  }

  const menuItems = [
    user && { label: 'Profile', to: `/profile/${user._id}` },
    user && { label: 'Write', to: '/write' },
    user && { label: 'My Blogs', to: `/myblogs/${user._id}` },
    !user && { label: 'Login', to: '/login' },
    !user && { label: 'Register', to: '/register' },
  ].filter(Boolean)

  return (
    <div
      className={`absolute z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ${
        mobile ? 'right-0 top-12 w-52' : 'right-0 top-12 w-52'
      }`}
    >
      <div className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
          >
            {item.label}
          </Link>
        ))}

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  )
}

export default Menu