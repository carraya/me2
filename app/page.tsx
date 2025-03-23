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
    </main>
  );
}
