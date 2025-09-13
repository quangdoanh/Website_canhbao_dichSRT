// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-button-menu");
if (buttonMenuMobile) {
  const sider = document.querySelector(".sider");
  const siderOverlay = document.querySelector(".sider-overlay");

  buttonMenuMobile.addEventListener("click", () => {
    sider.classList.add("active");
    siderOverlay.classList.add("active");
  });

  siderOverlay.addEventListener("click", () => {
    sider.classList.remove("active");
    siderOverlay.classList.remove("active");
  });
}
// End Menu Mobile

//Sider
document.addEventListener("DOMContentLoaded", () => {
  const allLinks = document.querySelectorAll(".sider .inner-menu li a");
  const dropdownLinks = document.querySelectorAll(".sider .inner-menu li.dropdown > a");

  // ✅ Mặc định chọn phần tử đầu tiên
  if (allLinks.length > 0) {
    allLinks[0].classList.add("active");
  }

  allLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Xóa active cũ
      allLinks.forEach(l => l.classList.remove("active"));

      // Đặt active cho link vừa click
      link.classList.add("active");

      const parentLi = link.parentElement;

      // Nếu là dropdown cha thì toggle submenu
      if (parentLi.classList.contains("dropdown")) {
        // Nếu muốn chỉ mở 1 submenu thì đóng các cái khác
        dropdownLinks.forEach(other => {
          if (other !== link) {
            other.parentElement.classList.remove("active");
          }
        });

        parentLi.classList.toggle("active");
      }
    });
  });
});

//End Sider

// menu -mobile
//End Sider

