let countdownInterval; // Store interval ID

function updateCountdown() {
  // Clear any existing interval
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  // Get stored end time or create new one
  let endTime = localStorage.getItem("countdownEndTime");
  if (!endTime) {
    // Set end time to 30 days from now
    endTime = new Date();
    endTime.setDate(endTime.getDate() + 30);
    localStorage.setItem("countdownEndTime", endTime.getTime());
  } else {
    endTime = new Date(parseInt(endTime));
    // If past end time, reset for new 30 days
    if (endTime < new Date()) {
      endTime = new Date();
      endTime.setDate(endTime.getDate() + 30);
      localStorage.setItem("countdownEndTime", endTime.getTime());
    }
  }

  // Start countdown timer
  countdownInterval = setInterval(() => {
    const now = new Date();
    const remaining = endTime - now;
    const countdownElement = document.getElementById("countdown");

    if (!countdownElement) {
      clearInterval(countdownInterval);
      return;
    }

    if (remaining >= 0) {
      const remDays = Math.floor(remaining / (24 * 60 * 60 * 1000));
      const remHours = Math.floor(
        (remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const remMinutes = Math.floor(
        (remaining % (60 * 60 * 1000)) / (60 * 1000)
      );
      const remSeconds = Math.floor((remaining % (60 * 1000)) / 1000);

      countdownElement.textContent = `${remDays} Days ${remHours
        .toString()
        .padStart(2, "0")}:${remMinutes
        .toString()
        .padStart(2, "0")}:${remSeconds.toString().padStart(2, "0")}`;
    } else {
      // Reset for new 30 days when time's up
      endTime = new Date();
      endTime.setDate(endTime.getDate() + 30);
      localStorage.setItem("countdownEndTime", endTime.getTime());
    }
  }, 1000);
}

// Initialize countdown when page loads
document.addEventListener("DOMContentLoaded", updateCountdown);

// Refresh countdown every minute to stay in sync
setInterval(updateCountdown, 60000);
