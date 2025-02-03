import ApiStatus from '@/components/shared/ApiStatusCard';

export default function Home() {
    return (
        <div className="center-all w-full h-full gap-6 p-14 col">
            <div className="text-xl font-medium">Home Page</div>

            <ApiStatus />
        </div>
    );
}
