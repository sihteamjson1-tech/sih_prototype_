import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Container } from './Chrome.jsx';
export function SiteFooter() {
    const { messages } = useLanguage();
    const columns = [
        {
            title: messages.footerAbout,
            links: [
                [messages.aboutPramaan, '/about#pramaan'],
                [messages.aboutAicte, '/about#aicte'],
                [messages.aboutProject, '/about#project'],
            ],
        },
        {
            title: messages.footerServices,
            links: [
                [messages.validation, '/verify'],
                [messages.authentication, '/documents'],
                [messages.compliance, '/compliance'],
                [messages.tracking, '/track'],
            ],
        },
        {
            title: messages.footerHelp,
            links: [
                [messages.faqs, '/help#faqs'],
                [messages.guide, '/help#guide'],
                [messages.contact, '/help#contact'],
                [messages.accessibility, '/help#accessibility'],
            ],
        },
        {
            title: messages.footerPolicies,
            links: [
                [messages.privacy, '/privacy'],
                [messages.terms, '/terms'],
                [messages.disclaimer, '/disclaimer'],
                [messages.security, '/security'],
            ],
        },
    ];
    return (<footer className="no-print mt-12 border-t-4 border-navy bg-navy-deep text-white">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (<div key={column.title}>
            <h2 className="text-sm font-semibold tracking-wide">{column.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              {column.links.map(([label, to]) => (<li key={to}>
                  <Link className="hover:underline" to={to}>
                    {label}
                  </Link>
                </li>))}
            </ul>
          </div>))}
      </Container>
      <div className="border-t border-white/15">
        <Container className="space-y-1 py-4 text-xs leading-5 text-white/80">
          <p>SIH 2026 Prototype</p>
          <p>{messages.advisory}</p>
          <p>{messages.notOfficial}</p>
          <p>{messages.lastUpdated}</p>
        </Container>
      </div>
    </footer>);
}
