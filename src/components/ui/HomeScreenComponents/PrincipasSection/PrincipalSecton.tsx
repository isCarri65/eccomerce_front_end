import { useState } from "react";
import mainImage from "../../../../assets/homeImages/HomeImage.webp";

export const PrincipalSection = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className="bg-black h-[32vw] relative">
      <div
        className={`bg-center bg-no-repeat w-full h-full flex justify-start items-center opacity-60`}
        style={{
          backgroundImage: `url(${mainImage})`,
          backgroundSize: "cover",
        }}
      ></div>
      <div className="w-full h-full position absolute left-0 top-0 flex justify-around  items-center ">
        <div className="text-white w-[24%]  flex flex-col gap-4 left-[12rem] top-[25%]">
          <p className="xl:text-4xl lg:text-4xl text-2xl font-semibold">
            La mejor calidad con el mejor confort
          </p>
          <div className="text-lg xl:text-xl lg:text-xl text-sm">
            <p
              style={{
                fontFamily: "Open Sans, sans serif",
              }}
            >
              Explora diferentes categorias y encuantra lo que buscabas
            </p>
            <button
              className="text-white font-medium bg-[var(--primary-color)] px-4 py-2 rounded hover:bg-gray-800 transition duration-300 ease-in-out "
              style={{
                fontFamily: "Open Sans, sans serif",
              }}
            >
              Compra Ahora
            </button>
          </div>
        </div>
        <div className="w-[24%]"></div>
      </div>
    </div>
  );
};
