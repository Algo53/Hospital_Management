import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function DoctorStatistics({ appointments }: { appointments: IAppointment[] }) {
    const [all, setAll] = useState<number>(0);
    const [pending, setPending] = useState<number>(0);
    const [completed, setCompleted] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [notStarted, setNotStarted] = useState<number>(0);
    // const [chartData, setChartData] = useState<any>({
    //     labels: [],
    //     datasets: [
    //         {
    //             data: [],
    //             backgroundColor: [],
    //             hoverBackgroundColor: [],
    //         }
    //     ]
    // });
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const total = appointments.length;
        const complet = appointments.filter(item => item.status === "Completed").length;
        const onProgress = appointments.filter(item => item.progress !== 0 && item.progress !== 100).length;
        const notYetStarted = appointments.filter(item => item.progress === 0).length;
        setAll(total);
        setCompleted(complet);
        setProgress(onProgress);
        setNotStarted(notYetStarted);
        setData([
            { key: "Total Appointments", value: total },
            { key: "Complete Appointments", value: complet },
            { key: "Pending Appointments", value: total - complet },
            { key: "On Progress Appointments", value: onProgress },
            { key: "Not Yet Started Appointments", value: notYetStarted },
        ]);
        // setChartData({
        //     labels: ["Not Started", "Pending", "Completed", "In Progress"],
        //     datasets: [
        //         {
        //             data: [notYetStarted, total - complet, complet, onProgress],
        //             backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#03A9F4"],
        //             hoverBackgroundColor: ["#66BB6A", "#FFB74D", "#E57373", "#8BC34A"],
        //         }
        //     ]
        // });
    }, [appointments]);

    // if (!appointments || appointments.length === 0) {
    //     return <p>No appointments data available.</p>;
    // }

    // const chartOptions = {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //   };

    // return (
    //     <div className="chart-container">
    //         <Pie data={chartData} options={chartOptions} />
    //     </div>
    // );

    return (
        <div className="flex flex-col gap-3 p-3 h-full w-full bg-gradient-to-r from-black/40 to-black/90 rounded-xl overflow-y-scroll hide-scrollbar">
            <div className="flex gap-3 grid grid-cols md:grid-cols-2">
                {
                    data.length > 0 && data.map((item: { key: string, value: string }, index: number) => (

                        <div key={index} className="flex border rounded-md py-2 px-4 justify-between items-center bg-gradient-to-r from-zinc-400 to-white">
                            <div className="text-sm xs:text-lg md:text-xl font-bold">{item.key}</div>
                            <div className="text-lg xs:text-xl md:text-2xl font-bold">{item.value}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default DoctorStatistics;