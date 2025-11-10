type HeroProps = {
  title?: string
  subtitle?: string
  className?: string
}

export default function Hero({ 
  title = "EaseHC", 
  subtitle = "Agendar, remarcar ou cancelar suas consultas e exames ficou muito mais fácil e rápido. Evite filas e ligações. Com alguns cliques, você cuida da sua saúde no seu tempo.",
  className = ''
}: HeroProps) {
  return (
    <section className={`hero ${className}`} id="home">
      <div className="container grid gap-10 items-center grid-cols-1 md:grid-cols-2">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="flex justify-center md:justify-end order-first md:order-last">
          <img 
            src="/imagens/LOGO.png" 
            className="h-64 md:h-80 lg:h-96 w-auto object-contain" 
            alt="Logo EaseHC" 
          />
        </div>
      </div>
    </section>
  )
}
