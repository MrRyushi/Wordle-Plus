import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()
  return (
    <div className="w-screen md:h-screen flex justify-center bg-slate-50 h-auto px-8 xs:px-12 sm:px-24 md:px-36 lg:px-48 xl:px-64 2xl:px-72 py-16 md:py-40 poppins">
      <div className="space-y-12">
        <div className="">
          <h1 className="poppins text-slate-950 teext-center text-5xl">How to Play</h1>
          <h3 className="text-2xl mt-8">Guess the word in 6 tries</h3>
          <div className="space-y-1 text-xl mt-2">
            <h4>• Each guess must be a valid 5-letter word</h4>
            <h4>• The color of the tiles will change to show how close your guess was to the word</h4>
          </div>
          <div className="space-y-2 text-xl mt-3">
            <h4>Examples</h4>
            {/* TODO: Can be converted into functions that take in a word and split it */}
            <div>
              <div className="flex space-x-2">
                <h5 className="bg-green-600 border-2 w-max p-2">W</h5>
                <h5 className="border-2 w-max p-2">E</h5>
                <h5 className="border-2 w-max p-2">A</h5>
                <h5 className="border-2 w-max p-2">R</h5>
                <h5 className="border-2 w-max p-2">Y</h5>
              </div>
              <h5><span className="font-bold">W</span> is in the word and in the correct spot</h5>
            </div>

            <div>
              <div className="flex space-x-2">
                <h5 className="border-2 w-max p-2">P</h5>
                <h5 className="bg-yellow-600 border-2 w-max p-2">I</h5>
                <h5 className="border-2 w-max p-2">L</h5>
                <h5 className="border-2 w-max p-2">L</h5>
                <h5 className="border-2 w-max p-2">S</h5>
              </div>
              <h5><span className="font-bold">I</span> is in the word but in the wrong spot</h5>
            </div>

            <div>
              <div className="flex space-x-2">
                <h5 className="border-2 w-max p-2">V</h5>
                <h5 className="border-2 w-max p-2">A</h5>
                <h5 className="border-2 w-max p-2">G</h5>
                <h5 className="bg-gray-400 border-2 w-max p-2">U</h5>
                <h5 className="border-2 w-max p-2">E</h5>
              </div>
              <h5><span className="font-bold">U</span> is not in the word in any spot</h5>
            </div>
          </div>
        </div>

        {/* TODO Can be converted into a a singular botton with the rest of the Back buttons */}
        <button className="text-xl py-2 px-6 bg-slate-900 text-slate-50 rounded-xl" onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  )
}
