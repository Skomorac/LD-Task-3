class SwiperSection {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.swiper = null;
    this.toggleBtn = this.container.querySelector(".swiper-section__toggle");
    this.leftArrowBtn = this.container.querySelector(
      ".swiper-section__nav--left"
    );
    this.rightArrowBtn = this.container.querySelector(
      ".swiper-section__nav--right"
    );
    this.imagesContainer = this.container.querySelector(
      ".swiper-section__images"
    );
    this.wrapper = this.container.querySelector(".swiper-wrapper");
    this.isActive = false;
    this.currentIndex = 0;
    this.handleToggle = this.handleToggle.bind(this);
    this.handleLeftArrow = this.handleLeftArrow.bind(this);
    this.handleRightArrow = this.handleRightArrow.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.lastIsDesktop = this.isDesktop();
    this.initToggle();
    this.initArrows();
    window.addEventListener("resize", this.handleResize);
    this.init();
  }

  isDesktop() {
    return window.innerWidth >= 1024;
  }

  handleResize() {
    const isDesktopNow = this.isDesktop();
    if (isDesktopNow !== this.lastIsDesktop) {
      if (this.isActive) {
        this.destroy();
        this.init();
      }
      this.lastIsDesktop = isDesktopNow;
    }
  }

  initToggle() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", this.handleToggle);
    }
  }

  initArrows() {
    if (this.leftArrowBtn) {
      this.leftArrowBtn.addEventListener("click", this.handleLeftArrow);
    }
    if (this.rightArrowBtn) {
      this.rightArrowBtn.addEventListener("click", this.handleRightArrow);
    }
  }

  handleLeftArrow() {
    if (this.isActive && this.swiper) {
      this.swiper.slidePrev();
    }
  }

  handleRightArrow() {
    if (this.isActive && this.swiper) {
      this.swiper.slideNext();
    }
  }

  handleToggle() {
    if (this.isActive) {
      this.destroy();
    } else {
      this.init();
    }
  }

  updateArrows() {
    if (!this.isActive || !this.swiper) {
      if (this.leftArrowBtn) this.leftArrowBtn.style.display = "none";
      if (this.rightArrowBtn) this.rightArrowBtn.style.display = "none";
      return;
    }
    if (this.isDesktop()) {
      // On desktop, always show both arrows
      if (this.leftArrowBtn) this.leftArrowBtn.style.display = "";
      if (this.rightArrowBtn) this.rightArrowBtn.style.display = "";
      return;
    }
    const idx = this.swiper.activeIndex;
    const lastIdx = this.swiper.slides.length - 1;
    if (idx === 0) {
      if (this.leftArrowBtn) this.leftArrowBtn.style.display = "none";
      if (this.rightArrowBtn) this.rightArrowBtn.style.display = "";
    } else if (idx === lastIdx) {
      if (this.leftArrowBtn) this.leftArrowBtn.style.display = "";
      if (this.rightArrowBtn) this.rightArrowBtn.style.display = "none";
    } else {
      if (this.leftArrowBtn) this.leftArrowBtn.style.display = "";
      if (this.rightArrowBtn) this.rightArrowBtn.style.display = "";
    }
  }

  getSwiperConfig() {
    if (this.isDesktop()) {
      return {
        slidesPerView: 3,
        spaceBetween: 8,
        loop: false,
        initialSlide: this.currentIndex,
        on: {
          slideChange: () => {
            if (this.swiper) {
              this.currentIndex = this.swiper.activeIndex;
              console.log("Active slide:", this.swiper.activeIndex);
              this.updateArrows();
            }
          },
          afterInit: () => {
            this.updateArrows();
          },
        },
      };
    } else {
      return {
        slidesPerView: "auto",
        spaceBetween: 8,
        loop: false,
        initialSlide: this.currentIndex,
        on: {
          slideChange: () => {
            if (this.swiper) {
              this.currentIndex = this.swiper.activeIndex;
              console.log("Active slide:", this.swiper.activeIndex);
              this.updateArrows();
            }
          },
          afterInit: () => {
            this.updateArrows();
          },
        },
      };
    }
  }

  init() {
    if (!this.container || this.swiper) return;
    if (this.imagesContainer) {
      this.imagesContainer.classList.remove("swiper-section__images--disabled");
    }
    if (this.wrapper) {
      this.wrapper.classList.remove("swiper-wrapper--disabled");
    }
    if (this.toggleBtn) {
      this.toggleBtn.classList.remove("swiper-section__toggle--disabled");
      this.toggleBtn.textContent = "Destroy Swiper";
    }
    this.swiper = new Swiper(".swiper-section__images", this.getSwiperConfig());
    this.isActive = true;
    this.updateArrows();
  }

  destroy() {
    if (this.swiper) {
      this.currentIndex = this.swiper.activeIndex;
      this.swiper.destroy(true, true);
      this.swiper = null;
      this.isActive = false;
      if (this.toggleBtn) {
        this.toggleBtn.classList.add("swiper-section__toggle--disabled");
        this.toggleBtn.textContent = "Swiper Disabled";
      }
      if (this.imagesContainer) {
        this.imagesContainer.classList.add("swiper-section__images--disabled");
      }
      if (this.wrapper) {
        this.wrapper.classList.add("swiper-wrapper--disabled");
      }
      if (this.leftArrowBtn) this.leftArrowBtn.style.display = "none";
      if (this.rightArrowBtn) this.rightArrowBtn.style.display = "none";
    }
  }
}

// Initialize when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  window.swiperSection = new SwiperSection(".swiper-section");
});
