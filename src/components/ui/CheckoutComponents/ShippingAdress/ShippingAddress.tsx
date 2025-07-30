import React, { useState } from "react";
import styles from "./ShippingAddress.module.css";
import { IUser } from "../../../../types/User/IUser";
import { IAddress } from "../../../../types/Address/IAddress";
import axios from "axios";
import { useUserStore } from "../../../../stores/userStore";
import { Button } from "../../ElementsHTML/Button";
import Swal from "sweetalert2";
import { ICreateAddress } from "../../../../types/Address/ICreateAddress";
import { useAddresses } from "../../../../hooks/useAddress";
import { createAddressProfile } from "../../../../api/services/AddressService";

interface ShippingAddressProps {
  onAddressConfirmed: (useCurrent: boolean) => void;
  user: IUser | null;
  addresses: IAddress[] | null;
}

const initialAddress: ICreateAddress = {
  street: "",
  number: "",
  apartment: "",
  aptNumberAndFloor: "",
  province: "",
  locality: "",
  postal: "",
};

const ShippingAddress: React.FC<ShippingAddressProps> = ({
  onAddressConfirmed,
  user,
  addresses,
}) => {
  const [useCurrentAddress, setUseCurrentAddress] = useState(true);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [form, setForm] = useState<ICreateAddress>(initialAddress);
  const { currentUserProfile } = useUserStore();
  const { handleCreateAddress } = useAddresses();

  const userAddress = {
    name: user?.name,
    lastName: user?.lastName,
    street: addresses?.street,
    city: addresses?.locality,
    province: addresses?.province,
    zip: addresses?.postal,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleYesClick = () => {
    setUseCurrentAddress(true);
    setShowContinueButton(true); // Show continue button after choosing 'Sí'
  };

  const handleNoClick = () => {
    setUseCurrentAddress(false);
  };

  const handleCancelForm = () => {
    Swal.fire({
      title: "¿No quiere agregar la direccion?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        setUseCurrentAddress(!useCurrentAddress);
      }
    });
  };
  const handleContinueClick = () => {
    onAddressConfirmed(useCurrentAddress); // Inform parent component and pass the choice
  };
  const handleSubmitAddress = async () => {
    try {
      const address = await createAddressProfile(form);
      console.log("Dirección creada:", address);
      setUseCurrentAddress(true);
      onAddressConfirmed(useCurrentAddress);
    } catch (error: any) {
      console.error(
        "Error al crear la dirección:",
        error.response?.data || error.message,
        error
      );
      alert("Error al crear la dirección");
    }
    // Inform parent component and pass the choice
  };

  return (
    <div className={styles.container}>
      <h3>Elije una direccion de envio</h3>
      {addresses && currentUserProfile ? (
        addresses.map((addressItem) => (
          <div key={addressItem.id} className={styles.addressDetails}>
            <p>
              {currentUserProfile.name} {currentUserProfile.lastName}
            </p>
            <p>
              {addressItem.street}, {addressItem.number}
            </p>
            <p>
              {addressItem.locality}, {addressItem.province} -{" "}
              {addressItem.postal}
            </p>
          </div>
        ))
      ) : (
        <div className={styles.addAddressPlaceholder}>
          <form className={styles.addressForm} onSubmit={handleSubmitAddress}>
            <div className={styles.formRow}>
              <label>Calle</label>
              <input
                name="street"
                value={form.street}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <label>Número</label>
              <input
                name="number"
                value={form.number}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <label>Apartamento</label>
              <input
                name="apartment"
                value={form.apartment}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formRow}>
              <label>Piso y Número</label>
              <input
                name="aptNumberAndFloor"
                value={form.aptNumberAndFloor}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formRow}>
              <label>Provincia</label>
              <input
                name="province"
                value={form.province}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <label>Localidad</label>
              <input
                name="locality"
                value={form.locality}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <label>Código Postal</label>
              <input
                name="postal"
                value={form.postal}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formActions}>
              <Button type="submit" variant="primary">
                Confirmar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelForm}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}
      {useCurrentAddress ? (
        <div className={styles.question}>
          <p>¿Mantener la dirección actual como envío del producto?</p>
          <div className={styles.buttons}>
            <button onClick={handleYesClick}>Sí</button>
            <button onClick={handleNoClick} className={styles.button}>
              No
            </button>
          </div>
        </div>
      ) : (
        ""
      )}

      {showContinueButton ? ( // Conditionally render continue button
        <button className={styles.continueButton} onClick={handleContinueClick}>
          Continuar
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default ShippingAddress;
