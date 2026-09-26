/* eslint-disable react/prop-types */
import { resolveImageUrl } from '../url'

const ProfilePosts = ({p}) => {
  // console.log(p)
  return (
    <div className="w-full flex mt-8 space-x-4">
    {/* left */}
    <div className="w-[35%] h-[200px] flex justify-center items-center">
    <img
      src={resolveImageUrl(p.photo)}
      alt=""
      onError={(e) => {
        e.target.onerror = null
        e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
      }}
      className="h-full w-full object-cover"
    />
    </div>
    {/* right */}
    <div className="flex flex-col w-[65%]">
      <h1 className="text-xl font-bold md:mb-2 mb-1 md:text-2xl">
      {p.title}
      </h1>
      <div className="flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between md:mb-4">
       <p>@{p.username}</p>
       <div className="flex space-x-2">
       <p>{new Date(p.updatedAt).toString().slice(0,15)}</p>
       <p>{new Date(p.updatedAt).toString().slice(16,24)}</p>
       </div>
      </div>
      <p className="text-sm md:text-lg">{p.desc.slice(0,200)+" ...Read more"}</p>
    </div>

    </div>
  )
}

export default ProfilePosts