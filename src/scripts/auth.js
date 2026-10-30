import { supabase } from "../lib/supabase.js";

const loginButton = document.querySelector("#google-login");
const status = document.querySelector("#login-status");
const accountInfo = document.querySelector("#account-info");
const userEmail = document.querySelector("#user-email");
const logoutButton = document.querySelector("#logout-button");

function showLoggedOut() {
  loginButton?.removeAttribute("hidden");
  accountInfo?.setAttribute("hidden", "");
  if (userEmail) userEmail.textContent = "";
}

function showLoggedIn(user) {
  loginButton?.setAttribute("hidden", "");
  accountInfo?.removeAttribute("hidden");

  if (userEmail) {
    userEmail.textContent = user.email || "メールアドレス未登録";
  }

  if (status) {
    status.textContent = "ログインしています。";
  }
}

// Googleログイン
if (loginButton && status) {
  loginButton.addEventListener("click", async () => {
    loginButton.setAttribute("disabled", "");
    status.textContent = "Googleログインへ移動しています...";

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Googleログインエラー:", error);

      status.textContent =
        "ログインを開始できませんでした。設定を確認してください。";

      loginButton.removeAttribute("disabled");
    }
  });
}

// ログアウト
if (logoutButton && status) {
  logoutButton.addEventListener("click", async () => {
    logoutButton.setAttribute("disabled", "");
    status.textContent = "ログアウトしています...";

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      showLoggedOut();
      status.textContent = "ログアウトしました。";
    } catch (error) {
      console.error("ログアウトエラー:", error);
      status.textContent = "ログアウトに失敗しました。";
    } finally {
      logoutButton.removeAttribute("disabled");
    }
  });
}

// ページを開いたときのログイン状態を確認
async function checkLogin() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("セッション確認エラー:", error);
    if (status) status.textContent = "ログイン状態を確認できませんでした。";
    return;
  }

  if (data.session?.user) {
    showLoggedIn(data.session.user);
  } else {
    showLoggedOut();
    if (status) status.textContent = "ログインしていません。";
  }
}

// ログイン・ログアウトによる状態変化を監視
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    showLoggedIn(session.user);
  } else {
    showLoggedOut();
  }
});

checkLogin();
