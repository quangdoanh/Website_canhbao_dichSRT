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

  // Pagination 
  const Pagination = document.querySelector("[pagination]")

  if (Pagination) {
    const url = new URL(window.location.href) // tạo 1 url tại đia chỉ hiện tại

    Pagination.addEventListener("change", () => {
      const option = Pagination.value
      if (option) {
        url.searchParams.set("page", option)
      } else {
        url.searchParams.delete("page")
      }
      console.log(option)

      window.location.href = url.href
    })

    // Hiển thị mặc định
    const valueCurrent = url.searchParams.get("page")
    if (valueCurrent) {
      Pagination.value = valueCurrent
    }


  }

  // end

  // active theo url 

  /*
  =============
  SÂU RÓM THÔNG
  ===============
  */
  let submenuLinks = sider.querySelectorAll(".menusrt");
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

    if (splitPathNameCurrent[1] == splitPathName[1] && splitPathNameCurrent[2] == splitPathName[2] && splitPathNameCurrent[3] == splitPathName[3] && splitPathNameCurrent[4] == splitPathName[4]) {
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


// FilePond RAR
const fileRarInput = document.querySelector("#file");
let filePondRar = null;

if (fileRarInput) {
  // Đăng ký plugin nếu cần (chỉ cần FileValidateType)
  FilePond.registerPlugin(FilePondPluginFileValidateType);

  filePondRar = FilePond.create(fileRarInput, {
    acceptedFileTypes: ['.rar'],
    labelIdle: "Kéo thả hoặc nhấp để chọn file .rar",
    maxFileSize: "50MB",
  });
}

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
      const ma_tinh = event.target.ma_tinh.value;

      const data = {
        fullName: fullName,
        email: email,
        phone: phone,
        role: role,
        status: status,
        password: password,
        ma_tinh: ma_tinh

      }
      fetch(`/${pathAdmin}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",   // THÊM DÒNG NÀY
        },
        body: JSON.stringify(data),
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
      const ma_tinh = event.target.ma_tinh.value;

      const data = {
        fullName: fullName,
        email: email,
        phone: phone,
        role: role,
        status: status,
        password: password,
        ma_tinh: ma_tinh

      }

      fetch(`/${pathAdmin}/user/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",   // THÊM DÒNG NÀY
        },
        body: JSON.stringify(data),
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


// Filter name
const filterName = document.querySelector("[filter-name]")

if (filterName) {
  const url = new URL(window.location.href)
  filterName.addEventListener("change", () => {
    const value = filterName.value
    if (value) {
      url.searchParams.set("name", value)
    } else {
      url.searchParams.delete("name")
    }
    window.location.href = url.href
  })
  // hiển thị mặc định
  const valueCurrent = url.searchParams.get("name")
  if (valueCurrent) {
    filterName.value = valueCurrent
  }
  console.log(filterName.value)
  console.log("-------")
  console.log(valueCurrent)

}
// end filter method

const filterMethod = document.querySelector("[filter-method]")

if (filterMethod) {
  const url = new URL(window.location.href)
  filterMethod.addEventListener("change", () => {
    const value = filterMethod.value
    if (value) {
      url.searchParams.set("method", value)
    } else {
      url.searchParams.delete("method")
    }
    window.location.href = url.href
  })
  // hiển thị mặc định
  const valueCurrent = url.searchParams.get("method")
  if (valueCurrent) {
    filterMethod.value = valueCurrent
  }
}
// end Filter 


// 

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
    .onSuccess((event) => {
      const id = event.target.id.value;
      const phancap = event.target.phancap.value;
      const dataFinal = {
        id,
        phancap
      };
      console.log("data", dataFinal)

      fetch(`/${pathAdmin}/sauromthong/edit/${id}`, {
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
// About Create Form
const aboutCreateForm = document.querySelector("#about-create-form");
if (aboutCreateForm) {
  const validation = new JustValidate("#about-create-form");

  validation
    .addField("#title", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tiêu đề!",
      },
    ])
    .onSuccess((event) => {
      const title = event.target.title.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const content = tinymce.get("content").getContent();
      //Tạo formData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("avatar", avatar);
      formData.append("content", content);

      fetch(`/${pathAdmin}/about/create`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Dữ liệu trả về:", data);
          if (data.code == "error") {
            alert(data.message);
          }
          if (data.code == "success") {
            window.location.href = `/${pathAdmin}/about/list`;
          }
        });
    });
}
// End About Create Form

// About Edit Form
const aboutEditForm = document.querySelector("#about-edit-form");
if (aboutEditForm) {
  const validation = new JustValidate("#about-edit-form");

  validation
    .addField("#title", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tiêu đề!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const title = event.target.title.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
        const avatarInput = event.target.avatar; // Lấy chính input
        const imageDefault = avatarInput.getAttribute("image-default");
        if (imageDefault && imageDefault.includes(avatar.name)) {
          avatar = null;
        }
      }
      const content = tinymce.get("content").getContent();
      //Tạo formData
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", title);
      formData.append("avatar", avatar);
      formData.append("content", content);

      fetch(`/${pathAdmin}/about/edit/${id}`, {
        method: "PATCH",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Dữ liệu trả về:", data);
          if (data.code == "error") {
            alert(data.message);
          }
          if (data.code == "success") {
            window.location.href = `/${pathAdmin}/about/list`;
          }
        });
    });
}
// End About Edit Form
//change-status-about
const toggleStatusInputs = document.querySelectorAll("[toggle-status], [toggle-public]");

if (toggleStatusInputs) {
  toggleStatusInputs.forEach(input => {
    input.addEventListener("change", async (e) => {
      const api = e.target.getAttribute("data-api");
      // nếu là toggle-status thì gửi số 1/0, còn toggle-public thì gửi true/false
      const isStatus = e.target.hasAttribute("toggle-status");
      const payload = isStatus 
        ? { status: e.target.checked ? 1 : 0 } 
        : { isPublic: e.target.checked };

      try {
        const res = await fetch(api, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.code === "success") {
          window.location.reload();
        } else {
          alert("Cập nhật thất bại: " + data.message);
          e.target.checked = !e.target.checked; // rollback
        }

      } catch (err) {
        alert("Có lỗi kết nối!");
        e.target.checked = !e.target.checked;
      }
    });
  });
}

//end change-status-about



// contact answer Form
const contactAnswerForm = document.querySelector("#contact-answer-form");
if (contactAnswerForm) {
  const validation = new JustValidate("#contact-answer-form");

  validation
    .addField("#answer", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập phản hồi!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const answer = event.target.answer.value;

      const data = {
        id: id,
        answer: answer
      };

      fetch(`/${pathAdmin}/contact/answer/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Dữ liệu trả về:", data);
          if (data.code == "error") {
            alert(data.message);
          }
          if (data.code == "success") {
            window.location.href = `/${pathAdmin}/contact/list`;
          }
        });
    });
}
// End contact answer Form
// button -contact-answer-form
const answerInput = document.getElementById("answer");
const updateBtn = document.getElementById("updateBtn");

if (answerInput && updateBtn) {
  const originalValue = answerInput.value;

  answerInput.addEventListener("input", () => {
    if (answerInput.value.trim() !== originalValue.trim()) {
      updateBtn.style.display = "inline-block";
    } else {
      updateBtn.style.display = "none";
    }
  });
}

// button -contact-answer-form


//dieutra-create-form
const dieutraForm = document.querySelector("#dieutra-create-form");

if (dieutraForm) {
  const validation = new JustValidate("#dieutra-create-form");

  validation
    // Validate số sâu
    .addField("#sosau", [
      { rule: "required", errorMessage: "Vui lòng nhập số sâu!" },
      { rule: "number", errorMessage: "Số sâu phải là số!" },
      { rule: "minNumber", value: 0, errorMessage: "Số sâu phải >= 0" }
    ])
    // Validate số cây
    .addField("#socay", [
      { rule: "required", errorMessage: "Vui lòng nhập số cây!" },
      { rule: "number", errorMessage: "Số cây phải là số!" },
      { rule: "minNumber", value: 0, errorMessage: "Số cây phải >= 0" }
    ])
    .addField("#tinh", [
      { rule: "required", errorMessage: "Vui lòng chọn Tỉnh!" }
    ])
    // Validate huyện
    .addField("#huyen", [
      { rule: "required", errorMessage: "Vui lòng chọn Huyện!" }
    ])
    // Validate xã
    .addField("#xa", [
      { rule: "required", errorMessage: "Vui lòng chọn Xã!" }
    ])
    // Validate địa chỉ cụ thể
    .addField("#diachi", [
      { rule: "required", errorMessage: "Vui lòng nhập địa chỉ cụ thể!" },
      { rule: "maxLength", value: 255, errorMessage: "Địa chỉ quá dài!" }
    ])
    // Validate loài cây
    .addField("#loai_cay", [
      { rule: "required", errorMessage: "Vui lòng chọn loài cây!" },
      { rule: "customRegexp", value: /^(thongmavi|thongnhua)$/, errorMessage: "Loài cây không hợp lệ!" }
    ])
    // Validate đường kính TB
    .addField("#duong_kinh_tb", [
      { rule: "required", errorMessage: "Vui lòng nhập đường kính TB!" },
      { rule: "number", errorMessage: "Đường kính TB phải là số!" },
      { rule: "minNumber", value: 0.01, errorMessage: "Đường kính TB phải > 0" }
    ])
    .addField("#tk", [
      { rule: "required", errorMessage: "Vui lòng nhập  Tiểu khu!" }
    ])
    .addField("#khoanh", [
      { rule: "required", errorMessage: "Vui lòng nhập  Khoảnh!" }
    ])
    .addField("#lo", [
      { rule: "required", errorMessage: "Vui lòng nhập  Lô!" }
    ])
    .onSuccess((event) => {
      event.preventDefault();

      const matinh = event.target.tinh.value;
      const mahuyen = event.target.huyen.value;
      const maxa = event.target.xa.value;
      const sosau = event.target.sosau.value;
      const socay = event.target.socay.value;
      const diachi = event.target.diachi.value.trim();
      const loai_cay = event.target.loai_cay.value;
      const duong_kinh_tb = event.target.duong_kinh_tb.value;
      const tk = event.target.tk.value;
      const khoanh = event.target.khoanh.value;
      const lo = event.target.lo.value;

      const data = {
        matinh,
        mahuyen,
        maxa,
        sosau,
        socay,
        dia_chi_cu_the: diachi,
        loai_cay,
        duong_kinh_tb,
        tk,
        khoanh,
        lo
      };


      fetch(`/${pathAdmin}/dieutra/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === "success") {
            window.location.href = `/${pathAdmin}/dieutra/list`;
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
//end-dieutra-create-form


// dieutra-edit-form
const dieutraEditForm = document.querySelector("#dieutra-edit-form");

if (dieutraEditForm) {
  const validation = new JustValidate("#dieutra-edit-form");

  validation
    // Validate số sâu
    .addField("#sosau", [
      { rule: "required", errorMessage: "Vui lòng nhập số sâu!" },
      { rule: "number", errorMessage: "Số sâu phải là số!" },
      { rule: "minNumber", value: 0, errorMessage: "Số sâu phải >= 0" }
    ])
    // Validate số cây
    .addField("#socay", [
      { rule: "required", errorMessage: "Vui lòng nhập số cây!" },
      { rule: "number", errorMessage: "Số cây phải là số!" },
      { rule: "minNumber", value: 0, errorMessage: "Số cây phải >= 0" }
    ])
    .addField("#tinh", [
      { rule: "required", errorMessage: "Vui lòng chọn Tỉnh!" }
    ])
    // Validate huyện
    .addField("#huyen", [
      { rule: "required", errorMessage: "Vui lòng chọn huyện!" }
    ])
    // Validate xã
    .addField("#xa", [
      { rule: "required", errorMessage: "Vui lòng chọn xã!" }
    ])
    // Validate địa chỉ cụ thể
    .addField("#diachi", [
      { rule: "required", errorMessage: "Vui lòng nhập địa chỉ cụ thể!" },
      { rule: "maxLength", value: 255, errorMessage: "Địa chỉ quá dài!" }
    ])
    .addField("#loai_cay", [{ rule: "required", errorMessage: "Vui lòng chọn loài cây!" }])
    .addField("#duong_kinh_tb", [
      { rule: "required", errorMessage: "Vui lòng nhập đường kính!" },
      { rule: "number", errorMessage: "Đường kính phải là số!" },
      { rule: "minNumber", value: 0, errorMessage: "Đường kính phải >= 0" }
    ])
    .addField("#tk", [
      { rule: "required", errorMessage: "Vui lòng nhập  Tiểu khu!" }
    ])
    .addField("#khoanh", [
      { rule: "required", errorMessage: "Vui lòng nhập  Khoảnh!" }
    ])
    .addField("#lo", [
      { rule: "required", errorMessage: "Vui lòng nhập  Lô!" }
    ])
    .onSuccess((event) => {
      event.preventDefault();

      const id = event.target.id.value; // id bản ghi
      const matinh = event.target.tinh.value;
      const mahuyen = event.target.huyen.value;
      const maxa = event.target.xa.value;
      const sosau = event.target.sosau.value;
      const socay = event.target.socay.value;
      const diachi = event.target.diachi.value.trim();
      const loai_cay = event.target.loai_cay.value;
      const duong_kinh_tb = event.target.duong_kinh_tb.value;
      const tk = event.target.tk.value;
      const khoanh = event.target.khoanh.value;
      const lo = event.target.lo.value;
      const data = {
        matinh,
        mahuyen,
        maxa,
        sosau,
        socay,
        dia_chi_cu_the: diachi,
        loai_cay,
        duong_kinh_tb,
        tk,
        khoanh,
        lo
      };

      console.log("Dữ liệu gửi lên server:", data);

      fetch(`/${pathAdmin}/dieutra/edit/${id}`, {
        method: "PATCH", // hoặc POST nếu backend không hỗ trợ PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === "success") {
            window.location.reload();
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

//end-dieutra-edit-form

// Xóa mềm
const listButtonDeletePathc = document.querySelectorAll("[button-delete-patch]");
if (listButtonDeletePathc.length > 0) {
  listButtonDeletePathc.forEach((button) => {
    button.addEventListener("click", () => {
      const dataApi = button.getAttribute("data-api");
      fetch(dataApi, {
        method: "PATCH",
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

// End Xóa mềm

// creat map 
const mapCreateForm = document.querySelector("#map-create-form");

if (mapCreateForm) {


  // Khởi tạo JustValidate
  const validation = new JustValidate("#map-create-form");

  validation
    // Thông tin
    .addField("#title", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập thông tin!",
      },
    ])
    // Loại bản đồ
    .addField("#map", [
      {
        rule: "required",
        errorMessage: "Vui lòng chọn loại bản đồ!",
      },
    ])
    // File .rar < 50MB
    .addField("#file", [
      {
        validator: () => {
          if (!filePondRar) return false;       // dùng filePondRar
          const files = filePondRar.getFiles(); // lấy file từ FilePond RAR
          if (!files || files.length === 0) return false;

          const file = files[0].file;
          const maxSize = 50 * 1024 * 1024; // 50MB
          const validExt = file.name.toLowerCase().endsWith(".rar");

          return file.size <= maxSize && validExt;
        },
        errorMessage: "Vui lòng chọn file .rar và nhỏ hơn 50MB!",
      },
    ])
    // Submit form
    .onSuccess((event) => {
      const matinh = event.target.tinh.value;
      const title = event.target.title.value;
      const map = event.target.map.value;
      const content = tinymce.get("content").getContent() || "";

      console.log(matinh);
      // Lấy file từ FilePond
      const files = filePondRar.getFiles();
      const file = files.length > 0 ? files[0].file : null;

      const formData = new FormData();
      formData.append("matinh", matinh)
      formData.append("thongtin", title);
      formData.append("map", map);
      if (file) formData.append("file", file);
      formData.append("mota", content);

      fetch(`/${pathAdmin}/map/create`, {
        method: "POST",
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          console.log("Dữ liệu trả về:", data);
          if (data.code === "error") {
            alert(data.message);
          }
          if (data.code === "success") {
            window.location.href = `/${pathAdmin}/map/list`;
          }
        });
    });
}



const mapEditForm = document.querySelector("#map-edit-form");

if (mapEditForm && fileRarInput && filePondRar) {
  const fileUrl = fileRarInput.dataset.file; // URL file cũ
  const fileName = fileUrl ? decodeURIComponent(fileUrl.split('/').pop()) : null;

  // Load file cũ nếu có
  if (fileUrl) {
    filePondRar.addFile(fileUrl, {
      type: 'remote',
      file: {
        name: fileName,                  // <-- tên file sẽ hiển thị trên UI
        size: 1,                         // nếu không biết size, đặt 0 tạm
        type: 'application/x-rar-compressed',
        isOld: true // <-- đánh dấu file cũ
      }
    }).catch(() => console.warn('Không thể tải file cũ'));
  }


  new JustValidate("#map-edit-form")
    .addField("#tinh", [{ rule: "required", errorMessage: "Vui chọn tỉnh" }])
    .addField("#title", [{ rule: "required", errorMessage: "Vui lòng nhập thông tin!" }])
    .addField("#map", [{ rule: "required", errorMessage: "Vui lòng chọn loại bản đồ!" }])
    .addField("#file", [{
      validator: () => {
        const files = filePondRar.getFiles();
        if (!files.length) return true; // không chọn file mới -> hợp lệ
        const f = files[0].file;
        return f.name.toLowerCase().endsWith(".rar") && f.size <= 50 * 1024 * 1024;
      },
      errorMessage: "File phải là .rar và nhỏ hơn 50MB!"
    }])
    .onSuccess(event => {
      const matinh = event.target.querySelector('[name="tinh"]').value;
      const id = event.target.querySelector('[name="id"]').value;
      const title = event.target.title.value;
      const map = event.target.map.value;
      // Lấy file từ FilePond
      const files = filePondRar.getFiles();
      const file = files[0]?.file;;
      const mota = tinymce.get("content")?.getContent() || "";

      console.log(file)

      const formData = new FormData();
      formData.append("matinh", matinh)
      formData.append("thongtin", title);
      formData.append("map", map);
      // Nếu người dùng chọn file mới, append file
      if (file) {
        if (file.isOld) {
          console.log("file cũ")
          console.log(fileRarInput.dataset.file)
          formData.append("file", fileRarInput.dataset.file);
        } else {
          console.log("file mới")
          formData.append("file", file);
        }
      }
      formData.append("mota", mota);

      fetch(`/${pathAdmin}/map/edit/${id}`, {
        method: "PATCH",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === "error") alert(data.message);
          else if (data.code === "success") {
            console.log("Cập nhật thành công!");
            window.location.href = `/${pathAdmin}/map/list`;
          }
        })
        .catch(() => alert("Có lỗi xảy ra, vui lòng thử lại!"));
    });
}

// Profile Edit Form
const profileEditForm = document.querySelector("#profile-edit-form");
if (profileEditForm) {
  const validation = new JustValidate("#profile-edit-form");

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
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const phone = event.target.phone.value;

      const dataFinal = {
        full_name: fullName,
        phone: phone
      }

      fetch(`/${pathAdmin}/profile/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",   // THÊM DÒNG NÀY
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
    });
}
// End Profile Edit Form

// Profile Change Password Form
const profileChangePasswordForm = document.querySelector(
  "#profile-change-password-form"
);
if (profileChangePasswordForm) {
  const validation = new JustValidate("#profile-change-password-form");

  validation
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
    .addField("#confirmPassword", [
      {
        rule: "required",
        errorMessage: "Vui lòng xác nhận mật khẩu!",
      },
      {
        validator: (value, fields) => {
          const password = fields["#password"].elem.value;
          return value == password;
        },
        errorMessage: "Mật khẩu xác nhận không khớp!",
      },
    ])
    .onSuccess((event) => {
      const password = event.target.password.value;

      const dataFinal = {
        password: password,
      };
      fetch(`/${pathAdmin}/profile/change-password`, {
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
    });
}
// End Profile Change Password Form


// weather-edit
// weather-edit-form
const weatherEditForm = document.querySelector("#weather-edit-form");

if (weatherEditForm) {
  const validation = new JustValidate("#weather-edit-form");

  validation
    // // Validate Tỉnh
    // .addField("#tinh", [
    //   { rule: "required", errorMessage: "Vui lòng chọn Tỉnh!" }
    // ])
    // // Validate Huyện
    // .addField("#huyen", [
    //   { rule: "required", errorMessage: "Vui lòng chọn Huyện!" }
    // ])
    // Validate Xã
    .addField("#xa", [
      { rule: "required", errorMessage: "Vui lòng chọn Xã!" }
    ])
    // Validate Nhiệt độ Min
    .addField("#temp_min", [
      { rule: "required", errorMessage: "Vui lòng nhập nhiệt độ Min!" },
      { rule: "number", errorMessage: "Nhiệt độ Min phải là số!" }
    ])
    // Validate Nhiệt độ Max
    .addField("#temp_max", [
      { rule: "required", errorMessage: "Vui lòng nhập nhiệt độ Max!" },
      { rule: "number", errorMessage: "Nhiệt độ Max phải là số!" }
    ])
    // Validate Nhiệt độ TB
    .addField("#temp_mean", [
      { rule: "required", errorMessage: "Vui lòng nhập nhiệt độ TB!" },
      { rule: "number", errorMessage: "Nhiệt độ TB phải là số!" }
    ])
    // Validate Lượng mưa Min
    .addField("#rain_min", [
      { rule: "required", errorMessage: "Vui lòng nhập lượng mưa Min!" },
      { rule: "number", errorMessage: "Lượng mưa Min phải là số!" }
    ])
    // Validate Lượng mưa Max
    .addField("#rain_max", [
      { rule: "required", errorMessage: "Vui lòng nhập lượng mưa Max!" },
      { rule: "number", errorMessage: "Lượng mưa Max phải là số!" }
    ])
    // Validate Lượng mưa TB
    .addField("#rain_mean", [
      { rule: "required", errorMessage: "Vui lòng nhập lượng mưa TB!" },
      { rule: "number", errorMessage: "Lượng mưa TB phải là số!" }
    ])
    // Validate Gió Min
    .addField("#wind_min", [
      { rule: "required", errorMessage: "Vui lòng nhập tốc độ gió Min!" },
      { rule: "number", errorMessage: "Tốc độ gió Min phải là số!" }
    ])
    // Validate Gió Max
    .addField("#wind_max", [
      { rule: "required", errorMessage: "Vui lòng nhập tốc độ gió Max!" },
      { rule: "number", errorMessage: "Tốc độ gió Max phải là số!" }
    ])
    // Validate Gió TB
    .addField("#wind_mean", [
      { rule: "required", errorMessage: "Vui lòng nhập tốc độ gió TB!" },
      { rule: "number", errorMessage: "Tốc độ gió TB phải là số!" }
    ])
    // Validate cấp số k
    .addField("#cap_so_p", [
      { rule: "required", errorMessage: "Vui lòng nhập cấp số!" },
      { rule: "number", errorMessage: "Cấp số phải là số!" },
      { rule: "minNumber", value: 0, errorMessage: "Cấp số phải >= 0" }
    ])
    .onSuccess((event) => {
      event.preventDefault();

      const id = event.target.id.value;
      const data = {
        ma_tinh: event.target.tinh.value,
        ma_huyen: event.target.huyen.value,
        ma_xa: event.target.xa.value,
        temp_min:event.target.temp_min.value,
        temp_max: event.target.temp_max.value,
        temp_mean: event.target.temp_mean.value,
        rain_min: event.target.rain_min.value,
        rain_max: event.target.rain_max.value,
        rain_mean: event.target.rain_mean.value,
        wind_min: event.target.wind_min.value,
        wind_max: event.target.wind_max.value,
        wind_mean: event.target.wind_mean.value,
        cap_so_p: event.target.cap_so_p.value
      };

      console.log("Dữ liệu gửi lên server:", data);

      fetch(`/${pathAdmin}/weather-data/edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === "success") {
            window.location.reload();
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

//end weather-edit



// filter - ma_tinh
const filterMaTinh = document.querySelector("[filter-Ma_tinh]");
if (filterMaTinh) {
  const url = new URL(window.location.href);
  //lắng nghe thay đổi lựa chọn
  filterMaTinh.addEventListener("change", () => {
    const value = filterMaTinh.value;
    if (value) {
      url.searchParams.set("ma_tinh", value);
    } else {
      url.searchParams.delete("ma_tinh");
    }
    window.location.href = url.href;
  });
  //hiển thị cái lựa chọn mặc định
  const valueCurrent = url.searchParams.get("ma_tinh");
  if (valueCurrent) {
    filterMaTinh.value = valueCurrent;
  }
}
//end filter - ma_tinh

// filter - ma_huyen
const filterMaHuyen = document.querySelector("[filter-Ma_huyen]");
if (filterMaHuyen) {
  const url = new URL(window.location.href);
  //lắng nghe thay đổi lựa chọn
  filterMaHuyen.addEventListener("change", () => {
    const value = filterMaHuyen.value;
    if (value) {
      url.searchParams.set("ma_huyen", value);
    } else {
      url.searchParams.delete("ma_huyen");
    }
    window.location.href = url.href;
  });
  //hiển thị cái lựa chọn mặc định
  const valueCurrent = url.searchParams.get("ma_huyen");
  if (valueCurrent) {
    filterMaHuyen.value = valueCurrent;
  }
}
//end filter - ma_huyen


// filter - ma_huyen
const filterMaXa = document.querySelector("[filter-Ma_xa]");
if (filterMaXa) {
  const url = new URL(window.location.href);
  //lắng nghe thay đổi lựa chọn
  filterMaXa.addEventListener("change", () => {
    const value = filterMaXa.value;
    if (value) {
      url.searchParams.set("ma_xa", value);
    } else {
      url.searchParams.delete("ma_xa");
    }
    window.location.href = url.href;
  });
  //hiển thị cái lựa chọn mặc định
  const valueCurrent = url.searchParams.get("ma_xa");
  if (valueCurrent) {
    filterMaXa.value = valueCurrent;
  }
}
//end filter - ma_huyen


const filterLoaiBanDo = document.querySelector("[filter-loaibando]");
if (filterLoaiBanDo) {
  const url = new URL(window.location.href);
  //lắng nghe thay đổi lựa chọn
  filterLoaiBanDo.addEventListener("change", () => {
    const value = filterLoaiBanDo.value;
    if (value) {
      url.searchParams.set("loaibando", value);
    } else {
      url.searchParams.delete("loaibando");
    }
    window.location.href = url.href;
  });
  //hiển thị cái lựa chọn mặc định
  const valueCurrent = url.searchParams.get("loaibando");
  if (valueCurrent) {
    filterLoaiBanDo.value = valueCurrent;
  }
}