import { useRef, useState } from "react";

const ScrollableSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setScrollStart(scrollRef.current?.scrollTop || 0);
    document.body.style.userSelect = "none"; // Previene la selección accidental de texto
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current || !thumbRef.current) return;

    const deltaY = e.clientY - startY;
    const scrollHeight =
      scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    const thumbHeight =
      scrollRef.current.clientHeight - thumbRef.current.clientHeight;
    const scrollRatio = scrollHeight / thumbHeight;

    scrollRef.current.scrollTop = scrollStart + deltaY * scrollRatio;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = "auto"; // Reactiva la selección de texto
  };

  return (
    <div className="relative w-64 h-96 border border-gray-400">
      {/* Contenido Desplazable */}
      <div ref={scrollRef} className="overflow-hidden h-full p-4 bg-gray-200">
        <p>Contenido largo...</p>
        <p>Más contenido...</p>
        <p>Texto adicional...</p>
        <p>Este div tiene scroll manual.</p>
        <p>Mueve la barra lateral.</p>
        <p>La lógica ajusta el scroll.</p>
        <p>Última línea.</p>
        <p>Contenido largo...</p>
        <p>Más contenido...</p>
        <p>Texto adicional...</p>
        <p>Este div tiene scroll manual.</p>
        <p>Mueve la barra lateral.</p>
        <p>La lógica ajusta el scroll.</p>
        <p>Última línea.</p>
        <p>Contenido largo...</p>
        <p>Más contenido...</p>
        <p>Texto adicional...</p>
        <p>Este div tiene scroll manual.</p>
        <p>Mueve la barra lateral.</p>
        <p>La lógica ajusta el scroll.</p>
        <p>Última línea.</p>
        <p>Contenido largo...</p>
        <p>Más contenido...</p>
        <p>Texto adicional...</p>
        <p>Este div tiene scroll manual.</p>
        <p>Mueve la barra lateral.</p>
        <p>La lógica ajusta el scroll.</p>
        <p>Última línea.</p>
      </div>

      {/* Barra de Scroll */}
      <div className="absolute right-2 top-0 w-3 h-full bg-gray-300 rounded-lg">
        <div
          ref={thumbRef}
          className="absolute w-full h-10 bg-gray-700 rounded-lg cursor-pointer"
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Eventos Globales */}
      {isDragging && (
        <div
          className="fixed inset-0"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      )}
    </div>
  );
};

export default ScrollableSection;
