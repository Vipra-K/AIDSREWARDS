const COOLDOWN_PERIOD = 5 * 60 * 1000; // 5 minutes in milliseconds
let lastFetchTime = 0;

async function fetchStats() {
  try {
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastFetchTime;

    if (lastFetchTime && timeElapsed < COOLDOWN_PERIOD) {
      const remainingTime = Math.ceil((COOLDOWN_PERIOD - timeElapsed) / 1000);
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      throw new Error(`Please wait ${minutes}m ${seconds}s before refreshing.`);
    }

    const response = await fetch(
      "https://hollowrewards-backend.onrender.com/api/affiliate/stats",
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log(data);
    if (!data.error) {
      displayLeaderboard(data.data.summarizedBets);
      lastFetchTime = Date.now();
    } else {
      showError("API Error: " + data.msg);
    }
  } catch (err) {
    showError(err.message);
    console.error("Fetch Error:", err);
  }
}

function displayLeaderboard(bets) {
  const sortedBets = bets.sort((a, b) => b.wager - a.wager).slice(0, 10);

  const prizes = {
    1: 250,
    2: 200,
    3: 150,
    4: 120,
    5: 100,
    6: 80,
    7: 60,
    8: 40,
    9: 20,
    10: 10,
  };

  // Update top 3 positions
  const topThreeContainer = document.querySelector(".css-gqrafh");

  // Create array for top 3 with center card showing #1
  const displayOrder = [
    { bet: sortedBets[1], position: 2 }, // Left card shows #2
    { bet: sortedBets[0], position: 1 }, // Center card shows #1
    { bet: sortedBets[2], position: 3 }, // Right card shows #3
  ];

  let topThreeHTML = "";

  displayOrder.forEach(({ bet, position }, index) => {
    if (!bet) return;

    // Use css-oijls1 for center card, css-jehefp for side cards
    const cssClass = index === 1 ? "css-oijls1" : "css-jehefp";

    topThreeHTML += `
      <div class="${cssClass}">
        <img alt="${bet.user.username}'s avatar" 
             src="${bet.user.avatar}"
             width="96" height="96" 
             class="css-1wgwpc8">
        <div class="css-hca0vm">
          <span class="css-15a1lq3">${bet.user.username}</span>
        </div>
        <div class="css-7ahevu ejrykqo0">
          <span class="css-1vqddgv">Wagered </span>
          <span class="css-18icuxn">
            <div class="css-1y0ox2o">
              <span class="css-114dvlx">${bet.wager.toFixed(2)}</span>
            </div>
          </span>
        </div>
        <span class="css-v4675v">
          <div class="css-1y0ox2o">
            <div class="price-wrapper">
              $ ${prizes[position]}
            </div>
          </div>
        </span>
      </div>
    `;
  });

  topThreeContainer.innerHTML = topThreeHTML;

  // Rest of the code for positions 4-10 remains the same
  let remainingHTML = "";

  for (let i = 3; i < sortedBets.length; i++) {
    const bet = sortedBets[i];
    const position = i + 1;

    remainingHTML += `
      <div data-v-1d580398="" class="row list row-cols-5">
        <div data-v-1d580398="" class="hide-mobile col-2"><b data-v-1d580398="">#</b>${position}</div>
        <div data-v-1d580398="" class="col-5">
          <img data-v-1d580398="" src="${bet.user.avatar}">
          <span data-v-1d580398="">${bet.user.username}</span>
        </div>
        <div data-v-1d580398="" class="col-2">
          ${
            prizes[position]
              ? `
            <div data-v-1d580398="" class="price-wrapper">
              $ ${prizes[position]}
            </div>
          `
              : ""
          }
        </div>
        <div data-v-1d580398="" class="col-3">
          <div data-v-1d580398="" class="price-wrapper" style="color: #eee">
            <div class="price-image-wrapper" style="height: 0rem; width: 0rem; margin-right: 0px;"></div>
            ${bet.wager.toFixed(2)}
          </div>
        </div>
      </div>
    `;
  }

  const detailsRow = document.querySelector(".row.list.details");
  if (detailsRow && detailsRow.nextElementSibling) {
    const existingRows = document.querySelectorAll(".row.list.row-cols-5");
    existingRows.forEach((row) => row.remove());
    detailsRow.insertAdjacentHTML("afterend", remainingHTML);
  }
}

function showError(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("message");
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// Initialize leaderboard with auto-refresh
async function initializeLeaderboard() {
  try {
    await fetchStats();
    // Update leaderboard every 5 minutes
    setInterval(fetchStats, COOLDOWN_PERIOD);
  } catch (err) {
    console.error("Failed to initialize leaderboard:", err);
    showError("Failed to initialize leaderboard");
  }
}

// Start the application
initializeLeaderboard();
