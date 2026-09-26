import axios from "axios"
import Footer from "../components/Footer"
import HomePosts from "../components/HomePosts"
import Navbar from "../components/Navbar"
import { IF, URL } from "../url"
import { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Loader from '../components/Loader'
import { UserContext } from "../context/UserContext"

const FALLBACK_POSTS = [
  {
    _id: 'demo-1',
    title: 'Designing a calmer morning routine',
    desc: 'A simple morning ritual can create more focus, better energy, and a sense of control before the day begins. In this post, I share a few easy changes that worked for me and how to build a routine that feels sustainable instead of stressful.',
    photo: '1691325126464pexels-cottonbro-studio-6153354.jpg',
    username: 'Demo Writer',
    userId: 'demo-user',
    categories: ['Lifestyle', 'Productivity'],
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo-2',
    title: 'Why creative consistency beats creative intensity',
    desc: 'Most creative work is not built from dramatic bursts of inspiration. It grows from small, repeatable habits, a clear process, and steady effort. Here is how I keep my creative practice active without burning out.',
    photo: '1691325229381pexels-antonio-batinić-4164418.jpg',
    username: 'Demo Writer',
    userId: 'demo-user',
    categories: ['Creativity', 'Writing'],
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo-3',
    title: 'A beginner guide to building a personal brand online',
    desc: 'Personal branding is not about pretending to be someone else. It is about becoming clear about what you stand for and sharing useful ideas consistently. This guide breaks it down into simple steps for creators and professionals alike.',
    photo: '1691325325689pexels-anna-shvets-3683040.jpg',
    username: 'Demo Writer',
    userId: 'demo-user',
    categories: ['Business', 'Growth'],
    updatedAt: new Date().toISOString(),
  },
]

const Home = () => {
  
  const {search}=useLocation()
  // console.log(search)
  const [posts,setPosts]=useState([])
  const [noResults,setNoResults]=useState(false)
  const [loader,setLoader]=useState(true)
  const {user}=useContext(UserContext)
  // console.log(user)

  const fetchPosts=async()=>{
    setLoader(true)
    try{
      if (!URL) {
        throw new Error('No API URL configured')
      }
      const res=await axios.get(URL+"/api/posts/"+search)
      setPosts(res.data)
      setNoResults(res.data.length === 0)
    }
    catch(err){
      console.log('Using fallback posts for GitHub Pages mode:', err)
      setPosts(FALLBACK_POSTS)
      setNoResults(false)
    }
    finally{
      setLoader(false)
    }
  }

  useEffect(()=>{
    fetchPosts()

  },[search])



  return (
    
    <>
    <Navbar/>
<div className="px-8 md:px-[200px] min-h-[80vh]">
        {loader?<div className="h-[40vh] flex justify-center items-center"><Loader/></div>:!noResults?
        posts.map((post)=>(
          <>
          <Link to={user?`/posts/post/${post._id}`:"/login"}>
          <HomePosts key={post._id} post={post}/>
          </Link>
          </>
          
        )):<h3 className="text-center font-bold mt-16">No posts available</h3>}
    </div>
    <Footer/>
    </>
    
  )
}

export default Home