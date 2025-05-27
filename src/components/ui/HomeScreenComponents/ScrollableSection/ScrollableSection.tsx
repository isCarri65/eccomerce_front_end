import SimpleBar from "simplebar-react";
import "./ScrollableSection.css";
const SimpleBarScrollbar: React.FC = () => {
  return (
    <SimpleBar
      style={{ maxHeight: 400, width: 300 }}
      forceVisible="y"
      autoHide={false}
    >
      {/* Contenido con scroll */}
      {Array.from({ length: 30 }).map((_, index) => (
        <div
          key={index}
          style={{ padding: "20px", borderBottom: "1px solid #eee" }}
        >
          Item {index + 1}
        </div>
      ))}
    </SimpleBar>
  );
};

export default SimpleBarScrollbar;

// Para instalar:
// npm install simplebar-react
// o
// yarn add simplebar-react
