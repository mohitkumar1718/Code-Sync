import Avatar from 'react-avatar';
const Client = ({username}) => {
  
  return (
    <div className='mx-2'>
     <Avatar className={"rounded-md mb-1"}  name={username}  size="40" textSizeRatio={1.75} />
       <span className='text-white ml-1'>{username}</span>
    </div>
  )
}

export default Client