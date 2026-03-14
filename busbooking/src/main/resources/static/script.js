'use strict';

/* ============================================================
   STATE
============================================================ */
const state = {
  from: '',
  to: '',
  date: '',
  passengers: 1,
  selectedBus: null,
  selectedSeat: null
};

/* ============================================================
   DOM HELPERS
============================================================ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

/* ============================================================
   INIT
============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  const fromCity   = $('#fromCity');
  const toCity     = $('#toCity');
  const travelDate = $('#travelDate');
  const searchBtn  = $('#searchBtn');

  /* set today's date */
  if (travelDate) {
    const today = new Date().toISOString().split("T")[0];
    travelDate.min = today;
    travelDate.value = today;
  }

  /* SEARCH BUTTON (Redirect) */
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {

      const from = fromCity.value.trim();
      const to   = toCity.value.trim();
      const date = travelDate.value;

      if (!from || !to || !date) {
        alert("Please fill all fields");
        return;
      }

      window.location.href =
        `buses.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`;

    });
  }

  /* if buses.html page */
  loadBusResults();

  /* modal steps */
  if ($('#step1Next')) $('#step1Next').addEventListener("click", goStep2);
  if ($('#step2Next')) $('#step2Next').addEventListener("click", goStep3);
  if ($('#step2Back')) $('#step2Back').addEventListener("click", () => showStep(1));
  if ($('#step3Back')) $('#step3Back').addEventListener("click", () => showStep(2));
  if ($('#confirmBtn')) $('#confirmBtn').addEventListener("click", handleConfirm);

});


/* ============================================================
   LOAD BUS RESULTS (buses.html)
============================================================ */
function loadBusResults() {

  const busList = $('#busList');

  /* only run in buses.html */
  if (!busList) return;

  const params = new URLSearchParams(window.location.search);

  const from = params.get("from");
  const to   = params.get("to");
  const date = params.get("date");

  state.from = from;
  state.to   = to;
  state.date = date;

  fetch(`/api/bus/search?from=${from}&to=${to}`)
    .then(res => res.json())
    .then(data => renderResults(data))
    .catch(err => console.error(err));
}


/* ============================================================
   RENDER BUS RESULTS
============================================================ */
function renderResults(buses) {

  const busList = $('#busList');

  busList.innerHTML = "";

  if (!buses || buses.length === 0) {
    busList.innerHTML = "<p>No buses available</p>";
    return;
  }

  buses.forEach(bus => {

    const card = document.createElement("div");
    card.className = "bus-card";

    card.innerHTML = `
      <h3>${bus.busName}</h3>
      <p>${bus.fromLocation} → ${bus.toLocation}</p>
      <p>Departure: ${bus.departureTime}</p>
      <p>Price: ₹${bus.price}</p>
      <button class="btn-book">Book Now</button>
    `;

    card.querySelector(".btn-book")
        .addEventListener("click", () => openBookingModal(bus));

    busList.appendChild(card);

  });

}


/* ============================================================
   OPEN BOOKING MODAL
============================================================ */
function openBookingModal(bus) {

  state.selectedBus = bus;
  state.selectedSeat = null;

  $('#mBusName').textContent = bus.busName;

  $('#mBusRoute').textContent =
    `${bus.fromLocation} → ${bus.toLocation} • ${state.date}`;

  renderSeats(bus.totalSeats);

  showStep(1);

  $('#modalOverlay').classList.add("open");

}


/* ============================================================
   RENDER SEATS
============================================================ */
function renderSeats(totalSeats) {

  const seatGrid = $('#seatGrid');

  seatGrid.innerHTML = "";

  for (let i = 1; i <= totalSeats; i++) {

    const seat = document.createElement("div");

    seat.className = "seat";
    seat.textContent = i;

    seat.addEventListener("click", () => {

      $$('.seat').forEach(s => s.classList.remove("selected"));

      seat.classList.add("selected");

      state.selectedSeat = i;

    });

    seatGrid.appendChild(seat);

  }

}


/* ============================================================
   STEP NAVIGATION
============================================================ */
function goStep2() {

  if (!state.selectedSeat) {
    alert("Please select seat");
    return;
  }

  showStep(2);

}

function goStep3() {

  const name = $('#paxName').value.trim();
  const age  = $('#paxAge').value.trim();

  if (!name || !age) {
    alert("Please enter passenger details");
    return;
  }

  showStep(3);

}

function showStep(n) {

  [1,2,3,4].forEach(i => {

    const el = document.getElementById("step" + i);

    if (el) el.classList.toggle("hidden", i !== n);

  });

}


/* ============================================================
   CONFIRM BOOKING
============================================================ */
function handleConfirm() {

  const name = $('#paxName').value.trim();

  if (!name || !state.selectedSeat) {
    alert("Please complete booking");
    return;
  }

  fetch(`/api/booking/book?busId=${state.selectedBus.id}&passengerName=${name}&seatNumber=${state.selectedSeat}&bookingDate=${state.date}`, {
    method: "POST"
  })
  .then(res => res.json())
  .then(data => {

    alert(data.message);

    if (data.status === "SUCCESS") {

      $('#successId').textContent =
        "Booking ID: " + data.data;

      showStep(4);

    }

  })
  .catch(err => {
    console.error(err);
    alert("Booking failed");
  });

}