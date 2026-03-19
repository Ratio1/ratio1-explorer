import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { CardWithIcon } from '@/app/server-components/shared/cards/CardWithIcon';
import { RowWithIcon } from '@/app/server-components/shared/cards/RowWithIcon';
import { notFound } from 'next/navigation';
import { RiCpuLine } from 'react-icons/ri';

/*
Public preview route for Playwright-based UI screenshots.
Swap the component tree inside section id="playwright-preview" when validating UI changes.
Keep this page deterministic and independent from auth/API/blockchain calls.
*/

const isDevelopment = process.env.NODE_ENV === 'development';

export default function PlaywrightPreviewPage() {
    if (!isDevelopment) {
        notFound();
    }

    return (
        <main className="col mx-auto w-full max-w-5xl gap-6 p-4 md:p-8">
            <section id="playwright-preview"></section>
        </main>
    );
}
