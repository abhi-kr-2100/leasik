export default function HomeHero() {
  return (
    <div className="flex flex-col h-screen bg-emerald-400 pl-[10%] pt-[17%] text-white">
      <main className="mb-10">
        <h1 className="text-8xl mb-1">Leasik</h1>
        <p className="pl-2 text-2xl">Learn languages in context</p>
      </main>
      <footer>
        <p className="pl-2 text-xl">
          Created by{" "}
          <a
            href="https://github.com/abhi-kr-2100"
            target="_blank"
            rel="noreferrer"
            className="underline font-black hover:italic"
          >
            abhi-kr-2100
          </a>
        </p>
      </footer>
    </div>
  );
}
