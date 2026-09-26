import { Link, useLocation } from "react-router-dom"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import { URL } from "../url"
import HomePosts from "../components/HomePosts"
import Loader from "../components/Loader"


const MyBlogs = () => {
    const {search}=useLocation()
  // console.log(search)
  const [posts,setPosts]=useState([])
  const [noResults,setNoResults]=useState(false)
  const [loader,setLoader]=useState(true)
  const {user}=useContext(UserContext)
  // console.log(user)

  const fetchPosts=async()=>{
    if (!user?._id) {
      setPosts([])
      setNoResults(true)
      setLoader(false)
      return
    }

    setLoader(true)
    try{
      const res=await axios.get(URL+"/api/posts/user/"+user._id)
      setPosts(res.data)
      setNoResults(res.data.length === 0)
    }
    catch(err){
      console.log(err)
      setPosts([])
      setNoResults(true)
    }
    finally{
      setLoader(false)
    }
  }

  useEffect(()=>{
    fetchPosts()

  },[search])

  return (
    <div>
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
    </div>
  )
}

export default MyBlogs