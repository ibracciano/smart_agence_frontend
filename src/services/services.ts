export const generateTicketNumber = (service: string): string => {
  const firstLetter = service.charAt(0).toUpperCase();
  const randomNumber = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  return `${firstLetter}${randomNumber}`;
};

export const convertInDate = (dateString: string) => {
  const dateObject = new Date(dateString);
  return dateObject.toLocaleDateString();
};

const getHour = (date: string) => {
  const date_hour = new Date(date);
  const hour = date_hour.toLocaleTimeString();
  return hour;
};

const getTimes = (date1: string, date2: string) => {
  const date_hour1 = new Date(date1);
  const date_hour2 = new Date(date2);
  const soustract_hour = date_hour2.getTime() - date_hour1.getTime();

  // Conversion en heures et minutes
  const heures = Math.floor(soustract_hour / (1000 * 60 * 60));
  const minutes = Math.floor((soustract_hour % (1000 * 60 * 60)) / (1000 * 60));
  const secondes = Math.floor((soustract_hour % (1000 * 60)) / 1000);

  return `${heures} h ${minutes} min ${secondes} s`;
};

export { getHour, getTimes };
