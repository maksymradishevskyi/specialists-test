import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonRange,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useMemo } from 'react';
import { AGE_RANGE, PRICE_RANGE } from '../constants';
import type { Filters } from '../types';

type FiltersModalProps = {
  isOpen: boolean;
  draftFilters: Filters;
  onDraftChange: (updater: (prev: Filters) => Filters) => void;
  onClose: () => void;
  onClear: () => void;
  onApply: () => void;
  total: number | null;
  specialistsLength: number;
};

const FiltersModal = ({
  isOpen,
  draftFilters,
  onDraftChange,
  onClose,
  onClear,
  onApply,
  total,
  specialistsLength
}: FiltersModalProps) => {
  const draftFiltersCount = useMemo(
    () =>
      [
        draftFilters.minAge,
        draftFilters.maxAge,
        draftFilters.genders?.length ? 'gender' : undefined,
        draftFilters.minPrice,
        draftFilters.maxPrice
      ].filter((value) => value !== undefined && value !== null && value !== '').length,
    [draftFilters]
  );

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar className="filters-toolbar">
          <IonButton slot="start" fill="clear" className="filters-back" onClick={onClose}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle className="filters-title">Filters</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="filters-sheet">
        <div className="filters-wrapper">
          <div className="filter-group">
            <div className="filter-label">
              <span>Price per session</span>
              <span className="range-value">
                ${draftFilters.minPrice ?? PRICE_RANGE.min} – ${draftFilters.maxPrice ?? PRICE_RANGE.max}
              </span>
            </div>
            <IonRange
              dualKnobs
              min={PRICE_RANGE.min}
              max={PRICE_RANGE.max}
              step={5}
              value={{
                lower: draftFilters.minPrice ?? PRICE_RANGE.min,
                upper: draftFilters.maxPrice ?? PRICE_RANGE.max
              }}
              onIonChange={(e) => {
                const value = e.detail.value;
                if (typeof value === 'object' && value !== null) {
                  onDraftChange((prev) => ({
                    ...prev,
                    minPrice: value.lower,
                    maxPrice: value.upper
                  }));
                }
              }}
            />
          </div>

          <div className="filter-group">
            <div className="filter-label">
              <span>Gender</span>
            </div>
            <div className="gender-row">
              <button
                type="button"
                className={`gender-chip ${draftFilters.genders?.includes('man') ? 'active' : ''}`}
                onClick={() =>
                  onDraftChange((prev) => {
                    const current = new Set(prev.genders ?? []);
                    if (current.has('man')) {
                      current.delete('man');
                    } else {
                      current.add('man');
                    }
                    return { ...prev, genders: Array.from(current) };
                  })
                }
              >
                <span role="img" aria-hidden="true">
                  👨
                </span>
                <span>Man</span>
              </button>
              <button
                type="button"
                className={`gender-chip ${draftFilters.genders?.includes('woman') ? 'active' : ''}`}
                onClick={() =>
                  onDraftChange((prev) => {
                    const current = new Set(prev.genders ?? []);
                    if (current.has('woman')) {
                      current.delete('woman');
                    } else {
                      current.add('woman');
                    }
                    return { ...prev, genders: Array.from(current) };
                  })
                }
              >
                <span role="img" aria-hidden="true">
                  👩
                </span>
                <span>Woman</span>
              </button>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-label">
              <span>Age</span>
              <span className="range-value">
                {draftFilters.minAge ?? AGE_RANGE.min} – {draftFilters.maxAge ?? AGE_RANGE.max}
              </span>
            </div>
            <IonRange
              dualKnobs
              min={AGE_RANGE.min}
              max={AGE_RANGE.max}
              step={1}
              value={{
                lower: draftFilters.minAge ?? AGE_RANGE.min,
                upper: draftFilters.maxAge ?? AGE_RANGE.max
              }}
              onIonChange={(e) => {
                const value = e.detail.value;
                if (typeof value === 'object' && value !== null) {
                  onDraftChange((prev) => ({
                    ...prev,
                    minAge: value.lower,
                    maxAge: value.upper
                  }));
                }
              }}
            />
          </div>

          <div className="filters-actions modern">
            <IonButton fill="clear" onClick={onClear} className="clear-btn">
              Clear all
            </IonButton>
            <IonButton expand="block" onClick={onApply} className="show-btn">
              {draftFiltersCount > 0 ? `Show (${total ?? specialistsLength})` : 'Show'}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default FiltersModal;

