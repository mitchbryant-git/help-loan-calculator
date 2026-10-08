export default function GuideSchema({ metadata }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    '@context': 'https://schema.org', '@type': 'WebPage',
    '@id': metadata.alternates.canonical + '#webpage', url: metadata.alternates.canonical,
    name: metadata.title, description: metadata.description,
    isPartOf: { '@id': 'https://allthatsnext.com/#website' },
    publisher: { '@id': 'https://allthatsnext.com/#organization' },
  }).replace(/</g, '\u003c') }} />;
}
