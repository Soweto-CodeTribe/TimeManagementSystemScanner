export const getAllProgramMonths = (startTimestamp, endTimestamp) => {
  // Validate inputs
  if (!startTimestamp || !endTimestamp) {
    console.error("Invalid timestamp inputs:", { startTimestamp, endTimestamp });
    return [];
  }

  // Convert timestamps to Date objects
  const startDate = new Date(parseInt(startTimestamp));
  const endDate = new Date(parseInt(endTimestamp));
  
  // Validate date objects
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("Invalid date conversion:", { 
      startTimestamp, 
      endTimestamp, 
      startDate: startDate.toString(), 
      endDate: endDate.toString() 
    });
    return [];
  }
  
  console.log("Program date range:", { 
    startDate: startDate.toLocaleDateString(), 
    endDate: endDate.toLocaleDateString() 
  });

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
  
  console.log(`Generated ${months.length} months from ${months[0]?.monthYear} to ${months[months.length-1]?.monthYear}`);
  
  return months;
};