import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { BtnLink, Screen } from '../MobileUi.jsx';

export function MobileNotFound() {
    usePageTitle('Page not found');
    return (<Screen title="Page not found" lede="That address is not part of this prototype.">
      <BtnLink to="/">Back to home</BtnLink>
    </Screen>);
}
