export function formatDate(isoDate: string) {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long", // Full name of the month
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta", // For WIB (UTC+7)
    };
  
    let formattedDate = date.toLocaleString("id-ID", options);
  
    formattedDate = formattedDate
      .replace("pukul", ", ")
      .replace(/\s+/, " ")
      .trim();
    return formattedDate.replace(
      /(\d+)(\s+)(\D+)(\s+)(\d+)(,\s+)(\d+):(\d+)/,
      "$1 $3 $5, $7:$8"
    );
  }
  