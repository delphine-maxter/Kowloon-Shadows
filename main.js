function getUnlockTime() {
  const now = new Date();
  let unlock = new Date();
  unlock.setDate(now.getDate() + 1);
  unlock.setHours(19, 30, 0, 0); // 7:30 PM
  return unlock;
}

function updateCountdown() {
  const countdown = document.getElementById('countdown');
  const unlockBtn = document.getElementById('unlockBtn');
  const now = new Date();
  const unlockTime = getUnlockTime();
  const diff = unlockTime - now;
  if (diff > 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    countdown.textContent = `Unlocks in ${hours}h ${mins}m ${secs}s`;
    unlockBtn.disabled = true;
    unlockBtn.classList.remove('glow');
    unlockBtn.textContent = "LOCKED";
  } else {
    countdown.textContent = "Unlocked!";
    unlockBtn.disabled = false;
    unlockBtn.classList.add('glow');
    unlockBtn.textContent = "UNLOCK";
    clearInterval(countdownInterval);
  }
}

document.getElementById('unlockBtn').onclick = function() {
  if (!this.disabled) {
    window.location.href = "tour.html";
  }
};

updateCountdown();
setInterval(updateCountdown, 1000);
