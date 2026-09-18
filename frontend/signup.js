document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#signup-form");
  const message = document.querySelector("#signup-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const member = {
      name: String(formData.get("name") || "").trim(),
      studentId: String(formData.get("studentId") || "").trim(),
      password: String(formData.get("password") || "")
    };

    if (!member.name || !member.studentId || !member.password) {
      App.showMessage(message, "이름, 학번, 비밀번호를 모두 입력해 주세요.", "error");
      return;
    }

    try {
      App.showMessage(message, "가입 정보를 저장하는 중입니다.", "");
      await App.createMember(member);
      window.location.href = "feed.html";
    } catch (error) {
      App.showMessage(message, error.message, "error");
    }
  });
});
