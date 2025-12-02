import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function HowItWorks() {
  const { themeData, isConnected, setCurrentMainView } = useAppContext();

  return (
    <div className="relative z-10 px-5 pt-16 md:pt-4 h-full flex flex-col pb-24 overflow-auto">

      <div className="bg-white rounded-3xl shadow-lg p-5 mb-4">
        <h2 className="text-lg font-black text-slate-900 mb-4 text-center">HOW IT WORKS</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-black">1</div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-sm mb-1">PICK UP YOUR BRACELET</p>
              <p className="text-xs text-slate-600">After security, grab your smart bracelet at the distribution booth. It lights up with team colors!</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-black">2</div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-sm mb-1">BRING THE ENERGY</p>
              <p className="text-xs text-slate-600">Clap! Cheer! Fist pump! Join chants! Your bracelet tracks your fandom energy through motion and sound.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-black">3</div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-sm mb-1">EARN TOKENS</p>
              <p className="text-xs text-slate-600">Your energy automatically converts to tokens. The louder and more engaged you are, the more you earn!</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-black">4</div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-sm mb-1">REDEEM REWARDS</p>
              <p className="text-xs text-slate-600">Use tokens for exclusive offers - food, drinks, merchandise, experiences. Real rewards for real fans!</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-black">5</div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-sm mb-1">RETURN YOUR BRACELET</p>
              <p className="text-xs text-slate-600">At the end of the game, return your bracelet at the same booth. Your stats and tokens are saved!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-lg p-5 mb-4">
        <h3 className="text-base font-black text-slate-900 mb-3 text-center">REMEMBER</h3>
        <div className="space-y-2 text-center">
          <p className="text-sm font-bold text-slate-700">🏆 ANYONE CAN WIN FROM ANY SECTION</p>
          <p className="text-sm font-bold text-slate-700">🎉 BE LOUD, HAVE FUN, BE KIND</p>
          <p className="text-sm font-bold text-slate-700">⚡ MORE ENERGY = MORE TOKENS</p>
          <p className="text-sm font-bold text-slate-700">🤝 BUILD TEAM SPIRIT & UNITY</p>
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl shadow-lg p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-lg">🧪</span>
          </div>
          <h3 className="text-base font-black text-slate-900">TEST SITE FEATURES</h3>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-3">
            <p className="font-bold text-slate-900 text-sm mb-1">📱 Toggle Views</p>
            <p className="text-xs text-slate-600">Use the menu (☰) to switch between Fan View and Admin View.</p>
          </div>

          <div className="bg-white rounded-2xl p-3">
            <p className="font-bold text-slate-900 text-sm mb-1">⚡ SIMULATOR MODE</p>
            <p className="text-xs text-slate-600">Click SIMULATOR to choose fan type, crowd level, and duration for realistic data.</p>
          </div>

          <div className="bg-white rounded-2xl p-3">
            <p className="font-bold text-slate-900 text-sm mb-1">🔄 Connect Device</p>
            <p className="text-xs text-slate-600">Click the big CONNECT button to simulate bracelet connection.</p>
          </div>

          <div className="bg-white rounded-2xl p-3">
            <p className="font-bold text-slate-900 text-sm mb-1">📊 View History</p>
            <p className="text-xs text-slate-600">Click the history icon to see all past simulations from this session.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-5 mb-4">
        <h3 className="text-base font-black text-slate-900 mb-3">WHAT YOUR BRACELET TRACKS</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-3">
            <span className="text-2xl mb-1">💓</span>
            <p className="text-xs font-bold text-slate-700">Heart Rate</p>
            <p className="text-[10px] text-slate-600">Excitement levels</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-3">
            <span className="text-2xl mb-1">👏</span>
            <p className="text-xs font-bold text-slate-700">Hand Motion</p>
            <p className="text-[10px] text-slate-600">Claps & fist pumps</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-3">
            <span className="text-2xl mb-1">📢</span>
            <p className="text-xs font-bold text-slate-700">Sound Level</p>
            <p className="text-[10px] text-slate-600">Cheers & chants</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-3">
            <span className="text-2xl mb-1">🚶</span>
            <p className="text-xs font-bold text-slate-700">Movement</p>
            <p className="text-[10px] text-slate-600">Seat vs. concessions</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-lg p-5 text-white mb-4">
        <h3 className="text-base font-black mb-3">WHY THIS MATTERS</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="mt-0.5">✨</span>
            <p className="text-xs font-semibold">Creates unforgettable game moments through unity</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5">🎁</span>
            <p className="text-xs font-semibold">Rewards genuine fan passion and participation</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5">📈</span>
            <p className="text-xs font-semibold">Helps venues improve your experience with real data</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5">🤝</span>
            <p className="text-xs font-semibold">Builds stronger connections between fans and teams</p>
          </div>
        </div>
      </div>

      <div className="mt-2 mb-6">
        <button 
          onClick={() => setCurrentMainView('fan')}
          className="w-full py-4 rounded-2xl font-black text-white shadow-xl hover:scale-[1.02] transition"
          style={{ background: `linear-gradient(135deg, ${isConnected ? themeData.primaryColor : '#06b6d4'}, ${isConnected ? themeData.secondaryColor : '#0891b2'})` }}
        >
          {isConnected ? 'BACK TO APP' : 'START YOUR EXPERIENCE'}
        </button>
      </div>

      <style jsx>{`
        .overflow-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}