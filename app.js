document.addEventListener("DOMContentLoaded", function () {
  const notificationBell = document.getElementById("notificationBell");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const menuButton = document.getElementById("menuButton");
  const menu = document.getElementById("menu");
  const initials = document.querySelector(".initials");
  const brandMenu = document.getElementById("brand");
  const menuItems = document.querySelectorAll(".menuitem_button");

  notificationBell.addEventListener("click", function (event) {
    toggleDropdown(notificationDropdown, notificationBell);
    closeDropdown(menu, menuButton, initials);
    event.stopPropagation();
  });

  notificationBell.tabIndex = 0;
  notificationBell.setAttribute("role", "button");
  notificationBell.setAttribute("aria-haspopup", "true");
  notificationBell.setAttribute("aria-expanded", "false");

  notificationBell.addEventListener("keydown", function (event) {
    if (
      (event.key === "Enter" || event.key === " ") &&
      notificationDropdown.style.display !== "flex"
    ) {
      toggleDropdown(notificationDropdown, notificationBell);
      event.preventDefault();
    } else if (event.key === "Escape") {
      closeDropdown(notificationDropdown, notificationBell);
    }
  });

  menuButton.addEventListener("click", function (event) {
    toggleDropdown(menu, menuButton);
    closeDropdown(notificationDropdown, notificationBell);
    event.stopPropagation();
  });

  menuButton.addEventListener("keydown", function (event) {
    if (menu.style.display === "flex") {
      if (event.key === "Escape") {
        closeDropdown(menu, menuButton);
      }
    } else {
      if (
        (event.key === "Enter" || event.key === " ") &&
        menu.style.display !== "flex"
      ) {
        toggleDropdown(menu, menuButton);
        event.preventDefault();
      }
    }
  });

  initials.addEventListener("click", function (event) {
    toggleDropdown(menu, initials);
    closeDropdown(notificationDropdown, notificationBell);
    event.stopPropagation();
  });

  initials.addEventListener("keydown", function (event) {
    if (menu.style.display === "flex") {
      if (event.key === "Escape") {
        closeDropdown(menu, initials);
      }
    } else {
      if (
        (event.key === "Enter" || event.key === " ") &&
        menu.style.display !== "flex"
      ) {
        toggleDropdown(menu, initials);
        event.preventDefault();
      }
    }
  });

  document.addEventListener("click", function (event) {
    if (
      !notificationBell.contains(event.target) &&
      !notificationDropdown.contains(event.target)
    ) {
      closeDropdown(notificationDropdown, notificationBell);
    }

    if (
      !(menuButton.contains(event.target) || initials.contains(event.target)) &&
      !menu.contains(event.target)
    ) {
      closeDropdown(menu, menuButton, initials);
    }
  });

  brandMenu.addEventListener("click", function (event) {
    const isOpen = menu.style.display === "flex";

    if (isOpen) {
      closeDropdown(menu, menuButton, initials);
      brandMenu.focus();
    } else {
      toggleDropdown(menu, menuButton);
      const firstMenuItem = menuItems[0];
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    }

    event.stopPropagation();
  });

  document.addEventListener("keydown", function (event) {
    const isOpen = menu.style.display === "flex";

    if (isOpen) {
      const currentIndex = Array.from(menuItems).indexOf(
        document.activeElement
      );

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        const nextIndex = (currentIndex + 1) % menuItems.length;
        menuItems[nextIndex].focus();
        changeBorderColor(menuItems[nextIndex], "#005bd3");
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        const prevIndex =
          (currentIndex - 1 + menuItems.length) % menuItems.length;
        menuItems[prevIndex].focus();
        changeBorderColor(menuItems[prevIndex], "#005bd3");
      } else if (event.key === "Escape") {
        closeDropdown(menu, menuButton, initials);
        brandMenu.focus();
      }

      event.preventDefault();
    }
  });
});

function toggleDropdown(dropdown, trigger) {
  const computedStyle = window.getComputedStyle(dropdown);
  const isVisible = computedStyle.getPropertyValue("display") !== "none";

  if (!isVisible) {
    closeOtherDropdowns(trigger);
    dropdown.style.display = "flex";
    trigger.classList.add("active");
    dropdown.style.animation = "slideInRight 0.5s forwards";
  } else {
    closeDropdown(dropdown, trigger);
  }
}

function closeDropdown(dropdown, trigger, otherTrigger = null) {
  const computedStyle = window.getComputedStyle(dropdown);
  const isVisible = computedStyle.getPropertyValue("display") !== "none";

  if (isVisible) {
    dropdown.style.animation = "slideOutRight 0.5s forwards";
    trigger.classList.remove("active");

    setTimeout(() => {
      dropdown.style.display = "none";
    }, 500);
  }

  if (otherTrigger) {
    const otherDropdown = document.getElementById("menu"); // Adjust the ID accordingly
    closeDropdown(otherDropdown, otherTrigger);
  }
}

function closeOtherDropdowns(currentTrigger) {
  const dropdowns = document.querySelectorAll(".dropdown"); // Adjust the class accordingly

  dropdowns.forEach((dropdown) => {
    if (
      dropdown.style.display === "flex" &&
      dropdown.previousElementSibling !== currentTrigger
    ) {
      closeDropdown(dropdown, dropdown.previousElementSibling);
    }
  });
}

function dismissTrialCallout() {
  var promoSection = document.querySelector(".promo-section");

  promoSection.classList.toggle("hidden");

  if (promoSection.classList.contains("hidden")) {
    promoSection.addEventListener(
      "animationend",
      function () {
        promoSection.style.display = "none";
      },
      { once: true }
    );
  }
}

function changeBorderColor(element, color) {
  menuItems.forEach((item) => {
    item.style.borderColor = "transparent";
  });

  element.style.borderColor = color;
}

const navbar = document.querySelector(".navbar");
window.addEventListener("resize", () => {
  if (window.innerWidth <= 600) {
    navbar.classList.add("mobile");
  } else {
    navbar.classList.remove("mobile");
  }
});

function toggleOnboardingCard() {
  // Get the onboarding card element
  const onboardingCard = document.getElementById("onboardingSteps");

  // Get the arrow icons
  const arrowUp = document.querySelector(".arrow-up");
  const arrowDown = document.querySelector(".arrow-down");

  // Toggle the display style of the onboarding card
  onboardingCard.style.display =
    onboardingCard.style.display === "none" ||
    onboardingCard.style.display === ""
      ? "block"
      : "none";

  // Toggle the display style of the arrow icons based on the state of the onboarding card
  arrowUp.style.display =
    onboardingCard.style.display === "block" ? "block" : "none";
  arrowDown.style.display =
    onboardingCard.style.display === "none" ? "block" : "none";
}

const progressText = document.getElementById("progressText");
const progressInnerBar = document.getElementById("progressInnerBar");

const buttons = document.querySelectorAll(".shopping-item-checkbox");

let completedCount = 0;

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const completedIcon = button.querySelector(".completed-icon");
    const notCompletedIcon = button.querySelector(".not-completed-icon");

    if (completedIcon.classList.contains("hidden")) {
      // Button is not completed, mark it as completed
      completedIcon.classList.remove("hidden");
      notCompletedIcon.classList.add("hidden");
      completedCount++;
    } else {
      // Button is completed, mark it as not completed
      completedIcon.classList.add("hidden");
      notCompletedIcon.classList.remove("hidden");
      completedCount--;
    }

    // Ensure the completedCount does not go below 0 or exceed the total count
    completedCount = Math.min(buttons.length, Math.max(0, completedCount));

    // Update progress bar
    const totalCount = buttons.length;
    progressText.textContent = `${completedCount}/${totalCount} completed`;
    const progressPercentage = (completedCount / totalCount) * 100;
    progressInnerBar.style.width = `${progressPercentage}%`;
  });
});

const hiddenClass = "hidden";
const markedAsDone = "checkbox-done";
const shoppingItems = document.querySelectorAll(".shopping-item-checkbox");

function showElement(element) {
  element.classList.remove(hiddenClass);
}

function hideElement(element) {
  element.classList.add(hiddenClass);
}

function setLoadingState(
  loadingSpinnerIcon,
  completedIcon,
  notCompletedIcon,
  checkboxButtonStatus
) {
  hideElement(completedIcon);
  hideElement(notCompletedIcon);
  showElement(loadingSpinnerIcon);
  checkboxButtonStatus.setAttribute("aria-label", "Loading, please wait...");
}

function handleButtonClick(event) {
  const checkboxButton = event.currentTarget;
  const notCompletedIcon = checkboxButton.querySelector(".not-completed-icon");
  const completedIcon = checkboxButton.querySelector(".completed-icon");
  const loadingSpinnerIcon = checkboxButton.querySelector(
    ".loading-spinner-icon"
  );
  const checkboxButtonStatus = checkboxButton.nextElementSibling; // Assuming status is the next sibling element

  setLoadingState(
    loadingSpinnerIcon,
    completedIcon,
    notCompletedIcon,
    checkboxButtonStatus
  );

  setTimeout(() => {
    hideElement(loadingSpinnerIcon);

    if (checkboxButton.classList.contains(markedAsDone)) {
      showElement(notCompletedIcon);
      hideElement(completedIcon);
      checkboxButton.setAttribute(
        "aria-label",
        checkboxButton
          .getAttribute("aria-label")
          .replace("as done", "as not done")
      );
      checkboxButtonStatus.setAttribute("aria-label", "Not done, Not Done...");
    } else {
      showElement(completedIcon);
      hideElement(notCompletedIcon);
      checkboxButton.setAttribute(
        "aria-label",
        checkboxButton
          .getAttribute("aria-label")
          .replace("as not done", "as done")
      );
      checkboxButtonStatus.setAttribute(
        "aria-label",
        "Successfully done, Done..."
      );
    }

    checkboxButton.classList.toggle(markedAsDone);
  }, 1500);
}

shoppingItems.forEach((item) => {
  item.addEventListener("click", handleButtonClick);
});

const steps = document.querySelectorAll(".shopping-item");
const contents = document.querySelectorAll(".onboarding-content");

steps.forEach((step, index) => {
  step.addEventListener("click", () => {
    if (!step.classList.contains("active")) {
      // Close all open steps
      steps.forEach((s) => {
        s.classList.remove("active");
      });

      contents.forEach((content) => {
        content.style.display = "none";
      });

      // Open the clicked step
      step.classList.add("active");
      contents[index].style.display = "block";
    }
  });
});
