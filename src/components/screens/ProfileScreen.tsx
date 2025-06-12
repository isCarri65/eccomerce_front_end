import { useState } from 'react';
import { Button } from '../ui/Button';
import { ProfilePersonal } from './ProfilePersonal';
import { ProfileFavorites } from './ProfileFavorites';
import { ProfileHistory } from './ProfileHistory';
import styles from './ProfileScreen.module.css';

type ProfileTab = 'personal' | 'favorites' | 'history';

export const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');

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
        </div>
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}; 