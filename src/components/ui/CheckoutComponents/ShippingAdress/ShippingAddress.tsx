import React, { useState } from 'react';
import styles from './ShippingAddress.module.css';
import { IUser } from '../../../../types/User/IUser';
import { Address } from '../../../../types/Address/IAddress';

interface ShippingAddressProps {
  onAddressConfirmed: (useCurrent: boolean) => void;
  user: IUser | null;
  address: Address | null;
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({ onAddressConfirmed, user, address }) => {
  const [useCurrentAddress, setUseCurrentAddress] = useState(true);
  const [showContinueButton, setShowContinueButton] = useState(false); // New state for continue button

  // Hardcoded address details
  const userAddress = {
    name: user?.name,
    lastName: user?.lastName,
    street: address?.street,
    city: address?.locality,
    province: address?.province,
    zip: address?.cp,
  };

  const handleYesClick = () => {
    setUseCurrentAddress(true);
    setShowContinueButton(true); // Show continue button after choosing 'Sí'
  };

  const handleNoClick = () => {
    setUseCurrentAddress(false);
    setShowContinueButton(true); // Show continue button after choosing 'No'
  };

  const handleContinueClick = () => {
    onAddressConfirmed(useCurrentAddress); // Inform parent component and pass the choice
  };

  return (
    <div className={styles.container}>
      <h3>Dirección de Envío</h3>
      {useCurrentAddress ? (
        <div className={styles.addressDetails}>
          <p>{userAddress.name} {userAddress.lastName}</p>
          <p>{userAddress.street}</p>
          <p>{userAddress.city}, {userAddress.province} - {userAddress.zip}</p>
        </div>
      ) : (
        <div className={styles.addAddressPlaceholder}>
          <p>Por favor, ingresa una nueva dirección de envío.</p>
        </div>
      )}

      <div className={styles.question}>
        <p>¿Mantener la dirección actual como envío del producto?</p>
        <div className={styles.buttons}>
          <button onClick={handleYesClick} className={styles.button}>Sí</button>
          <button onClick={handleNoClick} className={styles.button}>No</button>
        </div>
      </div>

      {showContinueButton && ( // Conditionally render continue button
        <button className={styles.continueButton} onClick={handleContinueClick}>
          Continuar
        </button>
      )}
    </div>
  );
};

export default ShippingAddress;
