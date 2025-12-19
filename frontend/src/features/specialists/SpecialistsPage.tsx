import type { InfiniteScrollCustomEvent, RefresherEventDetail } from '@ionic/core';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  IonToast
} from '@ionic/react';
import { heartOutline, peopleOutline } from 'ionicons/icons';
import { useEffect, useMemo, useState } from 'react';
import FiltersModal from './components/FiltersModal';
import HeaderActions from './components/HeaderActions';
import SpecialistCard from './components/SpecialistCard';
import SortSheet from './components/SortSheet';
import { defaultSort, emptyFilters } from './constants';
import { useSpecialists } from './hooks/useSpecialists';
import './specialists.css';
import type { Filters, SortOption } from './types';

const SpecialistsPage = () => {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [draftFilters, setDraftFilters] = useState<Filters>(emptyFilters);
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(defaultSort);
  const [isSortSheetOpen, setSortSheetOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const {
    specialists,
    hasMore,
    total,
    isFetching,
    isInitialLoading,
    favoriteIds,
    toggleFavorite,
    loadMore,
    refresh,
    error,
    setNextResetLimit
  } = useSpecialists(filters, sortOption);

  const activeFiltersCount = useMemo(
    () =>
      [
        filters.minAge,
        filters.maxAge,
        filters.genders?.length ? 'gender' : undefined,
        filters.minPrice,
        filters.maxPrice
      ].filter((value) => value !== undefined && value !== null && value !== '').length,
    [filters]
  );

  const subtitle = useMemo(() => {
    if (total === null) return 'Loading providers...';
    const noun = total === 1 ? 'provider is' : 'providers are';
    return `${total} ${noun} currently available`;
  }, [total]);

  const showErrorToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (error) {
      showErrorToast('Request failed. Check connection and retry.');
    }
  }, [error]);

  const visibleSpecialists = useMemo(
    () => (showFavoritesOnly ? specialists.filter((s) => favoriteIds.has(s.id)) : specialists),
    [favoriteIds, showFavoritesOnly, specialists]
  );

  const favoritesCount = useMemo(
    () =>
      activeFiltersCount > 0
        ? specialists.filter((s) => favoriteIds.has(s.id)).length
        : favoriteIds.size,
    [activeFiltersCount, favoriteIds, specialists]
  );

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refresh();
    event.detail.complete();
  };

  const handleLoadMore = async (event: InfiniteScrollCustomEvent) => {
    await loadMore();
    event.target.complete();
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setFiltersOpen(false);
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
    setFiltersOpen(false);
  };

  const handleDraftChange = (updater: (prev: Filters) => Filters) => {
    setDraftFilters((prev) => {
      const next = updater(prev);
      setFilters(next); // apply immediately so the list refreshes as users click
      return next;
    });
  };

  const openFilters = () => {
    setDraftFilters(filters);
    setFiltersOpen(true);
  };

  const isEmpty = !isInitialLoading && visibleSpecialists.length === 0 && !showFavoritesOnly;
  const isFavoritesEmpty =
    showFavoritesOnly && visibleSpecialists.length === 0 && !isInitialLoading;

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="page-container">
          <header className="header">
            <div className="top-text">
              <h1>Build healthy relationships with your partner</h1>
              <p className="subtitle">{subtitle}</p>
            </div>
            <HeaderActions
              activeFiltersCount={activeFiltersCount}
              favoritesCount={favoritesCount}
              showFavoritesOnly={showFavoritesOnly}
              onOpenFilters={openFilters}
              onOpenSort={() => setSortSheetOpen(true)}
              onToggleFavorites={() => setShowFavoritesOnly((prev) => !prev)}
            />
          </header>

          {isInitialLoading ? (
            <div className="centered">
              <IonSpinner name="crescent" />
              <IonNote>Loading providers...</IonNote>
            </div>
          ) : isFavoritesEmpty ? (
            <div className="empty">
              <IonIcon icon={heartOutline} />
              <h3>No favorites yet</h3>
              <p>Add providers to favorites to see them here.</p>
              <IonButton onClick={() => setShowFavoritesOnly(false)} size="small">
                Show all
              </IonButton>
            </div>
          ) : isEmpty ? (
            <div className="empty">
              <IonIcon icon={peopleOutline} />
              <h3>No specialists match these filters</h3>
              <p>Try adjusting age, gender, or price to see more providers.</p>
              <IonButton onClick={resetFilters} size="small">
                Reset filters
              </IonButton>
            </div>
          ) : (
            <>
              <div className="cards-stack">
                {visibleSpecialists.map((specialist) => (
                  <SpecialistCard
                    key={specialist.id}
                    specialist={specialist}
                    isFavorite={favoriteIds.has(specialist.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {!hasMore && specialists.length > 0 && (
                <IonText color="medium" className="end-of-list">
                  End of results
                </IonText>
              )}
            </>
          )}
        </div>

        <IonInfiniteScroll
          onIonInfinite={handleLoadMore}
          threshold="120px"
          disabled={!hasMore}
        >
          <IonInfiniteScrollContent loadingSpinner="crescent" loadingText="Loading more..." />
        </IonInfiniteScroll>

        <FiltersModal
          isOpen={isFiltersOpen}
          draftFilters={draftFilters}
          onDraftChange={handleDraftChange}
          onClose={() => setFiltersOpen(false)}
          onClear={resetFilters}
          onApply={applyFilters}
          total={total}
          specialistsLength={specialists.length}
        />

        <SortSheet
          isOpen={isSortSheetOpen}
          onClose={() => setSortSheetOpen(false)}
          onSelect={(option) => {
            // keep current filtered count when re-sorting
            setNextResetLimit(Math.max(specialists.length, 1));
            setSortOption(option);
            setSortSheetOpen(false);
          }}
        />

        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          color="danger"
          onDidDismiss={() => setToastMessage('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default SpecialistsPage;