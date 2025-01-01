export const generateRange = (start: string, end: string) => {
    const slots: string[] = [];
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    while (current <= endTime) {
        const hours = current.getHours().toString().padStart(2, '0');
        const minutes = current.getMinutes().toString().padStart(2, '0');
        slots.push(`${hours}:${minutes}`);
        current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
}

export const generateSlots = (timeRange: string[]) => {
    const allSlots: string[] = [];
    for (const range of timeRange) {
        const [start, end] = range.split('-');
        allSlots.push(...generateRange(start, end));
    }
    return allSlots;
}

export const generateDateStrings = (): { value: string; data: string }[] => {
    const days: { value: string; data: string }[] = [];
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric' };

    for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i); // Increment date by i days

        // Format date for `data`
        const formattedData = date.toLocaleDateString('en-US', options); // Format as "Tue, 17"

        // Format date for `value`
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        const formattedValue = `${month}-${day}-${year}`; // Format as "12-17-2024"

        days.push({ value: formattedValue, data: formattedData });
    }

    return days;
}