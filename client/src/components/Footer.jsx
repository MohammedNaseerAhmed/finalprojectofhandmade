export default function Footer(){
  return (
    <footer className="mt-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} HandmadeWorld. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-cyan-300">Privacy</a>
          <a href="#" className="hover:text-cyan-300">Terms</a>
          <a href="#" className="hover:text-cyan-300">Contact</a>
        </div>
      </div>
    </footer>
  )
}


