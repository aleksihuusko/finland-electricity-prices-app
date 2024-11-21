const API_KEY = import.meta.env.VITE_ENTSOE_API_KEY;
const DOMAIN = "10YFI-1--------U"; // Finland's domain code

const formatDateTime = (date, hour = "00", minute = "00") => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  console.log(
    `Formatting date: ${date.toISOString()} to ${year}${month}${day}${hour}${minute}`
  );

  return `${year}${month}${day}${hour}${minute}`;
};

export const fetchElectricityPrices = async () => {
  const now = new Date();
  const finnishTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Helsinki" })
  );

  // Debug log for timing
  console.log(
    "Current Finnish time:",
    finnishTime.toLocaleString("en-US", { timeZone: "Europe/Helsinki" })
  );
  console.log("Hour in Finland:", finnishTime.getHours());

  const today = new Date(finnishTime);
  const tomorrow = new Date(finnishTime);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(finnishTime);
  yesterday.setDate(yesterday.getDate() - 1);

  const periodStartToday = formatDateTime(yesterday, "23", "00");
  const periodEndToday = formatDateTime(today, "22", "00");
  const periodStartTomorrow = formatDateTime(today, "23", "00");
  const periodEndTomorrow = formatDateTime(tomorrow, "22", "00");

  // Add debug logging
  console.log("Finnish time:", finnishTime.toISOString());
  console.log("Request periods:", {
    today: `${periodStartToday} - ${periodEndToday}`,
    tomorrow: `${periodStartTomorrow} - ${periodEndTomorrow}`,
  });

  try {
    // Fetch both requests in parallel
    const [todayResponse, tomorrowResponse] = await Promise.all([
      fetch(
        `/api/electricity?documentType=A44&in_Domain=${DOMAIN}&out_Domain=${DOMAIN}&periodStart=${periodStartToday}&periodEnd=${periodEndToday}&securityToken=${API_KEY}`
      ),
      fetch(
        `/api/electricity?documentType=A44&in_Domain=${DOMAIN}&out_Domain=${DOMAIN}&periodStart=${periodStartTomorrow}&periodEnd=${periodEndTomorrow}&securityToken=${API_KEY}`
      ),
    ]);

    const todayText = await todayResponse.text();
    const tomorrowText = await tomorrowResponse.text();

    // Add detailed debug logging
    console.log("API Responses:", {
      todayStatus: todayResponse.status,
      tomorrowStatus: tomorrowResponse.status,
      todayHasPoints: todayText.includes("<Point>"),
      tomorrowHasPoints: tomorrowText.includes("<Point>"),
      tomorrowTextPreview: tomorrowText.substring(0, 200),
    });

    // Check if tomorrow's data contains price points
    const hasTomorrowPrices = tomorrowText.includes("<Point>");

    return {
      today: parseXMLResponse(todayText),
      tomorrow: hasTomorrowPrices ? parseXMLResponse(tomorrowText) : null,
      hasTomorrowPrices,
    };
  } catch (error) {
    console.error("Error fetching electricity prices:", error);
    return null;
  }
};

const parseXMLResponse = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const timeSeries = xmlDoc.getElementsByTagName("TimeSeries");

  const prices = [];

  for (let series of timeSeries) {
    const points = series.getElementsByTagName("Point");
    for (let point of points) {
      const position = point.getElementsByTagName("position")[0].textContent;
      const price = point.getElementsByTagName("price.amount")[0].textContent;
      prices.push({
        hour: parseInt(position) - 1,
        price: parseFloat(price) / 1, // Convert to EUR/MWh
      });
    }
  }

  return prices.sort((a, b) => a.hour - b.hour);
};
