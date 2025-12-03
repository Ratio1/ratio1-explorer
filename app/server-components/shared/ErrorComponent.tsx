export default function ErrorComponent({ title, description }: { title: string; description: string }) {
    return (
        <div className="center-all m-auto min-h-full w-full gap-2 py-8">
            <div className="center-all flex-col gap-3 py-8">
                <div className="text-7xl font-semibold text-slate-700">404</div>

                <div className="center-all flex-col gap-1 text-center">
                    <div className="text-xl font-semibold">{title}</div>

                    <div className="max-w-[600px] text-slate-500">{description}</div>
                </div>
            </div>
        </div>
    );
}
