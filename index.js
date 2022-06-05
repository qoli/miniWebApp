var spot = document.getElementById("spot");
var futures = document.getElementById("futures");
var timeValue = document.getElementById("timeValue");
var time = 0;

loop();

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
}
