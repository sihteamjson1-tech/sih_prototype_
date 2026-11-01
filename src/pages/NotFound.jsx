import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Chrome.jsx';
import { buttonClass } from '../utils/format.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
export function NotFound() {
    usePageTitle('Page not found');
    return (<Container className="py-16">
      <h1 className="text-3xl font-semibold text-navy">Page not found</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">That address is not part of this prototype.</p>
      <Link className={`${buttonClass('primary')} mt-6`} to="/">Back to home</Link>
    </Container>);
}
