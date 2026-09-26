
const Footer = () => {
  return (
    <footer className="mt-16 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm text-slate-300 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="mb-3 text-lg font-bold text-white">Blog Market</p>
          <p>Stories that inform, inspire, and keep the conversation going.</p>
        </div>

        <div>
          <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-slate-400">Explore</p>
          <ul className="space-y-2">
            <li>Featured Blogs</li>
            <li>Most Viewed</li>
            <li>Readers Choice</li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-slate-400">Company</p>
          <ul className="space-y-2">
            <li>Forum</li>
            <li>Support</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-400">
        All rights reserved © Blog Market 2026
      </div>
    </footer>
  )
}

export default Footer