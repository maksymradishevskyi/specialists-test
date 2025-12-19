import { IonButton, IonIcon } from '@ionic/react';
import { funnelOutline, heart, heartOutline, swapVerticalOutline } from 'ionicons/icons';

type HeaderActionsProps = {
  activeFiltersCount: number;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  onOpenFilters: () => void;
  onOpenSort: () => void;
  onToggleFavorites: () => void;
};

const HeaderActions = ({
  activeFiltersCount,
  favoritesCount,
  showFavoritesOnly,
  onOpenFilters,
  onOpenSort,
  onToggleFavorites
}: HeaderActionsProps) => (
  <div className="actions">
    <IonButton onClick={onOpenFilters} fill="clear" className="action-btn action-badge-btn">
      <span slot="start" className="icon-with-badge">
        <IonIcon icon={funnelOutline} />
        {activeFiltersCount > 0 && (
          <span className="action-badge">
            <span className="action-badge-content">{activeFiltersCount}</span>
          </span>
        )}
      </span>
      <span>Filters</span>
    </IonButton>

    <IonButton onClick={onOpenSort} fill="clear" className="action-btn">
      <IonIcon slot="start" icon={swapVerticalOutline} />
      <span>Sort</span>
    </IonButton>

    <IonButton
      onClick={onToggleFavorites}
      fill="clear"
      className="action-btn action-badge-btn"
    >
      <span slot="start" className="icon-with-badge">
        <IonIcon icon={showFavoritesOnly ? heart : heartOutline} />
        {favoritesCount > 0 && (
          <span className="action-badge">
            <span className="action-badge-content">{favoritesCount}</span>
          </span>
        )}
      </span>
      <span>Favorites</span>
    </IonButton>
  </div>
);

export default HeaderActions;

