import { search } from '@/lib/actions';
import { isNonZeroInteger } from '@/lib/utils';
import SearchResultsList from '../server-components/SearchResultsList';
import { BorderedCard } from '../server-components/shared/cards/BorderedCard';

export default async function SearchPage(props: {
    searchParams?: Promise<{
        query?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query: string = searchParams?.query || '';

    const { results, error } = await search(query);

    const getSectionTitle = (value: string) => <div className="text-lg font-bold md:text-xl">{value}</div>;

    return (
        <div className="responsive-col">
            <BorderedCard>
                <div className="card-title-big font-bold">Search results</div>

                {!results.length ? (
                    <div className="text-sm text-slate-500">0 matching results</div>
                ) : (
                    <div className="col font-medium">
                        <div>
                            Displaying results for:{' '}
                            <span className="font-semibold">
                                {isNonZeroInteger(query) && 'License #'}
                                {query}
                            </span>
                        </div>

                        <div className="text-sm text-slate-500">{results.length} results found</div>
                    </div>
                )}
            </BorderedCard>

            {!results.length || !!error ? (
                <div className="col gap-1">
                    <div className="font-semibold">No results</div>
                    <div className="text-sm">
                        We couldn't find any results matching your search. Try again with a different value.
                    </div>
                </div>
            ) : (
                <SearchResultsList results={results} variant="search-page" getSectionTitle={getSectionTitle} />
            )}
        </div>
    );
}
