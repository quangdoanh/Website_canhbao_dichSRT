// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-menu-mobile");
if (buttonMenuMobile) {
  const menu = document.querySelector(".header .inner-menu");

  // Click vào button mở menu
  buttonMenuMobile.addEventListener("click", () => {
    menu.classList.add("active");
  });

  // Click vào overlay đóng menu
  const overlay = menu.querySelector(".inner-overlay");
  if (overlay) {
    overlay.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  }

  // Click vào icon down mở sub menu
  const listButtonSubMenu = menu.querySelectorAll("ul > li > i");
  listButtonSubMenu.forEach((button) => {
    button.addEventListener("click", () => {
      button.parentNode.classList.toggle("active");
    });
  });
}
// End Menu Mobile

// Doanh
// Swiper Section 3
const swiperSection3 = document.querySelector(".swiper-section-3");
if (swiperSection3) {
  new Swiper('.swiper-section-3', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
}
// End Swiper Section 3
// end Doanh
// Logout 
// dùng riêng js cilent

const buttonLogout = document.querySelector(".logout");
console.log(buttonLogout)
if (buttonLogout) {
  buttonLogout.addEventListener("click", () => {
    fetch(`/admin/account/logout`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          console.log('Đăng xuất nè')
          window.location.href = `/`;
        }
      });
  });
}
// End Logout

//contact-create-form
const contactCreateForm = document.querySelector("#contact-create-form");
if (contactCreateForm) {
  const validation = new JustValidate("#contact-create-form");

  validation
    .addField("#full_name", [
      { rule: "required", errorMessage: "Vui lòng nhập họ và tên!" }
    ])
    .addField("#email", [
      { rule: "required", errorMessage: "Vui lòng nhập email!" },
      { rule: "email", errorMessage: "Email không đúng định dạng!" }
    ])
    .addField("#message", [
      { rule: "required", errorMessage: "Vui lòng nhập nội dung!" }
    ])
    .onSuccess((event) => {
      event.preventDefault(); // Ngăn submit mặc định
      const data = {
        full_name: event.target.full_name.value,
        email: event.target.email.value,
        phone: event.target.phone.value,
        message: event.target.message.value
      };
      console.log(data);
      fetch(`contact/create`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === "success") {
            contactForm.reset();
          } else {
            alert(data.message || "Có lỗi xảy ra, vui lòng thử lại!");
          }
        })
        .catch(err => {
          console.error(err);
          alert("Có lỗi xảy ra, vui lòng thử lại!");
        });
    });
}

//end-contact-create-form
