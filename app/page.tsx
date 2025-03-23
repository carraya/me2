import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col pt-6 sm:pt-8 md:pt-12 px-4 sm:px-8 md:px-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-[family-name:var(--font-playfair)] leading-tight sm:leading-tight md:leading-relaxed max-w-[90%] md:max-w-[80%] lg:max-w-[70%] font-medium">
        <span className="font-extrabold">Chris</span> is a Morehead-Cain scholar building the <em>future of living</em> in San Francisco and New York.
      </h1>

      {/* Contact buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-14 self-start">
        <a
          href="mailto:arraya.christopher@gmail.com"
          className="inline-block w-full sm:w-auto px-4 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 border border-dashed border-[#35353433] hover:bg-[#35353408] text-center font-medium tracking-wider text-[#353534bb] text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5"
        >
          CONTACT ME
        </a>
        <a
          href="https://x.com/cjarrayadev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full sm:w-auto px-4 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 border border-dashed border-[#35353433] hover:bg-[#35353408] text-center font-medium tracking-wider text-[#353534bb] text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5"
        >
          TWITTER
        </a>
        <a
          href="https://www.linkedin.com/in/cjarraya"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full sm:w-auto px-4 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 border border-dashed border-[#35353433] hover:bg-[#35353408] text-center font-medium tracking-wider text-[#353534bb] text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5"
        >
          LINKEDIN
        </a>
      </div>

      {/* Three images in a row with border top and bottom */}
      <div className="w-full mt-12 sm:mt-16 md:mt-20 lg:mt-24 relative">
        {/* Top full-width dotted line container */}
        <div className="full-width-border"></div>

        {/* Image grid container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 mb-8">
          {/* UNC Image */}
          <div className="relative flex flex-col">
            <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden rounded-sm location-image-container">
              <Image
                src="/unc.png"
                alt="UNC Chapel Hill campus"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="location-hover-text">CH</div>
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                       radial-gradient(ellipse at center, transparent 90%, var(--background) 100%),
                       linear-gradient(to top, var(--background), transparent 10%, transparent 90%, var(--background)),
                       linear-gradient(to left, var(--background), transparent 10%, transparent 90%, var(--background))
                     `
                }}>
              </div>
            </div>
          </div>

          {/* Golden Gate Image */}
          <div className="relative flex flex-col">
            <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden rounded-sm location-image-container">
              <Image
                src="/goldengate.png"
                alt="Golden Gate Bridge above the clouds"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="location-hover-text">SF</div>
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                       radial-gradient(ellipse at center, transparent 90%, var(--background) 100%),
                       linear-gradient(to top, var(--background), transparent 10%, transparent 90%, var(--background)),
                       linear-gradient(to left, var(--background), transparent 10%, transparent 90%, var(--background))
                     `
                }}>
              </div>
            </div>
          </div>

          {/* NYC Image */}
          <div className="relative flex flex-col">
            <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden rounded-sm location-image-container">
              <Image
                src="/nyc.png"
                alt="New York City skyline"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="location-hover-text">NYC</div>
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                       radial-gradient(ellipse at center, transparent 90%, var(--background) 100%),
                       linear-gradient(to top, var(--background), transparent 10%, transparent 90%, var(--background)),
                       linear-gradient(to left, var(--background), transparent 10%, transparent 90%, var(--background))
                     `
                }}>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom full-width dotted line container */}
        <div className="full-width-border bottom-0"></div>
      </div>
    </main >
  );
}
