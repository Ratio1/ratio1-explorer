export default async function ListHeader({ children }) {
    return (
        <div className="hidden w-full min-w-[1126px] items-center justify-between gap-3 rounded-xl border-2 border-slate-100 bg-slate-100 px-4 py-4 text-sm font-medium text-slate-400 lg:flex lg:gap-6 lg:px-6">
            {children}
        </div>
    );
}
