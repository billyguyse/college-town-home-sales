const minimumPrice = 10_000;
const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const countFormat = new Intl.NumberFormat("en-US");

function* csvRows(csv) {
  // Consume one field and its delimiter at a time, including quoted commas,
  // escaped quotes, and line breaks inside quoted fields.
  const fieldPattern = /(?:"((?:[^"]|"")*)"|([^",\r\n]*))(,|\r\n|\r|\n|$)/y;
  let row = [];
  while (fieldPattern.lastIndex < csv.length) {
    const field = fieldPattern.exec(csv);
    if (!field) throw new Error("Invalid CSV field");
    row.push(field[1] === undefined ? field[2] : field[1].replaceAll('""', '"'));
    if (field[3] !== ",") {
      yield row;
      row = [];
    } else if (fieldPattern.lastIndex === csv.length) {
      row.push("");
      yield row;
    }
  }
}

function summarizeSales(csv) {
  const rows = csvRows(csv.replace(/^\uFEFF/, ""));
  const { value: header } = rows.next();
  const columns = ["city", "state", "sale_price"].map(name => header?.indexOf(name) ?? -1);
  if (columns.includes(-1)) throw new Error("Missing CSV columns");
  const [cityColumn, stateColumn, priceColumn] = columns;

  const cities = new Map();
  for (const row of rows) {
    const price = Number(row[priceColumn]);
    if (!Number.isFinite(price) || price < minimumPrice) continue;

    const city = row[cityColumn];
    const state = row[stateColumn];
    const key = `${city}, ${state}`;
    if (!cities.has(key)) cities.set(key, { city, state, prices: [] });
    cities.get(key).prices.push(price);
  }

  return Array.from(cities.values(), ({ city, state, prices }) => {
    prices.sort((a, b) => a - b);
    const middle = Math.floor(prices.length / 2);
    const median = prices.length % 2
      ? prices[middle]
      : (prices[middle - 1] + prices[middle]) / 2;
    return { city, state, median, count: prices.length };
  }).sort((a, b) => b.median - a.median
    || a.city.localeCompare(b.city) || a.state.localeCompare(b.state));
}

function renderSales(cities) {
  const body = document.getElementById("city-rows");
  for (const { city, state, median, count } of cities) {
    const row = body.insertRow();
    const place = document.createElement("th");
    place.scope = "row";
    place.textContent = `${city}, ${state}`;
    row.append(place);
    const priceCell = row.insertCell();
    priceCell.className = "median";
    priceCell.textContent = priceFormat.format(median);
    row.insertCell().textContent = countFormat.format(count);
  }
  document.getElementById("city-count").textContent = countFormat.format(cities.length);
  const total = cities.reduce((sum, { count }) => sum + count, 0);
  document.getElementById("sale-count").textContent = countFormat.format(total);
  document.getElementById("summary").hidden = false;
  document.getElementById("ranking").hidden = false;
}

async function loadSales() {
  const status = document.getElementById("status");
  try {
    const response = await fetch("data/college_town_home_sales.csv");
    if (!response.ok) throw new Error(`CSV request failed (${response.status})`);
    const cities = summarizeSales(await response.text());
    if (!cities.length) {
      status.textContent = "No home sales qualified for the rankings.";
      return;
    }
    renderSales(cities);
    status.hidden = true;
  } catch (error) {
    status.textContent = "Home sale data could not be loaded. Refresh the page to try again.";
    console.error(error);
  }
}

loadSales();
