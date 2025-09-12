'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';

export default function EpochsChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart width={200} height={40} data={data}>
                <Line type="monotone" dataKey="Availability" stroke="#1b47f7" strokeWidth={2} dot={<div></div>} />
            </LineChart>
        </ResponsiveContainer>
    );
}
