console.log("Script connected!");

// =========================
// Step 0: Connect to HTML
// =========================
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const fetchButton = document.getElementById("fetchButton");
const postList = document.getElementById("postList");
const errorDiv = document.getElementById("error");

const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("titleInput");
const bodyInput = document.getElementById("bodyInput");
const formError = document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");

const searchInput = document.getElementById("searchInput");

let allPosts = []; // Store posts for filtering

// =========================
// Fetch posts
// =========================
async function fetchPosts() {
  try {
    errorDiv.textContent = "Loading posts...";
    errorDiv.style.color = "black";
    postList.innerHTML = "";

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch posts");

    allPosts = await response.json();
    errorDiv.textContent = "Posts loaded successfully!";
    errorDiv.style.color = "green";

    renderPosts(allPosts);

  } catch (error) {
    console.error(error);
    errorDiv.textContent = "Error loading posts.";
    errorDiv.style.color = "red";
  }
}

// =========================
// Render posts
// =========================
function renderPosts(posts) {
  postList.innerHTML = "";
  posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post-item");
    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <button class="deleteBtn" data-id="${post.id}">Delete</button>
      <hr>
    `;
    postList.appendChild(postDiv);

    // Delete functionality
    const deleteButton = postDiv.querySelector(".deleteBtn");
    deleteButton.addEventListener("click", () => deletePost(post.id, postDiv));
  });
}

// =========================
// Delete post
// =========================
async function deletePost(postId, postDiv) {
  try {
    const response = await fetch(`${API_URL}/${postId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete post");

    postDiv.remove();
    allPosts = allPosts.filter(p => p.id !== postId);

  } catch (error) {
    console.error(error);
    alert("Error deleting post.");
  }
}

// =========================
// Create new post
// =========================
postForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  formError.textContent = "";
  formSuccess.textContent = "Submitting post...";

  const newPost = {
    title: titleInput.value,
    body: bodyInput.value,
    userId: 1
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    });

    if (!response.ok) throw new Error("Failed to submit post");

    const createdPost = await response.json();
    formSuccess.textContent = `Post created! ID: ${createdPost.id}`;

    allPosts.unshift(createdPost);
    renderPosts(allPosts);

    postForm.reset();

  } catch (error) {
    console.error(error);
    formError.textContent = "Error submitting post.";
    formSuccess.textContent = "";
  }
});

// =========================
// Search posts
// =========================
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(keyword) ||
    post.body.toLowerCase().includes(keyword)
  );
  renderPosts(filteredPosts);
});

// =========================
// Event listeners
// =========================
fetchButton.addEventListener("click", fetchPosts);
