(function () {
  const storageKeys = {
    currentMember: "activityCurrentMember"
  };

  const activityTypes = [
    { value: "EXERCISE", label: "운동" },
    { value: "BIBLE_READING", label: "성경읽기" },
    { value: "STUDY", label: "공부" },
    { value: "ETC", label: "기타" }
  ];

  const apiBase = window.ACTIVITY_API_BASE || "http://43.200.176.63:8080";

  function readStore(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }

  function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async function request(path, options) {
    const headers = options && options.body instanceof FormData
      ? { ...(options && options.headers) }
      : { "Content-Type": "application/json", ...(options && options.headers) };

    const response = await fetchOrThrow(`${apiBase}${path}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async function fetchOrThrow(url, options) {
    try {
      return await fetch(url, options);
    } catch (error) {
      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  async function readErrorMessage(response) {
    let message = "request failed";
    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch (error) {
      message = response.statusText || message;
    }
    return message;
  }

  async function sendMultipart(path, formData) {
    const response = await fetchOrThrow(`${apiBase}${path}`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    return response.json();
  }

  function getAssetUrl(path) {
    if (!path || !apiBase || !path.startsWith("/")) {
      return path;
    }
    return `${apiBase}${path}`;
  }

  function getCurrentMember() {
    return readStore(storageKeys.currentMember, null);
  }

  function setCurrentMember(member) {
    writeStore(storageKeys.currentMember, member);
  }

  function clearCurrentMember() {
    localStorage.removeItem(storageKeys.currentMember);
  }

  async function createMember(member) {
    const savedMember = await request("/members", {
      method: "POST",
      body: JSON.stringify(member)
    });
    setCurrentMember(savedMember);
    return savedMember;
  }

  async function login(credentials) {
    const member = await request("/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    setCurrentMember(member);
    return member;
  }

  async function getPosts() {
    return await request("/posts", { method: "GET" });
  }

  async function getMembers() {
    return await request("/members", { method: "GET" });
  }

  async function createPost(formElement) {
    const member = getCurrentMember();
    if (!member) {
      throw new Error("로그인 후 게시물을 작성해 주세요.");
    }

    const formData = new FormData(formElement);
    formData.set("studentId", member.studentId);

    return await sendMultipart("/posts", formData);
  }

  function getActivityLabel(value) {
    const activity = activityTypes.find((item) => item.value === value);
    return activity ? activity.label : value;
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  }

  function requireMember() {
    const member = getCurrentMember();
    if (!member) {
      window.location.href = "index.html";
      return null;
    }
    return member;
  }

  function bindLogout() {
    const logoutButton = document.querySelector("#logout-button");
    if (!logoutButton) {
      return;
    }

    logoutButton.addEventListener("click", () => {
      clearCurrentMember();
      window.location.href = "index.html";
    });
  }

  function showMessage(element, message, type) {
    element.textContent = message;
    element.classList.remove("is-error", "is-success");
    if (type) {
      element.classList.add(`is-${type}`);
    }
  }

  window.App = {
    activityTypes,
    bindLogout,
    clearCurrentMember,
    createMember,
    createPost,
    formatDate,
    getAssetUrl,
    getActivityLabel,
    getCurrentMember,
    getMembers,
    getPosts,
    login,
    requireMember,
    showMessage
  };
})();
