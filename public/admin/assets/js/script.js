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
const sider = document.querySelector(".sider");
if (sider) {
  const pathNameCurrent = window.location.pathname;
  const splitPathNameCurrent = pathNameCurrent.split("/");



  const menuList = sider.querySelectorAll(".dashboard");
  menuList.forEach(item => {
    const href = item.href;
    const pathName = new URL(href).pathname;
    const splitPathName = pathName.split("/");
    if (splitPathNameCurrent[1] == splitPathName[1] && splitPathNameCurrent[2] == splitPathName[2]) {
      item.classList.add("active");
    }


  })

  const menuItems = document.querySelectorAll('.item_menu');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {

      if (item.classList.contains('open')) {
        // Nếu item đang active → bỏ active
        item.classList.remove('open');
      } else {
        // Nếu item khác → bỏ active ở tất cả, rồi thêm active cho item hiện tại
        menuItems.forEach(i => i.classList.remove('active'));
        menuList.forEach(i => i.classList.remove('active', `open`));
        item.classList.add('active', 'open');
      }
    });
  });

  const cityItems = document.querySelectorAll('.item_city');

  cityItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('open')) {
        // Nếu item đang active → bỏ active
        item.classList.remove('open');
      } else {
        // Nếu item khác → bỏ active ở tất cả, rồi thêm active cho item hiện tại
        cityItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active', 'open');
      }
    })
  })

  // active theo url 
  let submenuLinks = sider.querySelectorAll(".menu");
  console.log(submenuLinks)
  submenuLinks.forEach(link => {
    const href = link.href;
    const pathName = new URL(href).pathname;
    const splitPathName = pathName.split("/");

    if (splitPathNameCurrent[3] == splitPathName[3] && splitPathNameCurrent[2] == splitPathName[2] &&
      splitPathNameCurrent[4] == splitPathName[4]) {
      // Active link con
      // console.log("đg dan", splitPathName[3])
      // console.log("đg dan 2", splitPathName[4])
      // console.log("đg dan ban dau", splitPathNameCurrent[3])
      // console.log("đg dan ban dau", splitPathNameCurrent[4])
      // console.log("them class", link)

      link.classList.add("actives");

      // Active luôn city cha (mở ra)
      const cityDiv = link.closest("ul.submenu-child")?.previousElementSibling;
      if (cityDiv && cityDiv.classList.contains("item_city")) {
        cityDiv.classList.add("active", "open");
      }

      // Active menu cha
      const itemMenu = link.closest("ul.submenu")?.previousElementSibling;
      if (itemMenu && itemMenu.classList.contains("item_menu")) {
        itemMenu.classList.add("active", "open");
      }
      menuList.forEach(i => i.classList.remove('active', `open`));


    }
  });

  let submenu2Links = sider.querySelectorAll(".menu2");
  submenu2Links.forEach(link => {
    const href = link.href;
    const pathName = new URL(href).pathname;
    const splitPathName = pathName.split("/");

    if (splitPathNameCurrent[1] == splitPathName[1] && splitPathNameCurrent[2] == splitPathName[2] && splitPathNameCurrent[3] == splitPathName[3]) {
      // Active link con
      // console.log("đg dan", splitPathName[3])
      // console.log("đg dan 2", splitPathName[4])
      // console.log("đg dan ban dau", splitPathNameCurrent[3])
      // console.log("đg dan ban dau", splitPathNameCurrent[4])
      // console.log("them class", link)

      link.classList.add("actives");

      // Active menu cha
      const itemMenu = link.closest("ul.submenu2")?.previousElementSibling; // lấy anh của phần tử ul.submenu
      if (itemMenu && itemMenu.classList.contains("item_menu")) {
        itemMenu.classList.add("active", "open");
      }
      menuList.forEach(i => i.classList.remove('active', `open`));


    }
  })

}
//End Sider

// Logout
const buttonLogout = document.querySelector(".sider .inner-logout");
if (buttonLogout) {
  buttonLogout.addEventListener("click", () => {
    fetch(`/${pathAdmin}/account/logout`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          window.location.href = `/${pathAdmin}/account/login`;
        }
      });
  });
}
// End Logout
// Alert
const alertTime = document.querySelector("[alert-time]");
if (alertTime) {
  let time = alertTime.getAttribute("alert-time");
  time = time ? parseInt(time) : 4000;
  setTimeout(() => {
    alertTime.remove(); // Xóa phần tử khỏi giao diện
  }, time);
}
// End Alert

// Filepond Image
const listFilepondImage = document.querySelectorAll("[filepond-image]");
let filePond = {};
if (listFilepondImage.length > 0) {
  listFilepondImage.forEach((filepondImage) => {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);

    let files = null;
    const elementImageDefault = filepondImage.closest("[image-default]");
    if (elementImageDefault) {
      const imageDefault = elementImageDefault.getAttribute("image-default");
      if (imageDefault) {
        files = [
          {
            source: imageDefault, // Đường dẫn ảnh
          },
        ];
      }
    }

    filePond[filepondImage.name] = FilePond.create(filepondImage, {
      labelIdle: "+",
      files: files,
    });
  });
}
// End Filepond Image
// Filepond Image Multi
const listFilepondImageMulti = document.querySelectorAll(
  "[filepond-image-multi]"
);
let filePondMulti = {};
if (listFilepondImageMulti.length > 0) {
  listFilepondImageMulti.forEach((filepondImage) => {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);

    let files = null;
    const elementListImageDefault = filepondImage.closest(
      "[list-image-default]"
    );
    if (elementListImageDefault) {
      let listImageDefault =
        elementListImageDefault.getAttribute("list-image-default");
      if (listImageDefault) {
        listImageDefault = JSON.parse(listImageDefault);
        files = [];
        listImageDefault.forEach((image) => {
          files.push({
            source: image, // Đường dẫn ảnh
          });
        });
      }
    }

    filePondMulti[filepondImage.name] = FilePond.create(filepondImage, {
      labelIdle: "+",
      files: files,
    });
  });
}
// End Filepond Image Multi


//  User Create Form
const UserCreateForm = document.querySelector(
  "#user-create-form"
);
if (UserCreateForm) {
  const validation = new JustValidate("#user-create-form");

  validation
    .addField("#fullName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự!",
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!",
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!",
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái thường!",
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ số!",
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const province = event.target.province.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("role", role);
      formData.append("status", status);
      formData.append("password", password);
      formData.append("province", province)
      formData.append("avatar", avatar);

      fetch(`/${pathAdmin}/user/create`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            alert(data.message);
          }
          if (data.code == "success") {
            window.location.href = `/${pathAdmin}/user/list`;
          }
        });
    });
}

//  User Create Form

//  User Edit Form
const UserEditForm = document.querySelector(
  "#user-edit-form"
);
if (UserEditForm) {
  const validation = new JustValidate("#user-edit-form");

  validation
    .addField("#fullName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự!",
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .addField("#password", [
      {
        validator: (value) => value ? value.length >= 8 : true,
        errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
      },
      {
        validator: (value) => value ? /[A-Z]/.test(value) : true,
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
      },
      {
        validator: (value) => value ? /[a-z]/.test(value) : true,
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
      },
      {
        validator: (value) => value ? /\d/.test(value) : true,
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
      },
      {
        validator: (value) => value ? /[@$!%*?&]/.test(value) : true,
        errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const province = event.target.province.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("role", role);
      formData.append("status", status);
      formData.append("password", password);
      formData.append("province", province)
      formData.append("avatar", avatar);

      fetch(`/${pathAdmin}/user/edit/${id}`, {
        method: "PATCH",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            alert(data.message);
          }
          if (data.code == "success") {
            window.location.href = `/${pathAdmin}/user/list`;
          }
        });
    });
}

//  User Edit Form
// Button Delete
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
  listButtonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const dataApi = button.getAttribute("data-api");
      fetch(dataApi, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            alert(data.message);
          }
          if (data.code == "success") {
            window.location.reload();
          }
        });
    });
  });
}

// End Button Delete
//check-all
const checkAll = document.querySelector("[check-all]");
if (checkAll) {
  checkAll.addEventListener("click", () => {
    const listCheckItem = document.querySelectorAll("[check-item]");
    listCheckItem.forEach((item) => {
      item.checked = checkAll.checked;
    });
  });
}
//end check-all

// Change multi
const changeMulti = document.querySelector("[change-multi]");
if (changeMulti) {
  const dataApi = changeMulti.getAttribute("data-api");
  const select = changeMulti.querySelector("select");
  const button = changeMulti.querySelector("button");

  button.addEventListener("click", () => {
    const option = select.value;
    const listInputChecked = document.querySelectorAll("[check-item]:checked");
    if (option && listInputChecked.length > 0) {
      const ids = [];
      listInputChecked.forEach((item) => {
        const id = item.getAttribute("check-item");
        ids.push(id);
      });
      const dataFinal = {
        option: option,
        ids: ids,
      };
      fetch(dataApi, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            alert(data.message);
          }
          if (data.code == "success") {
            window.location.reload();
          }
        });
    } else {
      alert("Vui lòng chọn option và bản ghi muốn thực hiện!");
    }
  });
}
// End Change multi
// filter status
const filterStatus = document.querySelector("[filter-status]");
if (filterStatus) {
  const url = new URL(window.location.href);
  //lắng nghe thay đổi lựa chọn
  filterStatus.addEventListener("change", () => {
    const value = filterStatus.value;
    if (value) {
      url.searchParams.set("status", value);
    } else {
      url.searchParams.delete("status");
    }
    window.location.href = url.href;
  });
  //hiển thị cái lựa chọn mặc định
  const valueCurrent = url.searchParams.get("status");
  if (valueCurrent) {
    filterStatus.value = valueCurrent;
  }
}
// end filter status
// Filter start date
const filterStartDate = document.querySelector("[filter-start-date]");
if (filterStartDate) {
  const url = new URL(window.location.href);
  //lăng nghe sự thay đổi
  filterStartDate.addEventListener("change", () => {
    const value = filterStartDate.value;
    if (value) {
      url.searchParams.set("startDate", value);
    } else {
      url.searchParams.delete("startDate");
    }
    window.location.href = url.href;
  });
  const valueCurrent = url.searchParams.get("startDate");
  if (valueCurrent) {
    filterStartDate.value = valueCurrent;
  }
}
// end Filter start date
// Filter end date
const filterEndDate = document.querySelector("[filter-end-date]");
if (filterEndDate) {
  const url = new URL(window.location.href);
  //Lắng nghe sự thay đổi
  filterEndDate.addEventListener("change", () => {
    const value = filterEndDate.value;
    if (value) {
      url.searchParams.set("endDate", value);
    } else {
      url.searchParams.delete("endDate");
    }
    window.location.href = url.href;
  });

  const valueCurrent = url.searchParams.get("endDate");
  if (valueCurrent) {
    filterEndDate.value = valueCurrent;
  }
}
// End Filter end date
// Filter Role
const filterRole = document.querySelector("[filter-role]");
if (filterRole) {
  const url = new URL(window.location.href);

  // Lắng nghe thay đổi lựa chọn
  filterRole.addEventListener("change", () => {
    const value = filterRole.value;
    if (value) {
      url.searchParams.set("role", value);
    } else {
      url.searchParams.delete("role");
    }

    window.location.href = url.href;
  })

  // Hiển thị lựa chọn mặc định
  const valueCurrent = url.searchParams.get("role");
  if (valueCurrent) {
    filterRole.value = valueCurrent;
  }
}
// End Filter Role
// Filter reset
const filterReset = document.querySelector("[filter-reset]");
if (filterReset) {
  const url = new URL(window.location.href);
  filterReset.addEventListener("click", () => {
    url.search = "";
    window.location.href = url.href;
  });
}
// Filter reset
// Search
const search = document.querySelector("[search]");
if (search) {
  const url = new URL(window.location.href);
  search.addEventListener("keyup", (event) => {
    if (event.code == "Enter") {
      const value = search.value;
      if (value) {
        url.searchParams.set("keyword", value.trim());
      } else {
        url.searchParams.delete("keyword");
      }

      window.location.href = url.href;
    }
  });
  const valueCurrent = url.searchParams.get("keyword");
  if (valueCurrent) {
    search.value = valueCurrent;
  }
}
// End Search

// Role Create Form
const roleCreateForm = document.querySelector(
  "#role-create-form"
);
if (roleCreateForm) {
  const validation = new JustValidate("#role-create-form");

  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên nhóm quyền!",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      // permissions
      const listElementPermission = roleCreateForm.querySelectorAll(
        'input[name="permissions"]:checked'
      );
      listElementPermission.forEach((input) => {
        permissions.push(input.value);
      });
      // End permissions
      const dataFinal = {
        name: name,
        description: description,
        permissions: permissions,
      };

      console.log(dataFinal);
      fetch(`/${pathAdmin}/role/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            alert(data.message);
          }
          if (data.code == "success") {
            window.location.href = `/${pathAdmin}/role/list`;
          }
        });
    });
}
// End Role Create Form
// Role edit Form
const roleEditForm = document.querySelector("#role-edit-form");
if (roleEditForm) {
  const validation = new JustValidate("#role-edit-form");

  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên nhóm quyền!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      // permissions
      const listElementPermission = roleEditForm.querySelectorAll(
        'input[name="permissions"]:checked'
      );
      listElementPermission.forEach((input) => {
        permissions.push(input.value);
      });
      // End permissions
      const dataFinal = {
        id: id,
        name: name,
        description: description,
        permissions: permissions,
      };

      fetch(`/${pathAdmin}/role/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            alert(data.message);
          }
          if (data.code == "success") {
            window.location.href = `/${pathAdmin}/role/list`;
          }
        });
    });
}
//  Role edit Form





// SRT edit Form
const srtEditForm = document.querySelector("#srt-edit-form");

if (srtEditForm) {
  const validation = new JustValidate("#srt-edit-form");

  validation
    .addField("#tk", [{ rule: "required" }])
    .addField("#khoanh", [{ rule: "required" }])
    .addField("#lo", [{ rule: "required" }])
    .addField("#dtich", [{ rule: "required" }])
    .addField("#namtr", [{ rule: "required" }])
    .addField("#churung", [{ rule: "required" }])
    .addField("#phancap", [{ rule: "required" }])
    .addField("#huyen", [{ rule: "required" }]) // hidden input
    .addField("#xa", [{ rule: "required" }])    // hidden input
    .onSuccess((event) => {



      const id = event.target.id.value;
      const tk = event.target.tk.value;
      const khoanh = event.target.khoanh.value;
      const lo = event.target.lo.value;
      const dtich = event.target.dtich.value;
      const namtr = event.target.namtr.value;
      const churung = event.target.churung.value;
      const phancap = event.target.phancap.value;
      // Lấy giá trị Huyện, Xã, Id_tỉnh
      const huyen = event.target.huyen.value;
      const xa = event.target.xa.value;
      const matinh = event.target.matinh.value;
      const permissions = [];

      // permissions
      const listElementPermission = srtEditForm.querySelectorAll(
        'input[name="permissions"]:checked'
      );
      listElementPermission.forEach((input) => {
        permissions.push(input.value);
      });
      // End permissions
      const dataFinal = {
        id,
        tk,
        khoanh,
        lo,
        dtich,
        namtr,
        churung,
        phancap,
        huyen,
        xa,
        permissions: permissions,
      };
      console.log("data", dataFinal)

      fetch(`/${pathAdmin}/sauromthong/dulieusrt/${matinh}/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            alert(data.message);
          }
          if (data.code == "success") {
            alert(data.message);
            console.log("thành công")
            //window.location.href = `/${pathAdmin}/sauromthong/dulieusrt/${matinh}/list`;
          }
        });
    });
}
//  SRT edit Form




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

// Create Wrong
const CreateWrong = document.querySelector(".create-wrong")
console.log(CreateWrong)
if (CreateWrong) {
  CreateWrong.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Hệ thống đang nâng cấp")
  })
}
// end
