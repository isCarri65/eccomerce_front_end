import styles from "./DynamicImagesInput.module.css";

interface Props {
  images: string[];
  setImages: (imgs: string[]) => void;
  label?: string;
}

export const DynamicImagesInput = ({ images, setImages, label = "Imágenes" }: Props) => {
  const handleChange = (idx: number, value: string) => {
    const newImages = [...images];
    newImages[idx] = value;
    setImages(newImages);
  };

  const handleAdd = () => setImages([...images, ""]);
  const handleRemove = (idx: number) => setImages(images.filter((_, i) => i !== idx));

  return (
    <div className={styles.imagesSection}>
      <label className={styles.label}>{label} (URL):</label>
      {images.map((img, idx) => (
        <div key={idx} className={styles.imgRow}>
          <input
            type="text"
            value={img}
            onChange={e => handleChange(idx, e.target.value)}
            placeholder="https://.../imagen.png"
            className={styles.input}
          />
          <button type="button" className={styles.removeBtn} onClick={() => handleRemove(idx)}>🗑️</button>
          {img && <img src={img} alt="preview" className={styles.previewImg} />}
        </div>
      ))}
      <button type="button" className={styles.addBtn} onClick={handleAdd}>Agregar imagen</button>
    </div>
  );
};
