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
    .addField("#topic", [
      { rule: "required", errorMessage: "Vui lòng chọn chủ đề!" }
    ])
    .onSuccess((event) => {
      event.preventDefault(); // Ngăn submit mặc định
      const data = {
        full_name: event.target.full_name.value,
        email: event.target.email.value,
        phone: event.target.phone.value,
        message: event.target.message.value,
        topic: event.target.topic.value
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
            alert("Gửi yêu cầu thành công")
            contactCreateForm.reset();
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


//---------------------- FILTER --------------
// Filter Tinh
const filterTinh = document.querySelector("[filter-tinh]")
if (filterTinh) {
  const url = new URL(window.location.href)
  filterTinh.addEventListener("change", () => {
    const value = filterTinh.value
    if (value) {
      url.searchParams.set("tinh", value)
      // Xóa param huyện khi chọn tỉnh mới
      url.searchParams.delete("huyen")
    } else {
      url.searchParams.delete("tinh")
      url.searchParams.delete("huyen") // Xóa luôn để chắc chắn
    }
    window.location.href = url.href
  })

  // hiển thị mặc định
  const valueCurrent = url.searchParams.get("tinh")
  if (valueCurrent)
    filterTinh.value = valueCurrent
}


const filterHuyen = document.querySelector("[filter-huyen]")
console.log("huyen", filterHuyen)
if (filterHuyen) {
  const url = new URL(window.location.href)
  filterHuyen.addEventListener("change", () => {
    const value = filterHuyen.value
    if (value) {
      url.searchParams.set("huyen", value)
    } else {
      url.searchParams.delete("huyen")
    }
    window.location.href = url.href
  })
  // hiển thị mặc định

  const valueCurrent = url.searchParams.get("huyen")
  if (valueCurrent)
    filterHuyen.value = valueCurrent
}
// End


// faq
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const question = item.querySelector(".question");

  question.addEventListener("click", () => {
    // Đóng tất cả trước
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
        otherItem.querySelector(".answer").style.display = "none";
      }
    });

    // Toggle cho item hiện tại
    item.classList.toggle("active");
    const answer = item.querySelector(".answer");
    if (item.classList.contains("active")) {
      answer.style.display = "block";
    } else {
      answer.style.display = "none";
    }
  });
});
// pagination
const pagination = document.querySelector("[pagination]");
if (pagination) {
  const url = new URL(window.location.href);
  pagination.addEventListener("change", () => {
    const value = pagination.value;
    if (value) {
      url.searchParams.set("page", value);
    } else {
      url.searchParams.delete("page");
    }
    window.location.href = url.href;
  });
  const valueCurrent = url.searchParams.get("page");
  if (valueCurrent) {
    pagination.value = valueCurrent;
  }
}
// end pagination