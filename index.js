var spot = document.getElementById("spot");
var futures = document.getElementById("futures");
var timeValue = document.getElementById("timeValue");
var historyValue = document.getElementById("historyValue");
var timeArrayValue = document.getElementById("timeArrayValue");
var historyArray = [];
var timeArray = [];
var time = 0;
var myChart;
var btcChart;
var chartConfig;
var btcChartConfig;

var btcPriceArray = [];

loop();
setupChart();

async function updateSpot() {
  var api = await fetch(
    "https://api.binance.com/api/v3/ticker/price?symbol=BTCBUSD",
    {
      method: "GET",
      headers: {},
    }
  );

  var data = await api.json();

  spot.innerHTML = data.price;

  btcPriceArray.push(data.price);
}

async function updateFutures() {
  var api = await fetch(
    "https://fapi.binance.com/fapi/v1/ticker/price?symbol=BTCBUSD",
    {
      method: "GET",
      headers: {},
    }
  );

  var data = await api.json();

  futures.innerHTML = data.price;
}

async function loop() {
  await updateSpot();
  await updateFutures();
  await calc();
  time = time + 1;
  timeValue.innerHTML = time;
  timeArray.push(time);
  timeArrayValue.innerHTML = timeArray.join(", ");

  updateChart();
  updateBtcChart();
  myChart.update();

  btcChart.update();

  if (timeArray.length > 35) {
    timeArray.shift();
    historyArray.shift();
    btcPriceArray.shift();
  }

  setTimeout(loop, 1000);
}

async function calc() {
  var spotValue = spot.innerHTML;
  var futuresValue = futures.innerHTML;

  var diff = spotValue - futuresValue;

  var pre = "+";

  var returnData = pre + diff.toFixed(2);

  if (diff < 0) {
    returnData = diff;
  }

  document.getElementById("result").innerHTML = returnData;

  historyArray.push(diff.toFixed(2));
  historyValue.innerHTML = historyArray.join(", ");
}

async function updateChart() {
  const labels = timeArray;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "升帖水",
        data: historyArray,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  chartConfig = {
    type: "line",
    data: data,
    options: {},
  };
}

async function updateBtcChart() {
  const labels = timeArray;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "BTC",
        data: btcPriceArray,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  btcChartConfig = {
    type: "line",
    data: data,
    options: {},
  };
}

async function setupChart() {
  const labels = timeArray;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "歷史",
        data: historyArray,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  chartConfig = {
    type: "line",
    data: data,
    options: {},
  };

  btcChartConfig = {
    type: "line",
    data: {
      labels: timeArray,
      datasets: [
        {
          label: "BTC",
          data: btcPriceArray,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {},
  };

  myChart = new Chart(document.getElementById("myChart"), chartConfig);

  btcChart = new Chart(document.getElementById("btcChart"), btcChartConfig);
}
