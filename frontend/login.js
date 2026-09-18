document.addEventListener("DOMContentLoaded", () => {
  if (App.getCurrentMember()) {
    window.location.href = "feed.html";
    return;
  }

  const form = document.querySelector("#login-form");
  const message = document.querySelector("#login-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const credentials = {
      studentId: String(formData.get("studentId") || "").trim(),
      password: String(formData.get("password") || "")
    };

    if (!credentials.studentId || !credentials.password) {
      App.showMessage(message, "학번과 비밀번호를 모두 입력해 주세요.", "error");
      return;
    }

    try {
      App.showMessage(message, "로그인 중입니다.", "");
      await App.login(credentials);
      window.location.href = "feed.html";
    } catch (error) {
      App.showMessage(message, error.message, "error");
    }
  });
});
