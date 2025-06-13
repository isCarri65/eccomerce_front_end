import { useState } from 'react';
import { useUserStore } from '../../../stores/userStore';
import { ProfilePersonal } from './ProfilePersonal';
import { ProfileFavorites } from './ProfileFavorites';
import { ProfileHistory } from './ProfileHistory';
import { AdminProducts } from './AdminProducts';
import { AdminDiscounts } from './AdminDiscounts';
import styles from './ProfileScreen.module.css';

type ProfileTab = 'personal' | 'favorites' | 'history' | 'products' | 'discounts' | 'admins';

export const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const { currentUserProfile } = useUserStore();
  const isAdmin = currentUserProfile?.role === 'ADMIN';

  const renderContent = () => {
    return (
      <div className={styles.tabContentCard}>
        {(() => {
          switch (activeTab) {
            case 'personal':
              return <ProfilePersonal />;
            case 'favorites':
              return <ProfileFavorites />;
            case 'history':
              return <ProfileHistory />;
            case 'products':
              return <AdminProducts />;
            case 'discounts':
              return <AdminDiscounts />;
            case 'admins':
              return <div style={{textAlign:'center',padding:'2rem'}}>Gestión de Administradores (solo admin)</div>;
          }
        })()}
      </div>
    );
  };

  return (
    <div className={styles.profileScreenWrapper}>
      <div className={styles.profileScreenContent}>
        <div className={styles.tabNavBar}>
          <button
            className={activeTab === 'personal' ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
            onClick={() => setActiveTab('personal')}
          >
            Datos Personales
          </button>
          <button
            className={activeTab === 'favorites' ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
            onClick={() => setActiveTab('favorites')}
          >
            Favoritos
          </button>
          <button
            className={activeTab === 'history' ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
            onClick={() => setActiveTab('history')}
          >
            Historial
          </button>
          {isAdmin && (
            <>
              <button
                className={activeTab === 'products' ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
                onClick={() => setActiveTab('products')}
              >
                Productos
              </button>
              <button
                className={activeTab === 'discounts' ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
                onClick={() => setActiveTab('discounts')}
              >
                Descuentos
              </button>
              <button
                className={activeTab === 'admins' ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
                onClick={() => setActiveTab('admins')}
              >
                Admins
              </button>
            </>
          )}
        </div>
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}; 