'use client';

import PFPCard from '../../components/pfpcard';

export default function MembersPage() {
  const beanies = [
    { name: 'Broh', src: '/pfps/broh.png', x: 'https://x.com/brohmetax' },
    { name: 'Papas', src: '/pfps/papas.png', x: 'https://x.com/papasxmeta' },
    { name: 'Nero', src: '/pfps/nero.png', x: 'https://x.com/nerometax' },
    { name: 'Rip', src: '/pfps/rip.png', x: 'https://x.com/ripmeta_x' },
    { name: 'Machine', src: '/pfps/machine.png', x: 'https://x.com/machinemetax' },
    { name: 'Frost', src: '/pfps/frost.png', x: 'https://x.com/frostymeta' },
    { name: 'Sauce', src: '/pfps/sauce.png', x: 'https://x.com/crypto_sauce' },
    { name: 'Pac', src: '/pfps/pac.png', x: 'https://x.com/PacmetaX' },
    { name: 'Bones', src: '/pfps/bones.png', x: 'https://x.com/bonesXventures' },
    { name: 'Javi', src: '/pfps/javi.png', x: 'https://x.com/javiMetax' },
    { name: 'Ned', src: '/pfps/ned.png', x: 'https://x.com/Nedmetax' },
    { name: 'Cinco', src: '/pfps/cinco.png', x: 'https://x.com/CincoXmeta' },
    { name: 'Palm', src: '/pfps/palm.png', x: 'https://x.com/doginalgm' },
    { name: 'Vip', src: '/pfps/vip.png', x: 'https://x.com/VIP3877' },
    { name: 'Teal', src: '/pfps/teal.png', x: 'https://x.com/TealMetax' },
    { name: 'VW', src: '/pfps/vw.png', x: 'https://x.com/VW_metaX' },
    { name: 'Uncle Dan', src: '/pfps/uncle dan.png', x: 'https://x.com/UncleDan1977' },
    { name: 'Butter', src: '/pfps/butter.png', x: 'https://x.com/buttermetax' },
    { name: 'Max', src: '/pfps/max.png', x: 'https://x.com/maxgigs' },
    { name: 'Nose', src: '/pfps/nose.png', x: 'https://x.com/Nose_Toes9' },
   ];

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-center text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">B.O.B Members</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-200 mb-2">Meet the Beanies</h2>
      <p className="text-md md:text-xl lg:text-2xl text-gray-400 mb-10">
        Our founding members building the future together.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-10 px-4 md:px-8 lg:px-16 max-w-6xl mx-auto">
        {beanies.map((bean, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <a
              href={bean.x}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-transform duration-300"
              title={`Follow ${bean.name} on X`}
            >
              <PFPCard src={bean.src} alt={`${bean.name}'s PFP`} />
            </a>
            <a
              href={bean.x}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-lg font-bold hover:underline"
              title={`Visit ${bean.name}'s X profile`}
            >
              {bean.name}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
