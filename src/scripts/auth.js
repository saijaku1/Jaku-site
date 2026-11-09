import { supabase } from "../lib/supabase.js";

const googleButton = document.querySelector("#google-login");
const status = document.querySelector("#login-status");

const authForms = document.querySelector("#auth-forms");
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");

const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");

const signupEmail = document.querySelector("#signup-email");
const signupPassword = document.querySelector("#signup-password");
const signupPasswordConfirm = document.querySelector(
  "#signup-password-confirm",
);

const showSignupButton = document.querySelector("#show-signup");
const showLoginButton = document.querySelector("#show-login");
const forgotPasswordButton = document.querySelector("#forgot-password");

const accountInfo = document.querySelector("#account-info");
const userEmail = document.querySelector("#user-email");
const logoutButton = document.querySelector("#logout-button");

function setStatus(text) {
  if (status) status.textContent = text;
}

function showLoggedOut() {
  authForms?.removeAttribute("hidden");
  accountInfo?.setAttribute("hidden", "");
}

function showLoggedIn(user) {
  authForms?.setAttribute("hidden", "");
  accountInfo?.removeAttribute("hidden");

  if (userEmail) {
    userEmail.textContent = user.email || "メールアドレス未登録";
  }

  setStatus("ログインしています。");
}

function setFormMode(mode) {
  if (!loginForm || !signupForm) return;

  loginForm.hidden = mode !== "login";
  signupForm.hidden = mode !== "signup";
  setStatus("");
}

// ログイン・新規登録フォームの切り替え
showSignupButton?.addEventListener("click", () => {
  setFormMode("signup");
});

showLoginButton?.addEventListener("click", () => {
  setFormMode("login");
});

// Googleログイン
googleButton?.addEventListener("click", async () => {
  googleButton.disabled = true;
  setStatus("Googleログインへ移動しています...");

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://jaku.runs-at.dev/auth/callback",
      },
    });

    if (error) throw error;
  } catch (error) {
    console.error("Googleログインエラー:", error);
    setStatus("Googleログインを開始できませんでした。");
    googleButton.disabled = false;
  }
});

// メールアドレス・パスワードでログイン
loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  const submitButton = loginForm.querySelector('button[type="submit"]');

  submitButton.disabled = true;
  setStatus("ログインしています...");

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setStatus("ログインしました。");
  } catch (error) {
    console.error("メールログインエラー:", error);
    setStatus(
      "ログインできませんでした。メールアドレスとパスワードを確認してください。",
    );
  } finally {
    submitButton.disabled = false;
  }
});

// メールアドレスで新規登録
signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = signupEmail.value.trim();
  const password = signupPassword.value;
  const passwordConfirm = signupPasswordConfirm.value;

  if (password.length < 8) {
    setStatus("パスワードは8文字以上で入力してください。");
    return;
  }

  if (password !== passwordConfirm) {
    setStatus("パスワードが一致しません。");
    return;
  }

  const submitButton = signupForm.querySelector('button[type="submit"]');

  submitButton.disabled = true;
  setStatus("アカウントを登録しています...");

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://jaku.runs-at.dev/auth/callback",
      },
    });

    if (error) throw error;

    if (data.session) {
      setStatus("アカウントを登録しました。");
    } else {
      setStatus(
        "確認メールを送信しました。メール内のリンクから登録を完了してください。",
      );
    }
  } catch (error) {
    console.error("新規登録エラー:", error);
    setStatus(
      "登録できませんでした。入力内容やメールアドレスを確認してください。",
    );
  } finally {
    submitButton.disabled = false;
  }
});

// パスワード再設定メール
forgotPasswordButton?.addEventListener("click", async () => {
  const email = loginEmail.value.trim();

  if (!email) {
    setStatus("先にメールアドレスを入力してください。");
    loginEmail.focus();
    return;
  }

  forgotPasswordButton.disabled = true;
  setStatus("再設定メールを送信しています...");

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://jaku.runs-at.dev/auth/callback?type=recovery",
    });

    if (error) throw error;

    setStatus("パスワード再設定メールを送信しました。メールをご確認ください。");
  } catch (error) {
    console.error("パスワード再設定エラー:", error);
    setStatus("メールを送信できませんでした。入力内容を確認してください。");
  } finally {
    forgotPasswordButton.disabled = false;
  }
});

// ログアウト
logoutButton?.addEventListener("click", async () => {
  logoutButton.disabled = true;
  setStatus("ログアウトしています...");

  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    showLoggedOut();
    setStatus("ログアウトしました。");
  } catch (error) {
    console.error("ログアウトエラー:", error);
    setStatus("ログアウトに失敗しました。");
  } finally {
    logoutButton.disabled = false;
  }
});

// 初期ログイン状態の確認
async function checkLogin() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("セッション確認エラー:", error);
    setStatus("ログイン状態を確認できませんでした。");
    return;
  }

  if (data.session?.user) {
    showLoggedIn(data.session.user);
  } else {
    showLoggedOut();
    setStatus("ログインしていません。");
  }
}

// ログイン状態の変化を監視
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    showLoggedIn(session.user);
  } else {
    showLoggedOut();
  }
});

void checkLogin();
