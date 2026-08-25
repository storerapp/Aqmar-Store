(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-duplicate]").forEach(function (track) {
      Array.from(track.children).forEach(function (item) {
        var copy = item.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        track.appendChild(copy);
      });
    });

    var menuButton = document.querySelector(".menu-button");
    var navLinks = document.querySelector(".nav-links");
    var isEnglish = document.documentElement.lang === "en";

    function closeMenu() {
      if (!menuButton || !navLinks) return;
      navLinks.classList.remove("open");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", isEnglish ? "Open menu" : "فتح القائمة");
    }

    if (menuButton && navLinks) {
      menuButton.addEventListener("click", function () {
        var open = navLinks.classList.toggle("open");
        menuButton.textContent = open ? "×" : "☰";
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? (isEnglish ? "Close menu" : "إغلاق القائمة") : (isEnglish ? "Open menu" : "فتح القائمة"));
      });
      navLinks.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeMenu); });
    }

    var musicButton = document.querySelector(".music-menu-toggle");
    var musicPicker = document.querySelector(".music-picker");
    var musicTracks = document.querySelectorAll(".music-track");
    var musicPlayButton = document.querySelector(".music-play-toggle");
    var audio = document.getElementById("site-audio");
    if (musicButton && musicPicker && audio) {
      audio.volume = 0.16;
      musicButton.addEventListener("click", function () {
        var open = musicPicker.classList.toggle("open");
        musicPicker.setAttribute("aria-hidden", String(!open));
        musicButton.setAttribute("aria-expanded", String(open));
      });
      musicTracks.forEach(function (track) {
        track.addEventListener("click", function () {
          var source = track.dataset.src;
          musicTracks.forEach(function (item) { item.classList.toggle("active", item === track); });
          if (audio.getAttribute("src") !== source) {
            audio.pause();
            audio.setAttribute("src", source);
            audio.load();
          }
          var currentLabel = musicButton.querySelector("[data-current-track]");
          if (currentLabel) currentLabel.textContent = track.dataset.name;
          playSelected();
        });
      });
      if (musicPlayButton) {
        musicPlayButton.addEventListener("click", function () {
          if (audio.paused) playSelected(); else audio.pause();
        });
      }
      document.addEventListener("click", function (event) {
        if (!musicPicker.contains(event.target) && !musicButton.contains(event.target)) {
          musicPicker.classList.remove("open");
          musicPicker.setAttribute("aria-hidden", "true");
          musicButton.setAttribute("aria-expanded", "false");
        }
      });
      function playSelected() {
        var playRequest = audio.play();
        if (playRequest && typeof playRequest.then === "function") {
          playRequest.then(function () { updateMusic(true); }).catch(function () { updateMusic(false); });
        }
      }
      audio.addEventListener("pause", function () { updateMusic(false); });
      audio.addEventListener("play", function () { updateMusic(true); });
      function updateMusic(playing) {
        musicButton.classList.toggle("playing", playing);
        var icon = musicButton.querySelector(".music-icon");
        if (icon) icon.textContent = playing ? "Ⅱ" : "♫";
        if (musicPlayButton) {
          var playIcon = musicPlayButton.querySelector("span");
          var playLabel = musicPlayButton.querySelector("b");
          if (playIcon) playIcon.textContent = playing ? "Ⅱ" : "▶";
          if (playLabel) playLabel.textContent = playing ? (isEnglish ? "Pause music" : "إيقاف الموسيقى") : (isEnglish ? "Play selected music" : "تشغيل الموسيقى المختارة");
        }
        musicTracks.forEach(function (track) {
          var marker = track.querySelector("em");
          if (marker) marker.textContent = track.classList.contains("active") && playing ? "Ⅱ" : "▶";
        });
        musicButton.setAttribute("aria-label", isEnglish ? "Choose site music" : "اختيار موسيقى الموقع");
      }
    }
  });
})();

// Performance: pause the decorative hero video while it is off-screen.
(() => {
  const video = document.querySelector('.hero-video');
  if (!video || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      if (video.paused) video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  }, { threshold: 0.05 });
  observer.observe(video);
})();
