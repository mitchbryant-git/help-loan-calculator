import { ArrowUpRight, Share2 } from 'lucide-react';

export default function ShareResultsCard({ onOpen }) {
  return (
    <button type="button" onClick={onOpen} className="share-launch">
      <span className="share-launch__icon" aria-hidden="true">
        <Share2 size={18} strokeWidth={2.3} />
      </span>

      <span className="share-launch__copy">
        <small>Optional utility</small>
        <strong>Share results</strong>
      </span>

      <span className="share-launch__meta">Live link or image</span>
      <ArrowUpRight className="share-launch__arrow" size={18} aria-hidden="true" />
    </button>
  );
}
