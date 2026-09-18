document.addEventListener("DOMContentLoaded", () => {
  const member = App.requireMember();
  if (!member) {
    return;
  }

  App.bindLogout();

  document.querySelector("#member-summary").textContent = `${member.name}님, 오늘 한 일을 간단하게 남겨보세요.`;

  const form = document.querySelector("#post-form");
  const activitySelect = document.querySelector("#activity-type");
  const message = document.querySelector("#post-message");
  const description = document.querySelector("#description");
  const descriptionCount = document.querySelector("#description-count");
  const imageInput = document.querySelector("#image");
  const imagePreview = document.querySelector("#image-preview");
  const imagePreviewImg = document.querySelector("#image-preview-img");
  const imageRemove = document.querySelector("#image-remove");
  const uploadDropzone = document.querySelector("#upload-dropzone");

  renderActivityOptions(activitySelect);
  bindDescriptionCounter(description, descriptionCount);
  bindImagePreview(imageInput, imagePreview, imagePreviewImg, imageRemove, uploadDropzone);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const activityType = String(formData.get("activityType") || "");
    const description = String(formData.get("description") || "").trim();

    if (!activityType || !description) {
      App.showMessage(message, "활동 종류와 설명을 입력해 주세요.", "error");
      return;
    }

    try {
      App.showMessage(message, "게시물을 올리는 중입니다.", "");
      await App.createPost(form);
      window.location.href = "feed.html";
    } catch (error) {
      App.showMessage(message, error.message, "error");
    }
  });
});

function renderActivityOptions(select) {
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "선택하세요";

  const options = App.activityTypes.map((activity) => {
    const option = document.createElement("option");
    option.value = activity.value;
    option.textContent = activity.label;
    return option;
  });

  select.replaceChildren(placeholder, ...options);
}

function bindDescriptionCounter(textarea, counter) {
  const max = textarea.maxLength;

  const update = () => {
    counter.textContent = `${textarea.value.length}/${max}`;
  };

  textarea.addEventListener("input", update);
  update();
}

function bindImagePreview(input, preview, previewImg, removeButton, dropzone) {
  input.addEventListener("change", () => {
    const file = input.files && input.files[0];

    if (!file) {
      hidePreview();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      previewImg.src = reader.result;
      preview.hidden = false;
      dropzone.hidden = true;
    };
    reader.readAsDataURL(file);
  });

  removeButton.addEventListener("click", () => {
    input.value = "";
    hidePreview();
  });

  function hidePreview() {
    preview.hidden = true;
    previewImg.src = "";
    dropzone.hidden = false;
  }
}
