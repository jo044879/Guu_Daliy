(function () {
  const storageKeys = {
    members: "activityMembers",
    posts: "activityPosts",
    currentMember: "activityCurrentMember"
  };

  const activityTypes = [
    { value: "EXERCISE", label: "운동" },
    { value: "BIBLE_READING", label: "성경읽기" },
    { value: "STUDY", label: "공부" },
    { value: "ETC", label: "기타" }
  ];

  const apiBase = window.ACTIVITY_API_BASE || (window.location.protocol === "file:" ? "http://localhost:8080" : "");

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

    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = new Error(await readErrorMessage(response));
      error.isApiError = true;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
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
    const response = await fetch(`${apiBase}${path}`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const error = new Error(await readErrorMessage(response));
      error.isApiError = true;
      throw error;
    }

    return response.json();
  }

  function shouldUseLocalFallback(error) {
    return !error.isApiError;
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
    try {
      const savedMember = await request("/members", {
        method: "POST",
        body: JSON.stringify(member)
      });
      setCurrentMember(savedMember);
      return savedMember;
    } catch (error) {
      if (!shouldUseLocalFallback(error)) {
        throw error;
      }

      const members = readStore(storageKeys.members, []);
      const exists = members.some((item) => item.studentId === member.studentId);

      if (exists) {
        throw new Error("이미 가입된 학번입니다.");
      }

      const savedMember = {
        id: crypto.randomUUID(),
        name: member.name,
        studentId: member.studentId,
        password: member.password
      };

      members.push(savedMember);
      writeStore(storageKeys.members, members);
      setCurrentMember(savedMember);
      return savedMember;
    }
  }

  async function login(credentials) {
    try {
      const member = await request("/login", {
        method: "POST",
        body: JSON.stringify(credentials)
      });
      setCurrentMember(member);
      return member;
    } catch (error) {
      if (!shouldUseLocalFallback(error)) {
        throw error;
      }

      const members = readStore(storageKeys.members, []);
      const member = members.find((item) => {
        return item.studentId === credentials.studentId && item.password === credentials.password;
      });

      if (!member) {
        throw new Error("학번 또는 비밀번호를 확인해 주세요.");
      }

      setCurrentMember(member);
      return member;
    }
  }

  async function getPosts() {
    try {
      return await request("/posts", { method: "GET" });
    } catch (error) {
      if (!shouldUseLocalFallback(error)) {
        throw error;
      }

      return readStore(storageKeys.posts, []);
    }
  }

  async function getMembers() {
    try {
      return await request("/members", { method: "GET" });
    } catch (error) {
      if (!shouldUseLocalFallback(error)) {
        throw error;
      }

      return readStore(storageKeys.members, []);
    }
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve("");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("이미지를 읽을 수 없습니다."));
      reader.readAsDataURL(file);
    });
  }

  async function createPost(formElement) {
    const member = getCurrentMember();
    if (!member) {
      throw new Error("로그인 후 게시물을 작성해 주세요.");
    }

    const formData = new FormData(formElement);
    formData.set("studentId", member.studentId);

    try {
      return await sendMultipart("/posts", formData);
    } catch (error) {
      if (!shouldUseLocalFallback(error)) {
        throw error;
      }

      const posts = readStore(storageKeys.posts, []);
      const imageFile = formData.get("image");
      const imageUrl = imageFile && imageFile.size > 0 ? await fileToDataUrl(imageFile) : "";

      const post = {
        id: crypto.randomUUID(),
        activityType: formData.get("activityType"),
        description: String(formData.get("description") || "").trim(),
        imageUrl,
        authorName: member.name,
        studentId: member.studentId,
        createdAt: new Date().toISOString()
      };

      posts.unshift(post);
      writeStore(storageKeys.posts, posts);
      return post;
    }
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
