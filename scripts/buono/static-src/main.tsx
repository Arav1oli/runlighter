import { createRoot } from 'react-dom/client';
import Launchpad from '../../../../buono-launchpad/site/app/components/Launchpad';
import publicationData from '../../../../buono-launchpad/site/public/data/launchpad-evidence.json';
import '../../../../buono-launchpad/site/app/globals.css';

const mount = document.getElementById('root');

if (!mount) {
  throw new Error('Buono launchpad mount element is missing.');
}

const publication = publicationData as Parameters<typeof Launchpad>[0]['publication'];
createRoot(mount).render(<Launchpad publication={publication} />);
