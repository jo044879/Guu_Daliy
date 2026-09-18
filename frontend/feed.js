document.addEventListener("DOMContentLoaded", async () => {
  const member = App.requireMember();
  if (!member) {
    return;
  }

  App.bindLogout();

  document.querySelector("#member-summary").textContent = `${member.name}님, 오늘의 활동을 확인하고 공유하세요.`;

  const feedList = document.querySelector("#feed-list");
  const emptyFeed = document.querySelector("#empty-feed");
  const postCount = document.querySelector("#post-count");
  const memberCount = document.querySelector("#member-count");

  const [posts, members] = await Promise.all([App.getPosts(), App.getMembers()]);
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  postCount.textContent = sortedPosts.length;
  memberCount.textContent = members.length;

  emptyFeed.hidden = sortedPosts.length > 0;
  feedList.replaceChildren(...sortedPosts.map(createPostCard));
});

function createPostCard(post) {
  const article = document.createElement("article");
  article.className = "post-card";

  if (post.imageUrl) {
    const image = document.createElement("img");
    image.className = "post-image";
    image.src = App.getAssetUrl(post.imageUrl);
    image.alt = `${App.getActivityLabel(post.activityType)} 인증 이미지`;
    article.append(image);
  }

  const content = document.createElement("div");
  content.className = "post-content";

  const title = document.createElement("h3");
  title.textContent = App.getActivityLabel(post.activityType);

  const meta = document.createElement("p");
  meta.className = "post-meta";
  meta.textContent = `${post.authorName} · ${post.studentId} · ${App.formatDate(post.createdAt)}`;

  const description = document.createElement("p");
  description.className = "post-description";
  description.textContent = post.description;

  content.append(title, meta, description);
  article.append(content);

  return article;
}
