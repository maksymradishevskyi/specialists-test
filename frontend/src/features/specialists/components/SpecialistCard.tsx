import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon
} from '@ionic/react';
import {
  briefcaseOutline,
  heart,
  heartOutline,
  peopleOutline,
  shieldCheckmark
} from 'ionicons/icons';
import { star } from 'ionicons/icons';
import type { Specialist } from '../specialistsApi';
import { formatName } from '../utils';

type SpecialistCardProps = {
  specialist: Specialist;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

const countryFlag = (code?: string) => {
  if (!code) return '🇺🇸';
  const base = 127397;
  return code
    .toUpperCase()
    .slice(0, 2)
    .replace(/./g, (char) => String.fromCodePoint(base + char.charCodeAt(0)));
};

const SpecialistCard = ({ specialist, isFavorite, onToggleFavorite }: SpecialistCardProps) => {
  const avatarUrl = specialist.avatar ?? 'https://api.dicebear.com/9.x/avataaars/svg?seed=unknown';
  const isTopRated = specialist.rating >= 4.7;
  const experienceYears = specialist.experienceYears ?? 5;
  const clients =
    specialist.clientsCount ?? Math.max(10, Math.round(specialist.reviewsCount * 0.2));
  const sessions = specialist.sessionsCount ?? clients + 12;
  const slots =
    specialist.availabilitySlots ?? ['Today, 10:00 AM', 'Tomorrow, 10:00 AM', 'Jun 12, 9:00 AM'];
  const displayName = formatName(specialist.name);

  return (
    <IonCard className="specialist-card">
      <IonCardHeader className="card-header">
        <div className="card-top">
          <div className="avatar">
            <img src={avatarUrl} alt={`${specialist.name} avatar`} />
          </div>
          <div className="title-block">
            <div className="name-row">
              <div className="name-line">
                <IonCardTitle className="name">{displayName}</IonCardTitle>
                <span className="flag">{countryFlag(specialist.countryCode)}</span>
                <IonIcon className="verified" icon={shieldCheckmark} />
                <span className="name-spacer" />
                <IonButton
                  fill="clear"
                  className="favorite-btn"
                  color={isFavorite ? 'danger' : 'medium'}
                  onClick={() => onToggleFavorite(specialist.id)}
                  aria-label={
                    isFavorite
                      ? `Remove ${specialist.name} from favorites`
                      : `Add ${specialist.name} to favorites`
                  }
                >
                  <IonIcon icon={isFavorite ? heart : heartOutline} />
                </IonButton>
              </div>
            </div>
            {isTopRated && (
              <IonBadge color="success" className="specialist-badge">
                🏆 Super Specialist
              </IonBadge>
            )}
            <div className="price-row">
              <div className="price-col">
                <span className="price">${specialist.pricePerSession} USD</span>
                <span className="duration">{specialist.sessionDurationMinutes} min</span>
              </div>
              <div className="rating-col">
                <div className="rating-line">
                  <IonIcon icon={star} />
                  <span className="rating-value">{specialist.rating.toFixed(1)}</span>
                </div>
                <span className="reviews">{specialist.reviewsCount} reviews</span>
              </div>
            </div>
          </div>
        </div>
      </IonCardHeader>

      <IonCardContent className="card-body">
        <p className="description">{specialist.description}</p>
        <div className="meta meta-bullets">
          <div className="meta-item">
            <IonIcon icon={briefcaseOutline} />
            <span>{experienceYears} years of experience</span>
          </div>
          <div className="meta-item">
            <IonIcon icon={peopleOutline} />
            <span>
              {clients} clients · {sessions} sessions
            </span>
          </div>
        </div>
        <div className="slots">
          {slots.map((slot, idx) => (
            <button key={`${specialist.id}-slot-${idx}`} className="slot-pill">
              {slot}
            </button>
          ))}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default SpecialistCard;

