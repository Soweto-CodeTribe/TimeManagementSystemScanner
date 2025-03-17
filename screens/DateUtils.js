export const getAllProgramMonths = (startTimestamp, endTimestamp) => {
    // Convert timestamps to Date objects
    const startDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);
   
    const months = [];
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Set to first day of start month
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
   
    // Loop through all months between start and end dates
    while (currentDate <= endDate) {
      months.push({
        month: currentDate.getMonth() + 1, // 1-12 format for API
        year: currentDate.getFullYear(),
        monthName: monthNames[currentDate.getMonth()],
        monthYear: `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
      });
     
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
   
    return months;
  };