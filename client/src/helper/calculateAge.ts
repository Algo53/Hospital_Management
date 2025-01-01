export const calculateAge = (dob: string) => {
    try {
        const [day, month, year] = dob.split("-").map(Number); // Parse DD-MM-YYYY format
        const birthDate = new Date(year, month - 1, day); // JavaScript months are 0-based
        const today = new Date();
    
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
    
        // Adjust age if the current month/day is before the birth month/day
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
    
        return calculatedAge;
    } catch (error) {
        return 0;
    }
};