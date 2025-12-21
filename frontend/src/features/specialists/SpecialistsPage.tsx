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
import { useFavorites } from './hooks/useFavorites';
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
    isInitialLoading,
    favoriteIds,
    toggleFavorite,
    loadMore,
    refresh,
    error
  } = useSpecialists(filters, sortOption);

  const favoriteIdsArray = useMemo(() => Array.from(favoriteIds), [favoriteIds]);

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

  const enableFavoritesData = showFavoritesOnly || activeFiltersCount > 0;

  const {
    favorites,
    hasMore: favoritesHasMore,
    total: favoritesTotal,
    isInitialLoading: favoritesInitialLoading,
    error: favoritesError,
    loadMore: loadMoreFavorites,
    refresh: refreshFavorites
  } = useFavorites(filters, sortOption, favoriteIdsArray, enableFavoritesData);

  const visibleSpecialists = useMemo(
    () => (showFavoritesOnly ? favorites : specialists),
    [favorites, showFavoritesOnly, specialists]
  );

  const usingFavorites = showFavoritesOnly;

  const listError = usingFavorites ? favoritesError : error;
  const listTotal = usingFavorites ? favoritesTotal : total;
  const listIsInitialLoading = usingFavorites ? favoritesInitialLoading : isInitialLoading;
  const listHasMore = usingFavorites ? favoritesHasMore : hasMore;

  const subtitle = useMemo(() => {
    if (listError && visibleSpecialists.length === 0) return 'Unable to load providers';
    if (listTotal === null) return 'Loading providers...';
    const noun = listTotal === 1 ? 'provider is' : 'providers are';
    return `${listTotal} ${noun} currently available`;
  }, [listError, listTotal, visibleSpecialists.length]);

  const showErrorToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (listError) {
      showErrorToast('Request failed. Check connection and retry.');
    }
  }, [listError]);

  const favoritesCount = useMemo(() => {
    if (enableFavoritesData) {
      if (favoritesTotal !== null) return favoritesTotal;
      return favorites.length;
    }
    return favoriteIds.size;
  }, [enableFavoritesData, favoriteIds.size, favorites.length, favoritesTotal]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    if (usingFavorites) {
      await refreshFavorites();
    } else {
      await refresh();
    }
    event.detail.complete();
  };

  const handleLoadMore = async (event: InfiniteScrollCustomEvent) => {
    if (usingFavorites) {
      await loadMoreFavorites();
    } else {
      await loadMore();
    }
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

  const isOfflineEmpty = !!listError && !listIsInitialLoading && visibleSpecialists.length === 0;
  const isEmpty =
    !listIsInitialLoading && !listError && visibleSpecialists.length === 0 && !showFavoritesOnly;
  const isFavoritesEmpty =
    showFavoritesOnly && visibleSpecialists.length === 0 && !listIsInitialLoading;

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

          {listIsInitialLoading ? (
            <div className="centered">
              <IonSpinner name="crescent" />
              <IonNote>Loading providers...</IonNote>
            </div>
          ) : isOfflineEmpty ? (
            <div className="empty">
              <IonIcon icon={peopleOutline} />
              <h3>Unable to load providers</h3>
              <p>Check your connection and try again.</p>
              <IonButton onClick={() => refresh()} size="small">
                Retry
              </IonButton>
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

              {!listHasMore && visibleSpecialists.length > 0 && (
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
          disabled={!listHasMore}
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
          total={listTotal}
          specialistsLength={visibleSpecialists.length}
        />

        <SortSheet
          isOpen={isSortSheetOpen}
          onClose={() => setSortSheetOpen(false)}
          selected={sortOption}
          onSelect={(option) => {
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