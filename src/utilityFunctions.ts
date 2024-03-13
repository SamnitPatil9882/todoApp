export const getCurrentDateString = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = currentDate.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}
export function isValidDate(dateString:string) {
    // Attempt to create a new Date object using the provided input
    const date = new Date(dateString);
    
    // Check if the constructed date object is valid
    // and the input date string matches the constructed date string
    return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
  }