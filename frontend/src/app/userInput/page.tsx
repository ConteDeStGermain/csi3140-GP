export default function UserInput() {
  return (
    <div className="min-h-screen bg-[#858585]">
      <h1 className='text-4xl border-b-black border-b-2 ml-4 p-4 w-[600px]'>Test it!</h1>
      <div className="flex flex-row justify-center">
        <h2 className="text-2xl mt-40 mr-24">Write a message: </h2>
        <div className="flex flex-col mt-40">
          <textarea className="mb-4 bg-[#858585] w-[500px] h-[250px] border-2 border-black" />
          <div className="flex justify-end">
            <p id="msgSent">Message has been sent</p>
            <button className="bg-black w-fit hover:bg-gray-200 hover:text-black text-white py-2 px-4 rounded ml-4">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
