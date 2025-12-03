import { Metadata } from 'next';
import ErrorComponent from './server-components/shared/ErrorComponent';

export const metadata: Metadata = {
    title: 'Error',
    description:
        'The page or content you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
};

export default async function NotFound() {
    return (
        <ErrorComponent
            title="Oops, an error occured!"
            description="The page or content you are looking for might have been removed, had its name changed, or is temporarily unavailable."
        />
    );
}
